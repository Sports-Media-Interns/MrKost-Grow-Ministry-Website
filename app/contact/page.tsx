import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "./contact-form";
import { BookingCalendar } from "./booking-calendar";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Contact Grow Ministry | Free Church Tech Consultation",
  description:
    "Contact Grow Ministry for a free consultation on AI-powered church solutions. Call, email, or visit us in Severance, CO. We respond within 24 hours.",
  keywords: [
    "contact Grow Ministry",
    "church technology consultation",
    "free church marketing consultation",
    "Severance Colorado church tech",
    "church digital services quote",
    "ministry technology help",
    "AI church solutions consultation",
    "church CRM demo",
  ],
  openGraph: {
    title: "Contact Grow Ministry | Free Church Technology Consultation",
    description:
      "Get a free consultation on AI-powered solutions for your church or ministry. Serving faith-based organizations nationwide from Severance, CO.",
    url: "https://growministry.com/contact",
  },
  twitter: {
    card: "summary",
    title: "Contact Grow Ministry | Free Church Tech Consultation",
    description:
      "Free consultation on AI-powered church solutions. Call, email, or visit us in Severance, CO.",
  },
};

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "info@growministry.com",
    href: "mailto:info@growministry.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "970-426-0844",
    href: "tel:9704260844",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Severance, CO 80550",
    href: "#",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon - Fri: 9:00 AM - 5:00 PM MT",
    href: "#",
  },
];

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Grow Ministry",
  description:
    "Contact Grow Ministry for a free consultation on AI-powered digital solutions for churches and ministries.",
  mainEntity: {
    "@type": "ProfessionalService",
    "@id": "https://growministry.com/#organization",
    name: "Grow Ministry",
    url: "https://growministry.com",
    logo: "https://growministry.com/images/logo.png",
    image: "https://growministry.com/images/logo.png",
    description:
      "AI-powered digital solutions for churches and faith-based organizations. SDVOSB certified.",
    telephone: "+1-970-426-0844",
    email: "info@growministry.com",
    priceRange: "$79-$297/month",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Severance",
      addressRegion: "CO",
      postalCode: "80550",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.5211,
      longitude: -104.8536,
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: "+1-970-426-0844",
      email: "info@growministry.com",
      availableLanguage: "English",
    },
    sameAs: [
      "https://www.linkedin.com/company/grow-ministry",
      "https://www.facebook.com/growministry",
    ],
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <BreadcrumbSchema items={[{ name: "Contact", url: "https://growministry.com/contact" }]} />
      {/* Hero */}
      <section className="relative text-primary-foreground py-24 px-4 overflow-hidden">
        <Image
          src="/images/heroes/contact-hero.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="relative mx-auto max-w-screen-xl text-center">
          <p className="text-sm uppercase tracking-widest text-primary-foreground/50 mb-4">
            Get In Touch
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight font-[family-name:var(--font-playfair)]">
            Contact Us
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Ready to grow your ministry&apos;s digital presence? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-screen-xl grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-2">
              Send Us a Message
            </h2>
            <p className="text-muted-foreground mb-8">
              Fill out the form below and we&apos;ll get back to you within one business day.
            </p>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-2">
              Contact Information
            </h2>
            <p className="text-muted-foreground mb-8">
              Reach out directly through any of the channels below.
            </p>

            <div className="space-y-6">
              {contactDetails.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-start gap-4 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-muted group-hover:bg-accent/20 transition shrink-0">
                    <Icon className="size-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-sm text-muted-foreground">{value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* SDVOSB Badge */}
            <div className="mt-12 p-6 rounded-xl bg-muted">
              <p className="text-sm font-semibold mb-1">SDVOSB Certified</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Grow Ministry is a Service-Disabled Veteran-Owned Small Business, a Dakdan Worldwide company. CAGE Code: 9W3P6 | UEI: H5BQG2J7JRB4
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Calendar */}
      <BookingCalendar />
    </main>
  );
}
