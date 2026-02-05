import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navbar contains all main links", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    // Check key navigation links exist
    await expect(nav.getByRole("link", { name: /about/i })).toBeAttached();
    await expect(nav.getByRole("link", { name: /services/i })).toBeAttached();
    await expect(nav.getByRole("link", { name: /contact/i })).toBeAttached();
  });

  test("navigates to about page", async ({ page }) => {
    await page.goto("/about");
    await expect(page).toHaveTitle(/About/);
  });

  test("navigates to services page", async ({ page }) => {
    await page.goto("/services");
    await expect(page).toHaveTitle(/Services/);
  });

  test("navigates to contact page", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveTitle(/Contact/);
  });

  test("navigates to FAQ page", async ({ page }) => {
    await page.goto("/faq");
    await expect(page).toHaveTitle(/FAQ/);
  });

  test("shows 404 for unknown routes", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
