import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useFormSubmit } from "@/hooks/use-form-submit";

function createMockEvent() {
  return { preventDefault: vi.fn() } as unknown as React.FormEvent;
}

describe("useFormSubmit", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        })
      )
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns correct initial state", () => {
    const { result } = renderHook(() =>
      useFormSubmit({
        endpoint: "/api/contact",
        buildPayload: () => ({ name: "Test" }),
      })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("");
    expect(result.current.submitted).toBe(false);
    expect(typeof result.current.handleSubmit).toBe("function");
    expect(typeof result.current.reset).toBe("function");
  });

  it("sets submitted=true and calls onSuccess on successful submission", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useFormSubmit({
        endpoint: "/api/contact",
        buildPayload: () => ({ name: "Test" }),
        onSuccess,
      })
    );

    const mockEvent = createMockEvent();

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(result.current.submitted).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("");
    expect(onSuccess).toHaveBeenCalledTimes(1);

    expect(fetch).toHaveBeenCalledWith("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test" }),
    });
  });

  it("sets error message when server responds with res.ok=false", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: "Invalid email address" }),
        })
      )
    );

    const { result } = renderHook(() =>
      useFormSubmit({
        endpoint: "/api/contact",
        buildPayload: () => ({ email: "bad" }),
      })
    );

    await act(async () => {
      await result.current.handleSubmit(createMockEvent());
    });

    expect(result.current.error).toBe("Invalid email address");
    expect(result.current.submitted).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it("uses fallback error message when server error has no message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({}),
        })
      )
    );

    const { result } = renderHook(() =>
      useFormSubmit({
        endpoint: "/api/contact",
        buildPayload: () => ({ name: "Test" }),
      })
    );

    await act(async () => {
      await result.current.handleSubmit(createMockEvent());
    });

    expect(result.current.error).toBe("Submission failed");
    expect(result.current.submitted).toBe(false);
  });

  it("sets error message on network error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("Network request failed")))
    );

    const { result } = renderHook(() =>
      useFormSubmit({
        endpoint: "/api/contact",
        buildPayload: () => ({ name: "Test" }),
      })
    );

    await act(async () => {
      await result.current.handleSubmit(createMockEvent());
    });

    expect(result.current.error).toBe("Network request failed");
    expect(result.current.submitted).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it("sets error message when buildPayload throws", async () => {
    const { result } = renderHook(() =>
      useFormSubmit({
        endpoint: "/api/contact",
        buildPayload: () => {
          throw new Error("reCAPTCHA failed to load");
        },
      })
    );

    await act(async () => {
      await result.current.handleSubmit(createMockEvent());
    });

    expect(result.current.error).toBe("reCAPTCHA failed to load");
    expect(result.current.submitted).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("sets fallback error when a non-Error is thrown", async () => {
    const { result } = renderHook(() =>
      useFormSubmit({
        endpoint: "/api/contact",
        buildPayload: () => {
          throw "string error";
        },
      })
    );

    await act(async () => {
      await result.current.handleSubmit(createMockEvent());
    });

    expect(result.current.error).toBe(
      "Something went wrong. Please try again."
    );
  });

  it("suppresses default error handling when onError returns true", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("Server unavailable")))
    );

    const onError = vi.fn(() => true);

    const { result } = renderHook(() =>
      useFormSubmit({
        endpoint: "/api/contact",
        buildPayload: () => ({ name: "Test" }),
        onError,
      })
    );

    await act(async () => {
      await result.current.handleSubmit(createMockEvent());
    });

    expect(onError).toHaveBeenCalledWith("Server unavailable");
    expect(result.current.error).toBe("");
    expect(result.current.submitted).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it("does not suppress error when onError returns false", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("Server unavailable")))
    );

    const onError = vi.fn(() => false);

    const { result } = renderHook(() =>
      useFormSubmit({
        endpoint: "/api/contact",
        buildPayload: () => ({ name: "Test" }),
        onError,
      })
    );

    await act(async () => {
      await result.current.handleSubmit(createMockEvent());
    });

    expect(onError).toHaveBeenCalledWith("Server unavailable");
    expect(result.current.error).toBe("Server unavailable");
  });

  it("reset() clears all state back to initial values", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("Something broke")))
    );

    const { result } = renderHook(() =>
      useFormSubmit({
        endpoint: "/api/contact",
        buildPayload: () => ({ name: "Test" }),
      })
    );

    // Trigger an error state
    await act(async () => {
      await result.current.handleSubmit(createMockEvent());
    });

    expect(result.current.error).toBe("Something broke");

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("");
    expect(result.current.submitted).toBe(false);
  });

  it("loading is true during submission", async () => {
    let resolveFetch: (value: unknown) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise((resolve) => {
            resolveFetch = resolve;
          })
      )
    );

    const { result } = renderHook(() =>
      useFormSubmit({
        endpoint: "/api/contact",
        buildPayload: () => ({ name: "Test" }),
      })
    );

    expect(result.current.loading).toBe(false);

    // Start submission without awaiting completion
    let submitPromise: Promise<void>;
    act(() => {
      submitPromise = result.current.handleSubmit(createMockEvent());
    });

    // Loading should be true while fetch is pending
    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    // Resolve the fetch
    await act(async () => {
      resolveFetch!({ ok: true, json: () => Promise.resolve({}) });
      await submitPromise!;
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.submitted).toBe(true);
  });

  it("sends correct JSON payload including recaptchaToken", async () => {
    const { result } = renderHook(() =>
      useFormSubmit({
        endpoint: "/api/lead",
        buildPayload: () => ({
          name: "John",
          email: "john@example.com",
          recaptchaToken: "token-abc",
        }),
      })
    );

    await act(async () => {
      await result.current.handleSubmit(createMockEvent());
    });

    expect(fetch).toHaveBeenCalledWith("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "John",
        email: "john@example.com",
        recaptchaToken: "token-abc",
      }),
    });
  });

  it("handles async buildPayload correctly", async () => {
    const { result } = renderHook(() =>
      useFormSubmit({
        endpoint: "/api/contact",
        buildPayload: async () => {
          return { name: "Async Test", recaptchaToken: "async-token" };
        },
      })
    );

    await act(async () => {
      await result.current.handleSubmit(createMockEvent());
    });

    expect(result.current.submitted).toBe(true);
    expect(fetch).toHaveBeenCalledWith("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Async Test",
        recaptchaToken: "async-token",
      }),
    });
  });
});
