import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { ServiceModal } from "@/components/ui/service-modal";

// Mock recaptcha-client
vi.mock("@/lib/recaptcha-client", () => ({
  loadRecaptchaScript: vi.fn(),
  getRecaptchaToken: vi.fn().mockResolvedValue("test-token"),
  RECAPTCHA_SITE_KEY: "test-key",
}));

// Mock useFocusTrap
vi.mock("@/hooks/use-focus-trap", () => ({
  useFocusTrap: vi.fn(),
}));

// Mock fetch
const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ success: true }),
});
global.fetch = mockFetch;

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  serviceName: "CRM Solutions",
  downloadUrl: "/downloads/crm-whitepaper.pdf",
};

describe("ServiceModal", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    defaultProps.onClose.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders nothing when not open", () => {
    const { container } = render(
      <ServiceModal {...defaultProps} isOpen={false} />
    );

    expect(container.innerHTML).toBe("");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders modal when open", () => {
    render(<ServiceModal {...defaultProps} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByText(/get the crm solutions white paper/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /enter your details below to receive instant access/i
      )
    ).toBeInTheDocument();
  });

  it("shows form fields with labels", () => {
    render(<ServiceModal {...defaultProps} />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /get access/i })
    ).toBeInTheDocument();
  });

  it("allows typing in form fields", () => {
    render(<ServiceModal {...defaultProps} />);

    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(
      /email address/i
    ) as HTMLInputElement;
    const phoneInput = screen.getByLabelText(
      /phone number/i
    ) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });
    fireEvent.change(emailInput, { target: { value: "jane@church.org" } });
    fireEvent.change(phoneInput, { target: { value: "(555) 123-4567" } });

    expect(nameInput.value).toBe("Jane Doe");
    expect(emailInput.value).toBe("jane@church.org");
    expect(phoneInput.value).toBe("(555) 123-4567");
  });

  it("calls onClose on backdrop click", () => {
    render(<ServiceModal {...defaultProps} />);

    // The backdrop is the first child div with bg-black/60
    const backdrop = screen
      .getByRole("dialog")
      .querySelector(".bg-black\\/60, [class*='bg-black']");

    // Fallback: click the backdrop element (first absolute div inside dialog)
    const dialog = screen.getByRole("dialog");
    const backdropEl = dialog.children[0] as HTMLElement;
    fireEvent.click(backdropEl);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close button is clicked", () => {
    render(<ServiceModal {...defaultProps} />);

    const closeBtn = screen.getByLabelText(/close/i);
    fireEvent.click(closeBtn);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("shows thank you state after successful submit", async () => {
    render(<ServiceModal {...defaultProps} />);

    // Fill form
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "jane@church.org" },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: "(555) 123-4567" },
    });

    // Submit
    const submitBtn = screen.getByRole("button", { name: /get access/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    // Wait for thank you state
    await waitFor(() => {
      expect(screen.getByText(/thank you, jane/i)).toBeInTheDocument();
    });

    expect(
      screen.getByText(/your crm solutions white paper is ready/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /download white paper/i })
    ).toBeInTheDocument();
  });

  it("download link has correct URL after submit", async () => {
    render(<ServiceModal {...defaultProps} />);

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "John Smith" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: "1234567890" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /get access/i }));
    });

    await waitFor(() => {
      const downloadLink = screen.getByRole("link", {
        name: /download white paper/i,
      });
      expect(downloadLink.getAttribute("href")).toBe(
        "/downloads/crm-whitepaper.pdf"
      );
    });
  });

  it("sends correct data to API on submit", async () => {
    render(<ServiceModal {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "jane@church.org" },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: "(555) 123-4567" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /get access/i }));
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "white_paper_download",
          name: "Jane Doe",
          email: "jane@church.org",
          phone: "(555) 123-4567",
          source: "service-modal",
          serviceName: "CRM Solutions",
          offer: "CRM Solutions White Paper",
          recaptchaToken: "test-token",
        }),
      });
    });
  });

  it("has aria-modal and aria-labelledby attributes", () => {
    render(<ServiceModal {...defaultProps} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("aria-labelledby")).toBe(
      "service-modal-title"
    );
  });
});
