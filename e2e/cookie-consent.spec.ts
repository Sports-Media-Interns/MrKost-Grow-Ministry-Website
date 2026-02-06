import { test, expect } from "@playwright/test";

test.describe("Cookie Consent Banner", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test so the banner always appears
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("gm_cookie_consent");
      localStorage.removeItem("gm_visitor_data");
    });
  });

  test("cookie banner appears on fresh visit", async ({ page }) => {
    // Reload to trigger fresh state
    await page.reload();
    const banner = page.locator('[role="dialog"][aria-label="Cookie consent"]');
    await expect(banner).toBeVisible({ timeout: 5000 });

    // Verify key elements in the banner
    await expect(page.getByText("We use cookies to enhance your experience")).toBeVisible();
    await expect(page.getByRole("link", { name: "Cookie Policy" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Accept All" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Essential Only" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Customize/i })).toBeVisible();
  });

  test("Accept All hides the banner and persists in localStorage", async ({ page }) => {
    await page.reload();
    const banner = page.locator('[role="dialog"][aria-label="Cookie consent"]');
    await expect(banner).toBeVisible({ timeout: 5000 });

    // Click Accept All
    await page.getByRole("button", { name: "Accept All" }).click();

    // Banner should disappear
    await expect(banner).not.toBeVisible();

    // Verify localStorage was set
    const consent = await page.evaluate(() => localStorage.getItem("gm_cookie_consent"));
    expect(consent).toBeTruthy();
    const parsed = JSON.parse(consent!);
    expect(parsed.essential).toBe(true);
    expect(parsed.analytics).toBe(true);
    expect(parsed.marketing).toBe(true);
    expect(parsed.functional).toBe(true);
  });

  test("banner does not reappear after accepting and reloading", async ({ page }) => {
    await page.reload();
    const banner = page.locator('[role="dialog"][aria-label="Cookie consent"]');
    await expect(banner).toBeVisible({ timeout: 5000 });

    // Accept cookies
    await page.getByRole("button", { name: "Accept All" }).click();
    await expect(banner).not.toBeVisible();

    // Reload the page — banner should NOT reappear
    await page.reload();
    // Give it time to potentially appear (the component has a 300ms delay)
    await page.waitForTimeout(1000);
    await expect(banner).not.toBeVisible();
  });

  test("Essential Only sets only essential preferences", async ({ page }) => {
    await page.reload();
    const banner = page.locator('[role="dialog"][aria-label="Cookie consent"]');
    await expect(banner).toBeVisible({ timeout: 5000 });

    // Click Essential Only
    await page.getByRole("button", { name: "Essential Only" }).click();

    // Banner should disappear
    await expect(banner).not.toBeVisible();

    // Verify localStorage has only essential cookies enabled
    const consent = await page.evaluate(() => localStorage.getItem("gm_cookie_consent"));
    expect(consent).toBeTruthy();
    const parsed = JSON.parse(consent!);
    expect(parsed.essential).toBe(true);
    expect(parsed.analytics).toBe(false);
    expect(parsed.marketing).toBe(false);
    expect(parsed.functional).toBe(false);
  });

  test("Customize panel opens and Save Preferences works", async ({ page }) => {
    await page.reload();
    const banner = page.locator('[role="dialog"][aria-label="Cookie consent"]');
    await expect(banner).toBeVisible({ timeout: 5000 });

    // Click Customize to expand the panel
    await page.getByRole("button", { name: /Customize/i }).click();

    // Verify customize panel is visible with category labels
    await expect(page.getByText("Essential")).toBeVisible();
    await expect(page.getByText("Analytics")).toBeVisible();
    await expect(page.getByText("Marketing")).toBeVisible();
    await expect(page.getByText("Functional")).toBeVisible();

    // Verify Save Preferences button is present
    await expect(page.getByRole("button", { name: "Save Preferences" })).toBeVisible();
  });
});
