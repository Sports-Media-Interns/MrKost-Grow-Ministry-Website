"use client"

import Script from "next/script"
import { CalendarDays } from "lucide-react"

export function BookingCalendar({ nonce }: { nonce?: string }) {
  return (
    <section className="py-24 px-4 bg-muted">
      <div className="mx-auto max-w-screen-xl">
        <div className="text-center mb-12">
          <div className="mx-auto mb-4 flex items-center justify-center size-14 rounded-full bg-accent/20">
            <CalendarDays className="size-7 text-accent-foreground" />
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-playfair)]">
            Schedule an Appointment
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Book a free consultation to discuss how we can help your ministry grow digitally.
          </p>
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl bg-background border border-border shadow-sm overflow-hidden">
          <iframe
            src="https://api.leadconnectorhq.com/widget/booking/rEcsti5ZtlyhHi89Vsj5"
            style={{ width: "100%", border: "none", overflow: "hidden", minHeight: "700px" }}
            scrolling="no"
            id="rEcsti5ZtlyhHi89Vsj5_1770193004488"
            title="Schedule an appointment with Grow Ministry"
          />
        </div>

        <Script
          src="https://link.msgsndr.com/js/form_embed.js"
          strategy="lazyOnload"
          nonce={nonce}
        />
      </div>
    </section>
  )
}
