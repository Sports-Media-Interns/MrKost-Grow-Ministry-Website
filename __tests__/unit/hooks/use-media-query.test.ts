import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMediaQuery } from "@/hooks/use-media-query";

describe("useMediaQuery", () => {
  let listeners: Map<string, () => void>;
  let matchesState: Map<string, boolean>;

  beforeEach(() => {
    listeners = new Map();
    matchesState = new Map();
    vi.stubGlobal("matchMedia", (query: string) => ({
      get matches() { return matchesState.get(query) ?? false; },
      media: query,
      onchange: null,
      addEventListener: (_event: string, handler: () => void) => {
        listeners.set(query, handler);
      },
      removeEventListener: () => {
        listeners.delete(query);
      },
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }));
  });

  it("returns false initially for non-matching query", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(false);
  });

  it("updates when media query changes", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(false);

    // Simulate the media query matching
    matchesState.set("(min-width: 768px)", true);
    const listener = listeners.get("(min-width: 768px)");
    if (listener) {
      act(() => {
        listener();
      });
    }
    expect(result.current).toBe(true);
  });
});
