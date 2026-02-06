import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Shield, Heart, Users, Lightbulb, Award, Building } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

export const metadata: Metadata = {
  title: "About Grow Ministry | Veteran-Owned Church Tech Company",
  description:
    "Veteran-owned and SDVOSB certified, Grow Ministry has served faith-based organizations since 2005 with AI-powered digital solutions. Meet our team.",
  keywords: [
    "about Grow Ministry",
    "veteran-owned church technology",
    "SDVOSB certified business",
    "faith-based technology company",
    "church digital marketing agency",
    "ministry technology partner",
    "service-disabled veteran-owned",
    "Severance Colorado church tech",
  ],
  openGraph: {
    title: "About Grow Ministry | Veteran-Owned, Faith-Driven Technology",
    description:
      "Since 2005, Grow Ministry has helped churches and ministries thrive with AI-powered digital solutions. SDVOSB certified. Based in Severance, CO.",
    url: "https://growministry.com/about",
  },
  twitter: {
    title: "About Grow Ministry | Veteran-Owned Church Tech",
    description:
      "Since 2005, serving faith-based organizations with AI-powered digital solutions. SDVOSB certified veteran-owned business.",
  },
};

const values = [
  {
    icon: Heart,
    title: "Faith-Centered",
    description: "Every tool and service we build serves the mission of the local church. Technology is a servant to ministry, never a replacement for pastoral leadership.",
  },
  {
    icon: Shield,
    title: "Integrity First",
    description: "Strict AI boundaries ensure technology never crosses into counseling, pastoral care, or preaching. Human oversight is non-negotiable.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "We serve churches, ministries, and faith-driven nonprofits of all sizes. From small congregations to multi-campus organizations.",
  },
  {
    icon: Lightbulb,
    title: "Innovation with Purpose",
    description: "We leverage cutting-edge technology — AI, automation, and data analytics — but always in service of people and spiritual growth.",
  },
];

