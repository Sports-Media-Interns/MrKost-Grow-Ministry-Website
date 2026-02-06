import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "pnpm build && pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      GHL_WEBHOOK_URL: "https://stub.example.com",
      RECAPTCHA_SECRET_KEY: "stub-secret",
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "stub-site-key",
      NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: "pk.stub",
      NEXT_PUBLIC_GA4_MEASUREMENT_ID: "G-STUB",
      UPSTASH_REDIS_REST_URL: "https://stub-redis.example.com",
      UPSTASH_REDIS_REST_TOKEN: "stub-token",
    },
  },
});
