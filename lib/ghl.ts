/**
 * GoHighLevel CRM API client.
 * Creates contacts and tags them based on form source.
 */
import * as Sentry from "@sentry/nextjs";
import { getGhlApiToken, getGhlLocationId } from "@/lib/env";
import { createLogger } from "@/lib/logger";
import type { CreateContactParams, GHLContactResponse } from "@/lib/types";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

const log = createLogger("ghl");

/**
 * Create (or upsert) a contact in GoHighLevel CRM.
 * Tags the contact with the form source for tracking.
 */
export async function createGHLContact(
  params: CreateContactParams
): Promise<{ success: boolean; contactId?: string; error?: string }> {
  const token = getGhlApiToken();
  const locationId = getGhlLocationId();

  if (!token || !locationId) {
    log.error("API token or Location ID not configured");
    return { success: false, error: "GHL not configured" };
  }

  // Split name into first/last
  const nameParts = params.name.trim().split(/\s+/);
  const firstName = params.firstName || nameParts[0] || "";
  const lastName = params.lastName || nameParts.slice(1).join(" ") || "";

  const body: Record<string, unknown> = {
    firstName,
    lastName,
    name: params.name,
    email: params.email,
    locationId,
    tags: params.tags,
    source: params.source,
  };

  if (params.phone) {
    body.phone = params.phone;
  }

  if (params.companyName) {
    body.companyName = params.companyName;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(`${GHL_API_BASE}/contacts/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Version: GHL_API_VERSION,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data: GHLContactResponse = await response.json();

    if (!response.ok) {
      const err = new Error(`GHL API error: ${response.status}`);
      log.error("Create contact failed", { status: response.status });
      Sentry.captureException(err, {
        contexts: { ghl: { status: response.status, tags: params.tags, source: params.source } },
      });
      return {
        success: false,
        error: `GHL API error: ${response.status}`,
      };
    }

    log.info("Contact created", { contactId: data.contact?.id, tags: params.tags });

    return {
      success: true,
      contactId: data.contact?.id,
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      log.error("Request timed out");
      Sentry.captureException(err, { tags: { integration: "ghl", reason: "timeout" } });
      return { success: false, error: "GHL request timed out" };
    }
    log.error("Error creating contact", { error: String(err) });
    Sentry.captureException(err, { tags: { integration: "ghl" } });
    return { success: false, error: "GHL request failed" };
  } finally {
    clearTimeout(timeout);
  }
}