const milestones = [
  { year: "2005", event: "Dakdan Worldwide founded by Dan Kost" },
  { year: "2024", event: "Grow Ministry established as a dedicated faith-based digital agency" },
  { year: "2025", event: "SDVOSB certification received, SBA registered" },
  { year: "2026", event: "Full service ecosystem launched: CRM, AI Telephone, Social Media, Travel, Swag, and Web/SEO" },
];

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Grow Ministry",
  description:
    "Learn about Grow Ministry's mission to empower churches and faith-based organizations with AI-powered digital solutions.",
  mainEntity: {
    "@type": "Organization",
    name: "Grow Ministry",
    founder: {
      "@type": "Person",
      name: "Dan Kost",
      jobTitle: "CEO & Founder",
      description:
        "U.S. Army veteran with over 45 years of business experience. Chairman of the Board at Dakdan Worldwide.",
    },
    foundingDate: "2005",
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "SDVOSB",
      name: "Service-Disabled Veteran-Owned Small Business",
    },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <BreadcrumbSchema items={[{ name: "About", url: "https://growministry.com/about" }]} />
      {/* Hero */}
      <section className="relative text-primary-foreground py-24 px-4 overflow-hidden">
        <Image
          src="/images/heroes/about-hero.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="relative mx-auto max-w-screen-xl text-center">
          <p className="text-sm uppercase tracking-widest text-primary-foreground/50 mb-4">
            About Grow Ministry
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight font-[family-name:var(--font-playfair)]">
            Empowering Ministries to Thrive
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            AI-powered digital growth for faith-based organizations. One partner for your entire digital ecosystem.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-screen-xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-playfair)]">
              Our Mission
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Grow Ministry exists to help faith-based organizations expand their reach and deepen community engagement through modern digital tools. We believe every church and ministry deserves access to the same caliber of technology used by leading organizations — without the complexity, without the confusion, and without compromising doctrinal integrity.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              As a Service-Disabled Veteran-Owned Small Business, we bring military discipline, strategic thinking, and mission-focused execution to everything we build. Our integrated ecosystem of services — CRM, social media, AI telephone, website development, travel, and branded merchandise — eliminates the need to juggle multiple vendors.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {values.map((value) => (
              <div key={value.title} className="p-6 rounded-xl border border-border">
                <value.icon className="size-8 text-accent mb-3" />
                <h3 className="font-semibold text-sm">{value.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <section id="team" className="py-24 px-4 bg-muted">
        <div className="mx-auto max-w-screen-xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center">
            <div className="relative">
              <Image
                src="/images/dankost-portrait.webp"
                alt="Dan Kost - CEO & Founder"
                width={400}
                height={500}
                className="rounded-2xl object-cover shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-background rounded-xl shadow-lg p-4">
                <Image
                  src="/images/sdvosb-certified.webp"
                  alt="SDVOSB Certified"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
              Leadership
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-playfair)]">
              Dan Kost
            </h2>
            <p className="text-lg text-muted-foreground mt-1">CEO &amp; Founder</p>

            <p className="mt-6 text-muted-foreground leading-relaxed">
              With over 45 years of business experience as an entrepreneur, consultant, and creative visionary, Dan Kost brings a unique combination of military discipline and innovative thinking to Grow Ministry.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              A U.S. Army veteran and lifelong entrepreneur, Dan serves as Chairman of the Board at Dakdan Worldwide and its family of companies. Under his leadership, Dakdan Worldwide has grown into a diverse portfolio spanning digital marketing, entertainment production, sports marketing, and faith-based technology services.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Dan&apos;s career spans creative direction, sports marketing, entertainment production, and digital innovation. His passion for faith-based communities drives Grow Ministry&apos;s mission to provide accessible, powerful digital tools to ministries of all sizes.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Award className="size-4 text-accent" />
                <span className="text-muted-foreground">U.S. Army Veteran</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building className="size-4 text-accent" />
                <span className="text-muted-foreground">Chairman, Dakdan Worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-screen-xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-center font-[family-name:var(--font-playfair)] mb-16">
            Our Journey
          </h2>
          <div className="max-w-2xl mx-auto space-y-8">
            {milestones.map((milestone, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                    {milestone.year.slice(-2)}
                  </div>
                  {i < milestones.length - 1 && <div className="w-px h-full bg-border mt-2" />}
                </div>
                <div className="pb-8">
                  <p className="text-sm font-semibold">{milestone.year}</p>
                  <p className="text-sm text-muted-foreground mt-1">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24 px-4 bg-muted">
        <div className="mx-auto max-w-screen-xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
            Certifications &amp; Credentials
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
            Grow Ministry is a Dakdan Worldwide company.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="bg-background rounded-xl p-6 border border-border text-center">
              <p className="text-2xl font-bold">SDVOSB</p>
              <p className="text-xs text-muted-foreground mt-2">Service-Disabled Veteran-Owned Small Business</p>
            </div>
            <div className="bg-background rounded-xl p-6 border border-border text-center">
              <p className="text-2xl font-bold font-mono">9W3P6</p>
              <p className="text-xs text-muted-foreground mt-2">CAGE Code</p>
            </div>
            <div className="bg-background rounded-xl p-6 border border-border text-center">
              <p className="text-lg font-bold font-mono">H5BQG2J7JRB4</p>
              <p className="text-xs text-muted-foreground mt-2">Unique Entity Identifier (UEI)</p>
            </div>
            <div className="bg-background rounded-xl p-6 border border-border text-center">
              <p className="text-2xl font-bold font-mono">541810</p>
              <p className="text-xs text-muted-foreground mt-2">NAICS Code (Advertising Agencies)</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-screen-xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-playfair)]">
            Ready to Grow Your Ministry?
          </h2>
          <p className="mt-4 text-primary-foreground/70 max-w-xl mx-auto">
            Let&apos;s build a digital strategy that serves your mission and strengthens your community.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <GradientButton asChild>
              <Link href="/contact">Get Started</Link>
            </GradientButton>
            <GradientButton variant="variant" asChild>
              <Link href="/services">View Services</Link>
            </GradientButton>
          </div>
        </div>
      </section>
    </div>
  );
}
