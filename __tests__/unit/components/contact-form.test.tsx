import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContactForm } from "@/app/contact/contact-form";

// Mock next/script
vi.mock("next/script", () => ({
  default: ({ onLoad }: { onLoad?: () => void }) => {
    // Simulate script loading
    if (onLoad) {
      setTimeout(onLoad, 0);
    }
    return null;
  },
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ContactForm", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all form fields", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/full name/i)).toBeDefined();
    expect(screen.getByLabelText(/email address/i)).toBeDefined();
    expect(screen.getByLabelText(/phone number/i)).toBeDefined();
    expect(screen.getByLabelText(/church \/ organization/i)).toBeDefined();
    expect(screen.getByLabelText(/service of interest/i)).toBeDefined();
    expect(screen.getByLabelText(/message/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /send message/i })).toBeDefined();
  });

  it("allows typing in form fields", () => {
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@test.com" } });

    expect(nameInput.value).toBe("John Doe");
    expect(emailInput.value).toBe("john@test.com");
  });

  it("shows service options in dropdown", () => {
    render(<ContactForm />);

    const select = screen.getByLabelText(/service of interest/i);
    expect(select).toBeDefined();

    // Check that some service options exist
    expect(screen.getByText("Digital Marketing")).toBeDefined();
    expect(screen.getByText("Website Development & SEO")).toBeDefined();
    expect(screen.getByText("CRM Solutions")).toBeDefined();
    expect(screen.getByText("AI Telephone Agent")).toBeDefined();
  });

  it("shows success message after successful submission", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(<ContactForm />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "john@test.com" } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: "555-123-4567" } });
    fireEvent.change(screen.getByLabelText(/service of interest/i), { target: { value: "CRM Solutions" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "Test message" } });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/message sent!/i)).toBeDefined();
    });

    // Verify API was called
    expect(mockFetch).toHaveBeenCalledWith("/api/contact", expect.objectContaining({
      method: "POST",
    }));
  });

  it("shows error message on submission failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Test error message" }),
    });

    render(<ContactForm />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "john@test.com" } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: "555-123-4567" } });
    fireEvent.change(screen.getByLabelText(/service of interest/i), { target: { value: "CRM Solutions" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "Test message" } });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText("Test error message")).toBeDefined();
    });
  });

  it("allows sending another message after success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(<ContactForm />);

    // Fill and submit
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "john@test.com" } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: "555-123-4567" } });
    fireEvent.change(screen.getByLabelText(/service of interest/i), { target: { value: "CRM Solutions" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "Test message" } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    // Wait for success and click "send another"
    await waitFor(() => {
      expect(screen.getByText(/message sent!/i)).toBeDefined();
    });

    fireEvent.click(screen.getByText(/send another message/i));

    // Form should be visible again
    expect(screen.getByLabelText(/full name/i)).toBeDefined();
  });
});
