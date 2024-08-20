import { LogCollector } from "@/api/utils/_cloudwatchLogCollector";
import { type EventContext } from "@cloudflare/workers-types";

export const logRequest: ProxyHandler<(context: EventContext<ENV, any, any>) => Promise<Response>> = {
    async apply(target, thisArg, args) {
        const request = args.at(0).request;
        const headers = request.headers;

        LogCollector.logInfo("cloudflare worker request", {
            additionalData: {
                keepalive: request.keepalive,
                integrity: request.integrity,
                cf: request.cf,
                redirect: request.redirect,
                headers: Object.fromEntries(headers),
                url: request.url,
                method: request.method,
            },
        });

        let response;

        try {
            response = await target.apply(thisArg, args);
        } catch (err) {
            LogCollector.logError("unhandled error", err);
        }

        LogCollector.logInfo("cloudflare worker response", {
            additionalData: {
                cf: response?.cf,
                webSocket: response?.webSocket,
                url: response?.url,
                redirected: response?.redirected,
                ok: response?.ok,
                ...(response && { headers: Object.fromEntries(response?.headers) }),
                statusText: response?.statusText,
                status: response?.status,
                bodyUsed: response?.bodyUsed,
                body: response?.body,
            },
        });

        return response;
    },
};
