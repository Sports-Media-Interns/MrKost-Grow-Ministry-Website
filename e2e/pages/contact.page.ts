import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { ContactData } from "../fixtures/test-data";

/**
 * Page object for the contact page (/contact).
 */
export class ContactPage extends BasePage {
  /* ---- form fields ---- */
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly orgInput: Locator;
  readonly serviceSelect: Locator;
  readonly messageInput: Locator;

  /* ---- form chrome ---- */
  readonly form: Locator;
  readonly submitButton: Locator;
  readonly serviceOptions: Locator;

  /* ---- labels ---- */
  readonly nameLabel: Locator;
  readonly emailLabel: Locator;
  readonly phoneLabel: Locator;
  readonly orgLabel: Locator;
  readonly serviceLabel: Locator;
  readonly messageLabel: Locator;

  /* ---- page heading ---- */
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);

    // Form fields (by stable id selectors used in the component)
    this.nameInput = page.locator("#contact-name");
    this.emailInput = page.locator("#contact-email");
    this.phoneInput = page.locator("#contact-phone");
    this.orgInput = page.locator("#contact-org");
    this.serviceSelect = page.locator("#contact-service");
    this.messageInput = page.locator("#contact-message");

    // Form & submit
    this.form = page.locator("form");
    this.submitButton = page.getByRole("button", { name: /Send Message/i });
    this.serviceOptions = page.locator("#contact-service option");

    // Labels
    this.nameLabel = page.getByText("Full Name *");
    this.emailLabel = page.getByText("Email Address *");
    this.phoneLabel = page.getByText("Phone Number *");
    this.orgLabel = page.getByText("Church / Organization");
    this.serviceLabel = page.getByText("Service of Interest *");
    this.messageLabel = page.getByText("Message *");

    // Heading
    this.heading = page.getByRole("heading", {
      level: 1,
      name: /Contact Us/i,
    });
  }

  /** Navigate to the contact page. */
  async goto() {
    await super.goto("/contact");
  }

  /** Fill every field in the contact form using the provided data. */
  async fillForm(data: ContactData) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phone);
    await this.orgInput.fill(data.organization);
    await this.serviceSelect.selectOption(data.service);
    await this.messageInput.fill(data.message);
  }

  /** Click the submit button. */
  async submitForm() {
    await this.submitButton.click();
  }

  /** Return the text contents of all <option> elements in the service dropdown. */
  async getServiceOptionTexts(): Promise<string[]> {
    return this.serviceOptions.allTextContents();
  }

  /**
   * Return the first visible error / validation message on the page.
   * Looks for a generic `[role="alert"]` element.
   */
  async getErrorMessage(): Promise<string | null> {
    const alert = this.page.locator('[role="alert"]').first();
    if (await alert.isVisible()) {
      return alert.textContent();
    }
    return null;
  }
}
