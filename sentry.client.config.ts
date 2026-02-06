import * as Sentry from "@sentry/nextjs";

/** Redact PII patterns from error data before sending to Sentry */
function redactPII(value: string): string {
  return value
    // Email addresses
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[REDACTED_EMAIL]")
    // Phone numbers (various formats)
    .replace(/(\+?1?\s*[-.(]?\d{3}[-.)]\s*\d{3}[-.\s]?\d{4})/g, "[REDACTED_PHONE]")
    // Names after common prefixes
    .replace(/(name["\s:=]+)([A-Z][a-z]+ [A-Z][a-z]+)/gi, "$1[REDACTED_NAME]");
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",

  // Only enable in production
  enabled: process.env.NODE_ENV === "production",

  // Performance monitoring sample rate (10% of transactions)
  tracesSampleRate: 0.1,

  // Session replay for debugging (1% of sessions, 100% on error)
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      // PII redaction: mask all text and block all media in replay
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
    Sentry.breadcrumbsIntegration({
      console: true,
      dom: true,
      fetch: true,
      xhr: true,
    }),
  ],

  // Filter out noisy errors
  ignoreErrors: [
    "ResizeObserver loop",
    "Network request failed",
    "Load failed",
    "ChunkLoadError",
  ],

  // Redact PII from error events before sending
  beforeSend(event) {
    // Redact PII from exception messages
    if (event.exception?.values) {
      for (const exception of event.exception.values) {
        if (exception.value) {
          exception.value = redactPII(exception.value);
        }
      }
    }

    // Redact PII from breadcrumb messages
    if (event.breadcrumbs) {
      for (const breadcrumb of event.breadcrumbs) {
        if (breadcrumb.message) {
          breadcrumb.message = redactPII(breadcrumb.message);
        }
      }
    }

    return event;
  },

  // Custom breadcrumbs for form interactions
  beforeBreadcrumb(breadcrumb) {
    // Redact form input values from DOM breadcrumbs
    if (breadcrumb.category === "ui.input" && breadcrumb.message) {
      breadcrumb.message = breadcrumb.message.replace(
        /input\[.*?\]/,
        "input[***]"
      );
    }
    return breadcrumb;
  },
});
