import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { useFocusTrap } from "@/hooks/use-focus-trap";

describe("useFocusTrap", () => {
  let container: HTMLDivElement;
  let button1: HTMLButtonElement;
  let button2: HTMLButtonElement;
  let button3: HTMLButtonElement;
  let onClose: () => void;

  beforeEach(() => {
    vi.useFakeTimers();

    // Create a DOM container with focusable elements
    container = document.createElement("div");
    button1 = document.createElement("button");
    button1.textContent = "First";
    button2 = document.createElement("button");
    button2.textContent = "Second";
    button3 = document.createElement("button");
    button3.textContent = "Third";

    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(button3);
    document.body.appendChild(container);

    onClose = vi.fn();
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("calls onClose on Escape key press", () => {
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, true, onClose));

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose on Escape when inactive", () => {
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, false, onClose));

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("traps Tab at last element by cycling to first", () => {
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, true, onClose));

    // Focus the last button
    button3.focus();
    expect(document.activeElement).toBe(button3);

    // Press Tab (not shift) — should wrap to first element
    const prevented = fireEvent.keyDown(document, {
      key: "Tab",
      shiftKey: false,
    });

    // fireEvent.keyDown returns false when preventDefault was called
    // (RTL inverts the boolean: false = preventDefault was called)
    expect(document.activeElement).toBe(button1);
  });

  it("traps Shift+Tab at first element by cycling to last", () => {
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, true, onClose));

    // Focus the first button
    button1.focus();
    expect(document.activeElement).toBe(button1);

    // Press Shift+Tab — should wrap to last element
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });

    expect(document.activeElement).toBe(button3);
  });

  it("does nothing when inactive (Tab not trapped)", () => {
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, false, onClose));

    button3.focus();

    // Tab should not be intercepted when inactive
    fireEvent.keyDown(document, { key: "Tab", shiftKey: false });

    // Active element should remain on button3 (no trap active)
    // Since the handler is not registered, focus is not changed
    expect(document.activeElement).toBe(button3);
  });

  it("auto-focuses first interactive element on activation", () => {
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, true, onClose));

    // Advance timers to trigger the setTimeout(0) auto-focus
    vi.advanceTimersByTime(1);

    expect(document.activeElement).toBe(button1);
  });

  it("does not auto-focus when inactive", () => {
    const ref = { current: container };

    // Focus something outside the container
    document.body.focus();

    renderHook(() => useFocusTrap(ref, false, onClose));

    vi.advanceTimersByTime(1);

    // Should not have focused anything inside the container
    expect(document.activeElement).not.toBe(button1);
  });

  it("does not trap regular Tab when not at boundary", () => {
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, true, onClose));

    // Focus the second button (middle — not at boundary)
    button2.focus();
    expect(document.activeElement).toBe(button2);

    // Tab should not be trapped because we're not at the last element
    fireEvent.keyDown(document, { key: "Tab", shiftKey: false });

    // Focus should remain on button2 (browser would move it, but in jsdom
    // without preventDefault, the keydown handler doesn't change focus)
    expect(document.activeElement).toBe(button2);
  });

  it("cleans up event listener on unmount", () => {
    const ref = { current: container };
    const removeSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => useFocusTrap(ref, true, onClose));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });
});
