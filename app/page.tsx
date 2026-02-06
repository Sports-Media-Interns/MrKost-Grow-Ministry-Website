import type { Metadata } from "next";
import { ShaderAnimationWrapper } from "@/components/ui/shader-animation-wrapper";
import { GradientButton } from "@/components/ui/gradient-button";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Grow Ministry | AI-Powered Digital Solutions for Churches",
  description:
    "Grow Ministry provides AI-powered CRM, websites, social media, and phone agents for churches and ministries. Veteran-owned. Start growing today.",
  keywords: [
    "AI for churches",
    "church digital marketing",
    "ministry technology solutions",
    "AI-powered church CRM",
    "church website development",
    "faith-based digital services",
    "veteran-owned church technology",
    "SDVOSB church services",
    "church social media management",
    "AI telephone agent for churches",
    "church growth solutions",
    "digital ministry tools",
  ],
  openGraph: {
    title: "Grow Ministry | AI-Powered Digital Solutions for Churches & Ministries",
    description:
      "AI-powered CRM, websites, social media management, and 24/7 phone agents built exclusively for faith-based organizations. Veteran-owned & SDVOSB certified.",
    url: "https://growministry.com/",
  },
  twitter: {
    title: "Grow Ministry | AI-Powered Digital Solutions for Churches",
    description:
      "AI-powered CRM, websites, social media, and 24/7 phone agents for faith-based organizations. Veteran-owned.",
  },
};
import {
  Share2,
  Globe,
  FileText,
  Users,
  Plane,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { socialLinks } from "@/lib/social-links";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Grow Ministry",
      url: "https://growministry.com",
      logo: "https://growministry.com/images/logo.png",
      description:
        "AI-powered digital solutions for churches, ministries, and faith-based nonprofits. Services include AI telephone agents, CRM, website development, SEO, AEO, social media management, faith-based travel, and branded merchandise.",
      foundingDate: "2005",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Severance",
        addressRegion: "CO",
        addressCountry: "US",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-970-426-0844",
        contactType: "sales",
        email: "info@growministry.com",
        availableLanguage: "English",
      },
      sameAs: [
        "https://www.facebook.com/GrowMinistryInfo",
        "https://www.instagram.com/growministryinfo/",
        "https://www.linkedin.com/company/grow-ministry/",
        "https://x.com/grow_ministry",
        "https://www.twitch.tv/growministry",
      ],
      knowsAbout: [
        "Church digital marketing",
        "AI telephone agents",
        "Church CRM software",
        "Faith-based travel",
        "Church website development",
        "Answer Engine Optimization",
      ],
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "SDVOSB",
        name: "Service-Disabled Veteran-Owned Small Business",
      },
    },
    {
      "@type": "WebSite",
      name: "Grow Ministry",
      url: "https://growministry.com",
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero / Shader Visual */}
      <section className="relative h-[50vh] w-full overflow-hidden">
        <ShaderAnimationWrapper />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-white font-[family-name:var(--font-playfair)] text-center">
            Grow Ministry
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/70 max-w-2xl text-center">
            AI-Powered Digital Growth for Faith-Based Organizations
          </p>
          <div className="mt-8 flex gap-4 pointer-events-auto">
            <GradientButton asChild>
              <Link href="/contact">Get Started</Link>
            </GradientButton>
            <GradientButton variant="variant" asChild>
              <Link href="/services">Our Services</Link>
            </GradientButton>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-screen-xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-center font-[family-name:var(--font-playfair)]">
            Empowering Ministries to Thrive
          </h2>
          <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
            We provide comprehensive digital solutions tailored for churches, ministries, and faith-driven nonprofits to expand their reach and community engagement.
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Digital Marketing",
                description:
                  "Strategic content creation, social media management, and targeted campaigns to grow your congregation.",
                href: "/services#social-media",
                image: "/images/services/social-media.webp",
                icon: Share2,
              },
              {
                title: "Website Development",
                description:
                  "Modern, responsive websites built with the latest technology to represent your ministry online.",
                href: "/services#website-seo",
                image: "/images/services/website-seo.webp",
                icon: Globe,
              },
              {
                title: "SEO & Content",
                description:
                  "Search engine optimization and compelling content to help people discover your ministry.",
                href: "/services#website-seo",
                image: "/images/services/master-report.webp",
                icon: FileText,
              },
              {
                title: "CRM Solutions",
                description:
                  "AI-powered customer relationship management to nurture and engage your community.",
                href: "/services#crm",
                image: "/images/services/crm.webp",
                icon: Users,
              },
              {
                title: "Faith-Based Travel",
                description:
                  "Organized mission trips, pilgrimages, and spiritual retreats for your congregation.",
                href: "/travel",
                image: "/images/services/travel.webp",
                icon: Plane,
              },
              {
                title: "Consulting",
                description:
                  "Expert guidance on digital strategy, fundraising platforms, and ministry growth.",
                href: "/services#master-report",
                image: "/images/services/ai-telephone.webp",
                icon: Lightbulb,
              },
            ].map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className="group relative h-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  {/* Background Image */}
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 group-hover:to-black/30 transition-all duration-500" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col justify-end h-full p-6">
                    {/* Icon */}
                    <div className="mb-3 flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-[#c1c5b3]/20 group-hover:border-[#c1c5b3]/40 transition-all duration-500">
                      <Icon className="size-5 text-white group-hover:text-[#c1c5b3] transition-colors duration-500" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-white font-[family-name:var(--font-playfair)] tracking-tight">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-sm text-white/70 leading-relaxed line-clamp-2">
                      {service.description}
                    </p>

                    {/* Learn More */}
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#c1c5b3] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <span>Learn More</span>
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-16 bg-muted">
        <div className="mx-auto max-w-screen-xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-playfair)]">
            Connect With Us
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Follow Grow Ministry on social media for the latest updates, resources, and community stories.
          </p>
          <div className="mt-10 flex items-center justify-center gap-6">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2"
                aria-label={label}
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground group-hover:bg-accent group-hover:text-accent-foreground transition shadow-md">
                  <Icon className="size-6" />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition" aria-hidden="true">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
