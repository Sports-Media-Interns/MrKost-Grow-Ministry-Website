"use client"

import { Pricing } from "@/components/ui/pricing"

const plans = [
  {
    name: "ESSENTIALS",
    price: "13",
    yearlyPrice: "10",
    period: "per month",
    features: [
      "Social Media Management tool",
      "Multi-platform scheduling",
      "Content calendar & analytics",
      "AI-assisted post generation",
      "Email & chat support",
    ],
    description: "Get your ministry visible online with professional social media management at an unbeatable price.",
    buttonText: "Get Started",
    href: "/contact",
    monthlyHref: "https://link.fastpaydirect.com/payment-link/69834f2b6503ca0689831c7a",
    yearlyHref: "https://link.fastpaydirect.com/payment-link/69834fd7c80eafa4629b6ab9",
    isPopular: false,
  },
  {
    name: "GROWTH",
    price: "79",
    yearlyPrice: "63",
    period: "per month",
    features: [
      "Everything in Essentials",
      "Congregation CRM platform",
      "Contact & attendance tracking",
      "Automated visitor follow-up",
      "Care & prayer request management",
      "AI-assisted messaging",
      "Weekly leadership scorecards",
    ],
    description: "The complete digital toolkit for growing ministries. First year free, no credit card required.",
    buttonText: "Get Started",
    href: "/contact",
    monthlyHref: "https://link.fastpaydirect.com/payment-link/69835019353338f696c470a0",
    yearlyHref: "https://link.fastpaydirect.com/payment-link/698350cb353338b063c47219",
    isPopular: true,
  },
  {
    name: "ENTERPRISE",
    price: "297",
    yearlyPrice: "237",
    period: "per month",
    features: [
      "Everything in Growth",
      "AI Telephone Agent - Inbound (24/7, 300 calls/mo)",
      "Custom website & SEO/AEO",
      "Managed social media service",
      "Branded merchandise store",
      "Dedicated account manager",
      "Priority chat bot support",
      "Custom integrations",
    ],
    description: "The full integrated ecosystem with dedicated support for large ministries and multi-campus churches.",
    buttonText: "Contact Sales",
    href: "https://api.leadconnectorhq.com/widget/booking/rEcsti5ZtlyhHi89Vsj5",
    monthlyHref: "https://api.leadconnectorhq.com/widget/booking/rEcsti5ZtlyhHi89Vsj5",
    yearlyHref: "https://api.leadconnectorhq.com/widget/booking/rEcsti5ZtlyhHi89Vsj5",
    isPopular: false,
  },
]

export function ServicesPricing() {
  return (
    <section id="pricing" className="py-6 px-4">
      <Pricing
        plans={plans}
        title="Ministry-Friendly Pricing"
        description={"Choose the plan that fits your congregation's needs.\nAll plans include onboarding, training, and dedicated support."}
      />
    </section>
  )
}
