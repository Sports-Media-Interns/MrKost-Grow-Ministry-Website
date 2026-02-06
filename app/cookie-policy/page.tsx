import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Cookie Policy | Grow Ministry",
  description:
    "Grow Ministry's cookie policy explains how we use cookies and similar technologies on our website to improve your experience.",
  openGraph: {
    title: "Cookie Policy | Grow Ministry",
    description:
      "How Grow Ministry uses cookies and tracking technologies on our website.",
    url: "https://growministry.com/cookie-policy",
  },
  twitter: {
    card: "summary",
    title: "Cookie Policy | Grow Ministry",
    description: "How Grow Ministry uses cookies on our website.",
  },
};

const cookieTableData = [
  {
    name: "_ghl_session",
    provider: "GoHighLevel",
    type: "Necessary",
    purpose: "Maintains session state for CRM-integrated forms and chat widgets",
    duration: "Session",
  },
  {
    name: "_ghl_uid",
    provider: "GoHighLevel",
    type: "Functional",
    purpose: "Identifies returning visitors for personalized CRM interactions",
    duration: "1 year",
  },
  {
    name: "_ga",
    provider: "Google Analytics",
    type: "Analytics",
    purpose: "Distinguishes unique visitors and calculates visitor, session, and campaign data",
    duration: "2 years",
  },
  {
    name: "_ga_*",
    provider: "Google Analytics",
    type: "Analytics",
    purpose: "Stores and counts page views for Google Analytics 4 property tracking",
    duration: "2 years",
  },
  {
    name: "_gid",
    provider: "Google Analytics",
    type: "Analytics",
    purpose: "Distinguishes users for analytics reporting within a 24-hour window",
    duration: "24 hours",
  },
  {
    name: "_gat",
    provider: "Google Analytics",
    type: "Analytics",
    purpose: "Throttles request rate to limit data collection on high-traffic sites",
    duration: "1 minute",
  },
  {
    name: "_fbp",
    provider: "Meta (Facebook)",
    type: "Marketing",
    purpose: "Tracks visits across websites for ad delivery and retargeting",
    duration: "3 months",
  },
  {
    name: "_gcl_au",
    provider: "Google Ads",
    type: "Marketing",
    purpose: "Stores conversion data for Google Ads click attribution",
    duration: "3 months",
  },
  {
    name: "cookie_consent",
    provider: "Grow Ministry",
    type: "Necessary",
    purpose: "Stores your cookie consent preferences so they are remembered across visits",
    duration: "1 year",
  },
  {
    name: "__next_hmr",
    provider: "Grow Ministry",
    type: "Necessary",
    purpose: "Enables core website functionality and page navigation",
    duration: "Session",
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col pt-16">
      <BreadcrumbSchema items={[{ name: "Cookie Policy", url: "https://growministry.com/cookie-policy" }]} />
      {/* Hero */}
      <section className="relative text-primary-foreground py-16 px-4 overflow-hidden">
        <Image
          src="/images/services/crm.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="relative mx-auto max-w-screen-xl text-center">
          <p className="text-sm uppercase tracking-widest text-primary-foreground/50 mb-4">
            Legal
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight font-[family-name:var(--font-playfair)]">
            Cookie Policy
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            How Grow Ministry uses cookies and similar technologies to deliver,
            improve, and protect our services.
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-muted-foreground mb-12">
            Effective Date: February 2026
          </p>

          {/* ------------------------------------------------------------------ */}
          {/* 1. Introduction */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Grow Ministry (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;),
              a Dakdan Worldwide
              Company, uses cookies and similar tracking technologies on
              growministry.com (the &quot;Site&quot;). This Cookie Policy
              explains what cookies are, how and why we use them, and how you can
              manage your preferences.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This policy is designed to comply with the European Union General
              Data Protection Regulation (GDPR), the California Consumer Privacy
              Act and California Privacy Rights Act (CCPA/CPRA), Brazil&apos;s
              Lei Geral de Prote&ccedil;&atilde;o de Dados (LGPD), Canada&apos;s
              Personal Information Protection and Electronic Documents Act
              (PIPEDA), and the EU ePrivacy Directive.
            </p>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 2. What Are Cookies */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              What Are Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cookies are small text files placed on your device (computer,
              tablet, or mobile phone) when you visit a website. They are widely
              used to make websites work more efficiently, to provide reporting
              information, and to assist with personalization.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cookies set by the website operator are called
              &quot;first-party cookies.&quot; Cookies set by parties other than
              the website operator are called &quot;third-party cookies.&quot;
              Third-party cookies enable features or functionality provided by
              external services such as analytics, advertising, and CRM
              integrations.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              In addition to cookies, we may use similar technologies such as
              pixel tags, web beacons, and local storage objects. References to
              &quot;cookies&quot; in this policy include these similar
              technologies unless stated otherwise.
            </p>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 3. Types of Cookies We Use */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Types of Cookies We Use
            </h2>

            <div className="space-y-6">
              <div className="border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Strictly Necessary Cookies
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  These cookies are essential for the Site to function properly.
                  They enable core features such as page navigation, secure
                  areas, and remembering your cookie consent preferences. The
                  Site cannot function correctly without these cookies, and they
                  cannot be disabled.
                </p>
              </div>

              <div className="border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Analytics cookies help us understand how visitors interact with
                  the Site by collecting and reporting information anonymously.
                  This data allows us to improve page performance, identify
                  popular content, and understand user behavior. We may use
                  Google Analytics and similar services for this purpose.
                </p>
              </div>

              <div className="border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Marketing and Advertising Cookies
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  These cookies may be set through our Site by advertising
                  partners. They are used to build a profile of your interests
                  and show you relevant advertisements on other sites. They work
                  by uniquely identifying your browser and device. If you do not
                  allow these cookies, you will experience less targeted
                  advertising.
                </p>
              </div>

              <div className="border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Functional Cookies
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Functional cookies enable enhanced functionality and
                  personalization, such as remembering your preferences,
                  recognizing you as a returning visitor, and pre-filling form
                  data through our GoHighLevel CRM integration. If you disable
                  these cookies, some or all of these features may not work
                  properly.
                </p>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 4. Specific Cookies We Use */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Specific Cookies We Use
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The table below lists the specific cookies set by our Site and
              third-party services integrated into our Site. This list is
              reviewed periodically and may be updated as our technology stack
              evolves.
            </p>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Cookie Name
                    </th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Provider
                    </th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Type
                    </th>
                    <th className="px-4 py-3 font-semibold">Purpose</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cookieTableData.map((cookie) => (
                    <tr key={cookie.name} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                        {cookie.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {cookie.provider}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            cookie.type === "Necessary"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : cookie.type === "Analytics"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                : cookie.type === "Marketing"
                                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                  : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                          }`}
                        >
                          {cookie.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {cookie.purpose}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {cookie.duration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 5. How We Use Cookies */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              How We Use Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use cookies and similar technologies for the following purposes:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Site operation and security:</strong>{" "}
                  Ensuring the Site functions correctly, maintaining session
                  integrity, and protecting against fraudulent or unauthorized
                  access.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Analytics and performance:</strong>{" "}
                  Measuring how visitors use the Site, identifying high-traffic
                  pages, diagnosing technical issues, and understanding which
                  content is most valuable to our audience.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Personalization:</strong>{" "}
                  Remembering your preferences, language settings, and form data
                  to provide a more tailored experience on subsequent visits.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">GoHighLevel CRM integration:</strong>{" "}
                  Our CRM platform, GoHighLevel, uses cookies to track visitor
                  interactions with our forms, chat widgets, and landing pages.
                  This allows us to manage leads, automate follow-ups, and
                  deliver personalized ministry engagement workflows.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Advertising and retargeting:</strong>{" "}
                  Delivering relevant advertisements to you on third-party
                  platforms, measuring the effectiveness of our ad campaigns, and
                  limiting the number of times you see the same advertisement.
                </span>
              </li>
            </ul>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 6. Third-Party Cookies */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Third-Party Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Some cookies on our Site are placed by third-party service
              providers. We do not control these cookies; their use is governed
              by the privacy and cookie policies of the respective providers.
              Key third parties include:
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-semibold mb-1">GoHighLevel</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our CRM and marketing automation platform. GoHighLevel cookies
                  facilitate lead tracking, form submissions, chat
                  functionality, appointment scheduling, and automated
                  communication workflows. These cookies help us serve
                  faith-based organizations more effectively.
                </p>
              </div>

              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-semibold mb-1">Google Analytics</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We may use Google Analytics to collect anonymized data about
                  Site traffic and usage patterns. Google Analytics uses cookies
                  to compile statistical reports. You can learn more at{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline hover:no-underline"
                  >
                    Google&apos;s Privacy Policy
                  </a>
                  . You can opt out via the{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline hover:no-underline"
                  >
                    Google Analytics Opt-Out Browser Add-on
                  </a>
                  .
                </p>
              </div>

              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-semibold mb-1">
                  Meta (Facebook) Pixel
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We may use the Meta Pixel to measure the effectiveness of our
                  advertising, deliver targeted ads, and build custom audiences
                  for our campaigns. You can manage your Meta ad preferences at{" "}
                  <a
                    href="https://www.facebook.com/adpreferences"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline hover:no-underline"
                  >
                    Facebook Ad Preferences
                  </a>
                  .
                </p>
              </div>

              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-semibold mb-1">Google Ads</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We may use Google Ads conversion tracking and remarketing to
                  reach potential clients. These cookies help us understand how
                  visitors interact with our Site after viewing an advertisement.
                  You can opt out via{" "}
                  <a
                    href="https://adssettings.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline hover:no-underline"
                  >
                    Google Ads Settings
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 7. Your Rights */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Your Rights
            </h2>

            {/* GDPR */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">
                Under the GDPR (European Economic Area, UK, and Switzerland)
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you are located in the European Economic Area, United Kingdom,
                or Switzerland, the GDPR and the ePrivacy Directive grant you
                specific rights regarding cookies and personal data processing:
              </p>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    <strong className="text-foreground">Right to consent:</strong>{" "}
                    We will obtain your informed, freely given consent before
                    placing non-essential cookies on your device. Necessary
                    cookies do not require consent as they are essential for the
                    Site to function.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    <strong className="text-foreground">Right to withdraw consent:</strong>{" "}
                    You may withdraw your consent at any time by adjusting your
                    cookie preferences or by clearing cookies from your browser.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    <strong className="text-foreground">Right of access:</strong>{" "}
                    You have the right to request information about the personal
                    data we process via cookies.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    <strong className="text-foreground">Right to erasure:</strong>{" "}
                    You may request the deletion of personal data collected
                    through cookies.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    <strong className="text-foreground">Right to lodge a complaint:</strong>{" "}
                    You may lodge a complaint with your local data protection
                    supervisory authority.
                  </span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3 text-sm">
                Our legal basis for processing data via cookies is your consent
                (Article 6(1)(a) GDPR) for non-essential cookies, and our
                legitimate interest (Article 6(1)(f) GDPR) for strictly
                necessary cookies.
              </p>
            </div>

            {/* CCPA / CPRA */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">
                Under the CCPA/CPRA (California, USA)
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you are a California resident, the CCPA and CPRA provide you
                with specific rights regarding the collection and sale of your
                personal information:
              </p>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    <strong className="text-foreground">Right to know:</strong>{" "}
                    You may request that we disclose what personal information we
                    collect, use, disclose, and sell, including data collected
                    via cookies.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    <strong className="text-foreground">Right to delete:</strong>{" "}
                    You may request deletion of personal information collected
                    via cookies, subject to certain exceptions.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    <strong className="text-foreground">Right to opt out of sale/sharing:</strong>{" "}
                    You have the right to opt out of the sale or sharing of your
                    personal information. We do not sell personal information in
                    the traditional sense. If advertising cookies constitute a
                    &quot;sale&quot; or &quot;sharing&quot; under the CCPA/CPRA,
                    you may opt out by adjusting your cookie preferences.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    <strong className="text-foreground">Right to non-discrimination:</strong>{" "}
                    We will not discriminate against you for exercising any of
                    your CCPA/CPRA rights.
                  </span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3 text-sm">
                To exercise your CCPA/CPRA rights, contact us at{" "}
                <a
                  href="mailto:info@growministry.com"
                  className="text-accent underline hover:no-underline"
                >
                  info@growministry.com
                </a>{" "}
                or call{" "}
                <a
                  href="tel:9704260844"
                  className="text-accent underline hover:no-underline"
                >
                  970-426-0844
                </a>
                . We will respond within 45 days as required by law.
              </p>
            </div>

            {/* LGPD */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">
                Under the LGPD (Brazil)
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you are located in Brazil, the LGPD grants you rights
                including:
              </p>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    Confirmation of the existence of processing of your personal
                    data.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    Access to your personal data collected via cookies.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    Correction of incomplete, inaccurate, or outdated data.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    Anonymization, blocking, or deletion of unnecessary or
                    excessive data.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    Revocation of consent at any time.
                  </span>
                </li>
              </ul>
            </div>

            {/* PIPEDA */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Under PIPEDA (Canada)
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you are located in Canada, PIPEDA provides you with the right
                to:
              </p>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    Know what personal information we hold about you and how it
                    is used.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    Access your personal information and challenge its accuracy.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    Withdraw consent for the collection, use, or disclosure of
                    your personal information, subject to legal or contractual
                    restrictions.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    File a complaint with the Office of the Privacy Commissioner
                    of Canada.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 8. How to Manage Cookies */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              How to Manage and Disable Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the right to decide whether to accept or reject cookies.
              You can set your cookie preferences through our cookie consent
              banner when you first visit the Site. Additionally, you can manage
              cookies through your browser settings. Below are instructions for
              the most common browsers:
            </p>

            <div className="space-y-4">
              <div className="bg-muted rounded-xl p-5">
                <h3 className="font-semibold mb-1">Google Chrome</h3>
                <p className="text-sm text-muted-foreground">
                  Settings &rarr; Privacy and Security &rarr; Cookies and Other
                  Site Data. You can block third-party cookies, clear cookies on
                  exit, or block all cookies.
                </p>
              </div>

              <div className="bg-muted rounded-xl p-5">
                <h3 className="font-semibold mb-1">Mozilla Firefox</h3>
                <p className="text-sm text-muted-foreground">
                  Settings &rarr; Privacy &amp; Security &rarr; Enhanced
                  Tracking Protection. Choose Standard, Strict, or Custom to
                  control cookie behavior.
                </p>
              </div>

              <div className="bg-muted rounded-xl p-5">
                <h3 className="font-semibold mb-1">Apple Safari</h3>
                <p className="text-sm text-muted-foreground">
                  Preferences &rarr; Privacy &rarr; Manage Website Data. Safari
                  blocks cross-site tracking by default. You can also block all
                  cookies entirely.
                </p>
              </div>

              <div className="bg-muted rounded-xl p-5">
                <h3 className="font-semibold mb-1">Microsoft Edge</h3>
                <p className="text-sm text-muted-foreground">
                  Settings &rarr; Cookies and Site Permissions &rarr; Manage and
                  Delete Cookies and Site Data. You can block third-party cookies
                  or all cookies.
                </p>
              </div>

              <div className="bg-muted rounded-xl p-5">
                <h3 className="font-semibold mb-1">Mobile Devices</h3>
                <p className="text-sm text-muted-foreground">
                  On iOS, go to Settings &rarr; Safari &rarr; Privacy &amp;
                  Security. On Android, open Chrome &rarr; Settings &rarr; Site
                  Settings &rarr; Cookies. You can also reset your advertising
                  identifier in your device settings.
                </p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mt-6 text-sm">
              Please note that disabling or blocking certain cookies may affect
              the functionality of the Site. Strictly necessary cookies cannot be
              disabled as they are required for the Site to operate. You can also
              opt out of interest-based advertising through the{" "}
              <a
                href="https://optout.aboutads.info/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline hover:no-underline"
              >
                Digital Advertising Alliance
              </a>
              ,{" "}
              <a
                href="https://www.networkadvertising.org/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline hover:no-underline"
              >
                Network Advertising Initiative
              </a>
              , or{" "}
              <a
                href="https://www.youronlinechoices.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline hover:no-underline"
              >
                Your Online Choices
              </a>{" "}
              (for EEA residents).
            </p>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 9. Cookie Retention Periods */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Cookie Retention Periods
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cookies remain on your device for different lengths of time
              depending on their category:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Session cookies:</strong>{" "}
                  Deleted automatically when you close your browser. These are
                  used for essential functions like maintaining your session
                  state.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Persistent cookies:</strong>{" "}
                  Remain on your device for a set period or until you manually
                  delete them. Retention periods vary: consent cookies persist
                  for up to 1 year, analytics cookies for up to 2 years, and
                  marketing cookies for up to 3 months.
                </span>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
              Refer to the cookie table above for the specific retention period
              of each cookie. We regularly review cookie retention periods and
              apply the principle of data minimization.
            </p>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 10. Do Not Track Signals */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Do Not Track Signals
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Some browsers include a &quot;Do Not Track&quot; (DNT) feature
              that signals to websites you visit that you do not want to be
              tracked. There is currently no universally accepted standard for
              how companies should respond to DNT signals. We will honor Global
              Privacy Control (GPC) signals as an opt-out of the sale or sharing
              of personal information as required by the CCPA/CPRA.
            </p>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 11. Children's Privacy */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Children&apos;s Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Site is not directed to children under the age of 16 (or
              under 13 in the United States under COPPA). We do not knowingly
              collect personal information from children through cookies or any
              other means. If we discover that we have inadvertently collected
              personal data from a child, we will promptly delete it. If you
              believe a child has provided us with personal information, please
              contact us immediately.
            </p>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 12. International Data Transfers */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              International Data Transfers
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Grow Ministry is based in the United States. If you are accessing
              our Site from outside the United States, please be aware that
              information collected through cookies may be transferred to,
              stored, and processed in the United States, where data protection
              laws may differ from those in your jurisdiction. By using the Site,
              you acknowledge this transfer. Where required by applicable law
              (such as the GDPR), we ensure appropriate safeguards are in place
              for cross-border data transfers, including Standard Contractual
              Clauses.
            </p>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 13. Updates to This Policy */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Updates to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may update this Cookie Policy from time to time to reflect
              changes in technology, legislation, our business operations, or
              regulatory requirements. When we make changes, we will update the
              &quot;Effective Date&quot; at the top of this page.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We encourage you to review this Cookie Policy periodically to stay
              informed about how we use cookies. Where changes are significant,
              we may provide additional notice such as a prominent banner on the
              Site or a direct notification. Continued use of the Site after
              changes are posted constitutes your acknowledgment of the updated
              policy.
            </p>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 14. Related Policies */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Related Policies
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              This Cookie Policy should be read together with our other legal
              documents:
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-accent underline hover:no-underline"
                >
                  Privacy Policy
                </Link>{" "}
                <span className="text-muted-foreground text-sm">
                  - Full details on how we collect, use, and protect your
                  personal information.
                </span>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-accent underline hover:no-underline"
                >
                  Terms of Service
                </Link>{" "}
                <span className="text-muted-foreground text-sm">
                  - The terms governing your use of our Site and services.
                </span>
              </li>
            </ul>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 15. Contact Us */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions or concerns about this Cookie Policy,
              your data, or how to exercise your rights, please contact us:
            </p>
            <div className="bg-muted rounded-xl p-6 space-y-2 text-sm">
              <p>
                <strong>Grow Ministry</strong>
              </p>
              <p className="text-muted-foreground">
                A Dakdan Worldwide Company
              </p>
              <p className="text-muted-foreground">Severance, CO, United States</p>
              <p>
                <span className="text-muted-foreground">Email: </span>
                <a
                  href="mailto:info@growministry.com"
                  className="text-accent underline hover:no-underline"
                >
                  info@growministry.com
                </a>
              </p>
              <p>
                <span className="text-muted-foreground">Phone: </span>
                <a
                  href="tel:9704260844"
                  className="text-accent underline hover:no-underline"
                >
                  970-426-0844
                </a>
              </p>
            </div>
            <p className="text-muted-foreground text-sm mt-4">
              For GDPR-related inquiries, you may also contact your local Data
              Protection Authority. For CCPA/CPRA requests, we will verify your
              identity before processing your request and respond within the
              timeframes required by law.
            </p>
          </section>

          <p className="text-sm text-muted-foreground border-t border-border pt-6 mt-12">
            Grow Ministry is a Dakdan Worldwide company.
          </p>
        </div>
      </article>
    </div>
  );
}
