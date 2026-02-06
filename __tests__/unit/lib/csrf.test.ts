import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { validateOrigin } from "@/lib/csrf";

function makeRequest(headers: Record<string, string> = {}) {
  return {
    headers: {
      get: (key: string) => headers[key.toLowerCase()] ?? null,
    },
  } as unknown as import("next/server").NextRequest;
}

describe("validateOrigin", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("development / test mode", () => {
    it("skips validation when NODE_ENV is not production", () => {
      vi.stubEnv("NODE_ENV", "development");
      const result = validateOrigin(makeRequest());
      expect(result).toBeNull();
    });

    it("skips validation in test environment", () => {
      vi.stubEnv("NODE_ENV", "test");
      const result = validateOrigin(makeRequest());
      expect(result).toBeNull();
    });
  });

  describe("production mode", () => {
    beforeEach(() => {
      vi.stubEnv("NODE_ENV", "production");
    });

    it("allows requests from growministry.com", () => {
      const req = makeRequest({ origin: "https://growministry.com" });
      expect(validateOrigin(req)).toBeNull();
    });

    it("allows requests from www.growministry.com", () => {
      const req = makeRequest({ origin: "https://www.growministry.com" });
      expect(validateOrigin(req)).toBeNull();
    });

    it("rejects requests from unknown origins", () => {
      const req = makeRequest({ origin: "https://evil.com" });
      expect(validateOrigin(req)).toBe("Forbidden origin: https://evil.com");
    });

    it("falls back to referer when origin is absent", () => {
      const req = makeRequest({ referer: "https://growministry.com/contact" });
      expect(validateOrigin(req)).toBeNull();
    });

    it("allows www referer", () => {
      const req = makeRequest({ referer: "https://www.growministry.com/about" });
      expect(validateOrigin(req)).toBeNull();
    });

    it("rejects unknown referer", () => {
      const req = makeRequest({ referer: "https://attacker.com/page" });
      expect(validateOrigin(req)).toBe("Forbidden referer");
    });

    it("rejects malformed referer", () => {
      const req = makeRequest({ referer: "not-a-url" });
      expect(validateOrigin(req)).toBe("Forbidden referer");
    });

    it("rejects missing origin and referer", () => {
      const req = makeRequest({});
      expect(validateOrigin(req)).toBe("Missing origin header");
    });

    it("prefers origin over referer when both present", () => {
      const req = makeRequest({
        origin: "https://evil.com",
        referer: "https://growministry.com/page",
      });
      expect(validateOrigin(req)).toBe("Forbidden origin: https://evil.com");
    });

    it("allows valid origin even with invalid referer", () => {
      const req = makeRequest({
        origin: "https://growministry.com",
        referer: "https://evil.com/page",
      });
      expect(validateOrigin(req)).toBeNull();
    });
  });
});
