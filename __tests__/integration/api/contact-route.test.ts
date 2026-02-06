import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/contact/route";
import { _resetRateMap } from "@/lib/rate-limit";

// Mock external dependencies
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

vi.mock("@/lib/recaptcha", () => ({
  verifyRecaptcha: vi.fn().mockResolvedValue({ success: true, score: 0.9 }),
}));

vi.mock("@/lib/ghl", () => ({
  createGHLContact: vi.fn().mockResolvedValue({ success: true, contactId: "test-id" }),
}));

vi.mock("@/lib/supabase", () => ({
  getSupabaseAdmin: vi.fn().mockReturnValue(null),
}));

vi.mock("@/lib/env", () => ({
  getGhlWebhookUrl: vi.fn().mockReturnValue(""),
  getRecaptchaSecretKey: vi.fn().mockReturnValue("test-secret"),
}));

vi.mock("@/lib/csrf", () => ({
  validateOrigin: vi.fn().mockReturnValue(null),
}));

vi.mock("@/lib/webhook-signature", () => ({
  createSignedHeaders: vi.fn().mockResolvedValue({ "Content-Type": "application/json" }),
}));

function createRequest(body: unknown, options?: { contentType?: string }) {
  const headers = new Headers({
    "content-type": options?.contentType ?? "application/json",
    "x-real-ip": "127.0.0.1",
  });
  return new NextRequest("http://localhost:3000/api/contact", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

const validPayload = {
  name: "John Smith",
  email: "john@church.org",
  phone: "(555) 123-4567",
  organization: "Grace Church",
  service: "CRM Solutions",
  message: "I need help with my church CRM setup please.",
  recaptchaToken: "test-token",
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    _resetRateMap();
    vi.clearAllMocks();
  });

  it("returns 200 with contactId on valid submission", async () => {
    const res = await POST(createRequest(validPayload));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.contactId).toBe("test-id");
  });

  it("returns 415 for non-JSON content type", async () => {
    const res = await POST(
      createRequest(validPayload, { contentType: "text/plain" })
    );
    const data = await res.json();

    expect(res.status).toBe(415);
    expect(data.error).toContain("Content-Type");
  });

  it("returns 400 for missing required fields", async () => {
    const res = await POST(createRequest({ name: "J" }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBeTruthy();
  });

  it("returns 400 for invalid email", async () => {
    const res = await POST(
      createRequest({ ...validPayload, email: "not-an-email" })
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("email");
  });

  it("returns 400 for missing service", async () => {
    const res = await POST(
      createRequest({ ...validPayload, service: "" })
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("Service");
  });

  it("returns 403 when reCAPTCHA fails", async () => {
    const { verifyRecaptcha } = await import("@/lib/recaptcha");
    vi.mocked(verifyRecaptcha).mockResolvedValueOnce({ success: false, score: 0.1 });

    const res = await POST(createRequest(validPayload));
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.error).toContain("reCAPTCHA");
  });

  it("returns 403 when CSRF validation fails", async () => {
    const { validateOrigin } = await import("@/lib/csrf");
    vi.mocked(validateOrigin).mockReturnValueOnce("Forbidden origin");

    const res = await POST(createRequest(validPayload));
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.error).toBe("Forbidden");
  });

  it("returns 429 when rate limited", async () => {
    // Exhaust rate limit (5 requests)
    for (let i = 0; i < 5; i++) {
      await POST(createRequest(validPayload));
    }

    const res = await POST(createRequest(validPayload));
    const data = await res.json();

    expect(res.status).toBe(429);
    expect(data.error).toContain("Too many requests");
    expect(res.headers.get("Retry-After")).toBe("60");
  });

  it("succeeds even when GHL fails", async () => {
    const { createGHLContact } = await import("@/lib/ghl");
    vi.mocked(createGHLContact).mockResolvedValueOnce({
      success: false,
      error: "GHL API error",
    });

    const res = await POST(createRequest(validPayload));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("returns 400 for invalid JSON body", async () => {
    const headers = new Headers({
      "content-type": "application/json",
      "x-real-ip": "127.0.0.1",
    });
    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers,
      body: "not json at all{",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("Invalid JSON");
  });
});
