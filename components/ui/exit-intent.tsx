"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { X, Download } from "lucide-react"
import Image from "next/image"

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""

/* ------------------------------------------------------------------ */
/*  Focus trap selector                                                */
/* ------------------------------------------------------------------ */

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Get a reCAPTCHA token if the script is available, otherwise return empty string. */
async function getRecaptchaToken(action: string): Promise<string> {
  try {
    if (typeof window !== "undefined" && window.grecaptcha) {
      return await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action })
    }
  } catch {
    console.warn("[GrowMinistry] reCAPTCHA execution failed for exit-intent")
  }
  return ""
}

/** Ensure the reCAPTCHA script is loaded (no-op if already present). */
function loadRecaptchaScript(): void {
  if (typeof document === "undefined" || !RECAPTCHA_SITE_KEY) return
  if (document.querySelector(`script[src*="recaptcha/api.js"]`)) return
  const script = document.createElement("script")
  script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
  script.async = true
  document.head.appendChild(script)
}

/* ------------------------------------------------------------------ */
/*  Submit via server-side API (creates GHL contact with tag)          */
/* ------------------------------------------------------------------ */

async function submitLead(data: Record<string, unknown>): Promise<void> {
  try {
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  } catch (err) {
    console.error("[GrowMinistry] Exit-intent submission error:", err)
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function ExitIntent() {
  const [isOpen, setIsOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const readyRef = useRef(false)
  const shownThisSession = useRef(false)
  const loadTimestamp = useRef(0)
  const modalRef = useRef<HTMLDivElement>(null)

  /* ---- gate checks ---- */
  const canShow = useCallback((): boolean => {
    if (shownThisSession.current) return false
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("gm_exit_shown")) return false
    if (Date.now() - loadTimestamp.current < 10_000) return false
    return true
  }, [])

  const showPopup = useCallback(() => {
    if (!canShow()) return
    shownThisSession.current = true
    setIsOpen(true)
  }, [canShow])

  /* ---- mount: load reCAPTCHA + attach exit-intent listeners ---- */
  useEffect(() => {
    loadRecaptchaScript()
    loadTimestamp.current = Date.now()

    // Mark ready after 10 s delay
    const readyTimer = setTimeout(() => {
      readyRef.current = true
    }, 10_000)

    /* Desktop: mouse leaves viewport top */
    const handleMouseLeave = (e: MouseEvent) => {
      if (!readyRef.current) return
      if (e.clientY <= 0) {
        showPopup()
      }
    }

    /* Mobile: visibility change (tab switch / app switch) */
    const handleVisibility = () => {
      if (!readyRef.current) return
      if (document.visibilityState === "hidden") {
        // Will show when they come back
        showPopup()
      }
    }

    /* Mobile: scroll-up near the top of the page */
    let lastScrollY = window.scrollY
    const handleScroll = () => {
      if (!readyRef.current) return
      const currentY = window.scrollY
      const scrollingUp = currentY < lastScrollY
      const nearTop = currentY < 100
      lastScrollY = currentY

      if (scrollingUp && nearTop) {
        showPopup()
      }
    }

    document.documentElement.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("visibilitychange", handleVisibility)
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      clearTimeout(readyTimer)
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [showPopup])

  /* ---- form submit ---- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setIsSubmitting(true)

    const recaptchaToken = await getRecaptchaToken("lead_capture")

    await submitLead({
      type: "exit_intent_lead",
      name: name.trim(),
      email: email.trim(),
      source: "exit-intent",
      offer: "Ministry Technology Master Report",
      recaptchaToken,
    })

    setSubmitted(true)
    setIsSubmitting(false)
    sessionStorage.setItem("gm_exit_shown", "true")
  }

  /* ---- close (without marking sessionStorage — can re-trigger) ---- */
  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  /* ---- keyboard: Escape to close + focus trap ---- */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
        return
      }
      // Focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [handleClose]
  )

  /* ---- attach keyboard listener when modal is open ---- */
  useEffect(() => {
    if (!isOpen) return
    document.addEventListener("keydown", handleKeyDown)
    // Focus first input on open
    const timer = setTimeout(() => {
      modalRef.current?.querySelector<HTMLElement>("input, button")?.focus()
    }, 0)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      clearTimeout(timer)
    }
  }, [isOpen, handleKeyDown])

  /* ---- backdrop click ---- */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  /* ---- render ---- */
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-[fadeIn_0.3s_ease-out] will-change-[opacity]"
      role="dialog"
      aria-modal="true"
      aria-label="Exit intent offer"
      onClick={handleBackdropClick}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>

      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* card */}
      <div ref={modalRef} className="relative w-full max-w-md rounded-2xl bg-background shadow-2xl animate-[scaleIn_0.35s_ease-out]">
        {/* close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 flex items-center justify-center size-8 rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Close popup"
        >
          <X className="size-5" />
        </button>

        {submitted ? (
          /* ---- thank-you state ---- */
          <div className="flex flex-col items-center gap-5 px-8 py-10 text-center">
            <Image src="/images/logo.webp" alt="Grow Ministry" width={56} height={56} className="rounded-full" />

            <div>
              <h3 className="text-xl font-semibold font-[family-name:var(--font-playfair)] text-foreground">
                Thank You!
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Your Ministry Technology Master Report is ready. Click below to
                download your copy.
              </p>
            </div>

            <a
              href="/downloads/GM_Master_Report_Ministry_Technology.pdf"
              download
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <Download className="size-4" />
              Download Report
            </a>

            <button
              onClick={handleClose}
              className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          /* ---- form state ---- */
          <div className="px-8 py-10">
            {/* logo */}
            <Image src="/images/logo.webp" alt="Grow Ministry" width={56} height={56} className="mx-auto mb-5 rounded-full" />

            {/* headline */}
            <h2 className="text-center text-2xl font-bold font-[family-name:var(--font-playfair)] text-foreground">
              Wait &mdash; Before You Go!
            </h2>

            {/* subtext */}
            <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
              Download our free Ministry Technology Master Report &mdash; a
              comprehensive guide to digital tools for faith-based
              organizations.
            </p>

            {/* form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="exit-name"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Name
                </label>
                <input
                  id="exit-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label
                  htmlFor="exit-email"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="exit-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@church.org"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Get My Free Report"}
              </button>
            </form>

            {/* privacy note */}
            <p className="mt-5 text-center text-xs text-muted-foreground">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
