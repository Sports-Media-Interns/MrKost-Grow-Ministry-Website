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

    expect(screen.getByAltText("Grow Ministry Logo")).toBeInTheDocument();
    expect(screen.getByText("Grow Ministry")).toBeInTheDocument();
    expect(
      screen.getByText(
        /ai-powered digital growth for faith-based organizations/i
      )
    ).toBeInTheDocument();
  });

  it("renders SDVOSB certification info", () => {
    render(<Footer4Col />);

    expect(
      screen.getByAltText(
        "Service-Disabled Veteran-Owned Small Business Certified"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("SDVOSB Certified")).toBeInTheDocument();
    expect(
      screen.getByText(/CAGE Code: 9W3P6/)
    ).toBeInTheDocument();
  });

  it("renders all Services column links", () => {
    render(<Footer4Col />);

    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("AI Telephone Agent")).toBeInTheDocument();
    expect(screen.getByText("CRM Solutions")).toBeInTheDocument();
    expect(screen.getByText("Social Media")).toBeInTheDocument();
    expect(screen.getByText("Website & SEO")).toBeInTheDocument();
    expect(screen.getByText("Faith-Based Travel")).toBeInTheDocument();
    expect(screen.getByText("Branded Merchandise")).toBeInTheDocument();
  });

  it("renders all Company column links", () => {
    render(<Footer4Col />);

    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("FAQ")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("Careers")).toBeInTheDocument();
    expect(screen.getByText("Internships")).toBeInTheDocument();
    expect(screen.getByText("Skillbridge")).toBeInTheDocument();
  });

  it("renders all Legal column links", () => {
    render(<Footer4Col />);

    expect(screen.getByText("Legal")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
    expect(screen.getByText("Cookie Policy")).toBeInTheDocument();
    expect(screen.getByText("Copyright Policy")).toBeInTheDocument();
    expect(screen.getByText("Press")).toBeInTheDocument();
  });

  it("renders Contact Us column with contact info", () => {
    render(<Footer4Col />);

    expect(screen.getByText("Contact Us")).toBeInTheDocument();
    expect(screen.getByText("info@growministry.com")).toBeInTheDocument();
    expect(screen.getByText("970-426-0844")).toBeInTheDocument();
    expect(
      screen.getByText("Severance, CO, United States")
    ).toBeInTheDocument();
  });

  it("renders social media links with sr-only labels", () => {
    render(<Footer4Col />);

    expect(screen.getByText("Facebook")).toBeInTheDocument();
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("X / Twitter")).toBeInTheDocument();
    expect(screen.getByText("Flickr")).toBeInTheDocument();
    expect(screen.getByText("Reddit")).toBeInTheDocument();
    expect(screen.getByText("Twitch")).toBeInTheDocument();
  });

  it("renders copyright text with current year", () => {
    render(<Footer4Col />);

    const currentYear = new Date().getFullYear().toString();
    expect(
      screen.getByText(new RegExp(`${currentYear} Grow Ministry`))
    ).toBeInTheDocument();
    expect(screen.getByText(/a dakdan worldwide company/i)).toBeInTheDocument();
  });

  it("renders site map link in footer", () => {
    render(<Footer4Col />);

    const sitemapLink = screen.getByRole("link", { name: /site map/i });
    expect(sitemapLink).toBeInTheDocument();
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
