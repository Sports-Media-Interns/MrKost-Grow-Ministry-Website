import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getGhlWebhookUrl,
  getRecaptchaSecretKey,
  getRecaptchaSiteKey,
  getMapboxToken,
  getGA4MeasurementId,
  validateEnv,
  _resetEnvCache,
} from "@/lib/env";

describe("env accessors", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    _resetEnvCache();
  });

  describe("getGhlWebhookUrl", () => {
    it("returns GHL_WEBHOOK_URL when set", () => {
      vi.stubEnv("GHL_WEBHOOK_URL", "https://example.com/hook");
      expect(getGhlWebhookUrl()).toBe("https://example.com/hook");
    });

    it("returns empty string when not set", () => {
      vi.stubEnv("GHL_WEBHOOK_URL", "");
      expect(getGhlWebhookUrl()).toBe("");
    });
  });

  describe("getRecaptchaSecretKey", () => {
    it("returns the secret key", () => {
      vi.stubEnv("RECAPTCHA_SECRET_KEY", "secret-123");
      expect(getRecaptchaSecretKey()).toBe("secret-123");
    });

    it("returns empty when not set", () => {
      vi.stubEnv("RECAPTCHA_SECRET_KEY", "");
      expect(getRecaptchaSecretKey()).toBe("");
    });
  });

  describe("getRecaptchaSiteKey", () => {
    it("returns the site key", () => {
      vi.stubEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY", "site-key");
      expect(getRecaptchaSiteKey()).toBe("site-key");
    });
  });

  describe("getMapboxToken", () => {
    it("returns the token", () => {
      vi.stubEnv("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN", "pk.test");
      expect(getMapboxToken()).toBe("pk.test");
    });
  });

  describe("getGA4MeasurementId", () => {
    it("returns the GA4 ID", () => {
      vi.stubEnv("NEXT_PUBLIC_GA4_MEASUREMENT_ID", "G-TEST");
      expect(getGA4MeasurementId()).toBe("G-TEST");
    });
  });
});

describe("validateEnv", () => {
  it("reports missing required vars", () => {
    vi.stubEnv("GHL_WEBHOOK_URL", "");
    const result = validateEnv();
    expect(result.valid).toBe(false);
    expect(result.missing).toContain("GHL_WEBHOOK_URL");
  });

  it("passes when required vars present", () => {
    vi.stubEnv("GHL_WEBHOOK_URL", "https://example.com/hook");
    vi.stubEnv("RECAPTCHA_SECRET_KEY", "secret-123");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example.com");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token-123");
    const result = validateEnv();
    expect(result.valid).toBe(true);
    expect(result.missing).toHaveLength(0);
  });
});
