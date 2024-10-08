/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type D1Database = import("@cloudflare/workers-types/experimental").D1Database;
type ENV = {
    DB: D1Database;
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
