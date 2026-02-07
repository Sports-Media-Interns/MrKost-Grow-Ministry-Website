import { NextResponse } from "next/server";
import { sanitizeString } from "@/lib/sanitize";
import {
  validateName,
  validateEmail,
  optionalString,
  ValidationError,
} from "@/lib/validation";
import { withApiHandler } from "@/lib/api-handler";
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
    throw new ValidationError("Invalid request body");
  }

  const body = data as Record<string, unknown>;

  const type = optionalString(body.type);
  const name = validateName(body.name);
  const email = validateEmail(body.email);
  const phone = typeof body.phone === "string" ? sanitizeString(body.phone.trim()) : "";
  const source = optionalString(body.source);

  if (!type) {
    throw new ValidationError("Lead type is required");
  }

  const recaptchaToken =
    typeof body.recaptchaToken === "string" ? body.recaptchaToken : "";

  const validated: LeadPayload = { type, name, email, source: source || type, recaptchaToken };
  if (phone) validated.phone = phone;

  // Only pass through whitelisted extra fields (prevents mass assignment)
  for (const [key, value] of Object.entries(body)) {
    if (ALLOWED_EXTRA_FIELDS.has(key) && value !== undefined && value !== null) {
      if (typeof value === "string") {
        validated[key] = sanitizeString(value);
      } else if (typeof value === "number" && Number.isFinite(value)) {
        validated[key] = value;
      }
      // Skip non-string/non-number values (arrays, objects, booleans)
    }
  }

  return validated;
}

export const POST = withApiHandler(
  {
    scope: "lead-api",
    rateLimitPrefix: "lead",
    recaptchaAction: "lead_capture",
  },
  async ({ body, log, referer }) => {
    const validated = validateLead(body);

    const result = await processLead(validated, { referer, log });

    return NextResponse.json({ success: true, contactId: result.contactId });
  }
);
