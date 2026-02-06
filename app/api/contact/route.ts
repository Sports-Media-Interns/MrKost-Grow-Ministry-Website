import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  validateName,
  validateEmail,
  validatePhone,
  validateMessage,
  optionalString,
  isValidationError,
} from "@/lib/validation";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { createLogger } from "@/lib/logger";
import { validateOrigin } from "@/lib/csrf";
import { processContact } from "@/lib/services/contact-service";
import type { ContactPayload } from "@/lib/types";

function validateContact(data: unknown): ContactPayload {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid request body");
  }

  const body = data as Record<string, unknown>;

  const name = validateName(body.name);
  const email = validateEmail(body.email);
  const phone = validatePhone(body.phone);
  const organization = optionalString(body.organization);
  const service = optionalString(body.service);
  const message = validateMessage(body.message);
  const recaptchaToken =
    typeof body.recaptchaToken === "string" ? body.recaptchaToken : "";

  if (!service) {
    throw new Error("Service selection is required");
  }

  return { name, email, phone, organization, service, message, recaptchaToken };
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") || undefined;
  const log = createLogger("contact-api", requestId);

  // Content-Type validation
  const contentType = request.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
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
    const { allowed } = await rateLimit(`contact:${clientIp}`, { limit: 5, windowMs: 60_000 });
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
    const validated = validateContact(body);

    // Verify reCAPTCHA token server-side (required -- reject missing/empty tokens)
    const recaptcha = await verifyRecaptcha(validated.recaptchaToken, "contact_form");
    if (!recaptcha.success) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed. Please try again." },
        { status: 403 }
      );
    }

    // Delegate business logic to service layer
    const result = await processContact(validated, {
      referer: request.headers.get("referer") || undefined,
      log,
    });

    return NextResponse.json({ success: true, contactId: result.contactId });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      log.error("Request timed out");
      return NextResponse.json(
        { error: "Request timed out. Please try again." },
        { status: 504 }
      );
    }

    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";

    if (isValidationError(message)) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    log.error("Unhandled error", { error: message });
    Sentry.captureException(err, { tags: { requestId } });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
