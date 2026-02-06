import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pricing } from "@/components/ui/pricing";

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

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      ...rest
    }: {
      children: React.ReactNode;
      className?: string;
    }) => <div className={className}>{children}</div>,
  },
}));

// Mock canvas-confetti
vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

// Mock @number-flow/react
vi.mock("@number-flow/react", () => ({
  default: ({ value, format }: { value: number; format?: Intl.NumberFormatOptions }) => {
    const formatted = new Intl.NumberFormat("en-US", format).format(value);
    return <span>{formatted}</span>;
  },
}));

// Mock useMediaQuery
vi.mock("@/hooks/use-media-query", () => ({
  useMediaQuery: vi.fn().mockReturnValue(true),
}));

const samplePlans = [
  {
    name: "Starter",
    price: "297",
    yearlyPrice: "237",
    period: "month",
    features: ["Feature A", "Feature B", "Feature C"],
    description: "Perfect for small churches getting started.",
    buttonText: "Get Started",
    href: "/contact",
    isPopular: false,
  },
  {
    name: "Growth",
    price: "597",
    yearlyPrice: "477",
    period: "month",
    features: ["Everything in Starter", "Feature D", "Feature E"],
    description: "For growing ministries ready to scale.",
    buttonText: "Start Growing",
    href: "/contact",
    isPopular: true,
  },
  {
    name: "Enterprise",
    price: "997",
    yearlyPrice: "797",
    period: "month",
    features: ["Everything in Growth", "Feature F", "Feature G"],
    description: "Full-service solution for large organizations.",
    buttonText: "Contact Us",
    href: "/contact",
    isPopular: false,
  },
];

describe("Pricing", () => {
  it("renders default title and description", () => {
    render(<Pricing plans={samplePlans} />);

    expect(
      screen.getByText("Simple, Transparent Pricing")
    ).toBeDefined();
    expect(
      screen.getByText(/choose the plan that works for your ministry/i)
    ).toBeDefined();
  });

  it("renders custom title and description when provided", () => {
    render(
      <Pricing
        plans={samplePlans}
        title="Our Plans"
        description="Pick one."
      />
    );

    expect(screen.getByText("Our Plans")).toBeDefined();
    expect(screen.getByText("Pick one.")).toBeDefined();
  });

  it("renders pricing card with plan names", () => {
    render(<Pricing plans={samplePlans} />);

    expect(screen.getByText("Starter")).toBeDefined();
    expect(screen.getByText("Growth")).toBeDefined();
    expect(screen.getByText("Enterprise")).toBeDefined();
  });

  it("renders features list for each plan", () => {
    render(<Pricing plans={samplePlans} />);

    expect(screen.getByText("Feature A")).toBeDefined();
    expect(screen.getByText("Feature B")).toBeDefined();
    expect(screen.getByText("Feature C")).toBeDefined();
    expect(screen.getByText("Everything in Starter")).toBeDefined();
    expect(screen.getByText("Feature D")).toBeDefined();
    expect(screen.getByText("Feature E")).toBeDefined();
    expect(screen.getByText("Everything in Growth")).toBeDefined();
    expect(screen.getByText("Feature F")).toBeDefined();
    expect(screen.getByText("Feature G")).toBeDefined();
  });

  it("renders CTA buttons with correct text", () => {
    render(<Pricing plans={samplePlans} />);

    expect(
      screen.getByRole("link", { name: /get started/i })
    ).toBeDefined();
    expect(
      screen.getByRole("link", { name: /start growing/i })
    ).toBeDefined();
    expect(
      screen.getByRole("link", { name: /contact us/i })
    ).toBeDefined();
  });

  it("renders plan descriptions", () => {
    render(<Pricing plans={samplePlans} />);

    expect(
      screen.getByText("Perfect for small churches getting started.")
    ).toBeDefined();
    expect(
      screen.getByText("For growing ministries ready to scale.")
    ).toBeDefined();
    expect(
      screen.getByText(
        "Full-service solution for large organizations."
      )
    ).toBeDefined();
  });

  it("shows monthly prices by default", () => {
    render(<Pricing plans={samplePlans} />);

    // Monthly prices ($297, $597, $997)
    expect(screen.getByText("$297")).toBeDefined();
    expect(screen.getByText("$597")).toBeDefined();
    expect(screen.getByText("$997")).toBeDefined();
  });

  it("renders Popular badge on popular plan", () => {
    render(<Pricing plans={samplePlans} />);

    expect(screen.getByText("Popular")).toBeDefined();
  });

  it("renders annual billing toggle", () => {
    render(<Pricing plans={samplePlans} />);

    expect(screen.getByText(/annual billing/i)).toBeDefined();
    expect(screen.getByText(/save 20%/i)).toBeDefined();
  });

  it("renders period text for plans", () => {
    render(<Pricing plans={samplePlans} />);

    const periodElements = screen.getAllByText(/\/ month/);
    expect(periodElements.length).toBe(3);
  });

  it("CTA buttons link to correct hrefs", () => {
    render(<Pricing plans={samplePlans} />);

    const getStartedLink = screen.getByRole("link", {
      name: /get started/i,
    });
    expect(getStartedLink.getAttribute("href")).toBe("/contact");
  });
});
