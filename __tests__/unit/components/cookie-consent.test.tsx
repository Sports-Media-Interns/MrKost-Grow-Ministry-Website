import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { CookieConsent } from "@/components/ui/cookie-consent";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

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
const mockFetch = vi.fn().mockResolvedValue({ ok: true });
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("CookieConsent", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockFetch.mockClear();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders banner after delay", async () => {
    render(<CookieConsent />);

    // Should not be visible immediately
    expect(screen.queryByRole("dialog")).toBeNull();

    // Advance past the 300ms delay
    await act(async () => {
      vi.advanceTimersByTime(350);
    });

    // Banner should now be visible
    expect(screen.getByRole("dialog")).toBeDefined();
    expect(
      screen.getByText(/we use cookies to enhance your experience/i)
    ).toBeDefined();
  });

  it("does not render banner if consent already given", async () => {
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === "gm_cookie_consent") return JSON.stringify({ essential: true });
      return null;
    });

    render(<CookieConsent />);

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("accept all sets localStorage with all true", async () => {
    render(<CookieConsent />);

    await act(async () => {
      vi.advanceTimersByTime(350);
    });

    const acceptAllBtn = screen.getByRole("button", { name: /accept all/i });

    await act(async () => {
      fireEvent.click(acceptAllBtn);
    });

    // Check localStorage was called with correct preferences
    const setItemCall = localStorageMock.setItem.mock.calls.find(
      (call: string[]) => call[0] === "gm_cookie_consent"
    );
    expect(setItemCall).toBeDefined();

    const savedPrefs = JSON.parse(setItemCall![1]);
    expect(savedPrefs.essential).toBe(true);
    expect(savedPrefs.analytics).toBe(true);
    expect(savedPrefs.marketing).toBe(true);
    expect(savedPrefs.functional).toBe(true);
    expect(savedPrefs.timestamp).toBeDefined();
  });

  it("essential only sets localStorage with all false except essential", async () => {
    render(<CookieConsent />);

    await act(async () => {
      vi.advanceTimersByTime(350);
    });

    const essentialBtn = screen.getByRole("button", { name: /essential only/i });

    await act(async () => {
      fireEvent.click(essentialBtn);
    });

    const setItemCall = localStorageMock.setItem.mock.calls.find(
      (call: string[]) => call[0] === "gm_cookie_consent"
    );
    expect(setItemCall).toBeDefined();

    const savedPrefs = JSON.parse(setItemCall![1]);
    expect(savedPrefs.essential).toBe(true);
    expect(savedPrefs.analytics).toBe(false);
    expect(savedPrefs.marketing).toBe(false);
    expect(savedPrefs.functional).toBe(false);
  });

  it("hides banner after accept all is clicked", async () => {
    render(<CookieConsent />);

    await act(async () => {
      vi.advanceTimersByTime(350);
    });

    expect(screen.getByRole("dialog")).toBeDefined();

    const acceptAllBtn = screen.getByRole("button", { name: /accept all/i });

    await act(async () => {
      fireEvent.click(acceptAllBtn);
    });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("customize panel toggles open and closed", async () => {
    render(<CookieConsent />);

    await act(async () => {
      vi.advanceTimersByTime(350);
    });

    // Customize panel should not be visible initially
    expect(screen.queryByText("Analytics")).toBeNull();

    // Click Customize to open panel
    const customizeBtn = screen.getByRole("button", { name: /customize/i });
    fireEvent.click(customizeBtn);

    // Panel should be visible with cookie categories
    expect(screen.getByText("Essential")).toBeDefined();
    expect(screen.getByText("Analytics")).toBeDefined();
    expect(screen.getByText("Marketing")).toBeDefined();
    expect(screen.getByText("Functional")).toBeDefined();
    expect(
      screen.getByRole("button", { name: /save preferences/i })
    ).toBeDefined();

    // Click Customize again to close panel
    fireEvent.click(customizeBtn);

    expect(screen.queryByText("Analytics")).toBeNull();
  });

  it("dispatches cookieConsentChange event on accept", async () => {
    const eventSpy = vi.fn();
    window.addEventListener("cookieConsentChange", eventSpy);

    render(<CookieConsent />);

    await act(async () => {
      vi.advanceTimersByTime(350);
    });

    const acceptAllBtn = screen.getByRole("button", { name: /accept all/i });

    await act(async () => {
      fireEvent.click(acceptAllBtn);
    });

    expect(eventSpy).toHaveBeenCalledTimes(1);

    window.removeEventListener("cookieConsentChange", eventSpy);
  });

  it("renders cookie policy link", async () => {
    render(<CookieConsent />);

    await act(async () => {
      vi.advanceTimersByTime(350);
    });

    const policyLink = screen.getByRole("link", { name: /cookie policy/i });
    expect(policyLink).toBeDefined();
    expect(policyLink.getAttribute("href")).toBe("/cookie-policy");
  });

  it("save preferences uses custom toggle values", async () => {
    render(<CookieConsent />);

    await act(async () => {
      vi.advanceTimersByTime(350);
    });

    // Open customize panel
    const customizeBtn = screen.getByRole("button", { name: /customize/i });
    fireEvent.click(customizeBtn);

    // Click Save Preferences (default: analytics=off, marketing=off, functional=on)
    const saveBtn = screen.getByRole("button", { name: /save preferences/i });

    await act(async () => {
      fireEvent.click(saveBtn);
    });

    const setItemCall = localStorageMock.setItem.mock.calls.find(
      (call: string[]) => call[0] === "gm_cookie_consent"
    );
    expect(setItemCall).toBeDefined();

    const savedPrefs = JSON.parse(setItemCall![1]);
    expect(savedPrefs.essential).toBe(true);
    expect(savedPrefs.analytics).toBe(false);
    expect(savedPrefs.marketing).toBe(false);
    expect(savedPrefs.functional).toBe(true);
  });
});
