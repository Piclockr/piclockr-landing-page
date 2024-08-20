import { logRequest } from "@/api/utils/_logRequest";
import { sendLogsToCloudwatchProxy } from "@/api/utils/_sendLogsToCloudwatchProxy";
import type { EventContext, R2Bucket } from "@cloudflare/workers-types";
import Mustache from "mustache";
import isEmail from "validator/lib/isEmail";
import normalizeEmail from "validator/lib/normalizeEmail";
import { LogCollector } from "../utils/_cloudwatchLogCollector";

export async function index(context: EventContext<ENV, any, any>) {
    const DB = context.env.DB;

    const body = await context.request.text();
    const { email, acceptPrivacyPolicy } = JSON.parse(body);

    let normalizedEmail;

    try {
        normalizedEmail = validateRequest({ email, acceptPrivacyPolicy });
    } catch (err: any) {
        LogCollector.logError("Failed to validate request", err);
        return new Response(err.message, { status: 400 });
    }

    const { results } = await DB.prepare("select * from waitlist where email = ?").bind(email).all();

    if (results.length === 0) {
        const validationId = crypto.randomUUID();
        try {
            await createNewEmail(DB, { email, validationId });
            await sendEmail(context.env.WAITLIST_EMAIL_QUEUE, context.env.COMMON_BUCKET, context.env.VALIDATION_BASE_URL, {
                to: normalizedEmail,
                validationId: validationId,
            });
            await markEmailAsSent(DB, email);
        } catch (err: any) {
            LogCollector.logError("Failed to create new email", err);
            return new Response("Something went wrong", { status: 500 });
        }
    } else {
        LogCollector.logInfo(`Email '${email}' already exists`);
        return new Response(null, { status: 200 });
    }

    return new Response(null, { status: 201 });
}

function validateRequest({ email, acceptPrivacyPolicy }: { email: string; acceptPrivacyPolicy: boolean }): string {
    if (!isEmail(email)) {
        throw new Error("Invalid email");
    }

    if (!acceptPrivacyPolicy) {
        throw new Error("Privacy policy not accepted");
    }

    return normalizeEmail(email, {
        gmail_remove_dots: false,
    });
}

async function createNewEmail(DB: D1Database, { email, validationId }: { email: string; validationId: string }) {
    const { success, error } = await DB.prepare("insert into waitlist (email, validation_id) values (?, ?)").bind(email, validationId).run();

    if (!success) {
        throw new Error("Failed to create new email: " + error);
    }

    LogCollector.logInfo(`New Email '${email}' created`);
}

async function sendEmail(emailQueue: Queue, bucket: R2Bucket, validationBaseUrl: string, email: { to: string; validationId: string }) {
    const emailTemplate = await bucket.get("email-templates/landingpage/waitlist/waitlist-validation.html");
    const emailTemplateText = await emailTemplate!.text();

    const html = Mustache.render(emailTemplateText, {
        validationLink: `${validationBaseUrl}/waitlist/validate?token=` + btoa(JSON.stringify({ email: email.to, validation_id: email.validationId })),
    });

    return emailQueue.send(
        {
            from: "Piclockr <noreply@piclockr.com>",
            to: email.to,
            subject: "Join Waitlist",
            html: html,
        },
        { contentType: "json" },
    );
}

async function markEmailAsSent(DB: D1Database, email: string) {
    const { success, error } = await DB.prepare("update waitlist set mail_sent_at = CURRENT_TIMESTAMP where email = ?").bind(email).run();

    if (!success) {
        throw new Error("Failed to mark email as sent: " + error);
    }

    LogCollector.logInfo(`Email '${email}' marked as sent`);
}

export function onRequest(ctx: EventContext<ENV, any, any>) {
    const proxyLoggedRequest = new Proxy(index, logRequest);
    const pCloudwatch = sendLogsToCloudwatchProxy(proxyLoggedRequest, ctx.env.CLOUDWATCH_OUT_QUEUE, { logGroupName: ctx.env.CLOUDWATCH_LOG_GROUP_NAME });
    return pCloudwatch(ctx);
}
