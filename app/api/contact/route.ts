import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  validateName,
  validateEmail,
  validatePhone,
  validateMessage,
  optionalString,
  isValidationError,
} from "@/lib/validation";
import { getGhlWebhookUrl } from "@/lib/env";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { createGHLContact } from "@/lib/ghl";
import { getSupabaseAdmin } from "@/lib/supabase";

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  organization: string;
  service: string;
  message: string;
  recaptchaToken: string;
}

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
  try {
    const clientIp = getClientIp(request);
    const { allowed } = await rateLimit(`contact:${clientIp}`, { limit: 5, windowMs: 60_000 });
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await request.json();
    const validated = validateContact(body);

    // Verify reCAPTCHA token server-side (required — reject missing/empty tokens)
    const recaptcha = await verifyRecaptcha(validated.recaptchaToken, "contact_form");
    if (!recaptcha.success) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed. Please try again." },
        { status: 403 }
      );
    }

    // 1) Create contact in GHL CRM with tag
    const ghlResult = await createGHLContact({
      firstName: validated.name.split(/\s+/)[0],
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      companyName: validated.organization || undefined,
      tags: ["contact-form", `service-${validated.service.toLowerCase().replace(/\s+/g, "-")}`],
      source: "website-contact-form",
    });

    if (!ghlResult.success) {
      console.warn("[Contact API] GHL contact creation failed, falling back to webhook:", ghlResult.error);
    }

    // 2) Also send to webhook (legacy backup / automation trigger)
    const webhookUrl = getGhlWebhookUrl();
    if (webhookUrl) {
      const webhookPayload = {
        type: "contact_form",
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        organization: validated.organization,
        service: validated.service,
        message: validated.message,
        source: "website-contact-form",
        pageUrl: request.headers.get("referer") || "https://growministry.com/contact",
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
        console.warn("[Contact API] Webhook delivery failed (non-critical)");
      } finally {
        clearTimeout(timeout);
      }
    }

    // 3) Save to Supabase (non-blocking — don't fail the request if DB is down)
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        await supabase.from("contacts").insert({
          name: validated.name,
          email: validated.email,
          phone: validated.phone,
          organization: validated.organization || null,
          service: validated.service,
          message: validated.message,
          source: "website-contact-form",
          ghl_contact_id: ghlResult.contactId || null,
          page_url: request.headers.get("referer") || null,
        });
      } catch {
        console.warn("[Contact API] Supabase insert failed (non-critical)");
      }
    }

    return NextResponse.json({ success: true, contactId: ghlResult.contactId });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      console.error("[Contact API] Request timed out");
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

    console.error("[Contact API] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
