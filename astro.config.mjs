import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import astroIcon from "astro-icon";
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
    output: "hybrid",
    integrations: [
        react(),
        tailwind({
            applyBaseStyles: false,
        }),
        astroIcon(),
        mdx(),
    ],
    adapter: cloudflare({
        mode: "directory",
        routes: {
            include: ["/api/*"],
        },
        runtime: {
            mode: "local",
            type: "pages",
            bindings: {
                DB: {
                    type: "d1",
                },
            },
        },
    }),
});
