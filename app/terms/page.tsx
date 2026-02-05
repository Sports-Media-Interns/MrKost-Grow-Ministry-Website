import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Terms of Service | Grow Ministry",
  description:
    "Terms of service for Grow Ministry's AI-powered digital solutions for churches, ministries, and faith-based organizations.",
  openGraph: {
    title: "Terms of Service | Grow Ministry",
    description:
      "Terms of service governing the use of Grow Ministry's AI-powered digital solutions for churches and ministries.",
    url: "https://growministry.com/terms",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | Grow Ministry",
    description:
      "Terms of service for Grow Ministry's church technology solutions.",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col pt-16">
      <BreadcrumbSchema items={[{ name: "Terms of Service", url: "https://growministry.com/terms" }]} />
      <article className="py-24 px-4">
        <div className="mx-auto max-w-3xl prose prose-neutral">
          <h1 className="text-4xl font-semibold font-[family-name:var(--font-playfair)]">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">Last updated: February 2026</p>

          <h2>Agreement to Terms</h2>
          <p>
            By accessing or using the Grow Ministry website (growministry.com) and services provided by Grow Ministry, a Dakdan Worldwide company (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>

          <h2>Services</h2>
          <p>Grow Ministry provides the following services to faith-based organizations:</p>
          <ul>
            <li>Digital marketing and content creation</li>
            <li>Website development and design</li>
            <li>Search engine optimization (SEO)</li>
            <li>CRM solutions and consulting</li>
            <li>Faith-based travel program organization</li>
            <li>Email marketing campaigns</li>
            <li>Custom fundraising platform development</li>
          </ul>

          <h2>User Responsibilities</h2>
          <p>When using our services, you agree to:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain the confidentiality of any account credentials</li>
            <li>Use our services in compliance with applicable laws and regulations</li>
            <li>Not use our services for any unlawful or unauthorized purpose</li>
            <li>Not interfere with or disrupt our services or servers</li>
          </ul>

          <h2>Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, images, and software, is the property of Grow Ministry or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our written consent.
          </p>

          <h2>Service Agreements</h2>
          <p>
            Specific services may be governed by separate service agreements or statements of work. In the event of any conflict between these Terms of Service and a specific service agreement, the service agreement shall prevail for that particular service.
          </p>

          <h2>Travel Programs</h2>
          <p>Participation in Grow Ministry travel programs is subject to additional terms:</p>
          <ul>
            <li>Travel arrangements are coordinated through vetted third-party partners</li>
            <li>Participants are responsible for obtaining necessary travel documents (passports, visas)</li>
            <li>Trip cancellation and refund policies will be provided at the time of registration</li>
            <li>Travel insurance is required for all international programs</li>
            <li>Grow Ministry reserves the right to modify or cancel trips due to safety concerns</li>
          </ul>

          <h2>Payment Terms</h2>
          <p>
            Payment terms for services will be outlined in individual service agreements or invoices. Unless otherwise specified, payment is due within 30 days of invoice date. Late payments may be subject to additional fees.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Grow Ministry shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability shall not exceed the amount paid by you for the services in question.
          </p>

          <h2>Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Grow Ministry, Dakdan Worldwide, and their officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of our services or violation of these terms.
          </p>

          <h2>Termination</h2>
          <p>
            We may terminate or suspend access to our services at any time, with or without cause, with or without notice. Upon termination, your right to use our services will immediately cease.
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in accordance with the laws of the State of Colorado, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Weld County, Colorado.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to this page. Your continued use of our services constitutes acceptance of the updated terms.
          </p>

          <h2>Contact Us</h2>
          <p>For questions about these Terms of Service, please contact us:</p>
          <ul>
            <li>Email: info@growministry.com</li>
            <li>Phone: 970-426-0844</li>
            <li>Address: Severance, CO 80550</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-8">
            Grow Ministry is a Dakdan Worldwide company. NAICS Code: 541810.
          </p>
        </div>
      </article>
    </main>
  );
}
