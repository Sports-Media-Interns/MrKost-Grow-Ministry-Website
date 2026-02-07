"use client"

import { useState, useEffect } from "react"
import { Globe, BookOpen, Heart, Users, ChevronRight, ChevronLeft, Check, MapPin } from "lucide-react"
import { GradientButton } from "@/components/ui/gradient-button"
import { loadRecaptchaScript, getRecaptchaToken } from "@/lib/recaptcha-client"
import type { TravelLocation } from "@/components/ui/travel-map-wrapper"

interface TripPlannerProps {
  locations: TravelLocation[]
}

type TripType = "mission" | "pilgrimage" | "retreat" | "workshop"

interface FormData {
  tripType: TripType | null
  region: string | null
  destinations: string[]
  groupSize: number
  travelMonth: string
  travelYear: string
  duration: string
  organization: string
  specialNeeds: string
  contactName: string
  contactEmail: string
  contactPhone: string
}

const tripTypeCards: { type: TripType; icon: typeof Globe; title: string; description: string }[] = [
  {
    type: "mission",
    icon: Globe,
    title: "Mission Trip",
    description: "Serve communities through construction, education, medical outreach, and evangelism.",
  },
  {
    type: "pilgrimage",
    icon: BookOpen,
    title: "Pilgrimage",
    description: "Walk where biblical figures walked and deepen your faith at historic sites.",
  },
  {
    type: "retreat",
    icon: Heart,
    title: "Spiritual Retreat",
    description: "Renew your spirit with guided worship, prayer, and fellowship in peaceful settings.",
  },
  {
    type: "workshop",
    icon: Users,
    title: "Workshop / Conference",
    description: "Learn from leading ministry voices at worship and leadership development events.",
  },
]

const regionDefinitions: {
  key: string
  label: string
  summary: string
  filterFn: (loc: TravelLocation) => boolean
}[] = [
  {
    key: "holy-land",
    label: "Holy Land & Bible Lands",
    summary: "Israel, Jordan, Egypt, Turkey, and Greece",
    filterFn: (l) =>
      l.type === "pilgrimage" &&
      ["Israel", "Jordan", "Egypt", "Turkey", "Greece"].includes(l.country),
  },
  {
    key: "latin-america",
    label: "Latin America & Caribbean",
    summary: "Haiti, Honduras, Guatemala, Belize, Costa Rica, Dominican Republic, Peru",
    filterFn: (l) =>
      l.type === "mission" &&
      ["Haiti", "Honduras", "Guatemala", "Belize", "Costa Rica", "Dominican Republic", "Peru"].includes(l.country),
  },
  {
    key: "africa",
    label: "Africa",
    summary: "Kenya, Uganda, Tanzania",
    filterFn: (l) =>
      l.type === "mission" && ["Kenya", "Uganda", "Tanzania"].includes(l.country),
  },
  {
    key: "asia",
    label: "Asia",
    summary: "India, Thailand, Cambodia",
    filterFn: (l) =>
      l.type === "mission" && ["India", "Thailand", "Cambodia"].includes(l.country),
  },
  {
    key: "united-states",
    label: "United States",
    summary: "Appalachia, Chicago, New York, Los Angeles, Miami, Gulf Coast",
    filterFn: (l) =>
      l.type === "mission" && l.country === "United States",
  },
  {
    key: "europe",
    label: "Europe",
    summary: "Spain, Rome, Portugal, Greece",
    filterFn: (l) =>
      ["Spain", "Italy", "Portugal", "Greece"].includes(l.country),
  },
  {
    key: "retreats",
    label: "Retreats & Conferences",
    summary: "Colorado Rockies, Nashville, Lisbon",
    filterFn: (l) => l.type === "retreat" || l.type === "workshop",
  },
]

const stepLabels = ["Trip Type", "Destination", "Details", "Review"]

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 3 }, (_, i) => String(currentYear + i))

const durations = ["3-5 days", "1 week", "2 weeks", "3+ weeks", "Custom"]

