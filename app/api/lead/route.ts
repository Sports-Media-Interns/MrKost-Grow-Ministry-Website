import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/sanitize";
import {
  validateName,
  validateEmail,
  optionalString,
  isValidationError,
} from "@/lib/validation";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { createLogger } from "@/lib/logger";
import { validateOrigin } from "@/lib/csrf";
import { processLead } from "@/lib/services/lead-service";
import type { LeadPayload } from "@/lib/types";

/** Whitelist of extra fields allowed beyond the core fields. */
const ALLOWED_EXTRA_FIELDS = new Set([
  "organization",
  "service",
  "serviceName",
  "destinations",
  "groupSize",
  "travelDates",
  "travelMonth",
  "travelYear",
  "duration",
  "notes",
  "specialNeeds",
  "churchName",
  "offer",
  "tripType",
  "region",
]);

function validateLead(data: unknown): LeadPayload {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid request body");
  }

  const body = data as Record<string, unknown>;

  const type = optionalString(body.type);
  const name = validateName(body.name);
  const email = validateEmail(body.email);
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const source = optionalString(body.source);

  if (!type) {
    throw new Error("Lead type is required");
  }

  const recaptchaToken =
    typeof body.recaptchaToken === "string" ? body.recaptchaToken : "";

  const validated: LeadPayload = { type, name, email, source: source || type, recaptchaToken };
  if (phone) validated.phone = phone;

  // Only pass through whitelisted extra fields (prevents mass assignment)
  for (const [key, value] of Object.entries(body)) {
    if (ALLOWED_EXTRA_FIELDS.has(key) && value !== undefined && value !== null) {
      validated[key] =
        typeof value === "string" ? sanitizeString(value) : value;
    }
  }

  return validated;
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") || undefined;
  const log = createLogger("lead-api", requestId);

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
    const { allowed } = await rateLimit(`lead:${clientIp}`, { limit: 5, windowMs: 60_000 });
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
    const validated = validateLead(body);

    // Verify reCAPTCHA token server-side (required -- reject missing/empty tokens)
    const recaptcha = await verifyRecaptcha(validated.recaptchaToken, "lead_capture");
    if (!recaptcha.success) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed. Please try again." },
        { status: 403 }
      );
    }

    // Delegate business logic to service layer
    const result = await processLead(validated, {
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
