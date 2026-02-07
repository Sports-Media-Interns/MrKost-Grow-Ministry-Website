"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[GrowMinistry] Page error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-accent font-[family-name:var(--font-playfair)]">
          Oops
        </p>
        <h1 className="mt-4 text-2xl font-semibold font-[family-name:var(--font-playfair)]">
          Something went wrong
        </h1>
        <p className="mt-3 text-muted-foreground">
          We encountered an unexpected error. Please try again or return to the
          home page.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
