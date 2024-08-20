export type LogLevel = "INFO" | "ERROR" | "WARN";

export class LogCollector {
    private static logs: string[] = [];

    public static logInfo(message: string, additionalData?: { [key: string]: any }) {
        this.log({ logLevel: "INFO", message, additionalData });
    }

    public static logWarn(message: string, additionalData?: { [key: string]: any }) {
        this.log({ logLevel: "WARN", message, additionalData });
    }

    public static logError(message: string, error: Error, additionalData?: { [key: string]: any }) {
        this.log({
            logLevel: "ERROR",
            message,
            additionalData,
            error,
        });
    }

    public static releaseLogs(): string[] {
        const logs = this.logs;
        this.logs = [];
        return logs;
    }

    private static log({
        logLevel,
        message,
        additionalData,
        error,
    }: {
        logLevel: LogLevel;
        message: string;
        additionalData?: { [key: string]: any };
        error?: Error;
    }) {
        const log = JSON.stringify({
            timestamp: new Date().toISOString(),
            level: logLevel,
            message: message,
            ...(error && {
                error: {
                    type: error.name,
                    message: error.message,
                    stacktrace: error.stack,
                },
            }),
            ...(additionalData && { additional_data: additionalData }),
        });

        console.log(log);

        this.logs.push(log);
    }
}
