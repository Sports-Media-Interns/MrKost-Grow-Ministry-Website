import type { Metadata } from "next";
import Image from "next/image";
import { ServicesInteractive } from "./services-interactive";
import { ServicesPricing } from "./services-pricing";

export const metadata: Metadata = {
  title: "Church Digital Services | AI CRM, Websites & Phone Agents",
  description:
    "AI telephone agents, church CRM, website development, SEO, AEO, social media, and branded merchandise for churches and ministries. Get a free consultation.",
  keywords: [
    "AI telephone agent for churches",
    "church CRM software",
    "congregation relationship management",
    "church website development",
    "church SEO services",
    "answer engine optimization for churches",
    "church social media management",
    "ministry branded merchandise",
    "AI phone answering for churches",
    "church digital marketing services",
    "faith-based technology solutions",
    "church print on demand store",
  ],
  openGraph: {
    title: "AI-Powered Services for Churches | CRM, Websites, Phone Agents & More",
    description:
      "Full-stack digital services for faith-based organizations: AI phone agents, CRM, websites, SEO, AEO, social media, travel, and branded merchandise.",
    url: "https://growministry.com/services",
  },
  twitter: {
    title: "Church Digital Services | AI CRM, Websites & Phone Agents",
    description:
      "AI telephone agents, CRM, websites, SEO, AEO, social media, and merch for churches. All from one veteran-owned partner.",
  },
};

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      serviceType: "AI Telephone Agent",
      provider: { "@type": "Organization", name: "Grow Ministry" },
      description:
        "24/7 AI-powered inbound call answering for churches. Handles prayer requests, service information, event details, and routes calls to ministry leaders.",
      areaServed: "US",
    },
    {
      "@type": "Service",
      serviceType: "Congregation Relationship Management (CRM)",
      provider: { "@type": "Organization", name: "Grow Ministry" },
      description:
        "AI-powered CRM designed specifically for churches to manage member engagement, communication, and ministry workflows.",
    },
    {
      "@type": "Service",
      serviceType: "Church Website Development & SEO",
      provider: { "@type": "Organization", name: "Grow Ministry" },
      description:
        "Custom church website development with built-in SEO and Answer Engine Optimization (AEO) to help churches rank in both traditional search and AI-powered search platforms.",
    },
    {
      "@type": "Service",
      serviceType: "Social Media Management",
      provider: { "@type": "Organization", name: "Grow Ministry" },
      description:
        "Full-service social media management for churches across Facebook, Instagram, X, and LinkedIn.",
    },
    {
      "@type": "Service",
      serviceType: "Branded Merchandise Store",
      provider: { "@type": "Organization", name: "Grow Ministry" },
      description:
        "Print-on-demand branded merchandise stores for churches and ministries, including apparel, accessories, and custom items.",
    },
  ],
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen flex flex-col pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      {/* Hero */}
      <section className="relative text-primary-foreground py-24 px-4 overflow-hidden">
        <Image
          src="/images/heroes/services-hero.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative mx-auto max-w-screen-xl text-center">
          <p className="text-sm uppercase tracking-widest text-primary-foreground/50 mb-4">
            What We Offer
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight font-[family-name:var(--font-playfair)]">
            Our Services
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            A complete integrated ecosystem of digital tools and services built exclusively for churches, ministries, and faith-driven organizations.
          </p>
        </div>
      </section>

      {/* Interactive Services */}
      <ServicesInteractive />

      {/* Pricing */}
      <ServicesPricing />
    </main>
  );
}
