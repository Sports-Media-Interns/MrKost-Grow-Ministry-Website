import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Globe, Phone, Users, Share2, ShoppingBag, Plane, FileText, Home, Info, HelpCircle, Mail, ScrollText, Shield } from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Sitemap | Grow Ministry",
  description:
    "Browse all pages on the Grow Ministry website. Find AI church solutions, CRM, website development, travel, and more.",
  openGraph: {
    title: "Sitemap | Grow Ministry",
    description:
      "Navigate all Grow Ministry pages - AI church solutions, CRM, websites, travel, and more.",
    url: "https://growministry.com/sitemap",
  },
  twitter: {
    card: "summary",
    title: "Sitemap | Grow Ministry",
    description: "Browse all Grow Ministry pages and services.",
  },
};

const siteStructure = [
  {
    title: "Main Pages",
    links: [
      { icon: Home, text: "Home", href: "/", description: "Landing page with overview of all services" },
      { icon: Info, text: "About Us", href: "/about", description: "Our mission, values, and team" },
      { icon: Globe, text: "Services", href: "/services", description: "All digital services for faith-based organizations" },
      { icon: Plane, text: "Faith-Based Travel", href: "/travel", description: "Mission trips, pilgrimages, retreats, and workshops" },
      { icon: Mail, text: "Contact", href: "/contact", description: "Get in touch with our team" },
      { icon: HelpCircle, text: "FAQ", href: "/faq", description: "Frequently asked questions" },
    ],
  },
  {
    title: "Services",
    links: [
      { icon: Phone, text: "AI Telephone Agent", href: "/services#ai-telephone", description: "24/7 AI-powered phone answering" },
      { icon: Users, text: "CRM Solutions", href: "/services#crm", description: "Congregation Relationship Management" },
      { icon: Share2, text: "Social Media Management", href: "/services#social-media", description: "Multi-platform scheduling and analytics" },
      { icon: Globe, text: "Website Development, SEO & AEO", href: "/services#website-seo", description: "Custom websites with search optimization" },
      { icon: Plane, text: "Faith-Based Travel Services", href: "/services#travel", description: "Spiritual journeys and mission trips" },
      { icon: ShoppingBag, text: "Branded Merchandise Store", href: "/services#swag-store", description: "Print-on-demand ministry merchandise" },
      { icon: FileText, text: "Ministry Technology Master Report", href: "/services#master-report", description: "Comprehensive platform overview" },
    ],
  },
  {
    title: "Travel Destinations",
    links: [
      { icon: Globe, text: "Holy Land & Bible Lands", href: "/travel#destinations", description: "Israel, Jordan, Egypt, Turkey, Greece" },
      { icon: Globe, text: "Latin America & Caribbean", href: "/travel#destinations", description: "Haiti, Honduras, Guatemala, Belize, Costa Rica, Dominican Republic, Peru" },
      { icon: Globe, text: "Africa", href: "/travel#destinations", description: "Kenya, Uganda, Tanzania" },
      { icon: Globe, text: "Asia", href: "/travel#destinations", description: "India, Thailand, Cambodia" },
      { icon: Globe, text: "United States", href: "/travel#destinations", description: "Appalachia, Chicago, NYC, LA, Miami, Gulf Coast" },
      { icon: Globe, text: "Europe", href: "/travel#destinations", description: "Spain, Italy, Portugal, Greece" },
    ],
  },
  {
    title: "White Papers & Downloads",
    links: [
      { icon: FileText, text: "AI Telephone Agent White Paper", href: "/services#ai-telephone", description: "PDF download" },
      { icon: FileText, text: "CRM White Paper", href: "/services#crm", description: "PDF download" },
      { icon: FileText, text: "Social Media White Paper", href: "/services#social-media", description: "PDF download" },
      { icon: FileText, text: "Website & SEO White Paper", href: "/services#website-seo", description: "PDF download" },
      { icon: FileText, text: "Travel White Paper", href: "/services#travel", description: "PDF download" },
      { icon: FileText, text: "Swag Store White Paper", href: "/services#swag-store", description: "PDF download" },
      { icon: FileText, text: "Master Report", href: "/services#master-report", description: "PDF download" },
    ],
  },
  {
    title: "Legal",
    links: [
      { icon: Shield, text: "Privacy Policy", href: "/privacy-policy", description: "How we handle your data" },
      { icon: ScrollText, text: "Terms of Service", href: "/terms", description: "Terms and conditions" },
      { icon: Shield, text: "Cookie Policy", href: "/cookie-policy", description: "How we use cookies and tracking" },
      { icon: Shield, text: "Copyright Policy", href: "/copyright-policy", description: "Intellectual property and DMCA procedures" },
    ],
  },
  {
    title: "External Links",
    links: [
      { icon: ShoppingBag, text: "Branded Merchandise Shop", href: "https://growministry.com/shop/", description: "Browse and order ministry merchandise", external: true },
      { icon: FileText, text: "Press / Blog", href: "https://growministry.com/blog/", description: "Latest news and articles", external: true },
    ],
  },
];

export default function SitemapPage() {
  return (
    <main className="min-h-screen flex flex-col pt-16">
      <BreadcrumbSchema items={[{ name: "Sitemap", url: "https://growministry.com/sitemap" }]} />
      {/* Hero */}
      <section className="relative text-primary-foreground py-16 px-4 overflow-hidden">
        <Image
          src="/images/services/website-seo.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="relative mx-auto max-w-screen-xl text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight font-[family-name:var(--font-playfair)]">
            Site Map
          </h1>
          <p className="mt-4 text-primary-foreground/70 max-w-xl mx-auto">
            A complete directory of every page and resource on the Grow Ministry website.
          </p>
        </div>
      </section>

      {/* Sitemap Content */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-screen-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {siteStructure.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-semibold font-[family-name:var(--font-playfair)] border-b border-border pb-3 mb-5">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.links.map((link) => {
                    const LinkTag = (link as { external?: boolean }).external ? 'a' : Link;
                    const extraProps = (link as { external?: boolean }).external
                      ? { target: "_blank" as const, rel: "noopener noreferrer" }
                      : {};
                    return (
                      <li key={link.text}>
                        <LinkTag
                          href={link.href}
                          className="group flex items-start gap-3 rounded-lg p-2 -mx-2 hover:bg-muted transition"
                          {...extraProps}
                        >
                          <link.icon className="size-4 text-accent shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium group-hover:text-accent transition">
                              {link.text}
                            </p>
                            <p className="text-xs text-muted-foreground">{link.description}</p>
                          </div>
                        </LinkTag>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
