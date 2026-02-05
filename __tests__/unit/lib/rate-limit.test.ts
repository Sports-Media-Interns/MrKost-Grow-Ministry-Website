import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, getClientIp, _resetRateMap } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    _resetRateMap();
  });

  it("allows requests within the limit", () => {
    const result = rateLimit("test-allow", { limit: 3 });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("blocks requests exceeding the limit", () => {
    rateLimit("test-block", { limit: 2 });
    rateLimit("test-block", { limit: 2 });
    const result = rateLimit("test-block", { limit: 2 });
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("tracks remaining correctly", () => {
    expect(rateLimit("test-remaining", { limit: 3 }).remaining).toBe(2);
    expect(rateLimit("test-remaining", { limit: 3 }).remaining).toBe(1);
    expect(rateLimit("test-remaining", { limit: 3 }).remaining).toBe(0);
  });

  it("uses separate counters per key", () => {
    rateLimit("key-a", { limit: 1 });
    const resultA = rateLimit("key-a", { limit: 1 });
    const resultB = rateLimit("key-b", { limit: 1 });
    expect(resultA.allowed).toBe(false);
    expect(resultB.allowed).toBe(true);
  });

  it("uses default limit of 5", () => {
    for (let i = 0; i < 5; i++) {
      expect(rateLimit("default-limit").allowed).toBe(true);
    }
    expect(rateLimit("default-limit").allowed).toBe(false);
  });
});

describe("getClientIp", () => {
  it("extracts IP from x-forwarded-for header", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getClientIp(request)).toBe("1.2.3.4");
  });

  it("extracts IP from x-real-ip header", () => {
    const request = new Request("http://localhost", {
      headers: { "x-real-ip": "10.0.0.1" },
    });
    expect(getClientIp(request)).toBe("10.0.0.1");
  });

  it("prefers x-forwarded-for over x-real-ip", () => {
    const request = new Request("http://localhost", {
      headers: {
        "x-forwarded-for": "1.2.3.4",
        "x-real-ip": "10.0.0.1",
      },
    });
    expect(getClientIp(request)).toBe("1.2.3.4");
  });

  it("returns unknown when no header present", () => {
    const request = new Request("http://localhost");
    expect(getClientIp(request)).toBe("unknown");
  });
});
