"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Phone, Users, Share2, ShoppingBag, Plane, Globe, FileText, CheckCircle2 } from "lucide-react"
import { ServiceModal } from "@/components/ui/service-modal"
import { GradientButton } from "@/components/ui/gradient-button"

const services = [
  {
    id: "ai-telephone",
    icon: Phone,
    title: "AI Telephone Agent",
    tagline: "Never miss a call again",
    image: "/images/services/grow-ministry-ai-phone-40020.jpg",
    description: "An automated phone answering service powered by AI, designed for churches and ministries. Handles incoming calls professionally 24/7/365, ensuring every caller is directed to the right resource.",
    features: [
      "FAQ handling trained on your ministry's specific information",
      "Intelligent call routing to appropriate staff members",
      "Message taking with CRM integration and auto follow-up tasks",
      "Outbound calls available as an add-on (additional fee)",
      "Crisis safeguards with immediate escalation to human staff",
    ],
    pricing: "Custom quote based on call volume and features",
    downloadUrl: "/downloads/GM_AI_Telephone_White_Paper.pdf",
    downloadName: "AI Telephone Agent",
  },
  {
    id: "crm",
    icon: Users,
    title: "Congregation Relationship Management",
    tagline: "Your digital command center",
    image: "/images/services/crm.webp",
    description: "A centralized ministry management platform that replaces scattered spreadsheets with a single source of truth for contacts, care requests, follow-ups, and reporting. No congregation member falls through the cracks.",
    features: [
      "Contact and household management with attendance tracking",
      "Care and prayer request tracking from submission to resolution",
      "Automated workflows for visitor follow-up and welcome sequences",
      "AI-assisted drafting for messages and care summaries",
      "Weekly leadership scorecards with growth and engagement metrics",
    ],
    pricing: "$79/month or $63/month billed annually — Free first year, no credit card required",
    downloadUrl: "/downloads/GM_CRM_White_Paper.pdf",
    downloadName: "CRM",
  },
  {
    id: "social-media",
    icon: Share2,
    title: "Social Media Management",
    tagline: "One dashboard, every platform",
    image: "/images/services/social-media.webp",
    description: "An affordable, intuitive social media management tool designed for faith-based organizations. Maintain a consistent, engaging online presence across all platforms from a single dashboard.",
    features: [
      "Multi-platform scheduling across Facebook, Instagram, X, LinkedIn",
      "Content calendar aligned to sermon series, events, and seasons",
      "Analytics and reporting on engagement, reach, and growth",
      "Approval workflows for theological accuracy and brand consistency",
      "AI-assisted content generation for posts, captions, and hashtags",
    ],
    pricing: "$13/month or $10/month billed annually — Managed Plan at $297/month",
    downloadUrl: "/downloads/GM_Social_Media_White_Paper.pdf",
    downloadName: "Social Media",
  },
  {
    id: "website-seo",
    icon: Globe,
    title: "Website Development, SEO & AEO",
    tagline: "Your digital front door",
    image: "/images/services/website-seo.webp",
    description: "Custom website development with Search Engine Optimization and Answer Engine Optimization. Ensures your ministry is found by both search engines and AI-powered answer platforms.",
    features: [
      "Mobile-first responsive website with easy content management",
      "Local SEO with Google Business Profile optimization",
      "Answer Engine Optimization for AI platforms and voice assistants",
      "Workflow automation for follow-ups, donations, and event reminders",
      "Structured data and FAQ schema for enhanced search visibility",
    ],
    pricing: "Project-based — Contact for a customized proposal",
    downloadUrl: "/downloads/GM_Website_SEO_AEO_White_Paper.pdf",
    downloadName: "Website & SEO",
  },
  {
    id: "travel",
    icon: Plane,
    title: "Faith-Based Travel Services",
    tagline: "Transformative spiritual journeys",
    image: "/images/services/travel.webp",
    description: "A dedicated travel department curating spiritual journeys to sacred destinations worldwide. End-to-end planning from consultation to post-trip follow-up with expert local guides, historians, and theologians.",
    features: [
      "Pastor and spouse travel free when minimum group size is met",
      "All-inclusive packages: airfare, hotels, meals, tours, and insurance",
      "Four types: Sacred Site Tours, Pilgrimages, Retreats, and Charters",
      "Customizable itineraries aligned with your spiritual goals",
      "CRM integration for seamless group communication",
    ],
    pricing: "Starting at ~$2,500 per person — Payment plans available",
    downloadUrl: "/downloads/GM_Travel_White_Paper.pdf",
    downloadName: "Travel",
  },
  {
    id: "swag-store",
    icon: ShoppingBag,
    title: "Branded Merchandise Store",
    tagline: "Zero inventory, passive revenue",
    image: "/images/services/swag-store.webp",
    description: "A turnkey print-on-demand merchandise store for your ministry. Launch a branded online store with 150+ customizable products and zero inventory risk. We handle design, fulfillment, and shipping.",
    features: [
      "Zero inventory risk — print and ship on demand",
      "150+ products: apparel, drinkware, accessories, home and office",
      "Passive revenue stream without additional staff",
      "Full brand control reflecting your ministry's visual identity",
      "Members become brand ambassadors in their communities",
    ],
    pricing: "Revenue-Share, One-Time Setup, or Custom Enterprise models",
    downloadUrl: "/downloads/GM_Swag_Store_White_Paper.pdf",
    downloadName: "Swag Store",
  },
  {
    id: "master-report",
    icon: FileText,
    title: "Ministry Technology Master Report",
    tagline: "The complete integrated ecosystem",
    image: "/images/services/grow-ministry-ai-phone-40021.jpg",
    description: "A comprehensive overview of the entire Grow Ministry platform. Addresses the modern ministry challenge of administrative overload and positions technology as a servant to ministry leadership.",
    features: [
      "Single integrated ecosystem eliminating multiple vendor juggling",
      "Strict AI boundaries — no counseling, pastoral care, or preaching",
      "Consolidated pricing overview across all services",
      "Data-driven leadership scorecards for pastoral clarity",
      "Doctrinal integrity safeguards for all AI-generated content",
    ],
    pricing: "Free download — Overview of all services and pricing",
    downloadUrl: "/downloads/GM_Master_Report_Ministry_Technology.pdf",
    downloadName: "Master Report",
  },
]

