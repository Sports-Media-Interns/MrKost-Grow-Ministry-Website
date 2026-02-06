"use client"

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "28rem" }}>
            <p
              style={{
                fontSize: "3.75rem",
                fontWeight: 700,
                color: "#6B8E8A",
              }}
            >
              Oops
            </p>
            <h1 style={{ marginTop: "1rem", fontSize: "1.5rem", fontWeight: 600 }}>
              Something went wrong
            </h1>
            <p style={{ marginTop: "0.75rem", color: "#666" }}>
              A critical error occurred. Please try refreshing the page.
            </p>
            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <button
                onClick={reset}
                style={{
                  borderRadius: "0.5rem",
                  backgroundColor: "#161821",
                  padding: "0.625rem 1.25rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
