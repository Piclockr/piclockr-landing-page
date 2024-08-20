import { logRequest } from "@/api/utils/_logRequest";
import type { EventContext } from "@cloudflare/workers-types";
import { LogCollector } from "../utils/_cloudwatchLogCollector";
import { sendLogsToCloudwatchProxy } from "../utils/_sendLogsToCloudwatchProxy";

export async function index(context: EventContext<ENV, any, any>) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const DB = context.env.DB;

    const url = new URL(context.request.url);

    const token = url.searchParams.get("token");

    try {
        const decodedToken = token ? JSON.parse(atob(token)) : null;

        if (!decodedToken) {
            LogCollector.logInfo("Invalid token");
            return new Response("Invalid token", { status: 400 });
        }

        const { email, validation_id } = decodedToken;

        const { success, error } = await DB.prepare("update waitlist set validated_at = CURRENT_TIMESTAMP where email = ? and validation_id = ?")
            .bind(email, validation_id)
            .run();

        if (!success) {
            LogCollector.logInfo(`Email '${email}' failed to validate: ${error}`);
            return new Response("Something went wrong", { status: 500 });
        }

        LogCollector.logInfo(`Email '${email}' successfully validated`);
    } catch (err) {
        LogCollector.logError("Unexpected error", err);
        return new Response("Something went wrong", { status: 500 });
    }

    return new Response(null, { status: 200 });
}

export function onRequest(ctx: EventContext<ENV, any, any>) {
    const proxyLoggedRequest = new Proxy(index, logRequest);
    const pCloudwatch = sendLogsToCloudwatchProxy(proxyLoggedRequest, ctx.env.CLOUDWATCH_OUT_QUEUE, { logGroupName: ctx.env.CLOUDWATCH_LOG_GROUP_NAME });
    return pCloudwatch(ctx);
}
