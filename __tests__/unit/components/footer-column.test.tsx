import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer4Col from "@/components/ui/footer-column";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} />
  ),
}));

// Mock custom icons
vi.mock("@/components/ui/icons", () => ({
  FlickrIcon: ({ className }: { className?: string }) => (
    <svg data-testid="flickr-icon" className={className} />
  ),
  RedditIcon: ({ className }: { className?: string }) => (
    <svg data-testid="reddit-icon" className={className} />
  ),
}));

describe("Footer4Col", () => {
  it("renders company info and logo", () => {
    render(<Footer4Col />);

    expect(screen.getByAltText("Grow Ministry Logo")).toBeDefined();
    expect(screen.getByText("Grow Ministry")).toBeDefined();
    expect(
      screen.getByText(
        /ai-powered digital growth for faith-based organizations/i
      )
    ).toBeDefined();
  });

  it("renders SDVOSB certification info", () => {
    render(<Footer4Col />);

    expect(
      screen.getByAltText(
        "Service-Disabled Veteran-Owned Small Business Certified"
      )
    ).toBeDefined();
    expect(screen.getByText("SDVOSB Certified")).toBeDefined();
    expect(
      screen.getByText(/CAGE Code: 9W3P6/)
    ).toBeDefined();
  });

  it("renders all Services column links", () => {
    render(<Footer4Col />);

    expect(screen.getByText("Services")).toBeDefined();
    expect(screen.getByText("AI Telephone Agent")).toBeDefined();
    expect(screen.getByText("CRM Solutions")).toBeDefined();
    expect(screen.getByText("Social Media")).toBeDefined();
    expect(screen.getByText("Website & SEO")).toBeDefined();
    expect(screen.getByText("Faith-Based Travel")).toBeDefined();
    expect(screen.getByText("Branded Merchandise")).toBeDefined();
  });

  it("renders all Company column links", () => {
    render(<Footer4Col />);

    expect(screen.getByText("Company")).toBeDefined();
    expect(screen.getByText("About Us")).toBeDefined();
    expect(screen.getByText("FAQ")).toBeDefined();
    expect(screen.getByText("Contact")).toBeDefined();
    expect(screen.getByText("Careers")).toBeDefined();
    expect(screen.getByText("Internships")).toBeDefined();
    expect(screen.getByText("Skillbridge")).toBeDefined();
  });

  it("renders all Legal column links", () => {
    render(<Footer4Col />);

    expect(screen.getByText("Legal")).toBeDefined();
    expect(screen.getByText("Privacy Policy")).toBeDefined();
    expect(screen.getByText("Terms of Service")).toBeDefined();
    expect(screen.getByText("Cookie Policy")).toBeDefined();
    expect(screen.getByText("Copyright Policy")).toBeDefined();
    expect(screen.getByText("Press")).toBeDefined();
  });

  it("renders Contact Us column with contact info", () => {
    render(<Footer4Col />);

    expect(screen.getByText("Contact Us")).toBeDefined();
    expect(screen.getByText("info@growministry.com")).toBeDefined();
    expect(screen.getByText("970-426-0844")).toBeDefined();
    expect(
      screen.getByText("Severance, CO, United States")
    ).toBeDefined();
  });

  it("renders social media links with sr-only labels", () => {
    render(<Footer4Col />);

    expect(screen.getByText("Facebook")).toBeDefined();
    expect(screen.getByText("Instagram")).toBeDefined();
    expect(screen.getByText("LinkedIn")).toBeDefined();
    expect(screen.getByText("X / Twitter")).toBeDefined();
    expect(screen.getByText("Flickr")).toBeDefined();
    expect(screen.getByText("Reddit")).toBeDefined();
    expect(screen.getByText("Twitch")).toBeDefined();
  });

  it("renders copyright text with current year", () => {
    render(<Footer4Col />);

    const currentYear = new Date().getFullYear().toString();
    expect(
      screen.getByText(new RegExp(`${currentYear} Grow Ministry`))
    ).toBeDefined();
    expect(screen.getByText(/a dakdan worldwide company/i)).toBeDefined();
  });

  it("renders site map link in footer", () => {
    render(<Footer4Col />);

    const sitemapLink = screen.getByRole("link", { name: /site map/i });
    expect(sitemapLink).toBeDefined();
    expect(sitemapLink.getAttribute("href")).toBe("/sitemap");
  });

  it("external links have target=_blank and rel attributes", () => {
    render(<Footer4Col />);

    const brandedMerchLink = screen.getByText("Branded Merchandise").closest("a");
    expect(brandedMerchLink?.getAttribute("target")).toBe("_blank");
    expect(brandedMerchLink?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("internal links use correct hrefs", () => {
    render(<Footer4Col />);

    const aboutLink = screen.getByText("About Us").closest("a");
    expect(aboutLink?.getAttribute("href")).toBe("/about");

    const faqLink = screen.getByText("FAQ").closest("a");
    expect(faqLink?.getAttribute("href")).toBe("/faq");

    const privacyLink = screen.getByText("Privacy Policy").closest("a");
    expect(privacyLink?.getAttribute("href")).toBe("/privacy-policy");
  });
});
