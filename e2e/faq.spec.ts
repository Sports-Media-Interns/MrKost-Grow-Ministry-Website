import { test, expect } from "@playwright/test";

test.describe("FAQ Page", () => {
  test("renders FAQ heading", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("has FAQ items", async ({ page }) => {
    await page.goto("/faq");
    // FAQ page should have multiple question/answer pairs
    const buttons = page.locator("button, details summary, [role='button']");
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test("has FAQPage JSON-LD structured data", async ({ page }) => {
    await page.goto("/faq");
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThan(0);
  });
});
