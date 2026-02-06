import { useState, useCallback } from "react";

interface UseFormSubmitOptions<T> {
  /** API endpoint to POST to */
  endpoint: string;
  /** Build the request body from form fields (can be async for reCAPTCHA) */
  buildPayload: () => (T & { recaptchaToken?: string }) | Promise<T & { recaptchaToken?: string }>;
  /** Called on successful submission */
  onSuccess?: () => void;
  /** Called on error — return true to suppress default error handling */
  onError?: (error: string) => boolean | void;
}

interface UseFormSubmitReturn {
  loading: boolean;
  error: string;
  submitted: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: () => void;
}

/**
 * Shared hook for form submission with loading/error/success states.
 * Eliminates duplicated useState + fetch logic across forms.
 */
export function useFormSubmit<T>(
  options: UseFormSubmitOptions<T>
): UseFormSubmitReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        const payload = await options.buildPayload();

        const res = await fetch(options.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Submission failed");
        }

        setSubmitted(true);
        options.onSuccess?.();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong. Please try again.";
        const suppressed = options.onError?.(message);
        if (!suppressed) {
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError("");
    setSubmitted(false);
  }, []);

  return { loading, error, submitted, handleSubmit, reset };
}
