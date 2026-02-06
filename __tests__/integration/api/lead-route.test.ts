import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/lead/route";
import { _resetRateMap } from "@/lib/rate-limit";

// Mock external dependencies
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

vi.mock("@/lib/recaptcha", () => ({
  verifyRecaptcha: vi.fn().mockResolvedValue({ success: true, score: 0.9 }),
}));

vi.mock("@/lib/ghl", () => ({
  createGHLContact: vi.fn().mockResolvedValue({ success: true, contactId: "lead-id" }),
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
  return new NextRequest("http://localhost:3000/api/lead", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

const validPayload = {
  type: "white_paper_download",
  name: "Jane Doe",
  email: "jane@church.org",
  source: "service-modal",
  serviceName: "CRM Solutions",
  recaptchaToken: "test-token",
};

describe("POST /api/lead", () => {
  beforeEach(() => {
    _resetRateMap();
    vi.clearAllMocks();
  });

  it("returns 200 with contactId on valid submission", async () => {
    const res = await POST(createRequest(validPayload));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.contactId).toBe("lead-id");
  });

  it("returns 415 for non-JSON content type", async () => {
    const res = await POST(
      createRequest(validPayload, { contentType: "application/x-www-form-urlencoded" })
    );
    const data = await res.json();

    expect(res.status).toBe(415);
    expect(data.error).toContain("Content-Type");
  });

  it("returns 400 for missing lead type", async () => {
    const res = await POST(createRequest({ ...validPayload, type: "" }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("Lead type");
  });

  it("returns 400 for missing name", async () => {
    const res = await POST(
      createRequest({ ...validPayload, name: "" })
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("Name");
  });

  it("returns 400 for invalid email", async () => {
    const res = await POST(
      createRequest({ ...validPayload, email: "bad" })
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("email");
  });

  it("returns 403 when reCAPTCHA fails", async () => {
    const { verifyRecaptcha } = await import("@/lib/recaptcha");
    vi.mocked(verifyRecaptcha).mockResolvedValueOnce({ success: false, score: 0.2 });

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
    for (let i = 0; i < 5; i++) {
      await POST(createRequest(validPayload));
    }

    const res = await POST(createRequest(validPayload));
    const data = await res.json();

    expect(res.status).toBe(429);
    expect(data.error).toContain("Too many requests");
  });

  it("passes whitelisted extra fields through", async () => {
    const { createGHLContact } = await import("@/lib/ghl");

    const payload = {
      ...validPayload,
      churchName: "Grace Church",
      tripType: "holy-land",
      hackerField: "should-be-stripped",
    };

    await POST(createRequest(payload));

    expect(createGHLContact).toHaveBeenCalledWith(
      expect.objectContaining({
        companyName: "Grace Church",
      })
    );
  });

  it("strips non-whitelisted fields", async () => {
    const { createGHLContact } = await import("@/lib/ghl");

    const payload = {
      ...validPayload,
      __proto__: "attack",
      admin: true,
      password: "secret",
    };

    await POST(createRequest(payload));

    const call = vi.mocked(createGHLContact).mock.calls[0][0];
    expect(call).not.toHaveProperty("admin");
    expect(call).not.toHaveProperty("password");
  });

  it("succeeds even when GHL fails", async () => {
    const { createGHLContact } = await import("@/lib/ghl");
    vi.mocked(createGHLContact).mockResolvedValueOnce({
      success: false,
      error: "GHL down",
    });

    const res = await POST(createRequest(validPayload));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
