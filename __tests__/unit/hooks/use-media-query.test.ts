import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMediaQuery } from "@/hooks/use-media-query";

describe("useMediaQuery", () => {
  let listeners: Map<string, (e: MediaQueryListEvent) => void>;

  beforeEach(() => {
    listeners = new Map();
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: (event: string, handler: (e: MediaQueryListEvent) => void) => {
        if (event === "change") listeners.set(query, handler);
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

    const listener = listeners.get("(min-width: 768px)");
    if (listener) {
      act(() => {
        listener({ matches: true } as MediaQueryListEvent);
      });
    }
    expect(result.current).toBe(true);
  });
});
