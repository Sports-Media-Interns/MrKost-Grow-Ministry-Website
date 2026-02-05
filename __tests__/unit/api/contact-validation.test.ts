import { describe, it, expect } from "vitest";
import {
  validateName,
  validateEmail,
  validatePhone,
  validateMessage,
  optionalString,
} from "@/lib/validation";

/**
 * Tests for contact form validation using the shared validation module.
 * The actual API route uses these same functions.
 */
describe("Contact Form Validation", () => {
  describe("name validation", () => {
    it("accepts valid name", () => {
      expect(validateName("John Smith")).toBe("John Smith");
    });

    it("rejects empty name", () => {
      expect(() => validateName("")).toThrow("Name is required");
    });

    it("rejects single char", () => {
      expect(() => validateName("J")).toThrow("Name is required");
    });
  });

  describe("email validation", () => {
    it("accepts valid email", () => {
      expect(validateEmail("john@church.org")).toBe("john@church.org");
    });

    it("rejects invalid email", () => {
      expect(() => validateEmail("not-an-email")).toThrow("Valid email");
    });
  });

  describe("phone validation", () => {
    it("accepts valid phone", () => {
      expect(validatePhone("(555) 123-4567")).toBe("(555) 123-4567");
    });

    it("rejects too few digits", () => {
      expect(() => validatePhone("123")).toThrow("Valid phone");
    });
  });

  describe("message validation", () => {
    it("accepts valid message", () => {
      const msg = "I need help with my church CRM setup please.";
      expect(validateMessage(msg)).toBe(msg);
    });

    it("rejects too short message", () => {
      expect(() => validateMessage("Hi")).toThrow("Message is required");
    });
  });

  describe("service validation via optionalString", () => {
    it("sanitizes service string", () => {
      expect(optionalString("CRM Solutions")).toBe("CRM Solutions");
    });

    it("returns empty for missing service", () => {
      expect(optionalString(undefined)).toBe("");
    });
  });

  describe("full contact payload", () => {
    it("validates complete contact data without errors", () => {
      const name = validateName("John Smith");
      const email = validateEmail("john@church.org");
      const phone = validatePhone("(555) 123-4567");
      const service = optionalString("CRM Solutions");
      const message = validateMessage("I need help with my church CRM setup please.");

      expect(name).toBeTruthy();
      expect(email).toBeTruthy();
      expect(phone).toBeTruthy();
      expect(service).toBeTruthy();
      expect(message).toBeTruthy();
    });

    it("rejects null body", () => {
      expect(() => validateName((null as unknown as Record<string, unknown>)?.name)).toThrow();
    });
  });
});
