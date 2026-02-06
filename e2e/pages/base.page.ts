import { Page, Locator } from "@playwright/test";

/**
 * Base page object that every page-specific class extends.
 *
 * Provides common locators (skip-link, navbar, footer) and helpers
 * shared across all pages.
 */
export class BasePage {
  readonly page: Page;
  readonly skipLink: Locator;
  readonly navbar: Locator;
  readonly footer: Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.skipLink = page.locator('a[href="#main-content"]');
    this.navbar = page.locator("nav");
    this.footer = page.locator("footer");
    this.mainContent = page.locator("#main-content");
  }

  /** Navigate to the given path (relative to baseURL). */
  async goto(path: string) {
    await this.page.goto(path);
  }

  /** Return the document title. */
  async getTitle(): Promise<string> {
    return this.page.title();
  }
}
