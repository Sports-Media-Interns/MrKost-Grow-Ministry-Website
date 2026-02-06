import { test, expect } from "@playwright/test";

test.describe("Services Page", () => {
  test("loads and displays hero section with correct title", async ({ page }) => {
    await page.goto("/services");
    await expect(page).toHaveTitle(/Services/);
    await expect(
      page.getByRole("heading", { level: 1, name: /Our Services/i })
    ).toBeVisible();
  });

  test("service selector radio buttons are displayed", async ({ page }) => {
    await page.goto("/services");
    await expect(
      page.getByRole("heading", { name: /Select a Service to Learn More/i })
    ).toBeVisible();

    // Verify service selector radio buttons exist
    const serviceRadios = page.locator('input[name="service"]');
    const count = await serviceRadios.count();
    expect(count).toBe(7); // 7 services total
  });

  test("service detail section shows active service information", async ({ page }) => {
    await page.goto("/services");
    // Default active service is "AI Telephone Agent"
    await expect(
      page.getByRole("heading", { level: 3, name: /AI Telephone Agent/i })
    ).toBeVisible();
    // Verify features section is present
    await expect(page.getByText("Key Features")).toBeVisible();
  });

  test("All Services grid displays service cards", async ({ page }) => {
    await page.goto("/services");
    await expect(
      page.getByRole("heading", { name: /All Services at a Glance/i })
    ).toBeVisible();
    // Each service should have a card in the grid — check for a few titles
    await expect(page.getByText("AI Telephone Agent").first()).toBeAttached();
    await expect(page.getByText("Congregation Relationship Management").first()).toBeAttached();
    await expect(page.getByText("Social Media Management").first()).toBeAttached();
    await expect(page.getByText("Branded Merchandise Store").first()).toBeAttached();
  });

  test("pricing section exists with plan cards", async ({ page }) => {
    await page.goto("/services");
    const pricingSection = page.locator("#pricing");
    await expect(pricingSection).toBeAttached();
    await expect(
      page.getByRole("heading", { name: /Ministry-Friendly Pricing/i })
    ).toBeVisible();

    // Verify the three pricing plans are present
    await expect(page.getByText("ESSENTIALS")).toBeAttached();
    await expect(page.getByText("GROWTH")).toBeAttached();
    await expect(page.getByText("ENTERPRISE")).toBeAttached();
  });

  test("clicking a service radio changes the detail view", async ({ page }) => {
    await page.goto("/services");

    // Click the CRM service radio
    const crmRadio = page.locator('input[name="service"][value="crm"]');
    await crmRadio.check({ force: true });

    // Verify CRM detail is now shown
    await expect(
      page.getByRole("heading", { level: 3, name: /Congregation Relationship Management/i })
    ).toBeVisible();
    await expect(
      page.getByText(/centralized ministry management platform/)
    ).toBeVisible();
  });

  test("has Service JSON-LD structured data", async ({ page }) => {
    await page.goto("/services");
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThan(0);
  });
});
