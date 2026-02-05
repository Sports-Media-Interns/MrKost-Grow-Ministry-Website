import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/sanitize";
import {
  validateName,
  validateEmail,
  optionalString,
  isValidationError,
} from "@/lib/validation";
import { getGhlWebhookUrl } from "@/lib/env";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { createGHLContact } from "@/lib/ghl";

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

/** Map lead type → GHL tag */
const LEAD_TYPE_TAGS: Record<string, string> = {
  white_paper_download: "white-paper-download",
  trip_planner: "trip-planner",
  exit_intent_lead: "exit-intent",
  cookie_consent: "cookie-consent",
};

interface LeadPayload {
  type: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  recaptchaToken: string;
  [key: string]: unknown;
}

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
  try {
    const clientIp = getClientIp(request);
    const { allowed } = await rateLimit(`lead:${clientIp}`, { limit: 5, windowMs: 60_000 });
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = validateLead(body);

    // Verify reCAPTCHA token server-side (required — reject missing/empty tokens)
    const recaptcha = await verifyRecaptcha(validated.recaptchaToken, "lead_capture");
    if (!recaptcha.success) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed. Please try again." },
        { status: 403 }
      );
    }

    // Build tags based on lead type and source
    const tags: string[] = [];
    const typeTag = LEAD_TYPE_TAGS[validated.type] || validated.type.replace(/_/g, "-");
    tags.push(typeTag);

    if (validated.type === "white_paper_download" && typeof validated.serviceName === "string") {
      tags.push(`wp-${validated.serviceName.toLowerCase().replace(/\s+/g, "-")}`);
    }

    if (validated.type === "trip_planner" && typeof validated.tripType === "string") {
      tags.push(`trip-${validated.tripType}`);
    }

    // 1) Create contact in GHL CRM with tags
    const ghlResult = await createGHLContact({
      firstName: validated.name.split(/\s+/)[0],
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      companyName:
        (typeof validated.organization === "string" ? validated.organization : undefined) ||
        (typeof validated.churchName === "string" ? validated.churchName : undefined),
      tags,
      source: validated.source,
    });

    if (!ghlResult.success) {
      console.warn("[Lead API] GHL contact creation failed, falling back to webhook:", ghlResult.error);
    }

    // 2) Also send to webhook (legacy backup / automation trigger)
    const webhookUrl = getGhlWebhookUrl();
    if (webhookUrl) {
      const { recaptchaToken: _token, ...leadData } = validated;
      const webhookPayload = {
        ...leadData,
        pageUrl: request.headers.get("referer") || "https://growministry.com",
        timestamp: new Date().toISOString(),
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);

      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(webhookPayload),
          signal: controller.signal,
        });
      } catch {
        console.warn("[Lead API] Webhook delivery failed (non-critical)");
      } finally {
        clearTimeout(timeout);
      }
    }

    return NextResponse.json({ success: true, contactId: ghlResult.contactId });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      console.error("[Lead API] Request timed out");
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

    console.error("[Lead API] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
