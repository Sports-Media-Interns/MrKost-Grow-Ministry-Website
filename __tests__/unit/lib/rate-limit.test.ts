import { describe, it, expect, beforeEach } from "vitest";
import { rateLimitSync, getClientIp, _resetRateMap } from "@/lib/rate-limit";

describe("rateLimitSync", () => {
  beforeEach(() => {
    _resetRateMap();
  });

  it("allows requests within the limit", () => {
    const result = rateLimitSync("test-allow", { limit: 3 });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("blocks requests exceeding the limit", () => {
    rateLimitSync("test-block", { limit: 2 });
    rateLimitSync("test-block", { limit: 2 });
    const result = rateLimitSync("test-block", { limit: 2 });
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("tracks remaining correctly", () => {
    expect(rateLimitSync("test-remaining", { limit: 3 }).remaining).toBe(2);
    expect(rateLimitSync("test-remaining", { limit: 3 }).remaining).toBe(1);
    expect(rateLimitSync("test-remaining", { limit: 3 }).remaining).toBe(0);
  });

  it("uses separate counters per key", () => {
    rateLimitSync("key-a", { limit: 1 });
    const resultA = rateLimitSync("key-a", { limit: 1 });
    const resultB = rateLimitSync("key-b", { limit: 1 });
    expect(resultA.allowed).toBe(false);
    expect(resultB.allowed).toBe(true);
  });

  it("uses default limit of 5", () => {
    for (let i = 0; i < 5; i++) {
      expect(rateLimitSync("default-limit").allowed).toBe(true);
    }
    expect(rateLimitSync("default-limit").allowed).toBe(false);
  });
});

describe("getClientIp", () => {
  it("extracts IP from x-forwarded-for header", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    // Outside Vercel, takes last IP (closest to server, hardest to spoof)
    expect(getClientIp(request)).toBe("5.6.7.8");
  });

  it("extracts IP from x-real-ip header", () => {
    const request = new Request("http://localhost", {
      headers: { "x-real-ip": "10.0.0.1" },
    });
    expect(getClientIp(request)).toBe("10.0.0.1");
  });

  it("prefers x-real-ip over x-forwarded-for (anti-spoofing)", () => {
    const request = new Request("http://localhost", {
      headers: {
        "x-forwarded-for": "1.2.3.4",
        "x-real-ip": "10.0.0.1",
      },
    });
    // x-real-ip is set by the proxy (e.g., Vercel) and is more trustworthy
    expect(getClientIp(request)).toBe("10.0.0.1");
  });

  it("returns unknown when no header present", () => {
    const request = new Request("http://localhost");
    expect(getClientIp(request)).toBe("unknown");
  });
});
