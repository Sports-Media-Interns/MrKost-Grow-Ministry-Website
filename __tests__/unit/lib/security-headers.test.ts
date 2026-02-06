import { describe, it, expect, beforeAll } from "vitest"

/**
 * Validates that the next.config.ts security headers are properly structured
 * and that the middleware CSP is correctly configured.
 */
describe("Security Headers (next.config.ts)", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let headers: any[]

  beforeAll(async () => {
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

describe("CSP Middleware", () => {
  it("includes upgrade-insecure-requests", async () => {
    const { middleware } = await import("@/middleware")
    const request = new Request("https://example.com/test")
    const response = middleware(request as never)
    const csp = response.headers.get("Content-Security-Policy")
    expect(csp).toContain("upgrade-insecure-requests")
  })

  it("includes self as default-src", async () => {
    const { middleware } = await import("@/middleware")
    const request = new Request("https://example.com/test")
    const response = middleware(request as never)
    const csp = response.headers.get("Content-Security-Policy")
    expect(csp).toContain("default-src 'self'")
  })

  it("includes frame-src for reCAPTCHA", async () => {
    const { middleware } = await import("@/middleware")
    const request = new Request("https://example.com/test")
    const response = middleware(request as never)
    const csp = response.headers.get("Content-Security-Policy")
    expect(csp).toContain("frame-src")
    expect(csp).toContain("www.recaptcha.net")
  })

  it("includes nonce in script-src", async () => {
    const { middleware } = await import("@/middleware")
    const request = new Request("https://example.com/test")
    const response = middleware(request as never)
    const csp = response.headers.get("Content-Security-Policy")
    expect(csp).toMatch(/nonce-[A-Za-z0-9+/=]+/)
  })
})
