import { describe, it, expect } from "vitest";
import { sanitizeString, sanitizePayload } from "@/lib/sanitize";

describe("sanitizeString", () => {
  it("passes through clean strings", () => {
    expect(sanitizeString("Hello World")).toBe("Hello World");
  });

  it("strips HTML tags", () => {
    expect(sanitizeString("<b>bold</b>")).toBe("bold");
  });

  it("strips script tags", () => {
    expect(sanitizeString('<script>alert("xss")</script>')).not.toContain(
      "<script>"
    );
    expect(sanitizeString('<script>alert("xss")</script>')).not.toContain(
      "alert"
    );
  });

  it("strips style tags", () => {
    expect(sanitizeString("<style>body{display:none}</style>")).not.toContain(
      "<style>"
    );
  });

  it("removes javascript: URIs", () => {
    expect(sanitizeString("javascript:alert(1)")).not.toContain("javascript:");
  });

  it("removes event handlers", () => {
    expect(sanitizeString("onclick=alert(1)")).not.toContain("onclick=");
    expect(sanitizeString("onmouseover=evil()")).not.toContain("onmouseover=");
  });

  it("preserves ampersand for CRM data", () => {
    expect(sanitizeString("John & Jane's Church")).toBe("John & Jane's Church");
  });

  it("preserves quotes for CRM data", () => {
    expect(sanitizeString('"quoted text"')).toBe('"quoted text"');
  });

  it("trims whitespace", () => {
    expect(sanitizeString("  hello  ")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(sanitizeString("")).toBe("");
  });
});

describe("sanitizePayload", () => {
  it("sanitizes string values in object", () => {
    const result = sanitizePayload({
      name: "<b>John</b>",
      age: 30,
    });
    expect(result.name).toBe("John");
    expect(result.age).toBe(30);
  });

  it("preserves non-string values", () => {
    const result = sanitizePayload({
      active: true,
      count: 5,
      tags: ["a", "b"],
    });
    expect(result.active).toBe(true);
    expect(result.count).toBe(5);
    expect(result.tags).toEqual(["a", "b"]);
  });
});
