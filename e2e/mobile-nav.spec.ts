import { test, expect } from "@playwright/test";

test.describe("Mobile Responsive Navigation", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("hamburger menu button is visible on mobile", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /Toggle menu/i });
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  test("desktop nav links are hidden on mobile", async ({ page }) => {
    await page.goto("/");
    // The desktop nav container has class "hidden md:flex"
    // Links inside it should not be visible at mobile viewport
    const desktopNav = page.locator("nav .hidden.md\\:flex");
    await expect(desktopNav).not.toBeVisible();

    // The desktop "Get Started" CTA should also be hidden
    const desktopCta = page.locator("nav .hidden.md\\:block");
    await expect(desktopCta).not.toBeVisible();
  });

  test("clicking hamburger opens mobile menu with nav links", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /Toggle menu/i });

    // Open menu
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");

    // Mobile menu container should appear
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu).toBeVisible();

    // Verify nav links are visible in the mobile menu
    await expect(mobileMenu.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "Services" })).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "Travel" })).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "About" })).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "Contact" })).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "Get Started" })).toBeVisible();
  });

  test("clicking a nav link in mobile menu navigates to the page", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /Toggle menu/i });

    // Open menu
    await menuButton.click();
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu).toBeVisible();

    // Click "About" link
    await mobileMenu.getByRole("link", { name: "About" }).click();

    // Verify navigation happened
    await expect(page).toHaveTitle(/About/);
    await expect(page).toHaveURL(/\/about/);

    // Mobile menu should close after clicking a link (onClick closes it)
    await expect(mobileMenu).not.toBeVisible();
  });

  test("clicking hamburger again closes the mobile menu", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /Toggle menu/i });

    // Open menu
    await menuButton.click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");

    // Close menu
    await menuButton.click();
    await expect(page.locator("#mobile-menu")).not.toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });
});
