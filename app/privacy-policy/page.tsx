import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Privacy Policy | Grow Ministry",
  description:
    "Grow Ministry's privacy policy explains how we collect, use, and protect your personal information when using our church technology services.",
  openGraph: {
    title: "Privacy Policy | Grow Ministry",
    description:
      "Learn how Grow Ministry protects your data and privacy across all our church technology services.",
    url: "https://growministry.com/privacy-policy",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Grow Ministry",
    description:
      "How Grow Ministry protects your data and privacy across our church technology services.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col pt-16">
      <BreadcrumbSchema items={[{ name: "Privacy Policy", url: "https://growministry.com/privacy-policy" }]} />
      <article className="py-24 px-4">
        <div className="mx-auto max-w-3xl prose prose-neutral">
          <h1 className="text-4xl font-semibold font-[family-name:var(--font-playfair)]">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">Last updated: February 2026</p>

          <h2>Introduction</h2>
          <p>
            Grow Ministry, a Dakdan Worldwide company (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website growministry.com and use our services.
          </p>

          <h2>Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>We may collect personal information that you voluntarily provide to us, including:</p>
          <ul>
            <li>Name, email address, and phone number</li>
            <li>Church or ministry organization name</li>
            <li>Mailing address</li>
            <li>Information provided through contact forms and service inquiries</li>
            <li>Travel program registration details</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>When you visit our website, we may automatically collect:</p>
          <ul>
            <li>IP address and browser type</li>
            <li>Device information and operating system</li>
            <li>Pages visited and time spent on our site</li>
            <li>Referring website addresses</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Organize and manage travel programs and events</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>We do not sell your personal information. We may share your information with:</p>
          <ul>
            <li>Service providers who assist in operating our website and delivering our services</li>
            <li>Travel partners and accommodation providers (for travel program participants)</li>
            <li>Legal authorities when required by law</li>
            <li>Our parent company, Dakdan Worldwide, and affiliated entities</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2>Cookies</h2>
          <p>
            Our website uses cookies and similar technologies to enhance your browsing experience and analyze site traffic. You can control cookie preferences through your browser settings.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies.
          </p>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13.
          </p>

          <h2>Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Opt out of marketing communications</li>
            <li>Lodge a complaint with a supervisory authority</li>
          </ul>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </p>

          <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us:</p>
          <ul>
            <li>Email: info@growministry.com</li>
            <li>Phone: 970-426-0844</li>
            <li>Address: Severance, CO 80550</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-8">
            Grow Ministry is a Dakdan Worldwide company.
          </p>
        </div>
      </article>
    </div>
  );
}
