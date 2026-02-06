import { describe, it, expect } from "vitest";
import {
  validateName,
  validateEmail,
  validatePhone,
  validateMessage,
  optionalString,
  isValidationError,
  ValidationError,
  EMAIL_REGEX,
} from "@/lib/validation";

describe("validateName", () => {
  it("accepts valid name", () => {
    expect(validateName("John Smith")).toBe("John Smith");
  });

  it("trims whitespace", () => {
    expect(validateName("  John  ")).toBe("John");
  });

  it("rejects empty string", () => {
    expect(() => validateName("")).toThrow("Name is required");
  });

  it("rejects single character", () => {
    expect(() => validateName("J")).toThrow("Name is required");
  });

  it("rejects non-string", () => {
    expect(() => validateName(123)).toThrow("Name is required");
  });

  it("rejects undefined", () => {
    expect(() => validateName(undefined)).toThrow("Name is required");
  });

  it("strips HTML tags", () => {
    const result = validateName("<script>alert(1)</script>John");
    expect(result).not.toContain("<script>");
  });
});

describe("validateEmail", () => {
  it("accepts valid email", () => {
    expect(validateEmail("user@example.com")).toBe("user@example.com");
  });

  it("trims whitespace", () => {
    expect(validateEmail("  user@example.com  ")).toBe("user@example.com");
  });

  it("rejects missing @", () => {
    expect(() => validateEmail("notanemail")).toThrow("Valid email");
  });

  it("rejects missing domain", () => {
    expect(() => validateEmail("user@")).toThrow("Valid email");
  });

  it("rejects empty string", () => {
    expect(() => validateEmail("")).toThrow("Valid email");
  });

  it("rejects non-string", () => {
    expect(() => validateEmail(null)).toThrow("Valid email");
  });
});

describe("validatePhone", () => {
  it("accepts valid US phone", () => {
    expect(validatePhone("(555) 123-4567")).toBe("(555) 123-4567");
  });

  it("accepts plain digits", () => {
    expect(validatePhone("5551234567")).toBe("5551234567");
  });

  it("rejects too few digits", () => {
    expect(() => validatePhone("123")).toThrow("Valid phone");
  });

  it("rejects empty", () => {
    expect(() => validatePhone("")).toThrow("Valid phone");
  });

  it("rejects non-string", () => {
    expect(() => validatePhone(undefined)).toThrow("Valid phone");
  });
});

describe("validateMessage", () => {
  it("accepts valid message", () => {
    expect(validateMessage("This is a valid message for the form.")).toBe(
      "This is a valid message for the form."
    );
  });

  it("rejects too short", () => {
    expect(() => validateMessage("Hi")).toThrow("Message is required");
  });

  it("rejects empty", () => {
    expect(() => validateMessage("")).toThrow("Message is required");
  });
});

describe("optionalString", () => {
  it("sanitizes string input", () => {
    expect(optionalString("hello")).toBe("hello");
  });

  it("returns empty for non-string", () => {
    expect(optionalString(undefined)).toBe("");
    expect(optionalString(null)).toBe("");
    expect(optionalString(123)).toBe("");
  });
});

describe("isValidationError", () => {
  it("returns true for ValidationError instances", () => {
    expect(isValidationError(new ValidationError("Name is required"))).toBe(true);
  });

  it("returns true for ValidationError with any message", () => {
    expect(isValidationError(new ValidationError("anything"))).toBe(true);
  });

  it("returns false for plain Error", () => {
    expect(isValidationError(new Error("Internal server error"))).toBe(false);
  });

  it("returns false for non-error values", () => {
    expect(isValidationError("Name is required")).toBe(false);
    expect(isValidationError(null)).toBe(false);
    expect(isValidationError(undefined)).toBe(false);
  });
});

describe("EMAIL_REGEX", () => {
  it("matches valid emails", () => {
    expect(EMAIL_REGEX.test("user@example.com")).toBe(true);
    expect(EMAIL_REGEX.test("a@b.co")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(EMAIL_REGEX.test("not-email")).toBe(false);
    expect(EMAIL_REGEX.test("@domain.com")).toBe(false);
  });
});
