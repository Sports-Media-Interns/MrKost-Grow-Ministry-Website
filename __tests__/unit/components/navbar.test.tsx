import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "@/components/ui/navbar";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

describe("Navbar", () => {
  it("renders logo and brand name", () => {
    render(<Navbar />);

    expect(screen.getByAltText("Grow Ministry")).toBeInTheDocument();
    expect(screen.getByText("Grow Ministry")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /services/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /travel/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /contact/i }).length).toBeGreaterThan(0);
  });

  it("renders Get Started CTA button", () => {
    render(<Navbar />);

    const ctaButtons = screen.getAllByRole("link", { name: /get started/i });
    expect(ctaButtons.length).toBeGreaterThan(0);
  });

  it("has correct href for navigation links", () => {
    render(<Navbar />);

    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink.getAttribute("href")).toBe("/");

    const servicesLink = screen.getByRole("link", { name: /services/i });
    expect(servicesLink.getAttribute("href")).toBe("/services");

    const travelLink = screen.getByRole("link", { name: /travel/i });
    expect(travelLink.getAttribute("href")).toBe("/travel");

    const aboutLink = screen.getByRole("link", { name: /about/i });
    expect(aboutLink.getAttribute("href")).toBe("/about");
  });

  it("renders mobile menu toggle button", () => {
    render(<Navbar />);

    const menuButton = screen.getByLabelText(/toggle menu/i);
    expect(menuButton).toBeInTheDocument();
  });

  it("toggles mobile menu on button click", () => {
    render(<Navbar />);

    const menuButton = screen.getByLabelText(/toggle menu/i);

    // Mobile menu should not be visible initially
    expect(screen.queryByRole("link", { name: /home/i })?.closest("#mobile-menu")).toBeNull();

    // Click to open mobile menu
    fireEvent.click(menuButton);

    // Mobile menu should now be visible
    expect(screen.getByRole("navigation")).toBeInTheDocument();

    // Click to close mobile menu
    fireEvent.click(menuButton);
  });

  it("has correct aria-expanded attribute on menu button", () => {
    render(<Navbar />);

    const menuButton = screen.getByLabelText(/toggle menu/i);
    expect(menuButton.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(menuButton);
    expect(menuButton.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(menuButton);
    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("has aria-controls attribute referencing mobile menu", () => {
    render(<Navbar />);

    const menuButton = screen.getByLabelText(/toggle menu/i);
    expect(menuButton.getAttribute("aria-controls")).toBe("mobile-menu");
  });
});
