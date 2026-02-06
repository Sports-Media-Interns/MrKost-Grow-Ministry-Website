import { test, expect } from "@playwright/test";
import { HomePage } from "./pages";

test.describe("Homepage", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
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
});
