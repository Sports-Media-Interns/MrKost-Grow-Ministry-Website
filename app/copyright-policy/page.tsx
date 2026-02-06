import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Copyright Policy | Grow Ministry",
  description:
    "Copyright policy for Grow Ministry content, branding, and intellectual property. Learn about permitted use of our materials.",
  openGraph: {
    title: "Copyright Policy | Grow Ministry",
    description:
      "Copyright and intellectual property policy for Grow Ministry content and services.",
    url: "https://growministry.com/copyright-policy",
  },
  twitter: {
    card: "summary",
    title: "Copyright Policy | Grow Ministry",
    description:
      "Copyright and intellectual property policy for Grow Ministry.",
  },
};

export default function CopyrightPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col pt-16">
      <BreadcrumbSchema items={[{ name: "Copyright Policy", url: "https://growministry.com/copyright-policy" }]} />
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
          <p className="text-sm uppercase tracking-widest text-primary-foreground/50 mb-4">
            Legal
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight font-[family-name:var(--font-playfair)]">
            Copyright Policy
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            How Grow Ministry protects intellectual property and respects the
            copyrights of others.
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
              a Dakdan Worldwide company, respects the intellectual property
              rights of others and expects our users to do the same. This
              Copyright Policy outlines our practices regarding the protection of
              copyrighted materials on growministry.com (the &quot;Site&quot;)
              and our procedures for addressing copyright infringement claims.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              All content published on the Site is protected by applicable
              copyright laws, international treaties, and other intellectual
              property regulations. By accessing or using the Site, you agree to
              comply with this Copyright Policy.
            </p>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 2. Ownership of Content */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Ownership of Content
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All content on the Site, including but not limited to text,
              graphics, logos, images, audio clips, video clips, software,
              designs, data compilations, and the overall arrangement and
              compilation thereof, is the property of Grow Ministry or is
              licensed to us by third parties.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This content is protected under the United States Copyright Act
              (Title 17, U.S. Code), international copyright treaties, and all
              applicable intellectual property laws. All rights not expressly
              granted in this policy are reserved by Grow Ministry.
            </p>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 3. Permitted Use */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Permitted Use
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Visitors to the Site may engage in the following activities for
              personal, non-commercial use only:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">View content:</strong>{" "}
                  You may browse and view pages on the Site using a standard web
                  browser.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Download and print:</strong>{" "}
                  You may download and print individual pages or sections of the
                  Site for personal reference, provided such use is
                  non-commercial in nature.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Retain notices:</strong>{" "}
                  All downloaded or printed materials must retain all copyright
                  notices, trademark notices, and other proprietary
                  designations as they appear in the original content.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">No modification:</strong>{" "}
                  Materials obtained from the Site may not be modified, altered,
                  or adapted in any way without prior written consent from Grow
                  Ministry.
                </span>
              </li>
            </ul>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 4. Prohibited Use */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Prohibited Use
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Without prior written consent from Grow Ministry, the following
              activities are strictly prohibited:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Reproduction:</strong>{" "}
                  Copying, reproducing, or duplicating any content from the Site
                  in any medium or format beyond what is permitted above.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Distribution:</strong>{" "}
                  Distributing, publishing, or transmitting any content from the
                  Site to third parties.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Modification:</strong>{" "}
                  Modifying, adapting, translating, or creating derivative works
                  based on any content from the Site.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Public display:</strong>{" "}
                  Publicly displaying, performing, or broadcasting any content
                  from the Site without authorization.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Derivative works:</strong>{" "}
                  Creating any works derived from or based upon the content,
                  design, or structure of the Site.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Commercial use:</strong>{" "}
                  Using any content from the Site for commercial purposes,
                  including but not limited to resale, licensing, or
                  monetization.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Framing and mirroring:</strong>{" "}
                  Framing, mirroring, or embedding any page or content from the
                  Site on another website or platform.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Data mining and scraping:</strong>{" "}
                  Using automated tools, bots, crawlers, or scrapers to extract,
                  harvest, or mine data or content from the Site.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Removal of notices:</strong>{" "}
                  Removing, obscuring, or altering any copyright notices,
                  trademark symbols, or other proprietary designations from the
                  Site content.
                </span>
              </li>
            </ul>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 5. Trademarks */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Trademarks
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              &quot;Grow Ministry,&quot; the Grow Ministry logo, and
              &quot;Dakdan Worldwide&quot; are trademarks or registered
              trademarks of their respective owners. These marks may not be
              used in connection with any product or service that is not
              affiliated with Grow Ministry, in any manner that is likely to
              cause confusion among users, or in any manner that disparages or
              discredits Grow Ministry.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              No use of any Grow Ministry trademark is permitted without prior
              written permission. All other trademarks, trade names, service
              marks, and logos appearing on the Site are the property of their
              respective owners and are used with permission or under applicable
              fair use provisions.
            </p>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 6. User-Generated Content */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              User-Generated Content
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you submit, post, or transmit any content to the Site,
              including but not limited to form submissions, comments, feedback,
              testimonials, or other materials, you grant Grow Ministry a
              non-exclusive, royalty-free, perpetual, irrevocable, worldwide
              license to use, reproduce, modify, adapt, publish, translate,
              distribute, display, and perform such content in any media or
              format, whether now known or hereafter developed.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              By submitting content, you represent and warrant that:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  You own or have the necessary rights, licenses, and
                  permissions to submit the content and to grant the license
                  described above.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  Your content does not infringe upon the intellectual property
                  rights, privacy rights, or any other rights of any third
                  party.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  Your content does not contain any material that is unlawful,
                  defamatory, obscene, or otherwise objectionable.
                </span>
              </li>
            </ul>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 7. DMCA Notice and Takedown Procedure */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              DMCA Notice and Takedown Procedure
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Grow Ministry complies with the Digital Millennium Copyright Act
              (DMCA). If you believe that content on our Site infringes upon
              your copyright, you may submit a written notification to our
              designated DMCA Agent.
            </p>

            <h3 className="text-lg font-semibold mb-3">
              Filing a DMCA Infringement Notice
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Your DMCA notice must include the following elements:
            </p>
            <div className="border border-border rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    <strong className="text-foreground">Signature:</strong>{" "}
                    A physical or electronic signature of the copyright owner or
                    a person authorized to act on their behalf.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    <strong className="text-foreground">Identification of copyrighted work:</strong>{" "}
                    Identification of the copyrighted work claimed to have been
                    infringed, or, if multiple copyrighted works are covered by a
                    single notification, a representative list of such works.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    <strong className="text-foreground">Identification of infringing material:</strong>{" "}
                    Identification of the material that is claimed to be
                    infringing and information reasonably sufficient to permit us
                    to locate the material (such as the URL of the page
                    containing the material).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    <strong className="text-foreground">Contact information:</strong>{" "}
                    Your name, address, telephone number, and email address so
                    that we may contact you regarding your complaint.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    <strong className="text-foreground">Good faith statement:</strong>{" "}
                    A statement that you have a good faith belief that the
                    disputed use of the copyrighted material is not authorized by
                    the copyright owner, its agent, or the law.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold mt-0.5">&#8226;</span>
                  <span>
                    <strong className="text-foreground">Accuracy statement:</strong>{" "}
                    A statement, made under penalty of perjury, that the
                    information in the notification is accurate and that you are
                    authorized to act on behalf of the owner of the copyright
                    that is allegedly infringed.
                  </span>
                </li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold mb-3">
              Designated DMCA Agent
            </h3>
            <div className="border border-border rounded-xl p-6 mb-6">
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Grow Ministry Copyright Agent</strong>
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
            </div>

            <h3 className="text-lg font-semibold mb-3">
              Counter-Notification Procedure
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you believe that content you posted on the Site was removed or
              disabled as a result of a mistake or misidentification, you may
              submit a written counter-notification to our DMCA Agent. Your
              counter-notification must include:
            </p>
            <ul className="space-y-3 text-muted-foreground mb-6">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  Your physical or electronic signature.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  Identification of the material that has been removed or to
                  which access has been disabled and the location at which the
                  material appeared before it was removed or disabled.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  A statement under penalty of perjury that you have a good
                  faith belief that the material was removed or disabled as a
                  result of mistake or misidentification.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  Your name, address, and telephone number, and a statement that
                  you consent to the jurisdiction of the federal district court
                  for the judicial district in which your address is located and
                  that you will accept service of process from the person who
                  provided the original notification.
                </span>
              </li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">
              Repeat Infringer Policy
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              In accordance with the DMCA, Grow Ministry maintains a policy to
              terminate, in appropriate circumstances, the accounts or access
              privileges of users who are repeat infringers of copyrighted
              materials. We reserve the right to remove any content and
              terminate the access of any user who is found to have repeatedly
              infringed upon the intellectual property rights of others.
            </p>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 8. Third-Party Content */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Third-Party Content
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The Site may contain content provided by or sourced from third
              parties, including but not limited to stock images, photographs,
              fonts, icons, illustrations, and software libraries. Such
              third-party content is used under license and remains the property
              of its respective owners.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The inclusion of third-party content on the Site does not grant
              you any rights or licenses to use such content independently.
              Third-party content is subject to the terms and conditions imposed
              by its respective owners and licensors.
            </p>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 9. White Papers and Downloads */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              White Papers and Downloads
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Grow Ministry may make downloadable materials available on the
              Site, including but not limited to white papers, reports, guides,
              templates, and other resources. These materials are provided for
              informational purposes only and are subject to the following
              terms:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Sharing:</strong>{" "}
                  Downloadable materials may be shared with others in their
                  original, unmodified form, provided that proper attribution to
                  Grow Ministry is included.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">No modification:</strong>{" "}
                  Downloadable materials may not be modified, altered, or
                  adapted in any way without prior written consent from Grow
                  Ministry.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">No commercial use:</strong>{" "}
                  Downloadable materials may not be sold, licensed, sublicensed,
                  or used for any commercial purpose without prior written
                  consent from Grow Ministry.
                </span>
              </li>
            </ul>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 10. Linking Policy */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Linking Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Third parties may link to publicly available pages on the Site,
              provided that the following conditions are met:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  The link is not deceptive, misleading, or fraudulent in any
                  way.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  The link does not falsely imply sponsorship, endorsement, or
                  approval by Grow Ministry of the linking party or its
                  products, services, or content.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  The link fits within the context of the linking party&apos;s
                  website or platform.
                </span>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Grow Ministry reserves the right to request the removal of any
              link to the Site at any time and for any reason. The linking party
              agrees to promptly remove any such link upon request.
            </p>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 11. International Copyright */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              International Copyright
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The content on the Site is protected under international copyright
              agreements and treaties, including but not limited to:
            </p>
            <div className="space-y-4">
              <div className="border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Berne Convention for the Protection of Literary and Artistic
                  Works
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Provides automatic copyright protection in all member
                  countries without the need for formal registration, ensuring
                  our content is recognized and protected internationally.
                </p>
              </div>

              <div className="border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">
                  WIPO Copyright Treaty (WCT)
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Extends copyright protection to digital works and the
                  internet, covering computer programs, databases, and digital
                  content distributed online.
                </p>
              </div>

              <div className="border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Applicable National Laws
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Our content is further protected by the domestic copyright and
                  intellectual property laws of each country in which it is
                  accessed, including the United States Copyright Act, the
                  European Copyright Directive, and equivalent statutes
                  worldwide.
                </p>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 12. Enforcement */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Enforcement
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Grow Ministry actively monitors and protects its intellectual
              property rights. We take unauthorized use of our content seriously
              and will pursue all available legal remedies to protect our
              copyrighted materials.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Unauthorized use of any content from the Site may result in:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Civil penalties:</strong>{" "}
                  Including injunctive relief, actual damages, statutory
                  damages, and recovery of attorney fees and court costs.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Criminal penalties:</strong>{" "}
                  Willful copyright infringement may be subject to criminal
                  prosecution under applicable federal and state laws.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">&#8226;</span>
                <span>
                  <strong className="text-foreground">Account termination:</strong>{" "}
                  We reserve the right to terminate access to the Site for any
                  user who violates this Copyright Policy.
                </span>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Grow Ministry reserves the right to pursue all available legal
              remedies, including but not limited to cease-and-desist notices,
              DMCA takedown requests, and litigation in federal or state court.
            </p>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 13. Related Policies */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Related Policies
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              This Copyright Policy should be read together with our other legal
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
              <li>
                <Link
                  href="/cookie-policy"
                  className="text-accent underline hover:no-underline"
                >
                  Cookie Policy
                </Link>{" "}
                <span className="text-muted-foreground text-sm">
                  - How we use cookies and similar technologies on our
                  Site.
                </span>
              </li>
            </ul>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* 14. Contact Us */}
          {/* ------------------------------------------------------------------ */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-4">
              Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about this Copyright Policy, wish to
              report potential copyright infringement, submit a DMCA notice, or
              request permission to use our content, please contact us:
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
              For copyright-related inquiries, DMCA notices, or permission
              requests, please include as much detail as possible to help us
              respond promptly and accurately.
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
