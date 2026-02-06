import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock the env module so we can control getRecaptchaSecretKey
vi.mock("@/lib/env", () => ({
  getRecaptchaSecretKey: vi.fn(),
}));

import { verifyRecaptcha } from "@/lib/recaptcha";
import { getRecaptchaSecretKey } from "@/lib/env";

const mockGetRecaptchaSecretKey = vi.mocked(getRecaptchaSecretKey);

describe("verifyRecaptcha", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Suppress console output during tests
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns success when no secret key in dev mode", async () => {
    mockGetRecaptchaSecretKey.mockReturnValue("");
    vi.stubEnv("NODE_ENV", "development");

    const result = await verifyRecaptcha("some-token");
    expect(result.success).toBe(true);
    expect(result.score).toBe(1.0);
  });

  it("returns failure when no secret key in production", async () => {
    mockGetRecaptchaSecretKey.mockReturnValue("");
    vi.stubEnv("NODE_ENV", "production");

    const result = await verifyRecaptcha("some-token");
    expect(result.success).toBe(false);
    expect(result.score).toBe(0);
  });

  it("returns failure for empty token in production", async () => {
    mockGetRecaptchaSecretKey.mockReturnValue("secret-key-123");

    const result = await verifyRecaptcha("");
    expect(result.success).toBe(false);
    expect(result.score).toBe(0);
  });

  it("returns success for valid verification response", async () => {
    mockGetRecaptchaSecretKey.mockReturnValue("secret-key-123");

    const mockFetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: true,
          score: 0.9,
          action: "submit",
        }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await verifyRecaptcha("valid-token", "submit");
    expect(result.success).toBe(true);
    expect(result.score).toBe(0.9);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://www.google.com/recaptcha/api/siteverify",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
    );
  });

  it("returns failure when score below threshold", async () => {
    mockGetRecaptchaSecretKey.mockReturnValue("secret-key-123");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            score: 0.3,
            action: "submit",
          }),
      })
    );

    const result = await verifyRecaptcha("low-score-token", "submit");
    expect(result.success).toBe(false);
    expect(result.score).toBe(0.3);
  });

  it("returns failure when action mismatches", async () => {
    mockGetRecaptchaSecretKey.mockReturnValue("secret-key-123");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            score: 0.9,
            action: "login",
          }),
      })
    );

    const result = await verifyRecaptcha("token", "submit");
    expect(result.success).toBe(false);
    expect(result.score).toBe(0);
  });

  it("handles network error gracefully", async () => {
    mockGetRecaptchaSecretKey.mockReturnValue("secret-key-123");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error"))
    );

    const result = await verifyRecaptcha("token");
    expect(result.success).toBe(false);
    expect(result.score).toBe(0);
  });

  it("handles timeout via AbortController", async () => {
    mockGetRecaptchaSecretKey.mockReturnValue("secret-key-123");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new DOMException("The operation was aborted.", "AbortError"))
    );

    const result = await verifyRecaptcha("token");
    expect(result.success).toBe(false);
    expect(result.score).toBe(0);
  });
});
