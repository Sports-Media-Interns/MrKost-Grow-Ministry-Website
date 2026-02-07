"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "";

interface CookiePreferences {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp: string;
}

/**
 * Google Analytics component that respects cookie consent.
 * Only loads GA4 when user has explicitly opted in to analytics cookies.
 */
export function GoogleAnalytics({ nonce }: { nonce?: string }) {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    // Check initial consent
    const checkConsent = () => {
      try {
        const consent = localStorage.getItem("gm_cookie_consent");
        if (consent) {
          const prefs: CookiePreferences = JSON.parse(consent);
          setAnalyticsEnabled(prefs.analytics === true);
        }
      } catch {
        // Invalid consent data - don't enable analytics
        setAnalyticsEnabled(false);
      }
    };

    // Check immediately
    checkConsent();

    // Listen for storage changes (consent updates in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gm_cookie_consent") {
        checkConsent();
      }
    };

    // Also listen for custom event from cookie consent component
    const handleConsentChange = () => {
      checkConsent();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cookieConsentChange", handleConsentChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cookieConsentChange", handleConsentChange);
    };
  }, []);

  // Don't render anything if GA4 ID is not configured or analytics not enabled
  if (!GA4_ID || !analyticsEnabled) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
        nonce={nonce}
      />
      <Script id="google-analytics" strategy="afterInteractive" nonce={nonce}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_ID}', {
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
