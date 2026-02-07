import { describe, it, expect, vi, beforeEach } from "vitest";
import type { LeadPayload } from "@/lib/types";

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
import { processLead } from "@/lib/services/lead-service";

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------
const baseLead: LeadPayload = {
  type: "exit_intent_lead",
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "5559876543",
  source: "exit-intent-popup",
  recaptchaToken: "token456",
};

const mockLog = { warn: vi.fn(), error: vi.fn() };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function setupGhlSuccess(contactId = "ghl-lead-456") {
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
describe("processLead", () => {
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
      "X-Webhook-Signature": "sig789",
      "X-Webhook-Timestamp": "1700000000000",
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true })
    );
  });

  // =======================================================================
  // Happy path
  // =======================================================================
  it("returns contactId on successful processing", async () => {
    const result = await processLead(baseLead, { log: mockLog });

    expect(result.contactId).toBe("ghl-lead-456");
    expect(mockLog.warn).not.toHaveBeenCalled();
    expect(mockLog.error).not.toHaveBeenCalled();
  });

  it("creates GHL contact with correct base parameters", async () => {
    await processLead(baseLead, { log: mockLog });

    expect(mockCreateGHLContact).toHaveBeenCalledTimes(1);
    const args = mockCreateGHLContact.mock.calls[0][0];
    expect(args.firstName).toBe("Jane");
    expect(args.name).toBe("Jane Doe");
    expect(args.email).toBe("jane@example.com");
    expect(args.phone).toBe("5559876543");
    expect(args.source).toBe("exit-intent-popup");
  });

  // =======================================================================
  // Tag building - LEAD_TYPE_TAGS map
  // =======================================================================
  describe("tag building", () => {
    it("maps exit_intent_lead to exit-intent tag", async () => {
      const payload: LeadPayload = { ...baseLead, type: "exit_intent_lead" };
      await processLead(payload, { log: mockLog });

      const tags = mockCreateGHLContact.mock.calls[0][0].tags;
      expect(tags).toContain("exit-intent");
    });

    it("maps white_paper_download to white-paper-download tag", async () => {
      const payload: LeadPayload = {
        ...baseLead,
        type: "white_paper_download",
        source: "white-paper",
      };
      await processLead(payload, { log: mockLog });

      const tags = mockCreateGHLContact.mock.calls[0][0].tags;
      expect(tags).toContain("white-paper-download");
    });

    it("maps trip_planner to trip-planner tag", async () => {
      const payload: LeadPayload = {
        ...baseLead,
        type: "trip_planner",
        source: "trip-planner",
      };
      await processLead(payload, { log: mockLog });

      const tags = mockCreateGHLContact.mock.calls[0][0].tags;
      expect(tags).toContain("trip-planner");
    });

    it("maps cookie_consent to cookie-consent tag", async () => {
      const payload: LeadPayload = {
        ...baseLead,
        type: "cookie_consent",
        source: "cookie-banner",
      };
      await processLead(payload, { log: mockLog });

      const tags = mockCreateGHLContact.mock.calls[0][0].tags;
      expect(tags).toContain("cookie-consent");
    });

    it("falls back to underscore-to-dash replacement for unknown types", async () => {
      const payload: LeadPayload = {
        ...baseLead,
        type: "newsletter_signup",
        source: "newsletter",
      };
      await processLead(payload, { log: mockLog });

      const tags = mockCreateGHLContact.mock.calls[0][0].tags;
      expect(tags).toContain("newsletter-signup");
    });

    // -----------------------------------------------------------------------
    // white_paper_download + serviceName
    // -----------------------------------------------------------------------
    it("adds wp-{serviceName} tag for white_paper_download with serviceName", async () => {
      const payload: LeadPayload = {
        ...baseLead,
        type: "white_paper_download",
        source: "white-paper",
        serviceName: "CRM Solutions",
      };
      await processLead(payload, { log: mockLog });

      const tags = mockCreateGHLContact.mock.calls[0][0].tags;
      expect(tags).toContain("white-paper-download");
      expect(tags).toContain("wp-crm-solutions");
    });

    it("does not add wp-tag when type is not white_paper_download even with serviceName", async () => {
      const payload: LeadPayload = {
        ...baseLead,
        type: "exit_intent_lead",
        serviceName: "Web Design",
      };
      await processLead(payload, { log: mockLog });

      const tags = mockCreateGHLContact.mock.calls[0][0].tags;
      expect(tags).not.toContainEqual(expect.stringContaining("wp-"));
    });

    // -----------------------------------------------------------------------
    // trip_planner + tripType
    // -----------------------------------------------------------------------
    it("adds trip-{tripType} tag for trip_planner with tripType", async () => {
      const payload: LeadPayload = {
        ...baseLead,
        type: "trip_planner",
        source: "trip-planner",
        tripType: "holy-land",
      };
      await processLead(payload, { log: mockLog });

      const tags = mockCreateGHLContact.mock.calls[0][0].tags;
      expect(tags).toContain("trip-planner");
      expect(tags).toContain("trip-holy-land");
    });

    it("does not add trip-tag when type is not trip_planner even with tripType", async () => {
      const payload: LeadPayload = {
        ...baseLead,
        type: "exit_intent_lead",
        tripType: "holy-land",
      };
      await processLead(payload, { log: mockLog });

      const tags = mockCreateGHLContact.mock.calls[0][0].tags;
      expect(tags).not.toContainEqual(expect.stringContaining("trip-"));
    });
  });

  // =======================================================================
  // Company name resolution (organization or churchName)
  // =======================================================================
  describe("companyName resolution", () => {
    it("uses organization as companyName when present", async () => {
      const payload: LeadPayload = { ...baseLead, organization: "Grace Church" };
      await processLead(payload, { log: mockLog });

      const args = mockCreateGHLContact.mock.calls[0][0];
      expect(args.companyName).toBe("Grace Church");
    });

    it("falls back to churchName when organization is absent", async () => {
      const payload: LeadPayload = { ...baseLead, churchName: "Hope Chapel" };
      await processLead(payload, { log: mockLog });

      const args = mockCreateGHLContact.mock.calls[0][0];
      expect(args.companyName).toBe("Hope Chapel");
    });

    it("passes undefined companyName when neither is provided", async () => {
      await processLead(baseLead, { log: mockLog });

      const args = mockCreateGHLContact.mock.calls[0][0];
      expect(args.companyName).toBeUndefined();
    });
  });

  // =======================================================================
  // GHL failure - graceful degradation
  // =======================================================================
  it("logs warning when GHL creation fails but still returns result", async () => {
    setupGhlFailure("GHL API error: 422");

    const result = await processLead(baseLead, { log: mockLog });

    expect(mockLog.warn).toHaveBeenCalledWith(
      "GHL contact creation failed, falling back to webhook",
      expect.objectContaining({ error: "GHL API error: 422" })
    );
    expect(result.contactId).toBeUndefined();
  });

  it("still sends webhook and saves to database when GHL fails", async () => {
    setupGhlFailure();
    const { mockInsert } = setupSupabase();
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", mockFetch);

    await processLead(baseLead, { log: mockLog });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockInsert).toHaveBeenCalledTimes(1);
    const row = mockInsert.mock.calls[0][0];
    expect(row.ghl_contact_id).toBeNull();
  });

  // =======================================================================
  // Webhook
  // =======================================================================
  it("sends webhook with lead data excluding recaptchaToken", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", mockFetch);

    await processLead(baseLead, {
      referer: "https://growministry.com/travel",
      log: mockLog,
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.name).toBe("Jane Doe");
    expect(body.email).toBe("jane@example.com");
    expect(body.pageUrl).toBe("https://growministry.com/travel");
    expect(body.timestamp).toBeDefined();
    // recaptchaToken should be stripped
    expect(body.recaptchaToken).toBeUndefined();
  });

  it("uses default pageUrl when referer is not provided", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", mockFetch);

    await processLead(baseLead, { log: mockLog });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.pageUrl).toBe("https://growministry.com");
  });

  it("skips webhook when URL is not configured", async () => {
    mockGetGhlWebhookUrl.mockReset();
    mockGetGhlWebhookUrl.mockReturnValue(undefined);
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    const result = await processLead(baseLead, { log: mockLog });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.contactId).toBe("ghl-lead-456");
  });

  it("logs warning when webhook delivery fails but still succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error"))
    );

    const result = await processLead(baseLead, { log: mockLog });

    expect(mockLog.warn).toHaveBeenCalledWith(
      "Webhook delivery failed (non-critical)"
    );
    expect(result.contactId).toBe("ghl-lead-456");
  });

  // =======================================================================
  // Supabase
  // =======================================================================
  it("saves to leads table with correct fields", async () => {
    const { mockFrom, mockInsert } = setupSupabase();

    await processLead(baseLead, {
      referer: "https://growministry.com/travel",
      log: mockLog,
    });

    expect(mockFrom).toHaveBeenCalledWith("leads");
    expect(mockInsert).toHaveBeenCalledTimes(1);
    const row = mockInsert.mock.calls[0][0];
    expect(row.type).toBe("exit_intent_lead");
    expect(row.name).toBe("Jane Doe");
    expect(row.email).toBe("jane@example.com");
    expect(row.phone).toBe("5559876543");
    expect(row.source).toBe("exit-intent-popup");
    expect(row.ghl_contact_id).toBe("ghl-lead-456");
    expect(row.page_url).toBe("https://growministry.com/travel");
  });

  it("stores extra fields in the extra column", async () => {
    const { mockInsert } = setupSupabase();
    const payload: LeadPayload = {
      ...baseLead,
      type: "trip_planner",
      source: "trip-planner",
      tripType: "holy-land",
      destinations: "Israel, Jordan",
      groupSize: "25",
    };

    await processLead(payload, { log: mockLog });

    const row = mockInsert.mock.calls[0][0];
    expect(row.extra).toEqual(
      expect.objectContaining({
        tripType: "holy-land",
        destinations: "Israel, Jordan",
        groupSize: "25",
      })
    );
  });

  it("inserts null extra when no extra fields are present", async () => {
    const { mockInsert } = setupSupabase();

    await processLead(baseLead, { log: mockLog });

    const row = mockInsert.mock.calls[0][0];
    expect(row.extra).toBeNull();
  });

  it("skips database save when Supabase is not configured", async () => {
    setupSupabase(false);

    const result = await processLead(baseLead, { log: mockLog });

    expect(result.contactId).toBe("ghl-lead-456");
    expect(mockLog.warn).not.toHaveBeenCalled();
    expect(mockLog.error).not.toHaveBeenCalled();
  });

  it("logs error when Supabase insert returns an error", async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      error: { code: "42P01", message: "relation does not exist" },
    });
    const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
    mockGetSupabaseAdmin.mockReturnValue({ from: mockFrom });

    const result = await processLead(baseLead, { log: mockLog });

    expect(mockLog.error).toHaveBeenCalledWith(
      "Supabase insert error (non-critical)",
      { code: "42P01", message: "relation does not exist" }
    );
    expect(result.contactId).toBe("ghl-lead-456");
  });

  it("logs warning when Supabase throws a network error", async () => {
    const mockFrom = vi.fn().mockReturnValue({
      insert: vi.fn().mockRejectedValue(new Error("ECONNREFUSED")),
    });
    mockGetSupabaseAdmin.mockReturnValue({ from: mockFrom });

    const result = await processLead(baseLead, { log: mockLog });

    expect(mockLog.warn).toHaveBeenCalledWith(
      "Supabase network error (non-critical)"
    );
    expect(result.contactId).toBe("ghl-lead-456");
  });

  // =======================================================================
  // Null defaults for optional fields
  // =======================================================================
  it("inserts null phone and page_url when not provided", async () => {
    const { mockInsert } = setupSupabase();
    const payload: LeadPayload = {
      type: "cookie_consent",
      name: "No Phone User",
      email: "nophone@test.com",
      source: "cookie-banner",
      recaptchaToken: "tok",
    };

    await processLead(payload, { log: mockLog });

    const row = mockInsert.mock.calls[0][0];
    expect(row.phone).toBeNull();
    expect(row.page_url).toBeNull();
  });
});
