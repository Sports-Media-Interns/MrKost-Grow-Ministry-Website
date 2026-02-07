/**
 * Shared API route handler wrapper.
 * Handles cross-cutting concerns: content-type, CSRF, rate limiting,
 * JSON parsing, reCAPTCHA, and structured error handling.
 */
import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { isValidationError } from "@/lib/validation";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { createLogger } from "@/lib/logger";
import { validateOrigin } from "@/lib/csrf";

/** Maximum request body size in bytes (64KB) */
const MAX_BODY_SIZE = 64 * 1024;

interface ApiHandlerOptions {
  /** Logger scope name (e.g., "contact-api") */
  scope: string;
  /** Rate limit key prefix (e.g., "contact") */
  rateLimitPrefix: string;
  /** reCAPTCHA action name (e.g., "contact_form") */
  recaptchaAction: string;
  /** Rate limit config */
  rateLimit?: { limit?: number; windowMs?: number };
}

interface HandlerContext {
  body: unknown;
  log: ReturnType<typeof createLogger>;
  referer: string | undefined;
  requestId: string | undefined;
}

type RouteHandler = (ctx: HandlerContext) => Promise<NextResponse>;

/**
 * Wraps a route-specific handler with shared cross-cutting concerns.
 * The handler receives the parsed + verified body and a logger.
 */
export function withApiHandler(options: ApiHandlerOptions, handler: RouteHandler) {
  return async function POST(request: NextRequest): Promise<NextResponse> {
    const requestId = request.headers.get("x-request-id") || undefined;
    const log = createLogger(options.scope, requestId);

    // Content-Type validation
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    // Body size check
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: "Request body too large" },
        { status: 413 }
      );
    }

    // CSRF: validate origin in production
    const csrfError = validateOrigin(request);
    if (csrfError) {
      log.warn("CSRF validation failed", { reason: csrfError });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
      const clientIp = getClientIp(request);
      const rlConfig = options.rateLimit ?? { limit: 5, windowMs: 60_000 };
      const { allowed } = await rateLimit(`${options.rateLimitPrefix}:${clientIp}`, rlConfig);
      if (!allowed) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429, headers: { "Retry-After": "60" } }
        );
      }

      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          { error: "Invalid JSON in request body" },
          { status: 400 }
        );
      }

      // Extract recaptchaToken for verification
      const recaptchaToken =
        body && typeof body === "object" && "recaptchaToken" in body
          ? String((body as Record<string, unknown>).recaptchaToken)
          : "";

      // Verify reCAPTCHA token server-side
      const recaptcha = await verifyRecaptcha(recaptchaToken, options.recaptchaAction);
      if (!recaptcha.success) {
        return NextResponse.json(
          { error: "reCAPTCHA verification failed. Please try again." },
          { status: 403 }
        );
      }

      // Delegate to route-specific handler
      return await handler({
        body,
        log,
        referer: request.headers.get("referer") || undefined,
        requestId,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        log.error("Request timed out");
        return NextResponse.json(
          { error: "Request timed out. Please try again." },
          { status: 504 }
        );
      }

      if (isValidationError(err)) {
        const message = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: message }, { status: 400 });
      }

      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";

      log.error("Unhandled error", { error: message });
      Sentry.captureException(err, { tags: { requestId } });
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
