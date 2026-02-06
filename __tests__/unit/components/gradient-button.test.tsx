import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GradientButton } from "@/components/ui/gradient-button";

describe("GradientButton", () => {
  it("renders with children", () => {
    render(<GradientButton>Get Started</GradientButton>);

    expect(
      screen.getByRole("button", { name: /get started/i })
    ).toBeDefined();
  });

  it("renders as a button element by default", () => {
    render(<GradientButton>Click Me</GradientButton>);

    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn.tagName).toBe("BUTTON");
  });

  it("applies default gradient-button class", () => {
    render(<GradientButton>Default</GradientButton>);

    const btn = screen.getByRole("button", { name: /default/i });
    expect(btn.className).toContain("gradient-button");
  });

  it("applies variant class when variant is set", () => {
    render(<GradientButton variant="variant">Variant</GradientButton>);

    const btn = screen.getByRole("button", { name: /variant/i });
    expect(btn.className).toContain("gradient-button-variant");
  });

  it("renders as link when asChild with anchor", () => {
    render(
      <GradientButton asChild>
        <a href="/contact">Contact Us</a>
      </GradientButton>
    );

    const link = screen.getByRole("link", { name: /contact us/i });
    expect(link).toBeDefined();
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("/contact");
    // The gradient-button class should be applied to the anchor
    expect(link.className).toContain("gradient-button");
  });

  it("forwards className", () => {
    render(
      <GradientButton className="custom-class">Styled</GradientButton>
    );

    const btn = screen.getByRole("button", { name: /styled/i });
    expect(btn.className).toContain("custom-class");
    // Should still have the base class
    expect(btn.className).toContain("gradient-button");
  });

  it("forwards other HTML button props", () => {
    render(
      <GradientButton disabled type="submit" aria-label="Submit form">
        Submit
      </GradientButton>
    );

    const btn = screen.getByRole("button", { name: /submit form/i });
    expect(btn).toBeDefined();
    expect((btn as HTMLButtonElement).disabled).toBe(true);
    expect(btn.getAttribute("type")).toBe("submit");
  });

  it("includes base utility classes", () => {
    render(<GradientButton>Test</GradientButton>);

    const btn = screen.getByRole("button", { name: /test/i });
    expect(btn.className).toContain("inline-flex");
    expect(btn.className).toContain("items-center");
    expect(btn.className).toContain("justify-center");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<GradientButton ref={ref}>Ref Test</GradientButton>);

    expect(ref.current).toBeDefined();
    expect(ref.current?.tagName).toBe("BUTTON");
  });
});
