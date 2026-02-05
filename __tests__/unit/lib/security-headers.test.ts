import { describe, it, expect, beforeAll } from "vitest"

/**
 * Validates that the next.config.ts security headers are properly structured.
 * We import the config and check the headers() output.
 */
describe("Security Headers (next.config.ts)", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let headers: any[]

  beforeAll(async () => {
    // Dynamic import of the next config
    const config = await import("@/next.config")
    const nextConfig = config.default
    if (nextConfig.headers) {
      headers = await nextConfig.headers()
    }
  })

  it("returns headers array", () => {
    expect(Array.isArray(headers)).toBe(true)
    expect(headers.length).toBeGreaterThan(0)
  })

  it("includes global security headers for all routes", () => {
    const global = headers.find((h) => h.source === "/(.*)")
    expect(global).toBeTruthy()

    const names = global.headers.map((h: { key: string }) => h.key)
    expect(names).toContain("X-Frame-Options")
    expect(names).toContain("X-Content-Type-Options")
    expect(names).toContain("Strict-Transport-Security")
    expect(names).toContain("Content-Security-Policy")
    expect(names).toContain("Referrer-Policy")
    expect(names).toContain("Permissions-Policy")
  })

  it("sets X-Frame-Options to SAMEORIGIN", () => {
    const global = headers.find((h) => h.source === "/(.*)")
    const xfo = global.headers.find(
      (h: { key: string }) => h.key === "X-Frame-Options"
    )
    expect(xfo.value).toBe("SAMEORIGIN")
  })

  it("sets HSTS with includeSubDomains and preload", () => {
    const global = headers.find((h) => h.source === "/(.*)")
    const hsts = global.headers.find(
      (h: { key: string }) => h.key === "Strict-Transport-Security"
    )
    expect(hsts.value).toContain("max-age=")
    expect(hsts.value).toContain("includeSubDomains")
    expect(hsts.value).toContain("preload")
  })

  it("CSP includes upgrade-insecure-requests", () => {
    const global = headers.find((h) => h.source === "/(.*)")
    const csp = global.headers.find(
      (h: { key: string }) => h.key === "Content-Security-Policy"
    )
    expect(csp.value).toContain("upgrade-insecure-requests")
  })

  it("CSP includes self as default-src", () => {
    const global = headers.find((h) => h.source === "/(.*)")
    const csp = global.headers.find(
      (h: { key: string }) => h.key === "Content-Security-Policy"
    )
    expect(csp.value).toContain("default-src 'self'")
  })

  it("CSP includes frame-src for reCAPTCHA", () => {
    const global = headers.find((h) => h.source === "/(.*)")
    const csp = global.headers.find(
      (h: { key: string }) => h.key === "Content-Security-Policy"
    )
    expect(csp.value).toContain("frame-src")
    expect(csp.value).toContain("www.recaptcha.net")
  })

  it("caches _next/static assets as immutable", () => {
    const staticRule = headers.find((h) =>
      h.source.includes("_next/static")
    )
    expect(staticRule).toBeTruthy()
    const cc = staticRule.headers.find(
      (h: { key: string }) => h.key === "Cache-Control"
    )
    expect(cc.value).toContain("immutable")
    expect(cc.value).toContain("max-age=31536000")
  })

  it("caches /images with stale-while-revalidate", () => {
    const imagesRule = headers.find((h) => h.source === "/images/(.*)")
    expect(imagesRule).toBeTruthy()
    const cc = imagesRule.headers.find(
      (h: { key: string }) => h.key === "Cache-Control"
    )
    expect(cc.value).toContain("stale-while-revalidate")
  })
})
