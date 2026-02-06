/**
 * Lead capture business logic - separated from HTTP handling.
 * Orchestrates GHL CRM creation, webhook delivery, and Supabase storage.
 */
import { createGHLContact } from "@/lib/ghl";
import { getGhlWebhookUrl } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createSignedHeaders } from "@/lib/webhook-signature";
import type { LeadPayload } from "@/lib/types";

/** Map lead type → GHL tag */
const LEAD_TYPE_TAGS: Record<string, string> = {
  white_paper_download: "white-paper-download",
  trip_planner: "trip-planner",
  exit_intent_lead: "exit-intent",
  cookie_consent: "cookie-consent",
};

interface LeadServiceOptions {
  referer?: string;
  log: {
    warn: (msg: string, data?: Record<string, unknown>) => void;
  };
}

interface LeadServiceResult {
  contactId?: string;
}

/**
 * Process a validated lead capture submission.
 * Handles tag building, CRM creation, webhook delivery, and database storage.
 * Non-critical failures (webhook, Supabase) are logged but don't block success.
 */
export async function processLead(
  validated: LeadPayload,
  options: LeadServiceOptions
): Promise<LeadServiceResult> {
  const { referer, log } = options;

  // Build tags based on lead type
  const tags = buildTags(validated);

  // 1) Create contact in GHL CRM with tags
  const ghlResult = await createGHLContact({
    firstName: validated.name.split(/\s+/)[0],
    name: validated.name,
    email: validated.email,
    phone: validated.phone,
    companyName:
      (typeof validated.organization === "string"
        ? validated.organization
        : undefined) ||
      (typeof validated.churchName === "string"
        ? validated.churchName
        : undefined),
    tags,
    source: validated.source,
  });

  if (!ghlResult.success) {
    log.warn("GHL contact creation failed, falling back to webhook", {
      error: ghlResult.error,
    });
  }

  // 2) Webhook + Supabase in parallel (both non-critical)
  await Promise.allSettled([
    sendWebhook(validated, referer, log),
    saveToDatabase(validated, ghlResult.contactId, referer, log),
  ]);

  return { contactId: ghlResult.contactId };
}

function buildTags(validated: LeadPayload): string[] {
  const tags: string[] = [];
  const typeTag =
    LEAD_TYPE_TAGS[validated.type] || validated.type.replace(/_/g, "-");
  tags.push(typeTag);

  if (
    validated.type === "white_paper_download" &&
    typeof validated.serviceName === "string"
  ) {
    tags.push(
      `wp-${validated.serviceName.toLowerCase().replace(/\s+/g, "-")}`
    );
  }

  if (
    validated.type === "trip_planner" &&
    typeof validated.tripType === "string"
  ) {
    tags.push(`trip-${validated.tripType}`);
  }

  return tags;
}

async function sendWebhook(
  validated: LeadPayload,
  referer: string | undefined,
  log: LeadServiceOptions["log"]
): Promise<void> {
  const webhookUrl = getGhlWebhookUrl();
  if (!webhookUrl) return;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { recaptchaToken, ...leadData } = validated;
  const webhookPayload = {
    ...leadData,
    pageUrl: referer || "https://growministry.com",
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
  validated: LeadPayload,
  contactId: string | undefined,
  referer: string | undefined,
  log: LeadServiceOptions["log"]
): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { recaptchaToken, name, email, phone, type, source, ...extraFields } =
      validated;
    await supabase.from("leads").insert({
      type: validated.type,
      name: validated.name,
      email: validated.email,
      phone: validated.phone || null,
      source: validated.source,
      ghl_contact_id: contactId || null,
      extra: Object.keys(extraFields).length > 0 ? extraFields : null,
      page_url: referer || null,
    });
  } catch {
    log.warn("Supabase insert failed (non-critical)");
  }
}
