import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

/**
 * Page object for the services page (/services).
 */
export class ServicesPage extends BasePage {
  /* ---- page heading ---- */
  readonly heading: Locator;

  /* ---- interactive service selector ---- */
  readonly selectorHeading: Locator;
  readonly serviceRadios: Locator;

  /* ---- service detail view ---- */
  readonly keyFeaturesText: Locator;

  /* ---- "All Services" grid ---- */
  readonly allServicesHeading: Locator;

  /* ---- pricing section ---- */
  readonly pricingSection: Locator;
  readonly pricingHeading: Locator;

  /* ---- structured data ---- */
  readonly jsonLdScripts: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole("heading", {
      level: 1,
      name: /Our Services/i,
    });

    this.selectorHeading = page.getByRole("heading", {
      name: /Select a Service to Learn More/i,
    });
    this.serviceRadios = page.locator('input[name="service"]');

    this.keyFeaturesText = page.getByText("Key Features");

    this.allServicesHeading = page.getByRole("heading", {
      name: /All Services at a Glance/i,
    });

    this.pricingSection = page.locator("#pricing");
    this.pricingHeading = page.getByRole("heading", {
      name: /Ministry-Friendly Pricing/i,
    });

    this.jsonLdScripts = page.locator('script[type="application/ld+json"]');
  }

  /** Navigate to the services page. */
  async goto() {
    await super.goto("/services");
  }

  /** Return a radio locator for a specific service value (e.g. "crm"). */
  serviceRadio(value: string): Locator {
    return this.page.locator(`input[name="service"][value="${value}"]`);
  }

  /** Return a heading locator for a service detail (level-3 heading). */
  serviceDetailHeading(name: RegExp): Locator {
    return this.page.getByRole("heading", { level: 3, name });
  }
}
