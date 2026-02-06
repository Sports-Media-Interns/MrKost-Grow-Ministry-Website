/**
 * Contact form business logic — separated from HTTP handling.
 * Orchestrates GHL CRM creation, webhook delivery, and Supabase storage.
 */
import { createGHLContact } from "@/lib/ghl";
import { getGhlWebhookUrl } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createSignedHeaders } from "@/lib/webhook-signature";
import type { ContactPayload } from "@/lib/types";

interface ContactServiceOptions {
  referer?: string;
  log: {
    warn: (msg: string, data?: Record<string, unknown>) => void;
  };
}

interface ContactServiceResult {
  contactId?: string;
}

/**
 * Process a validated contact form submission.
 * Handles CRM creation, webhook delivery, and database storage.
 * Non-critical failures (webhook, Supabase) are logged but don't block success.
 */
export async function processContact(
  validated: ContactPayload,
  options: ContactServiceOptions
): Promise<ContactServiceResult> {
  const { referer, log } = options;

  // 1) Create contact in GHL CRM with tag
  const ghlResult = await createGHLContact({
    firstName: validated.name.split(/\s+/)[0],
    name: validated.name,
    email: validated.email,
    phone: validated.phone,
    companyName: validated.organization || undefined,
    tags: [
      "contact-form",
      `service-${validated.service.toLowerCase().replace(/\s+/g, "-")}`,
    ],
    source: "website-contact-form",
  });

  if (!ghlResult.success) {
    log.warn("GHL contact creation failed, falling back to webhook", {
      error: ghlResult.error,
    });
  }

  // 2) Send to webhook (legacy backup / automation trigger)
  await sendWebhook(validated, referer, log);

  // 3) Save to Supabase (non-blocking)
  await saveToDatabase(validated, ghlResult.contactId, referer, log);

  return { contactId: ghlResult.contactId };
}

async function sendWebhook(
  validated: ContactPayload,
  referer: string | undefined,
  log: ContactServiceOptions["log"]
): Promise<void> {
  const webhookUrl = getGhlWebhookUrl();
  if (!webhookUrl) return;

  const webhookPayload = {
    type: "contact_form",
    name: validated.name,
    email: validated.email,
    phone: validated.phone,
    organization: validated.organization,
    service: validated.service,
    message: validated.message,
    source: "website-contact-form",
    pageUrl: referer || "https://growministry.com/contact",
    timestamp: new Date().toISOString(),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const payloadJson = JSON.stringify(webhookPayload);
    const signedHeaders = await createSignedHeaders(payloadJson);
    await fetch(webhookUrl, {
      method: "POST",
      headers: signedHeaders,
      body: payloadJson,
      signal: controller.signal,
    });
  } catch {
    log.warn("Webhook delivery failed (non-critical)");
  } finally {
    clearTimeout(timeout);
  }
}

async function saveToDatabase(
  validated: ContactPayload,
  contactId: string | undefined,
  referer: string | undefined,
  log: ContactServiceOptions["log"]
): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  try {
    await supabase.from("contacts").insert({
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      organization: validated.organization || null,
      service: validated.service,
      message: validated.message,
      source: "website-contact-form",
      ghl_contact_id: contactId || null,
      page_url: referer || null,
    });
  } catch {
    log.warn("Supabase insert failed (non-critical)");
  }
}
