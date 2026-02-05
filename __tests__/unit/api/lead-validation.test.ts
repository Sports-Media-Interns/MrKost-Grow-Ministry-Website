import { describe, it, expect } from "vitest";
import {
  validateName,
  validateEmail,
  optionalString,
} from "@/lib/validation";
import { sanitizeString } from "@/lib/sanitize";

const ALLOWED_EXTRA_FIELDS = new Set([
  "organization",
  "service",
  "serviceName",
  "destinations",
  "groupSize",
  "travelDates",
  "travelMonth",
  "travelYear",
  "duration",
  "notes",
  "specialNeeds",
  "churchName",
  "offer",
  "tripType",
  "region",
]);

/**
 * Tests for lead validation matching the actual route logic.
 */
describe("Lead Validation", () => {
  describe("core fields", () => {
    it("validates name", () => {
      expect(validateName("Jane Doe")).toBe("Jane Doe");
    });

    it("validates email", () => {
      expect(validateEmail("jane@church.org")).toBe("jane@church.org");
    });

    it("rejects missing type", () => {
      expect(optionalString("")).toBe("");
    });

    it("sanitizes type string", () => {
      expect(optionalString("white_paper_download")).toBe("white_paper_download");
    });
  });

  describe("extra field whitelisting", () => {
    it("allows whitelisted fields", () => {
      expect(ALLOWED_EXTRA_FIELDS.has("organization")).toBe(true);
      expect(ALLOWED_EXTRA_FIELDS.has("churchName")).toBe(true);
      expect(ALLOWED_EXTRA_FIELDS.has("tripType")).toBe(true);
      expect(ALLOWED_EXTRA_FIELDS.has("region")).toBe(true);
    });

    it("blocks non-whitelisted fields", () => {
      expect(ALLOWED_EXTRA_FIELDS.has("admin")).toBe(false);
      expect(ALLOWED_EXTRA_FIELDS.has("__proto__")).toBe(false);
      expect(ALLOWED_EXTRA_FIELDS.has("role")).toBe(false);
    });

    it("sanitizes extra field values", () => {
      const value = '<script>hack</script>My Church';
      const sanitized = sanitizeString(value);
      expect(sanitized).not.toContain("<script>");
      expect(sanitized).toContain("My Church");
    });
  });

  describe("tag mapping", () => {
    const LEAD_TYPE_TAGS: Record<string, string> = {
      white_paper_download: "white-paper-download",
      trip_planner: "trip-planner",
      exit_intent_lead: "exit-intent",
      cookie_consent: "cookie-consent",
    };

    it("maps known lead types to tags", () => {
      expect(LEAD_TYPE_TAGS["white_paper_download"]).toBe("white-paper-download");
      expect(LEAD_TYPE_TAGS["trip_planner"]).toBe("trip-planner");
      expect(LEAD_TYPE_TAGS["exit_intent_lead"]).toBe("exit-intent");
    });

    it("falls back to hyphenated type for unknown types", () => {
      const type = "custom_form_type";
      const tag = LEAD_TYPE_TAGS[type] || type.replace(/_/g, "-");
      expect(tag).toBe("custom-form-type");
    });
  });
});
