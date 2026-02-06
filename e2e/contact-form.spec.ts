import { test, expect } from "@playwright/test";

test.describe("Contact Form", () => {
  test("renders contact page with correct heading", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveTitle(/Contact/);
    await expect(
      page.getByRole("heading", { level: 1, name: /Contact Us/i })
    ).toBeVisible();
  });

  test("form fields are present with correct labels", async ({ page }) => {
    await page.goto("/contact");

    // Verify all form fields are attached and visible
    await expect(page.locator("#contact-name")).toBeVisible();
    await expect(page.locator("#contact-email")).toBeVisible();
    await expect(page.locator("#contact-phone")).toBeVisible();
    await expect(page.locator("#contact-org")).toBeVisible();
    await expect(page.locator("#contact-service")).toBeVisible();
    await expect(page.locator("#contact-message")).toBeVisible();

    // Verify labels
    await expect(page.getByText("Full Name *")).toBeVisible();
    await expect(page.getByText("Email Address *")).toBeVisible();
    await expect(page.getByText("Phone Number *")).toBeVisible();
    await expect(page.getByText("Church / Organization")).toBeVisible();
    await expect(page.getByText("Service of Interest *")).toBeVisible();
    await expect(page.getByText("Message *")).toBeVisible();
  });

  test("required fields have the required attribute", async ({ page }) => {
    await page.goto("/contact");

    await expect(page.locator("#contact-name")).toHaveAttribute("required", "");
    await expect(page.locator("#contact-email")).toHaveAttribute("required", "");
    await expect(page.locator("#contact-phone")).toHaveAttribute("required", "");
    await expect(page.locator("#contact-service")).toHaveAttribute("required", "");
    await expect(page.locator("#contact-message")).toHaveAttribute("required", "");

    // Organization is optional — no required attribute
    const orgRequired = await page.locator("#contact-org").getAttribute("required");
    expect(orgRequired).toBeNull();
  });

  test("submit button triggers native validation on empty form", async ({ page }) => {
    await page.goto("/contact");

    // Click the submit button without filling in any fields
    const submitButton = page.getByRole("button", { name: /Send Message/i });
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // The form should NOT have been submitted (HTML5 validation prevents it)
    // Verify we are still on the contact page with the form visible
    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator("#contact-name")).toBeVisible();
  });

  test("form fields accept user input correctly", async ({ page }) => {
    await page.goto("/contact");

    // Fill in each field
    await page.locator("#contact-name").fill("Jane Doe");
    await expect(page.locator("#contact-name")).toHaveValue("Jane Doe");

    await page.locator("#contact-email").fill("jane@example.org");
    await expect(page.locator("#contact-email")).toHaveValue("jane@example.org");

    await page.locator("#contact-phone").fill("(555) 987-6543");
    await expect(page.locator("#contact-phone")).toHaveValue("(555) 987-6543");

    await page.locator("#contact-org").fill("Hope Church");
    await expect(page.locator("#contact-org")).toHaveValue("Hope Church");

    await page.locator("#contact-service").selectOption("Website Development & SEO");
    await expect(page.locator("#contact-service")).toHaveValue(
      "Website Development & SEO"
    );

    await page.locator("#contact-message").fill("We need a new website for our church.");
    await expect(page.locator("#contact-message")).toHaveValue(
      "We need a new website for our church."
    );
  });

  test("service dropdown contains all expected options", async ({ page }) => {
    await page.goto("/contact");

    const options = page.locator("#contact-service option");
    const optionTexts = await options.allTextContents();

    expect(optionTexts).toContain("Select a service...");
    expect(optionTexts).toContain("Digital Marketing");
    expect(optionTexts).toContain("Website Development & SEO");
    expect(optionTexts).toContain("CRM Solutions");
    expect(optionTexts).toContain("AI Telephone Agent");
    expect(optionTexts).toContain("Social Media Management");
    expect(optionTexts).toContain("Faith-Based Travel");
    expect(optionTexts).toContain("Branded Merchandise Store");
    expect(optionTexts).toContain("General Inquiry");
  });

  test("contact information section displays contact details", async ({ page }) => {
    await page.goto("/contact");

    await expect(page.getByText("info@growministry.com")).toBeVisible();
    await expect(page.getByText("970-426-0844")).toBeVisible();
    await expect(page.getByText("Severance, CO 80550")).toBeVisible();
  });
});
