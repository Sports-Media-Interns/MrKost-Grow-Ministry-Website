import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GradientButton } from "@/components/ui/gradient-button";
import { FAQAccordion } from "./faq-accordion";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

export const metadata: Metadata = {
  title: "FAQ | AI Church Solutions & Ministry Technology",
  description:
    "Answers to common questions about Grow Ministry's AI telephone agents, church CRM, website development, and digital services for faith-based organizations.",
  keywords: [
    "church technology FAQ",
    "AI for churches questions",
    "church CRM FAQ",
    "ministry technology questions",
    "AI telephone agent FAQ",
    "church website FAQ",
    "faith-based digital services FAQ",
    "church social media FAQ",
    "how does AI help churches",
    "what is congregation relationship management",
  ],
  openGraph: {
    title: "FAQ | Grow Ministry Church Technology Solutions",
    description:
      "Get answers about AI telephone agents, church CRM, website development, and all digital services for faith-based organizations.",
    url: "https://growministry.com/faq",
  },
  twitter: {
    card: "summary",
    title: "FAQ | AI Church Solutions & Ministry Technology",
    description:
      "Answers to common questions about Grow Ministry's AI-powered services for churches and ministries.",
  },
};

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is Grow Ministry?",
        a: "Grow Ministry is a Service-Disabled Veteran-Owned Small Business (SDVOSB) that provides an integrated ecosystem of digital tools and services built exclusively for churches, ministries, and faith-driven organizations. We offer CRM, AI telephone, social media management, website development, faith-based travel, and branded merchandise services.",
      },
      {
        q: "Who is Grow Ministry designed for?",
        a: "Our services are built for faith-based organizations of all sizes - from small congregations to multi-campus ministries, faith-driven nonprofits, and religious educational institutions.",
      },
      {
        q: "What makes Grow Ministry different from other digital agencies?",
        a: "We are 100% focused on faith-based organizations. Every tool we build respects doctrinal integrity with strict AI boundaries - no counseling, pastoral care, or preaching. Technology serves ministry leadership, never replaces it. Plus, our integrated ecosystem means one partner for your entire digital presence.",
      },
      {
        q: "Is Grow Ministry a certified veteran-owned business?",
        a: "Yes. Grow Ministry is a Dakdan Worldwide company. We are SDVOSB-certified and registered with the SBA. Our CAGE Code is 9W3P6 and our Unique Entity Identifier (UEI) is H5BQG2J7JRB4.",
      },
    ],
  },
  {
    category: "CRM (Congregation Relationship Management)",
    questions: [
      {
        q: "What does the CRM system include?",
        a: "Our CRM provides contact and household management, attendance tracking, care and prayer request tracking, automated visitor follow-up workflows, AI-assisted message drafting, and weekly leadership scorecards with growth and engagement metrics.",
      },
      {
        q: "How much does the CRM cost?",
        a: "The CRM is $79/month or $740/year. Your first year is free with no credit card required, so you can experience the full platform risk-free.",
      },
      {
        q: "Can the CRM integrate with other Grow Ministry services?",
        a: "Absolutely. The CRM is the hub of our integrated ecosystem. It connects with the AI Telephone Agent for call logging and follow-ups, social media for engagement tracking, and travel services for group communication.",
      },
    ],
  },
  {
    category: "AI Telephone Agent",
    questions: [
      {
        q: "How does the AI Telephone Agent work?",
        a: "Our AI-powered phone system answers incoming calls 24/7/365, handles frequently asked questions trained on your ministry's specific information, routes calls intelligently to appropriate staff, takes messages with CRM integration, and can make outbound calls for appointment confirmations and event reminders.",
      },
      {
        q: "Is the AI Telephone Agent safe for sensitive calls?",
        a: "Yes. The system includes crisis safeguards with immediate escalation to human staff. The AI never provides counseling or pastoral care - it handles administrative tasks and information requests while ensuring sensitive calls reach a real person immediately.",
      },
      {
        q: "What happens if someone calls after hours?",
        a: "The AI Telephone Agent operates around the clock. After-hours callers receive the same professional experience - their questions are answered, messages are logged in the CRM, and urgent matters are escalated according to your custom protocols.",
      },
    ],
  },
  {
    category: "Social Media Management",
    questions: [
      {
        q: "Which social media platforms are supported?",
        a: "Our platform supports scheduling and management across Facebook, Instagram, X (Twitter), and LinkedIn - all from a single dashboard.",
      },
      {
        q: "Can you manage our social media for us?",
        a: "Yes. We offer both a self-service tool at $12.50/month (or $99/year) and a fully Managed Plan at $297/month where our team handles content creation, scheduling, and engagement on your behalf.",
      },
      {
        q: "Does the social media tool include content review for theological accuracy?",
        a: "Yes. Built-in approval workflows ensure all content is reviewed for theological accuracy and brand consistency before publishing. This is critical for faith-based organizations where messaging integrity matters.",
      },
    ],
  },
  {
    category: "Website Development & SEO",
    questions: [
      {
        q: "What is Answer Engine Optimization (AEO)?",
        a: "AEO is the next evolution beyond traditional SEO. While SEO optimizes your site for search engine rankings, AEO ensures your ministry appears in AI-powered answer platforms like ChatGPT, Google AI Overviews, and voice assistants. We implement structured data, FAQ schema, and content strategies that position your ministry as an authoritative source.",
      },
      {
        q: "Do you build custom websites or use templates?",
        a: "We build custom, mobile-first responsive websites tailored to your ministry's brand and needs. Each site includes easy content management, local SEO with Google Business Profile optimization, and workflow automation for follow-ups, donations, and event reminders.",
      },
    ],
  },
  {
    category: "Faith-Based Travel",
    questions: [
      {
        q: "What types of trips does Grow Ministry offer?",
        a: "We offer four types of faith-based travel: Sacred Site Tours to biblical and historical destinations, Pilgrimages for spiritual journeys, Retreats for team building and renewal, and Charter services for custom group travel.",
      },
      {
        q: "Do pastors travel free?",
        a: "Yes. When the minimum group size is met, the pastor and spouse travel free. This is part of our commitment to making transformative spiritual journeys accessible to ministry leaders.",
      },
      {
        q: "What is included in a travel package?",
        a: "Our all-inclusive packages cover airfare, hotels, meals, guided tours, travel insurance, and expert local guides including historians and theologians. Customizable itineraries are aligned with your spiritual goals, and CRM integration provides seamless group communication.",
      },
      {
        q: "How much do trips cost?",
        a: "Trips start at approximately $2,500 per person with payment plans available. Exact pricing depends on destination, group size, and trip type. Contact us for a customized quote.",
      },
    ],
  },
  {
    category: "Branded Merchandise Store",
    questions: [
      {
        q: "How does the merchandise store work?",
        a: "We set up a turnkey print-on-demand store for your ministry with 150+ customizable products including apparel, drinkware, accessories, and home and office items. There is zero inventory risk - products are printed and shipped on demand when ordered.",
      },
      {
        q: "What does it cost to launch a store?",
        a: "We offer three models: Revenue-Share (no upfront cost, split proceeds), One-Time Setup (flat fee for store creation), and Custom Enterprise for larger organizations. Your store generates passive revenue without additional staff.",
      },
    ],
  },
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I get started with Grow Ministry?",
        a: "Visit our Contact page or call us at 970-426-0844. We will schedule a consultation to understand your ministry's needs and recommend the right combination of services. You can also download any of our white papers from the Services page for detailed information on each offering.",
      },
      {
        q: "Can I start with just one service?",
        a: "Absolutely. While our ecosystem is designed to work together, you can start with any single service and add more as your ministry grows. Many churches start with the CRM (free first year) or social media management and expand from there.",
      },
      {
        q: "Is there a contract or long-term commitment?",
        a: "We believe in earning your trust through results, not contracts. Service terms vary - the CRM offers a free first year, social media is month-to-month, and project-based services like website development have defined scopes. Contact us for specifics on any service.",
      },
    ],
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.flatMap((category) =>
    category.questions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    }))
  ),
};

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbSchema items={[{ name: "FAQ", url: "https://growministry.com/faq" }]} />
      {/* Hero */}
      <section className="relative text-primary-foreground py-24 px-4 overflow-hidden">
        <Image
          src="/images/heroes/services-hero.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="relative mx-auto max-w-screen-xl text-center">
          <p className="text-sm uppercase tracking-widest text-primary-foreground/50 mb-4">
            Help Center
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight font-[family-name:var(--font-playfair)]">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Find answers to common questions about our services, pricing, and how we help faith-based organizations grow.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-3xl">
          <FAQAccordion faqs={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-muted">
        <div className="mx-auto max-w-screen-xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-playfair)]">
            Still Have Questions?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Our team is here to help. Reach out and we&apos;ll get back to you within one business day.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <GradientButton asChild>
              <Link href="/contact">Contact Us</Link>
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
