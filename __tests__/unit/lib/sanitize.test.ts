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
  });

  it("encodes ampersand", () => {
    expect(sanitizeString("a & b")).toContain("&amp;");
  });

  it("encodes quotes", () => {
    expect(sanitizeString('"quoted"')).toContain("&quot;");
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
