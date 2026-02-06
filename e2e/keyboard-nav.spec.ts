import { test, expect } from "@playwright/test";

test.describe("Keyboard Navigation & Accessibility", () => {
  test("skip-to-content link is attached and becomes visible on focus", async ({ page }) => {
    await page.goto("/");

    // The skip link exists in the DOM (sr-only by default)
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();

    // Verify it has the "Skip to main content" text
    await expect(skipLink).toHaveText(/Skip to main content/i);

    // Tab to focus the skip link (it should be the first focusable element)
    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();

    // When focused, the skip link should become visible (focus:not-sr-only styles)
    await expect(skipLink).toBeVisible();
  });

  test("Tab order reaches main navigation links", async ({ page }) => {
    await page.goto("/");

    // Tab past the skip-to-content link
    await page.keyboard.press("Tab");
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();

    // Tab to the logo link (first link in nav)
    await page.keyboard.press("Tab");
    const logoLink = page.locator('nav a[href="/"]').first();
    await expect(logoLink).toBeFocused();

    // Continue tabbing through nav links -- they are in the desktop nav
    // The nav links order: Home, Services, Travel, About, Contact
    await page.keyboard.press("Tab");
    const homeLink = page.locator('nav a[href="/"]').nth(1); // second / link (the nav link "Home")
    // Check that a nav element link is focused
    const focusedHref = await page.evaluate(() =>
      (document.activeElement as HTMLAnchorElement)?.getAttribute("href")
    );
    // The focused element should be a link within the navigation
    expect(focusedHref).toBeTruthy();
  });

  test("main content landmark has correct id", async ({ page }) => {
    await page.goto("/");
    const mainContent = page.locator("#main-content");
    await expect(mainContent).toBeAttached();
    await expect(mainContent).toHaveAttribute("id", "main-content");
  });

  test("skip link target matches the main content element", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.locator('a[href="#main-content"]');
    const skipHref = await skipLink.getAttribute("href");
    expect(skipHref).toBe("#main-content");

    // Verify the target element exists
    const target = page.locator(skipHref!);
    await expect(target).toBeAttached();
  });

  test("navbar has proper aria attributes on mobile menu toggle", async ({ page }) => {
    // Use mobile viewport to test the hamburger button
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: /Toggle menu/i });
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-label", "Toggle menu");
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(menuButton).toHaveAttribute("aria-controls", "mobile-menu");

    // Open menu and verify aria-expanded changes
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  });

  test("cookie consent banner has proper dialog role and aria attributes", async ({ page }) => {
    // Clear consent so banner appears
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("gm_cookie_consent"));
    await page.reload();

    const banner = page.locator('[role="dialog"][aria-labelledby="cookie-consent-title"]');
    await expect(banner).toBeVisible({ timeout: 5000 });
    await expect(banner).toHaveAttribute("role", "dialog");
    await expect(banner).toHaveAttribute("aria-modal", "true");
    await expect(banner).toHaveAttribute("aria-labelledby", "cookie-consent-title");
  });

  test("nav links have aria-current on active page", async ({ page }) => {
    await page.goto("/about");
    const aboutLink = page.locator('nav a[href="/about"]').first();
    await expect(aboutLink).toHaveAttribute("aria-current", "page");

    // Links to other pages should NOT have aria-current
    const servicesLink = page.locator('nav a[href="/services"]').first();
    const ariaCurrent = await servicesLink.getAttribute("aria-current");
    expect(ariaCurrent).toBeNull();
  });
});
