import * as Sentry from "@sentry/nextjs";

/** Redact PII patterns from error data before sending to Sentry */
function redactPII(value: string): string {
  return value
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[REDACTED_EMAIL]")
    .replace(/(\+?1?\s*[-.(]?\d{3}[-.)]\s*\d{3}[-.\s]?\d{4})/g, "[REDACTED_PHONE]")
    .replace(/(name["\s:=]+)([A-Z][a-z]+ [A-Z][a-z]+)/gi, "$1[REDACTED_NAME]");
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",

  // Only enable in production
  enabled: process.env.NODE_ENV === "production",

  // Performance monitoring sample rate
  tracesSampleRate: 0.1,

  // Redact PII from error events before sending
  beforeSend(event) {
    if (event.exception?.values) {
      for (const exception of event.exception.values) {
        if (exception.value) {
          exception.value = redactPII(exception.value);
        }
      }
    }

    if (event.breadcrumbs) {
      for (const breadcrumb of event.breadcrumbs) {
        if (breadcrumb.message) {
          breadcrumb.message = redactPII(breadcrumb.message);
        }
      }
    }

    return event;
  },
});
