import { test, expect } from "@playwright/test";

test.describe("Security Headers", () => {
  test("homepage returns security headers", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();

    expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["strict-transport-security"]).toContain("max-age=");
    expect(headers["content-security-policy"]).toContain("default-src 'self'");
  });

  test("static assets have immutable cache headers", async ({ request }) => {
    // Fetch homepage to discover a static asset URL
    const page = await request.get("/");
    const html = await page.text();

    // Extract a _next/static URL from the HTML
    const match = html.match(/\/_next\/static\/[^"'\s]+/);
    if (match) {
      const response = await request.get(match[0]);
      const cacheControl = response.headers()["cache-control"] || "";
      expect(cacheControl).toContain("immutable");
    }
  });
});
