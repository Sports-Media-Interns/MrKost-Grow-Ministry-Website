import { test, expect } from "@playwright/test";
import { ContactPage } from "./pages";
import { createContactData } from "./fixtures/test-data";

test.describe("Contact Form", () => {
  let contactPage: ContactPage;

  test.beforeEach(async ({ page }) => {
    contactPage = new ContactPage(page);
    await contactPage.goto();
  });

  test("renders contact page with correct heading", async () => {
    await expect(contactPage.page).toHaveTitle(/Contact/);
    await expect(contactPage.heading).toBeVisible();
  });

  test("form fields are present with correct labels", async () => {
    // Verify all form fields are attached and visible
    await expect(contactPage.nameInput).toBeVisible();
    await expect(contactPage.emailInput).toBeVisible();
    await expect(contactPage.phoneInput).toBeVisible();
    await expect(contactPage.orgInput).toBeVisible();
    await expect(contactPage.serviceSelect).toBeVisible();
    await expect(contactPage.messageInput).toBeVisible();

    // Verify labels
    await expect(contactPage.nameLabel).toBeVisible();
    await expect(contactPage.emailLabel).toBeVisible();
    await expect(contactPage.phoneLabel).toBeVisible();
    await expect(contactPage.orgLabel).toBeVisible();
    await expect(contactPage.serviceLabel).toBeVisible();
    await expect(contactPage.messageLabel).toBeVisible();
  });

  test("required fields have the required attribute", async () => {
    await expect(contactPage.nameInput).toHaveAttribute("required", "");
    await expect(contactPage.emailInput).toHaveAttribute("required", "");
    await expect(contactPage.phoneInput).toHaveAttribute("required", "");
    await expect(contactPage.serviceSelect).toHaveAttribute("required", "");
    await expect(contactPage.messageInput).toHaveAttribute("required", "");

    // Organization is optional — no required attribute
    const orgRequired = await contactPage.orgInput.getAttribute("required");
    expect(orgRequired).toBeNull();
  });

  test("submit button triggers native validation on empty form", async () => {
    // Click the submit button without filling in any fields
    await expect(contactPage.submitButton).toBeVisible();
    await contactPage.submitForm();

    // The form should NOT have been submitted (HTML5 validation prevents it)
    // Verify we are still on the contact page with the form visible
    await expect(contactPage.form).toBeVisible();
    await expect(contactPage.nameInput).toBeVisible();
  });

  test("form fields accept user input correctly", async () => {
    const data = createContactData();

    await contactPage.fillForm(data);

    await expect(contactPage.nameInput).toHaveValue(data.name);
    await expect(contactPage.emailInput).toHaveValue(data.email);
    await expect(contactPage.phoneInput).toHaveValue(data.phone);
    await expect(contactPage.orgInput).toHaveValue(data.organization);
    await expect(contactPage.serviceSelect).toHaveValue(data.service);
    await expect(contactPage.messageInput).toHaveValue(data.message);
  });

  test("service dropdown contains all expected options", async () => {
    const optionTexts = await contactPage.getServiceOptionTexts();

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

  test("contact information section displays contact details", async () => {
    await expect(contactPage.page.getByText("info@growministry.com")).toBeVisible();
    await expect(contactPage.page.getByText("970-426-0844")).toBeVisible();
    await expect(contactPage.page.getByText("Severance, CO 80550")).toBeVisible();
  });
});
