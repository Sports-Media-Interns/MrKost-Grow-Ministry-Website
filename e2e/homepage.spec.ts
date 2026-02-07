import { test, expect } from "@playwright/test";
import { HomePage } from "./pages";

test.describe("Homepage", () => {
  let homePage: HomePage;
  const jsErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    jsErrors.length = 0;
    page.on("pageerror", (err) => jsErrors.push(err.message));
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("loads and displays hero section", async () => {
    await expect(homePage.page).toHaveTitle(/Grow Ministry/);
    // Main content area should be visible
    await expect(homePage.mainContent).toBeVisible();
  });

  test("has correct meta description", async () => {
    await expect(homePage.metaDescription).toHaveAttribute(
      "content",
      /AI-powered/
    );
  });

  test("skip to content link works", async () => {
    await expect(homePage.skipLink).toBeAttached();
  });

  test("has no JavaScript errors on page load", async () => {
    // Wait a moment for any async scripts (Three.js, analytics) to execute
    await homePage.page.waitForTimeout(2000);
    expect(jsErrors).toHaveLength(0);
  });
});
