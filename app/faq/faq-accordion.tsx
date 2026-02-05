"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FAQ {
  q: string
  a: string
}

interface FAQCategory {
  category: string
  questions: FAQ[]
}

export function FAQAccordion({ faqs }: { faqs: FAQCategory[] }) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <div className="space-y-12">
      {faqs.map((category) => (
        <div key={category.category}>
          <h2 className="text-xl font-semibold font-[family-name:var(--font-playfair)] mb-6 pb-2 border-b border-border">
            {category.category}
          </h2>
          <div className="space-y-2">
            {category.questions.map((faq, qIndex) => {
              const key = `${category.category}-${faq.q}`
              const isOpen = openItems.has(key)
              const panelId = `faq-panel-${category.category}-${qIndex}`
              const buttonId = `faq-btn-${category.category}-${qIndex}`

              return (
                <div
                  key={key}
                  className="rounded-xl border border-border overflow-hidden"
                >
                  <button
                    id={buttonId}
                    onClick={() => toggleItem(key)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-muted/50 transition"
                  >
                    <span className="text-sm font-medium pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div id={panelId} role="region" aria-labelledby={buttonId} className="px-6 pb-5">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
