import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ExitIntent } from "@/components/ui/exit-intent";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "sessionStorage", { value: sessionStorageMock });

describe("ExitIntent", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockFetch.mockClear();
    localStorageMock.getItem.mockReturnValue(null);
    sessionStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("does not show popup initially", () => {
    render(<ExitIntent />);

    // Popup should not be visible right away
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows popup after mouse leaves viewport (after delay)", async () => {
    render(<ExitIntent />);

    // Advance timers past the 10s ready delay
    await act(async () => {
      vi.advanceTimersByTime(10500);
    });

    // Simulate mouse leaving the viewport (top)
    await act(async () => {
      fireEvent.mouseLeave(document.documentElement, { clientY: -1 });
    });

    // Popup should now be visible
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes popup when X button is clicked", async () => {
    render(<ExitIntent />);

    // Trigger the popup
    await act(async () => {
      vi.advanceTimersByTime(10500);
    });
    await act(async () => {
      fireEvent.mouseLeave(document.documentElement, { clientY: -1 });
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Click close button
    const closeButton = screen.getByLabelText(/close popup/i);
    fireEvent.click(closeButton);

    // Popup should be closed
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes popup when Escape key is pressed", async () => {
    render(<ExitIntent />);

    // Trigger the popup
    await act(async () => {
      vi.advanceTimersByTime(10500);
    });
    await act(async () => {
      fireEvent.mouseLeave(document.documentElement, { clientY: -1 });
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Press Escape
    await act(async () => {
      fireEvent.keyDown(document, { key: "Escape" });
    });

    // Popup should be closed
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes popup when backdrop is clicked", async () => {
    render(<ExitIntent />);

    // Trigger the popup
    await act(async () => {
      vi.advanceTimersByTime(10500);
    });
    await act(async () => {
      fireEvent.mouseLeave(document.documentElement, { clientY: -1 });
    });

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    // Click the backdrop (the dialog element itself)
    fireEvent.click(dialog);

    // Popup should be closed
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders form fields in popup", async () => {
    render(<ExitIntent />);

    // Trigger the popup
    await act(async () => {
      vi.advanceTimersByTime(10500);
    });
    await act(async () => {
      fireEvent.mouseLeave(document.documentElement, { clientY: -1 });
    });

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /get my free report/i })).toBeInTheDocument();
  });

  it("allows typing in form fields", async () => {
    render(<ExitIntent />);

    // Trigger the popup
    await act(async () => {
      vi.advanceTimersByTime(10500);
    });
    await act(async () => {
      fireEvent.mouseLeave(document.documentElement, { clientY: -1 });
    });

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });
    fireEvent.change(emailInput, { target: { value: "jane@test.com" } });

    expect(nameInput.value).toBe("Jane Doe");
    expect(emailInput.value).toBe("jane@test.com");
  });

  it("has submit button in form", async () => {
    render(<ExitIntent />);

    // Trigger the popup
    await act(async () => {
      vi.advanceTimersByTime(10500);
    });
    await act(async () => {
      fireEvent.mouseLeave(document.documentElement, { clientY: -1 });
    });

    // Submit button should be present
    const submitButton = screen.getByRole("button", { name: /get my free report/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton.getAttribute("type")).toBe("submit");
  });

  it("does not show popup if already shown in session", async () => {
    sessionStorageMock.getItem.mockReturnValue("true");

    render(<ExitIntent />);

    // Trigger the popup
    await act(async () => {
      vi.advanceTimersByTime(10500);
    });
    await act(async () => {
      fireEvent.mouseLeave(document.documentElement, { clientY: -1 });
    });

    // Popup should not appear
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
