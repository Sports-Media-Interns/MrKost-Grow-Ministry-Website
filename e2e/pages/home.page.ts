import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

/**
 * Page object for the homepage (/).
 */
export class HomePage extends BasePage {
  /** The hero <section> wrapping the shader animation and CTA. */
  readonly heroSection: Locator;

  /** The primary "Get Started" CTA link in the hero area. */
  readonly ctaButton: Locator;

  /** The "Our Services" secondary CTA link in the hero area. */
  readonly servicesButton: Locator;

  /** Service cards in the "Services Overview" grid. */
  readonly serviceCards: Locator;

  /** The meta description tag. */
  readonly metaDescription: Locator;

  constructor(page: Page) {
    super(page);

    // Hero is the first <section> on the page
    this.heroSection = page.locator("section").first();
    this.ctaButton = page.getByRole("link", { name: /Get Started/i });
    this.servicesButton = page.getByRole("link", { name: /Our Services/i });
    this.serviceCards = page.locator(
      "section:nth-of-type(2) a[href^='/services'], section:nth-of-type(2) a[href^='/travel']"
    );
    this.metaDescription = page.locator('meta[name="description"]');
  }

  /** Navigate to the homepage. */
  async goto() {
    await super.goto("/");
  }
}
