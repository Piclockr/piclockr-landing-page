/// <reference types="astro/client" />

type D1Database = import("@cloudflare/workers-types/experimental").D1Database;
type Queue = import("@cloudflare/workers-types/experimental").Queue;

type ENV = {
    DB: D1Database;
    CLOUDWATCH_LOG_GROUP_NAME: string;
    CLOUDWATCH_OUT_QUEUE: Queue;
    WAITLIST_EMAIL_QUEUE: Queue;
    COMMON_BUCKET: R2Bucket;
    VALIDATION_BASE_URL: string;
};

type Runtime = import("@astrojs/cloudflare").AdvancedRuntime<ENV>;

declare namespace App {
    interface Locals extends Runtime {
        user: {
            name: string;
            surname: string;
        };
    }
}
