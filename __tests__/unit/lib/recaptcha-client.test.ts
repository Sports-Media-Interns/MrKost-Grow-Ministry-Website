import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("recaptcha-client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  describe("loadRecaptchaScript", () => {
    it("does nothing when no site key is configured", async () => {
      vi.stubEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY", "");

      const { loadRecaptchaScript } = await import("@/lib/recaptcha-client");

      const appendChildSpy = vi.spyOn(document.head, "appendChild");
      loadRecaptchaScript();
      expect(appendChildSpy).not.toHaveBeenCalled();
    });

    it("does nothing when script already exists", async () => {
      vi.stubEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY", "site-key-123");

      // Add a fake script element that matches the selector
      const existingScript = document.createElement("script");
      existingScript.src = "https://www.google.com/recaptcha/api.js?render=site-key-123";
      document.head.appendChild(existingScript);

      const { loadRecaptchaScript } = await import("@/lib/recaptcha-client");

      const createElementSpy = vi.spyOn(document, "createElement");
      loadRecaptchaScript();
      expect(createElementSpy).not.toHaveBeenCalled();

      // Clean up
      existingScript.remove();
    });

    it("appends script to head when site key is set and script is absent", async () => {
      vi.stubEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY", "site-key-456");

      const { loadRecaptchaScript } = await import("@/lib/recaptcha-client");

      loadRecaptchaScript();

      const injectedScript = document.querySelector(
        `script[src*="recaptcha/api.js"]`
      ) as HTMLScriptElement | null;
      expect(injectedScript).not.toBeNull();
      expect(injectedScript?.src).toContain("render=site-key-456");
      expect(injectedScript?.async).toBe(true);

      // Clean up
      injectedScript?.remove();
    });
  });

  describe("getRecaptchaToken", () => {
    it("returns empty string when grecaptcha is not available", async () => {
      vi.stubEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY", "site-key-123");

      const { getRecaptchaToken } = await import("@/lib/recaptcha-client");

      // window.grecaptcha is not defined by default in jsdom
      const token = await getRecaptchaToken("submit");
      expect(token).toBe("");
    });

    it("returns token when grecaptcha is available", async () => {
      vi.stubEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY", "site-key-789");

      const mockExecute = vi.fn().mockResolvedValue("recaptcha-token-abc");
      vi.stubGlobal("grecaptcha", { execute: mockExecute });

      const { getRecaptchaToken } = await import("@/lib/recaptcha-client");

      const token = await getRecaptchaToken("contact");
      expect(token).toBe("recaptcha-token-abc");
      expect(mockExecute).toHaveBeenCalledWith("site-key-789", {
        action: "contact",
      });
    });

    it("returns empty string when grecaptcha.execute throws", async () => {
      vi.stubEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY", "site-key-789");

      const mockExecute = vi.fn().mockRejectedValue(new Error("Script not loaded"));
      vi.stubGlobal("grecaptcha", { execute: mockExecute });

      const { getRecaptchaToken } = await import("@/lib/recaptcha-client");

      const token = await getRecaptchaToken("submit");
      expect(token).toBe("");
    });
  });
});
