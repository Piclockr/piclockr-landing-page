import { serve } from "@hono/node-server";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Hono } from "hono";
import { createTransport } from "nodemailer";

const app = new Hono();
app.post(
    "/emails",
    zValidator(
        "json",
        z.object({
            from: z.string().email(),
            to: z.union([z.string().email(), z.array(z.string().email())]),
            subject: z.string(),
            html: z.string(),
        }),
    ),
    async (c) => {
        const { from, to, subject, html } = c.req.valid("json");
        const transporter = createTransport({
            host: "localhost",
            port: 2500,
        });
        await transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            html: html,
        });

        return new Response(null, { status: 200 });
    },
);

app.post(
    "/emails/batch",
    zValidator(
        "json",
        z.array(
            z.object({
                from: z.string().email(),
                to: z.union([z.string().email(), z.array(z.string().email())]),
                subject: z.string(),
                html: z.string(),
            }),
        ),
    ),
    async (c) => {
        const batch = c.req.valid("json");

        for (const { from, to, subject, html } of batch) {
            const transporter = createTransport({
                host: "localhost",
                port: 2500,
            });
            await transporter.sendMail({
                from: from,
                to: to,
                subject: subject,
                html: html,
            });
        }

        return new Response(null, { status: 200 });
    },
);

serve(app, (info) => {
    console.log(`Server listening on http://localhost:${info.port}`);
});