export function TripPlanner({ locations }: TripPlannerProps) {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Load reCAPTCHA script on mount
  useEffect(() => { loadRecaptchaScript() }, [])
  const [formData, setFormData] = useState<FormData>({
    tripType: null,
    region: null,
    destinations: [],
    groupSize: 10,
    travelMonth: "",
    travelYear: years[0],
    duration: "",
    organization: "",
    specialNeeds: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  })

  const availableRegions = regionDefinitions.filter((r) => {
    if (!formData.tripType) return false
    const matching = locations.filter(r.filterFn)
    if (formData.tripType === "pilgrimage") {
      return r.key === "holy-land" || r.key === "europe"
    }
    if (formData.tripType === "retreat" || formData.tripType === "workshop") {
      return r.key === "retreats"
    }
    return matching.length > 0 && r.key !== "holy-land" && r.key !== "retreats"
  })

  const regionLocations = formData.region
    ? locations.filter(
        regionDefinitions.find((r) => r.key === formData.region)?.filterFn ?? (() => false)
      )
    : []

  const canAdvance = (): boolean => {
    switch (step) {
      case 0:
        return formData.tripType !== null
      case 1:
        return formData.destinations.length > 0
      case 2:
        return formData.duration !== "" && formData.travelMonth !== ""
      case 3:
        return (
          formData.contactName.trim() !== "" &&
          formData.contactEmail.trim() !== "" &&
          formData.contactPhone.trim() !== ""
        )
      default:
        return false
    }
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const recaptchaToken = await getRecaptchaToken("lead_capture")
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "trip_planner",
          name: formData.contactName.trim(),
          email: formData.contactEmail.trim(),
          phone: formData.contactPhone.trim(),
          source: "trip-planner",
          recaptchaToken,
          tripType: formData.tripType,
          destinations: formData.destinations,
          region: formData.region,
          groupSize: formData.groupSize,
          travelMonth: formData.travelMonth,
          travelYear: formData.travelYear,
          duration: formData.duration,
          organization: formData.organization,
          specialNeeds: formData.specialNeeds,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Submission failed" }))
        setSubmitError(data.error || "Submission failed. Please try again.")
        return
      }
      setSubmitted(true)
    } catch (err) {
      console.error("[TripPlanner] Submission error:", err)
      setSubmitError("Network error. Please check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const toggleDestination = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      destinations: prev.destinations.includes(id)
        ? prev.destinations.filter((d) => d !== id)
        : [...prev.destinations, id],
    }))
  }

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center mb-6">
          <Check className="size-8 text-accent-foreground" />
        </div>
        <h3 className="text-2xl font-semibold font-[family-name:var(--font-playfair)]">
          Thank You, {formData.contactName.split(" ")[0]}!
        </h3>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          We&apos;ve received your trip planning request. A Grow Ministry travel coordinator will
          contact you within 2 business days to discuss your{" "}
          {formData.tripType === "mission"
            ? "mission trip"
            : formData.tripType === "pilgrimage"
              ? "pilgrimage"
              : formData.tripType === "retreat"
                ? "retreat"
                : "workshop"}{" "}
          plans.
        </p>
        <button
          onClick={() => {
            setSubmitted(false)
            setStep(0)
            setFormData({
              tripType: null,
              region: null,
              destinations: [],
              groupSize: 10,
              travelMonth: "",
              travelYear: years[0],
              duration: "",
              organization: "",
              specialNeeds: "",
              contactName: "",
              contactEmail: "",
              contactPhone: "",
            })
          }}
          className="mt-6 text-sm text-primary hover:text-accent transition underline"
        >
          Plan another trip
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-10 max-w-lg mx-auto">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  i < step
                    ? "bg-accent text-accent-foreground"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="size-4" /> : i + 1}
              </div>
              <span
                className={`mt-1.5 text-xs ${
                  i <= step ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {i < stepLabels.length - 1 && (
              <div
                className={`w-12 sm:w-20 h-0.5 mx-2 mt-[-18px] ${
                  i < step ? "bg-accent" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[340px]">
        {/* Step 1: Trip Type */}
        {step === 0 && (
          <div>
            <h3 className="text-lg font-semibold text-center mb-6">What type of trip are you planning?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {tripTypeCards.map((card) => {
                const selected = formData.tripType === card.type
                return (
                  <button
                    key={card.type}
                    onClick={() => setFormData((p) => ({ ...p, tripType: card.type, region: null, destinations: [] }))}
                    className={`rounded-xl border-2 p-6 text-left transition ${
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-accent"
                    }`}
                  >
                    <card.icon className={`size-8 ${selected ? "text-primary" : "text-accent"}`} />
                    <h4 className="mt-3 font-semibold">{card.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2: Destination */}
        {step === 1 && (
          <div>
            {!formData.region ? (
              <>
                <h3 className="text-lg font-semibold text-center mb-6">Choose a region</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {availableRegions.map((region) => {
                    const count = locations.filter(region.filterFn).length
                    return (
                      <button
                        key={region.key}
                        onClick={() => setFormData((p) => ({ ...p, region: region.key, destinations: [] }))}
                        className="rounded-xl border border-border p-5 text-left hover:border-accent transition"
                      >
                        <MapPin className="size-5 text-accent" />
                        <h4 className="mt-2 font-semibold">{region.label}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">{region.summary}</p>
                        <p className="mt-2 text-sm font-medium text-accent">{count} destination{count !== 1 ? "s" : ""}</p>
                      </button>
                    )
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <button
                    onClick={() => setFormData((p) => ({ ...p, region: null, destinations: [] }))}
                    className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1"
                  >
                    <ChevronLeft className="size-4" /> All Regions
                  </button>
                  <span className="text-sm text-muted-foreground">/</span>
                  <span className="text-sm font-medium">
                    {regionDefinitions.find((r) => r.key === formData.region)?.label}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-center mb-6">Select your destination(s)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {regionLocations.map((loc) => {
                    const selected = formData.destinations.includes(loc.id)
                    return (
                      <button
                        key={loc.id}
                        onClick={() => toggleDestination(loc.id)}
                        className={`rounded-xl border-2 p-5 text-left transition ${
                          selected ? "border-primary bg-primary/5" : "border-border hover:border-accent"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-sm">{loc.name}</h4>
                          {selected && (
                            <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                              <Check className="size-3" />
                            </div>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                          {loc.description}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 3: Trip Details */}
        {step === 2 && (
          <div className="max-w-xl mx-auto">
            <h3 className="text-lg font-semibold text-center mb-6">Tell us about your trip</h3>
            <div className="space-y-5">
              <div>
                <label htmlFor="tp-group-size" className="block text-sm font-medium mb-1">Group Size</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1}
                    max={200}
                    value={formData.groupSize}
                    onChange={(e) => setFormData((p) => ({ ...p, groupSize: Number(e.target.value) }))}
                    className="flex-1"
                    aria-label="Group size slider"
                  />
                  <input
                    id="tp-group-size"
                    type="number"
                    min={1}
                    max={200}
                    value={formData.groupSize}
                    onChange={(e) => setFormData((p) => ({ ...p, groupSize: Number(e.target.value) }))}
                    className="w-20 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tp-month" className="block text-sm font-medium mb-1">Preferred Month</label>
                  <select
                    id="tp-month"
                    value={formData.travelMonth}
                    onChange={(e) => setFormData((p) => ({ ...p, travelMonth: e.target.value }))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select month</option>
                    {months.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="tp-year" className="block text-sm font-medium mb-1">Year</label>
                  <select
                    id="tp-year"
                    value={formData.travelYear}
                    onChange={(e) => setFormData((p) => ({ ...p, travelYear: e.target.value }))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="tp-duration" className="block text-sm font-medium mb-1">Trip Duration</label>
                <select
                  id="tp-duration"
                  value={formData.duration}
                  onChange={(e) => setFormData((p) => ({ ...p, duration: e.target.value }))}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select duration</option>
                  {durations.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tp-organization" className="block text-sm font-medium mb-1">Church / Organization Name</label>
                <input
                  id="tp-organization"
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData((p) => ({ ...p, organization: e.target.value }))}
                  placeholder="First Baptist Church"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="tp-notes" className="block text-sm font-medium mb-1">Special Needs / Notes</label>
                <textarea
                  id="tp-notes"
                  value={formData.specialNeeds}
                  onChange={(e) => setFormData((p) => ({ ...p, specialNeeds: e.target.value }))}
                  rows={3}
                  placeholder="Wheelchair accessibility, dietary restrictions, etc."
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {step === 3 && (
          <div className="max-w-xl mx-auto">
            <h3 className="text-lg font-semibold text-center mb-6">Review & Submit</h3>

            {/* Summary */}
            <div className="rounded-xl border border-border p-5 mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Trip Type</span>
                <span className="font-medium capitalize">{formData.tripType?.replace("mission", "Mission Trip").replace("pilgrimage", "Pilgrimage").replace("retreat", "Spiritual Retreat").replace("workshop", "Workshop / Conference")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Region</span>
                <span className="font-medium">{regionDefinitions.find((r) => r.key === formData.region)?.label ?? "-"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Destination(s)</span>
                <span className="font-medium text-right max-w-[200px]">
                  {formData.destinations
                    .map((id) => locations.find((l) => l.id === id)?.name ?? id)
                    .join(", ")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Group Size</span>
                <span className="font-medium">{formData.groupSize}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Travel Dates</span>
                <span className="font-medium">
                  {formData.travelMonth} {formData.travelYear}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{formData.duration}</span>
              </div>
              {formData.organization && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Organization</span>
                  <span className="font-medium">{formData.organization}</span>
                </div>
              )}
              {formData.specialNeeds && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Notes:</span>
                  <p className="mt-1 text-foreground">{formData.specialNeeds}</p>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Your Contact Information</h4>
              <div>
                <label htmlFor="tp-name" className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  id="tp-name"
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData((p) => ({ ...p, contactName: e.target.value }))}
                  placeholder="John Smith"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="tp-email" className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  id="tp-email"
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData((p) => ({ ...p, contactEmail: e.target.value }))}
                  placeholder="john@church.org"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="tp-phone" className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  id="tp-phone"
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData((p) => ({ ...p, contactPhone: e.target.value }))}
                  placeholder="(555) 123-4567"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="mt-4 max-w-xl mx-auto rounded-lg border border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {submitError}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between max-w-xl mx-auto">
        {step > 0 ? (
          <GradientButton variant="variant" onClick={handleBack} disabled={submitting}>
            <ChevronLeft className="size-4 mr-1" /> Back
          </GradientButton>
        ) : (
          <div />
        )}
        {step < 3 ? (
          <GradientButton onClick={handleNext} disabled={!canAdvance()}>
            Next <ChevronRight className="size-4 ml-1" />
          </GradientButton>
        ) : (
          <GradientButton onClick={handleSubmit} disabled={!canAdvance() || submitting}>
            {submitting ? "Submitting..." : "Submit Request"} {!submitting && <ChevronRight className="size-4 ml-1" />}
          </GradientButton>
        )}
      </div>
    </div>
  )
}
