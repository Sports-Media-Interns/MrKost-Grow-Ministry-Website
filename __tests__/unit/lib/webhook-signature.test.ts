import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { _resetEnvCache } from "@/lib/env";

// Set env before importing the module
vi.stubEnv("WEBHOOK_SIGNING_SECRET", "test-secret-key-123");
_resetEnvCache();

const {
  signPayload,
  verifyWebhookTimestamp,
  verifyWebhookSignature,
  createSignedHeaders,
} = await import("@/lib/webhook-signature");

describe("signPayload", () => {
  it("returns a hex string for valid input", async () => {
    const sig = await signPayload("hello");
    expect(sig).toMatch(/^[0-9a-f]{64}$/);
  });

  it("returns deterministic signatures", async () => {
    const sig1 = await signPayload("test-payload");
    const sig2 = await signPayload("test-payload");
    expect(sig1).toBe(sig2);
  });

  it("produces different signatures for different payloads", async () => {
    const sig1 = await signPayload("payload-a");
    const sig2 = await signPayload("payload-b");
    expect(sig1).not.toBe(sig2);
  });
});

describe("verifyWebhookTimestamp", () => {
  it("accepts a fresh timestamp", () => {
    const ts = Date.now().toString();
    expect(verifyWebhookTimestamp(ts)).toBe(true);
  });

  it("rejects a timestamp older than 5 minutes", () => {
    const old = (Date.now() - 6 * 60 * 1000).toString();
    expect(verifyWebhookTimestamp(old)).toBe(false);
  });

  it("rejects NaN timestamp", () => {
    expect(verifyWebhookTimestamp("not-a-number")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(verifyWebhookTimestamp("")).toBe(false);
  });

  it("accepts timestamp within custom window", () => {
    const ts = (Date.now() - 8 * 60 * 1000).toString();
    expect(verifyWebhookTimestamp(ts, 10 * 60 * 1000)).toBe(true);
  });

  it("rejects timestamp outside custom window", () => {
    const ts = (Date.now() - 15 * 60 * 1000).toString();
    expect(verifyWebhookTimestamp(ts, 10 * 60 * 1000)).toBe(false);
  });

  it("accepts future timestamps within window", () => {
    const future = (Date.now() + 2 * 60 * 1000).toString();
    expect(verifyWebhookTimestamp(future)).toBe(true);
  });
});

describe("verifyWebhookSignature", () => {
  it("verifies a valid signature + timestamp pair", async () => {
    const payload = '{"key":"value"}';
    const timestamp = Date.now().toString();
    const signature = await signPayload(`${timestamp}.${payload}`);
    const result = await verifyWebhookSignature(payload, signature, timestamp);
    expect(result).toBe(true);
  });

  it("rejects tampered payload", async () => {
    const timestamp = Date.now().toString();
    const signature = await signPayload(`${timestamp}.original`);
    const result = await verifyWebhookSignature("tampered", signature, timestamp);
    expect(result).toBe(false);
  });

  it("rejects wrong signature", async () => {
    const payload = "test";
    const timestamp = Date.now().toString();
    const result = await verifyWebhookSignature(
      payload,
      "0".repeat(64),
      timestamp
    );
    expect(result).toBe(false);
  });

  it("rejects expired timestamp", async () => {
    const payload = "test";
    const oldTs = (Date.now() - 10 * 60 * 1000).toString();
    const signature = await signPayload(`${oldTs}.${payload}`);
    const result = await verifyWebhookSignature(payload, signature, oldTs);
    expect(result).toBe(false);
  });

  it("rejects empty signature", async () => {
    const result = await verifyWebhookSignature("test", "", Date.now().toString());
    expect(result).toBe(false);
  });

  it("rejects empty timestamp", async () => {
    const result = await verifyWebhookSignature("test", "abc", "");
    expect(result).toBe(false);
  });

  it("rejects signature with wrong length", async () => {
    const payload = "test";
    const timestamp = Date.now().toString();
    const result = await verifyWebhookSignature(payload, "short", timestamp);
    expect(result).toBe(false);
  });
});

describe("createSignedHeaders", () => {
  it("returns Content-Type and signature headers", async () => {
    const headers = await createSignedHeaders('{"data":true}');
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers["X-Webhook-Signature"]).toMatch(/^[0-9a-f]{64}$/);
    expect(headers["X-Webhook-Timestamp"]).toMatch(/^\d+$/);
  });

  it("produces verifiable signature", async () => {
    const payload = '{"test":1}';
    const headers = await createSignedHeaders(payload);
    const result = await verifyWebhookSignature(
      payload,
      headers["X-Webhook-Signature"],
      headers["X-Webhook-Timestamp"]
    );
    expect(result).toBe(true);
  });
});
