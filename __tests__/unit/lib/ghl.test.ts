import { describe, it, expect, vi, beforeEach } from "vitest";
import { createGHLContact } from "@/lib/ghl";

describe("createGHLContact", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns failure when API token is missing", async () => {
    vi.stubEnv("GHL_API_TOKEN", "");
    vi.stubEnv("GHL_LOCATION_ID", "test-loc");

    const result = await createGHLContact({
      firstName: "John",
      name: "John Smith",
      email: "john@test.com",
      tags: ["contact-form"],
      source: "test",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("not configured");
  });

  it("returns failure when Location ID is missing", async () => {
    vi.stubEnv("GHL_API_TOKEN", "pit-test-token");
    vi.stubEnv("GHL_LOCATION_ID", "");

    const result = await createGHLContact({
      firstName: "John",
      name: "John Smith",
      email: "john@test.com",
      tags: ["contact-form"],
      source: "test",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("not configured");
  });

  it("sends correct request payload", async () => {
    vi.stubEnv("GHL_API_TOKEN", "pit-test-token");
    vi.stubEnv("GHL_LOCATION_ID", "test-location");

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ contact: { id: "contact-123" } }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await createGHLContact({
      firstName: "John",
      name: "John Smith",
      email: "john@test.com",
      phone: "555-1234",
      companyName: "Test Church",
      tags: ["contact-form", "service-crm"],
      source: "website",
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain("/contacts/");
    expect(options.method).toBe("POST");

    const body = JSON.parse(options.body);
    expect(body.email).toBe("john@test.com");
    expect(body.tags).toEqual(["contact-form", "service-crm"]);
    expect(body.locationId).toBe("test-location");
    expect(body.companyName).toBe("Test Church");

    expect(options.headers.Authorization).toBe("Bearer pit-test-token");
    expect(options.headers.Version).toBe("2021-07-28");
  });

  it("returns contactId on success", async () => {
    vi.stubEnv("GHL_API_TOKEN", "pit-test-token");
    vi.stubEnv("GHL_LOCATION_ID", "test-location");

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ contact: { id: "abc-123" } }),
    }));

    const result = await createGHLContact({
      firstName: "Jane",
      name: "Jane Doe",
      email: "jane@test.com",
      tags: ["exit-intent"],
      source: "exit-intent",
    });

    expect(result.success).toBe(true);
    expect(result.contactId).toBe("abc-123");
  });

  it("returns failure on non-ok response", async () => {
    vi.stubEnv("GHL_API_TOKEN", "pit-test-token");
    vi.stubEnv("GHL_LOCATION_ID", "test-location");

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: () => Promise.resolve({ error: "Invalid email" }),
    }));

    const result = await createGHLContact({
      firstName: "Bad",
      name: "Bad Data",
      email: "invalid",
      tags: ["test"],
      source: "test",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("422");
  });

  it("handles network errors gracefully", async () => {
    vi.stubEnv("GHL_API_TOKEN", "pit-test-token");
    vi.stubEnv("GHL_LOCATION_ID", "test-location");

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network failed")));

    const result = await createGHLContact({
      firstName: "John",
      name: "John Smith",
      email: "john@test.com",
      tags: ["test"],
      source: "test",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("failed");
  });

  it("splits full name into first and last", async () => {
    vi.stubEnv("GHL_API_TOKEN", "pit-test-token");
    vi.stubEnv("GHL_LOCATION_ID", "test-location");

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ contact: { id: "split-test" } }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await createGHLContact({
      firstName: "John",
      name: "John Michael Smith",
      email: "john@test.com",
      tags: ["test"],
      source: "test",
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.firstName).toBe("John");
    expect(body.lastName).toBe("Michael Smith");
  });
});
