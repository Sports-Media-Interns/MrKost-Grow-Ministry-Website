import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ContactPayload } from "@/lib/types";

// ---------------------------------------------------------------------------
// Hoisted mock functions
// ---------------------------------------------------------------------------
const {
  mockCreateGHLContact,
  mockGetGhlWebhookUrl,
  mockGetSupabaseAdmin,
  mockCreateSignedHeaders,
} = vi.hoisted(() => ({
  mockCreateGHLContact: vi.fn(),
  mockGetGhlWebhookUrl: vi.fn(),
  mockGetSupabaseAdmin: vi.fn(),
  mockCreateSignedHeaders: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------
vi.mock("@/lib/ghl", () => ({ createGHLContact: mockCreateGHLContact }));
vi.mock("@/lib/env", () => ({ getGhlWebhookUrl: mockGetGhlWebhookUrl }));
vi.mock("@/lib/supabase", () => ({ getSupabaseAdmin: mockGetSupabaseAdmin }));
vi.mock("@/lib/webhook-signature", () => ({
  createSignedHeaders: mockCreateSignedHeaders,
}));

// ---------------------------------------------------------------------------
// Import under test (after mocks are installed)
// ---------------------------------------------------------------------------
import { processContact } from "@/lib/services/contact-service";

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------
const contactPayload: ContactPayload = {
  name: "John Smith",
  email: "john@example.com",
  phone: "5551234567",
  organization: "Test Church",
  service: "CRM Solutions",
  message: "Hello",
  recaptchaToken: "token123",
};

const mockLog = { warn: vi.fn(), error: vi.fn() };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function setupGhlSuccess(contactId = "ghl-contact-123") {
  mockCreateGHLContact.mockResolvedValue({
    success: true,
    contactId,
  });
}

function setupGhlFailure(error = "GHL API error: 500") {
  mockCreateGHLContact.mockResolvedValue({
    success: false,
    contactId: undefined,
    error,
  });
}

function setupWebhook(url: string | undefined = "https://hooks.example.com/wh") {
  mockGetGhlWebhookUrl.mockReturnValue(url);
}

function setupSupabase(configured = true) {
  if (!configured) {
    mockGetSupabaseAdmin.mockReturnValue(null);
    return { mockInsert: vi.fn(), mockFrom: vi.fn() };
  }
  const mockInsert = vi.fn().mockResolvedValue({ error: null });
  const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
  mockGetSupabaseAdmin.mockReturnValue({ from: mockFrom });
  return { mockInsert, mockFrom };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("processContact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();

    // Default: happy-path stubs
    setupGhlSuccess();
    setupWebhook();
    setupSupabase();
    mockCreateSignedHeaders.mockResolvedValue({
      "Content-Type": "application/json",
      "X-Webhook-Signature": "abc123",
      "X-Webhook-Timestamp": "1700000000000",
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true })
    );
  });

  // -----------------------------------------------------------------------
  // Happy path
  // -----------------------------------------------------------------------
  it("returns contactId on successful processing", async () => {
    const result = await processContact(contactPayload, { log: mockLog });

    expect(result.contactId).toBe("ghl-contact-123");
    expect(mockLog.warn).not.toHaveBeenCalled();
    expect(mockLog.error).not.toHaveBeenCalled();
  });

  it("creates GHL contact with correct parameters", async () => {
    await processContact(contactPayload, { log: mockLog });

    expect(mockCreateGHLContact).toHaveBeenCalledTimes(1);
    const args = mockCreateGHLContact.mock.calls[0][0];
    expect(args.firstName).toBe("John");
    expect(args.name).toBe("John Smith");
    expect(args.email).toBe("john@example.com");
    expect(args.phone).toBe("5551234567");
    expect(args.companyName).toBe("Test Church");
    expect(args.tags).toContain("contact-form");
    expect(args.tags).toContain("service-crm-solutions");
    expect(args.source).toBe("website-contact-form");
  });

  it("builds service tag from multi-word service name", async () => {
    const payload = { ...contactPayload, service: "Web Design" };
    await processContact(payload, { log: mockLog });

    const tags = mockCreateGHLContact.mock.calls[0][0].tags;
    expect(tags).toContain("service-web-design");
  });

  it("sends webhook with signed headers and correct payload", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", mockFetch);

    await processContact(contactPayload, {
      referer: "https://growministry.com/contact",
      log: mockLog,
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("https://hooks.example.com/wh");
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(options.headers["X-Webhook-Signature"]).toBe("abc123");

    const body = JSON.parse(options.body);
    expect(body.type).toBe("contact_form");
    expect(body.name).toBe("John Smith");
    expect(body.email).toBe("john@example.com");
    expect(body.service).toBe("CRM Solutions");
    expect(body.source).toBe("website-contact-form");
    expect(body.pageUrl).toBe("https://growministry.com/contact");
    expect(body.timestamp).toBeDefined();
  });

  it("saves to Supabase with correct fields", async () => {
    const { mockFrom, mockInsert } = setupSupabase();

    await processContact(contactPayload, {
      referer: "https://growministry.com/contact",
      log: mockLog,
    });

    expect(mockFrom).toHaveBeenCalledWith("contacts");
    expect(mockInsert).toHaveBeenCalledTimes(1);
    const row = mockInsert.mock.calls[0][0];
    expect(row.name).toBe("John Smith");
    expect(row.email).toBe("john@example.com");
    expect(row.phone).toBe("5551234567");
    expect(row.organization).toBe("Test Church");
    expect(row.service).toBe("CRM Solutions");
    expect(row.message).toBe("Hello");
    expect(row.source).toBe("website-contact-form");
    expect(row.ghl_contact_id).toBe("ghl-contact-123");
    expect(row.page_url).toBe("https://growministry.com/contact");
  });

  it("uses default pageUrl when referer is not provided", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", mockFetch);

    await processContact(contactPayload, { log: mockLog });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.pageUrl).toBe("https://growministry.com/contact");
  });

  // -----------------------------------------------------------------------
  // GHL failure — graceful degradation
  // -----------------------------------------------------------------------
  it("logs warning when GHL creation fails but still returns result", async () => {
    setupGhlFailure("GHL API error: 500");

    const result = await processContact(contactPayload, { log: mockLog });

    expect(mockLog.warn).toHaveBeenCalledWith(
      "GHL contact creation failed, falling back to webhook",
      expect.objectContaining({ error: "GHL API error: 500" })
    );
    // contactId is undefined because GHL failed
    expect(result.contactId).toBeUndefined();
  });

  it("still sends webhook and saves to database even when GHL fails", async () => {
    setupGhlFailure();
    const { mockInsert } = setupSupabase();
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", mockFetch);

    await processContact(contactPayload, { log: mockLog });

    // Webhook was still sent
    expect(mockFetch).toHaveBeenCalledTimes(1);
    // Supabase insert was still called (with null ghl_contact_id)
    expect(mockInsert).toHaveBeenCalledTimes(1);
    const row = mockInsert.mock.calls[0][0];
    expect(row.ghl_contact_id).toBeNull();
  });

  // -----------------------------------------------------------------------
  // Webhook not configured — skips gracefully
  // -----------------------------------------------------------------------
  it("skips webhook when URL is not configured", async () => {
    mockGetGhlWebhookUrl.mockReset();
    mockGetGhlWebhookUrl.mockReturnValue(undefined);
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    const result = await processContact(contactPayload, { log: mockLog });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.contactId).toBe("ghl-contact-123");
    expect(mockLog.warn).not.toHaveBeenCalled();
  });

  // -----------------------------------------------------------------------
  // Webhook failure — non-critical, does not block
  // -----------------------------------------------------------------------
  it("logs warning when webhook delivery fails but still succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error"))
    );

    const result = await processContact(contactPayload, { log: mockLog });

    expect(mockLog.warn).toHaveBeenCalledWith(
      "Webhook delivery failed (non-critical)"
    );
    expect(result.contactId).toBe("ghl-contact-123");
  });

  // -----------------------------------------------------------------------
  // Supabase not configured — skips gracefully
  // -----------------------------------------------------------------------
  it("skips database save when Supabase is not configured", async () => {
    setupSupabase(false);

    const result = await processContact(contactPayload, { log: mockLog });

    expect(result.contactId).toBe("ghl-contact-123");
    expect(mockLog.warn).not.toHaveBeenCalled();
    expect(mockLog.error).not.toHaveBeenCalled();
  });

  // -----------------------------------------------------------------------
  // Supabase insert error — non-critical, logged
  // -----------------------------------------------------------------------
  it("logs error when Supabase insert returns an error", async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      error: { code: "23505", message: "duplicate key" },
    });
    const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
    mockGetSupabaseAdmin.mockReturnValue({ from: mockFrom });

    const result = await processContact(contactPayload, { log: mockLog });

    expect(mockLog.error).toHaveBeenCalledWith(
      "Supabase insert error (non-critical)",
      { code: "23505", message: "duplicate key" }
    );
    expect(result.contactId).toBe("ghl-contact-123");
  });

  // -----------------------------------------------------------------------
  // Supabase network error — non-critical, logged
  // -----------------------------------------------------------------------
  it("logs warning when Supabase throws a network error", async () => {
    const mockFrom = vi.fn().mockReturnValue({
      insert: vi.fn().mockRejectedValue(new Error("Connection refused")),
    });
    mockGetSupabaseAdmin.mockReturnValue({ from: mockFrom });

    const result = await processContact(contactPayload, { log: mockLog });

    expect(mockLog.warn).toHaveBeenCalledWith(
      "Supabase network error (non-critical)"
    );
    expect(result.contactId).toBe("ghl-contact-123");
  });

  // -----------------------------------------------------------------------
  // Organization field handling
  // -----------------------------------------------------------------------
  it("passes undefined companyName when organization is empty string", async () => {
    const payload = { ...contactPayload, organization: "" };
    await processContact(payload, { log: mockLog });

    const args = mockCreateGHLContact.mock.calls[0][0];
    expect(args.companyName).toBeUndefined();
  });

  // -----------------------------------------------------------------------
  // Supabase row defaults
  // -----------------------------------------------------------------------
  it("inserts null organization and page_url when not provided", async () => {
    const { mockInsert } = setupSupabase();
    const payload = { ...contactPayload, organization: "" };

    await processContact(payload, { log: mockLog });

    const row = mockInsert.mock.calls[0][0];
    expect(row.organization).toBeNull();
    expect(row.page_url).toBeNull();
  });
});
