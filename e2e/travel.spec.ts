import { test, expect } from "@playwright/test";

test.describe("Travel Page", () => {
  test("loads and displays hero section with correct title", async ({ page }) => {
    await page.goto("/travel");
    await expect(page).toHaveTitle(/Travel/);
    await expect(
      page.getByRole("heading", { level: 1, name: /Faith-Based Travel Programs/i })
    ).toBeVisible();
  });

  test("map container is present", async ({ page }) => {
    await page.goto("/travel");
    // The map section has id="destinations"
    const mapSection = page.locator("#destinations");
    await expect(mapSection).toBeVisible();
    // The map wrapper renders a loading placeholder or the actual map container
    // In E2E with stub Mapbox token, the fallback/loading div will be present
    const mapArea = mapSection.locator(".rounded-xl").first();
    await expect(mapArea).toBeAttached();
  });

  test("destination tabs are visible", async ({ page }) => {
    await page.goto("/travel");
    // The destination tabs section contains radio buttons for each region
    const tabSection = page.getByRole("heading", {
      name: /Select a Region to Explore/i,
    });
    await expect(tabSection).toBeVisible();

    // Check that region tab labels are present
    await expect(page.getByText("Holy Land & Bible Lands")).toBeAttached();
    await expect(page.getByText("Latin America & Caribbean")).toBeAttached();
    await expect(page.getByText("Africa")).toBeAttached();
    await expect(page.getByText("United States")).toBeAttached();
    await expect(page.getByText("Retreats & Conferences")).toBeAttached();
    await expect(page.getByText("Europe")).toBeAttached();
  });

  test("trip planner section exists", async ({ page }) => {
    await page.goto("/travel");
    const tripPlannerSection = page.locator("#trip-planner");
    await expect(tripPlannerSection).toBeAttached();
    await expect(
      page.getByRole("heading", { name: /Plan Your Trip/i })
    ).toBeVisible();
    // Trip planner wizard should show step 1 heading
    await expect(
      page.getByText("What type of trip are you planning?")
    ).toBeVisible();
  });

  test("clicking a destination tab changes displayed content", async ({ page }) => {
    await page.goto("/travel");

    // Default active tab is "Holy Land & Bible Lands" — verify its summary text is shown
    const holyLandSummary = page.getByText(/Walk where Jesus walked/);
    await expect(holyLandSummary).toBeVisible();

    // Click the "Africa" tab radio button
    const africaTab = page.locator('input[name="travel-region"][value="africa"]');
    await africaTab.check({ force: true });

    // Verify the summary text changes to Africa-related content
    await expect(
      page.getByText(/Sub-Saharan Africa offers some of the most transformative/)
    ).toBeVisible();

    // Verify Africa destination cards appear (Kenya, Uganda, Tanzania)
    await expect(page.getByText("Nairobi, Kenya")).toBeVisible();
  });

  test("trip type cards are displayed in travel programs section", async ({ page }) => {
    await page.goto("/travel");
    await expect(
      page.getByRole("heading", { name: /Types of Travel Programs/i })
    ).toBeVisible();
    // Verify the four trip type cards
    await expect(page.getByRole("heading", { level: 3, name: "Mission Trips" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Pilgrimages" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Spiritual Retreats" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Workshops & Conferences" })).toBeVisible();
  });

  test("has TravelAgency JSON-LD structured data", async ({ page }) => {
    await page.goto("/travel");
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThan(0);
  });
});
