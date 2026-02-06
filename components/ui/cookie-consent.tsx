"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { usePathname } from "next/navigation"
import { Shield, ChevronDown, ChevronUp } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { loadRecaptchaScript, getRecaptchaToken } from "@/lib/recaptcha-client"
import { useFocusTrap } from "@/hooks/use-focus-trap"
import Image from "next/image"
import Link from "next/link"

interface CookiePreferences {
  essential: true
  analytics: boolean
  marketing: boolean
  functional: boolean
  timestamp: string
}

interface VisitorData {
  pagesVisited: string[]
  timeOnSite: number
  referrer: string
  deviceType: "mobile" | "desktop"
  browser: string
  screenResolution: string
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmTerm: string | null
  utmContent: string | null
  firstVisitTimestamp: string
  sessionCount: number
  currentPageUrl: string
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function detectDevice(): "mobile" | "desktop" {
  if (typeof navigator === "undefined") return "desktop"
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    ? "mobile"
    : "desktop"
}

function detectBrowser(): string {
  if (typeof navigator === "undefined") return "unknown"
  const ua = navigator.userAgent
  if (ua.includes("Firefox")) return "Firefox"
  if (ua.includes("Edg")) return "Edge"
  if (ua.includes("OPR") || ua.includes("Opera")) return "Opera"
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome"
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari"
  return "unknown"
}

function getUtmParams(): Record<string, string | null> {
  if (typeof window === "undefined") return {}
  const params = new URLSearchParams(window.location.search)
  return {
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmTerm: params.get("utm_term"),
    utmContent: params.get("utm_content"),
  }
}

function getScreenResolution(): string {
  if (typeof window === "undefined") return "unknown"
  return `${window.screen.width}x${window.screen.height}`
}

function buildVisitorData(): VisitorData {
  const stored = typeof localStorage !== "undefined"
    ? localStorage.getItem("gm_visitor_data")
    : null
  let existing: Partial<VisitorData> = {}
  if (stored) {
    try { existing = JSON.parse(stored) } catch { /* corrupted localStorage */ }
  }

  const utm = getUtmParams()

  return {
    pagesVisited: existing.pagesVisited ?? [window.location.pathname],
    timeOnSite: existing.timeOnSite ?? 0,
    referrer: existing.referrer ?? document.referrer,
    deviceType: existing.deviceType ?? detectDevice(),
    browser: existing.browser ?? detectBrowser(),
    screenResolution: existing.screenResolution ?? getScreenResolution(),
    utmSource: utm.utmSource ?? existing.utmSource ?? null,
    utmMedium: utm.utmMedium ?? existing.utmMedium ?? null,
    utmCampaign: utm.utmCampaign ?? existing.utmCampaign ?? null,
    utmTerm: utm.utmTerm ?? existing.utmTerm ?? null,
    utmContent: utm.utmContent ?? existing.utmContent ?? null,
    firstVisitTimestamp: existing.firstVisitTimestamp ?? new Date().toISOString(),
    sessionCount: (existing.sessionCount ?? 0) + (stored ? 0 : 1),
    currentPageUrl: window.location.href,
  }
}

async function sendCookieConsentLead(data: Record<string, unknown>, recaptchaToken: string): Promise<void> {
  try {
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "cookie_consent",
        name: "Anonymous Visitor",
        email: "visitor@growministry.com",
        source: "cookie-consent",
        recaptchaToken,
        ...data,
      }),
    })
  } catch (err) {
    console.error("[GrowMinistry] Cookie consent lead error:", err)
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [functional, setFunctional] = useState(true)

  const visitorRef = useRef<VisitorData | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pathname = usePathname()

  /* ---- initialize visitor tracking + load reCAPTCHA ---- */
  useEffect(() => {
    loadRecaptchaScript()

    // If consent already given, do not show banner
    const consent = localStorage.getItem("gm_cookie_consent")
    if (consent) {
      // Still track pages if consent was given
      visitorRef.current = buildVisitorData()
      startTracking()
      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }

    // Small delay so the banner slides in after paint
    const t = setTimeout(() => setVisible(true), 300)
    visitorRef.current = buildVisitorData()
    startTracking()

    return () => {
      clearTimeout(t)
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ---- page-view tracking (reacts to Next.js route changes) ---- */
  useEffect(() => {
    if (!visitorRef.current || !pathname) return

    if (!visitorRef.current.pagesVisited.includes(pathname)) {
      visitorRef.current.pagesVisited.push(pathname)
    }
    visitorRef.current.currentPageUrl = window.location.href
    persistVisitorData()
     
  }, [pathname])

  function startTracking() {
    if (timerRef.current) return
    timerRef.current = setInterval(() => {
      if (visitorRef.current) {
        visitorRef.current.timeOnSite += 1
        persistVisitorData()
      }
    }, 1000)
  }

  function persistVisitorData() {
    if (visitorRef.current) {
      localStorage.setItem("gm_visitor_data", JSON.stringify(visitorRef.current))
    }
  }

  /* ---- acceptance handlers ---- */
  const accept = useCallback(
    async (prefs: Omit<CookiePreferences, "essential" | "timestamp">) => {
      const preferences: CookiePreferences = {
        essential: true,
        analytics: prefs.analytics,
        marketing: prefs.marketing,
        functional: prefs.functional,
        timestamp: new Date().toISOString(),
      }

      localStorage.setItem("gm_cookie_consent", JSON.stringify(preferences))
      persistVisitorData()

      // Dispatch event for other components (e.g., GoogleAnalytics)
      window.dispatchEvent(new CustomEvent("cookieConsentChange"))

      // Get reCAPTCHA token and send consent data through server API
      const recaptchaToken = await getRecaptchaToken("lead_capture")
      sendCookieConsentLead({
        preferences,
        visitor: visitorRef.current,
      }, recaptchaToken)

      setVisible(false)
    },
    [],
  )

  const handleAcceptAll = useCallback(() => {
    accept({ analytics: true, marketing: true, functional: true })
  }, [accept])

  const handleEssentialOnly = useCallback(() => {
    accept({ analytics: false, marketing: false, functional: false })
  }, [accept])

  const handleSaveCustom = useCallback(() => {
    accept({ analytics, marketing, functional })
  }, [accept, analytics, marketing, functional])

  /* ---- keyboard: Escape to accept essential only + focus trap ---- */
  const bannerRef = useRef<HTMLDivElement>(null)
  useFocusTrap(bannerRef, visible, handleEssentialOnly)

  /* ---- render ---- */
  if (!visible) return null

  return (
    <div
      ref={bannerRef}
      className="fixed inset-x-0 bottom-0 z-40 animate-[slideUp_0.4s_ease-out] will-change-transform"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      <div className="bg-primary/95 backdrop-blur-sm border-t border-border/20 text-primary-foreground">
        {/* ---- main row ---- */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* left: icon + text */}
            <div className="flex items-start gap-3 sm:items-center">
              <Image src="/images/logo.webp" alt="Grow Ministry" width={24} height={24} className="mt-0.5 shrink-0 rounded-full sm:mt-0" />
              <p id="cookie-consent-title" className="text-sm leading-relaxed text-primary-foreground/90">
                We use cookies to enhance your experience and analyze site
                traffic.{" "}
                <Link
                  href="/cookie-policy"
                  className="underline underline-offset-2 hover:text-accent transition-colors"
                >
                  Cookie Policy
                </Link>
              </p>
            </div>

            {/* right: buttons */}
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                onClick={() => setShowCustomize((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary-foreground/20 px-4 py-2 text-sm font-medium text-primary-foreground/80 transition hover:bg-primary-foreground/10"
              >
                {showCustomize ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
                Customize
              </button>

              <button
                onClick={handleEssentialOnly}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary-foreground/20 px-4 py-2 text-sm font-medium text-primary-foreground/80 transition hover:bg-primary-foreground/10"
              >
                Essential Only
              </button>

              <button
                onClick={handleAcceptAll}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent/80"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>

        {/* ---- customize panel ---- */}
        {showCustomize && (
          <div className="border-t border-primary-foreground/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Essential */}
                <div className="flex items-center justify-between gap-3 rounded-lg bg-primary-foreground/5 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Shield className="size-4 text-accent" />
                    <div>
                      <p className="text-sm font-medium">Essential</p>
                      <p className="text-xs text-primary-foreground/50">
                        Always active
                      </p>
                    </div>
                  </div>
                  <Switch checked disabled className="opacity-60" />
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between gap-3 rounded-lg bg-primary-foreground/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Analytics</p>
                    <p className="text-xs text-primary-foreground/50">
                      Site usage data
                    </p>
                  </div>
                  <Switch
                    checked={analytics}
                    onCheckedChange={setAnalytics}
                  />
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between gap-3 rounded-lg bg-primary-foreground/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Marketing</p>
                    <p className="text-xs text-primary-foreground/50">
                      Personalized ads
                    </p>
                  </div>
                  <Switch
                    checked={marketing}
                    onCheckedChange={setMarketing}
                  />
                </div>

                {/* Functional */}
                <div className="flex items-center justify-between gap-3 rounded-lg bg-primary-foreground/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Functional</p>
                    <p className="text-xs text-primary-foreground/50">
                      Enhanced features
                    </p>
                  </div>
                  <Switch
                    checked={functional}
                    onCheckedChange={setFunctional}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSaveCustom}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent/80"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
