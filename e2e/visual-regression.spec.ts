import { test, expect } from "@playwright/test";

test.describe("Visual Regression", () => {
  test("homepage hero matches snapshot", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Wait for animations to settle
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot("homepage-hero.png", {
      fullPage: false,
      maxDiffPixelRatio: 0.05,
    });
  });

  test("contact page matches snapshot", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("contact-page.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test("services page matches snapshot", async ({ page }) => {
    await page.goto("/services");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("services-page.png", {
      fullPage: false,
      maxDiffPixelRatio: 0.05,
    });
  });

  test("about page matches snapshot", async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("about-page.png", {
      fullPage: false,
      maxDiffPixelRatio: 0.05,
    });
  });

  test("mobile homepage matches snapshot", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot("homepage-mobile.png", {
      fullPage: false,
      maxDiffPixelRatio: 0.05,
    });
  });
});