export function ServicesInteractive() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalService, setModalService] = useState({ name: "", url: "" })

  // Read URL hash on mount to auto-select a service (e.g. /services#crm)
  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (hash && services.some((s) => s.id === hash)) {
      setSelectedService(hash)
      // Scroll the service selector into view after a short delay for render
      setTimeout(() => {
        document.getElementById("service-selector")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }

    const onHashChange = () => {
      const h = window.location.hash.replace("#", "")
      if (h && services.some((s) => s.id === h)) {
        setSelectedService(h)
        document.getElementById("service-selector")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const activeService = services.find((s) => s.id === selectedService) || services[0]

  const handleRequestInfo = (serviceName: string, downloadUrl: string) => {
    setModalService({ name: serviceName, url: downloadUrl })
    setModalOpen(true)
  }

  return (
    <>
      <section id="service-selector" className="py-12 px-4 scroll-mt-20">
        <div className="mx-auto max-w-screen-xl">
          {/* Service Selector - Gradient Radio Buttons */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-center font-[family-name:var(--font-playfair)] mb-6">
              Select a Service to Learn More
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {services.map((service) => {
                const isActive = (selectedService ?? services[0].id) === service.id
                return (
                  <label
                    key={service.id}
                    className={`cursor-pointer relative flex items-center gap-2 rounded-[11px] px-5 py-3 text-sm font-bold transition-all duration-300 gradient-button text-white ${
                      isActive
                        ? "shadow-lg scale-[1.03]"
                        : "gradient-button-variant shadow-sm hover:shadow-md hover:scale-[1.02]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="service"
                      value={service.id}
                      checked={isActive}
                      onChange={() => setSelectedService(service.id)}
                      className="sr-only"
                    />
                    <service.icon className="size-4" />
                    <span className="hidden sm:inline">{service.title}</span>
                    <span className="sm:hidden">{service.title.split(" ").slice(0, 2).join(" ")}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Active Service Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              {/* Service Image */}
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8">
                <Image
                  src={activeService.image}
                  alt={activeService.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              <div className="flex items-center gap-3 mb-2">
                <activeService.icon className="size-8 text-accent" />
                <p className="text-sm uppercase tracking-widest text-muted-foreground">
                  {activeService.tagline}
                </p>
              </div>
              <h3 className="text-3xl font-semibold font-[family-name:var(--font-playfair)]">
                {activeService.title}
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {activeService.description}
              </p>
              <div className="mt-6 p-4 rounded-xl bg-muted">
                <p className="text-sm font-medium">Pricing</p>
                <p className="text-sm text-muted-foreground mt-1">{activeService.pricing}</p>
              </div>
              <div className="mt-5">
                <GradientButton
                  onClick={() =>
                    handleRequestInfo(activeService.downloadName, activeService.downloadUrl)
                  }
                >
                  Download White Paper
                </GradientButton>
              </div>
            </div>

            <div className="bg-muted rounded-2xl p-8">
              <h4 className="font-semibold mb-6">Key Features</h4>
              <ul className="space-y-4">
                {activeService.features.map((feature, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 className="size-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-border">
                <GradientButton
                  variant="variant"
                  onClick={() =>
                    handleRequestInfo(activeService.downloadName, activeService.downloadUrl)
                  }
                >
                  Request More Info
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Services Grid */}
      <section className="py-16 px-4 bg-muted">
        <div className="mx-auto max-w-screen-xl">
          <h2 className="text-3xl font-semibold text-center font-[family-name:var(--font-playfair)] mb-4">
            All Services at a Glance
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16">
            Download any white paper to get the full details on pricing, features, and implementation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="group bg-background rounded-xl border border-border overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                {/* Image with hover overlay */}
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Hover overlay with description */}
                  <div className="absolute inset-0 bg-primary/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-5">
                    <service.icon className="size-6 text-accent mb-3" />
                    <p className="text-xs text-primary-foreground/90 leading-relaxed line-clamp-5">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Card content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <service.icon className="size-4 text-accent" />
                    <h3 className="font-semibold text-sm">{service.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{service.tagline}</p>
                  <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{service.pricing.split("—")[0].trim()}</p>
                    <button
                      onClick={() => handleRequestInfo(service.downloadName, service.downloadUrl)}
                      className="text-xs font-medium text-primary hover:text-accent transition whitespace-nowrap"
                    >
                      Learn More &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Modal */}
      <ServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceName={modalService.name}
        downloadUrl={modalService.url}
      />
    </>
  )
}
