import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold text-accent font-[family-name:var(--font-playfair)]">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold font-[family-name:var(--font-playfair)]">
          Page Not Found
        </h1>
        <p className="mt-3 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
          >
            Go Home
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted transition"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  )
}
