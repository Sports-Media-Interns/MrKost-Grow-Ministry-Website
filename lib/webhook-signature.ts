/**
 * HMAC-SHA256 signature for outgoing webhook payloads.
 * Allows receiving systems to verify payload authenticity.
 */

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
