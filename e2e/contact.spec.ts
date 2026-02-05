import { test, expect } from "@playwright/test";

test.describe("Contact Page", () => {
  test("renders contact form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("form")).toBeVisible();
  });

  test("form has required fields", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator('input[name="name"], input[id="name"]')).toBeAttached();
    await expect(page.locator('input[name="email"], input[id="email"]')).toBeAttached();
  });

  test("page has correct heading", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
