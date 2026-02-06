/**
 * HMAC-SHA256 signature for outgoing webhook payloads.
 * Allows receiving systems to verify payload authenticity.
 */
import { timingSafeEqual } from "node:crypto";

const WEBHOOK_SECRET = process.env.WEBHOOK_SIGNING_SECRET || "";

/**
 * Generate an HMAC-SHA256 signature for a JSON payload.
 * Returns hex-encoded signature string.
 */
export async function signPayload(payload: string): Promise<string> {
  if (!WEBHOOK_SECRET) return "";

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Maximum age (in ms) for a valid webhook timestamp. Default: 5 minutes. */
const MAX_TIMESTAMP_AGE_MS = 5 * 60 * 1000;

/**
 * Verify that a webhook timestamp is within the acceptable window.
 * Rejects timestamps older than MAX_TIMESTAMP_AGE_MS to prevent replay attacks.
 */
export function verifyWebhookTimestamp(
  timestamp: string,
  maxAgeMs: number = MAX_TIMESTAMP_AGE_MS
): boolean {
  const ts = Number(timestamp);
  if (isNaN(ts)) return false;

  const age = Math.abs(Date.now() - ts);
  return age <= maxAgeMs;
}

/**
 * Verify an incoming webhook signature against the expected payload.
 * Returns true if the signature is valid and the timestamp is fresh.
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  timestamp: string,
  maxAgeMs?: number
): Promise<boolean> {
  if (!WEBHOOK_SECRET || !signature || !timestamp) return false;
  if (!verifyWebhookTimestamp(timestamp, maxAgeMs)) return false;

  const expected = await signPayload(`${timestamp}.${payload}`);
  if (expected.length !== signature.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

/**
 * Create headers for a signed webhook request.
 * Includes X-Signature and X-Timestamp for replay protection.
 */
export async function createSignedHeaders(
  payload: string
): Promise<Record<string, string>> {
  const timestamp = Date.now().toString();
  const signature = await signPayload(`${timestamp}.${payload}`);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (signature) {
    headers["X-Webhook-Signature"] = signature;
    headers["X-Webhook-Timestamp"] = timestamp;
  }

  return headers;
}
