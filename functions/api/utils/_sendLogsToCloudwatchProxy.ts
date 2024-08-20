import { LogCollector } from "@/api/utils/_cloudwatchLogCollector";
import type { Queue } from "@cloudflare/workers-types/2023-07-01";

export const sendLogsToCloudwatchProxy = (
    target: any,
    logger: Queue<{
        logGroupName: string;
        logStreamName?: string;
        messages: string[];
    }>,
    loggerConfig: { logGroupName: string },
    cls?: any,
) =>
    new Proxy(target, {
        async apply(target, thisArg, args) {
            let response;
            try {
                if (cls) {
                    response = await cls[target.name](...args);
                } else {
                    response = await target(...args);
                }
            } catch (error) {
                LogCollector.logError("Unexpected error", error);
            } finally {
                const logs = LogCollector.releaseLogs();
                if (logs.length > 0) {
                    await logger.send(
                        {
                            logGroupName: loggerConfig.logGroupName,
                            messages: logs,
                        },
                        { contentType: "json" },
                    );
                }
            }
            return response;
        },
    });
