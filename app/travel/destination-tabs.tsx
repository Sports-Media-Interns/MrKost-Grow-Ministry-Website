"use client"

import { useState } from "react"
import Link from "next/link"
import type { TravelLocation } from "@/components/ui/travel-map"

interface DestinationTabsProps {
  locations: TravelLocation[]
}

interface TabDef {
  key: string
  label: string
  filterFn: (loc: TravelLocation) => boolean
  summary: string
}

const tabs: TabDef[] = [
  {
    key: "all",
    label: "All",
    filterFn: () => true,
    summary:
      "Explore all 30 faith-based travel destinations across six continents. From mission trips and pilgrimages to retreats and conferences, Grow Ministry connects your congregation with transformative travel experiences worldwide.",
  },
  {
    key: "holy-land",
    label: "Holy Land & Bible Lands",
    filterFn: (l) =>
      l.type === "pilgrimage" &&
      ["Israel", "Jordan", "Egypt", "Turkey", "Greece"].includes(l.country),
    summary:
      "Walk where Jesus walked. Our Holy Land and Bible Lands pilgrimages take your group through the most significant sites in biblical history, from Jerusalem and the Jordan River to the churches of Revelation in Turkey and the missionary trails of the Apostle Paul in Greece.",
  },
  {
    key: "latin-america",
    label: "Latin America & Caribbean",
    filterFn: (l) =>
      l.type === "mission" &&
      ["Haiti", "Honduras", "Guatemala", "Belize", "Costa Rica", "Dominican Republic", "Peru"].includes(l.country),
    summary:
      "Latin America and the Caribbean represent some of the most impactful short-term mission destinations worldwide. From construction projects in Haiti to medical outreach in Peru, your team will partner with local churches and communities to make a lasting difference.",
  },
  {
    key: "africa",
    label: "Africa",
    filterFn: (l) =>
      l.type === "mission" && ["Kenya", "Uganda", "Tanzania"].includes(l.country),
    summary:
      "Sub-Saharan Africa offers some of the most transformative mission experiences available. Partner with local churches and community leaders in Kenya, Uganda, and Tanzania to support orphanages, schools, clean water initiatives, and community health programs.",
  },
  {
    key: "asia",
    label: "Asia",
    filterFn: (l) =>
      l.type === "mission" && ["India", "Thailand", "Cambodia"].includes(l.country),
    summary:
      "South and Southeast Asia present unique ministry opportunities including church planting, English teaching, anti-trafficking work, and community development. Partner with established ministry networks in India, Thailand, and Cambodia.",
  },
  {
    key: "united-states",
    label: "United States",
    filterFn: (l) => l.type === "mission" && l.country === "United States",
    summary:
      "You don\u2019t have to cross an ocean to make a difference. Domestic mission trips serve communities across the United States, from rural Appalachian housing repair to urban poverty relief in major cities and disaster response along the Gulf Coast.",
  },
  {
    key: "retreats",
    label: "Retreats & Conferences",
    filterFn: (l) => l.type === "retreat" || l.type === "workshop",
    summary:
      "Retreats and conferences provide focused time for spiritual renewal, worship, and leadership development. Whether it\u2019s a mountain retreat in the Colorado Rockies, a leadership renewal in Lisbon, or a worship conference in Nashville, these experiences equip your team for greater impact.",
  },
  {
    key: "europe",
    label: "Europe",
    filterFn: (l) =>
      ["Spain", "Italy", "Portugal", "Greece"].includes(l.country),
    summary:
      "Europe\u2019s rich Christian heritage comes alive through pilgrimages and retreats. Walk the Camino de Santiago in Spain, explore early church history in Rome and Greece, or experience leadership renewal in Portugal\u2019s welcoming culture.",
  },
]

export function DestinationTabs({ locations }: DestinationTabsProps) {
  const [activeTab, setActiveTab] = useState("holy-land")
  const [showAll, setShowAll] = useState(false)

  const currentTab = tabs.find((t) => t.key === activeTab) ?? tabs[0]
  const allFiltered = locations.filter(currentTab.filterFn)
  const filtered = showAll ? allFiltered : allFiltered.slice(0, 6)

  return (
    <div>
      {/* Tab Bar */}
      <div className="relative">
        <div className="flex overflow-x-auto gap-2 pb-2 mb-8 scrollbar-hide">
          {tabs.map((tab) => {
            const count = locations.filter(tab.filterFn).length
            const active = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setShowAll(false) }}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition shrink-0 ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-foreground hover:border-accent"
                }`}
              >
                {tab.label} ({count})
              </button>
            )
          })}
        </div>
        <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-muted/80 to-transparent pointer-events-none lg:hidden" />
      </div>

      {/* Regional Summary */}
      <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mb-8">
        {currentTab.summary}
      </p>

      {/* Destination Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((location) => (
          <div
            key={location.id}
            className="rounded-xl bg-background border border-border p-6 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-sm">{location.name}</h3>
                <p className="text-xs text-muted-foreground">{location.country}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent-foreground capitalize">
                {location.type}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {location.description}
            </p>
            <Link
              href="#trip-planner"
              className="mt-4 inline-block text-sm font-medium text-primary hover:text-accent transition"
            >
              Plan a Trip &rarr;
            </Link>
          </div>
        ))}
      </div>

      {!showAll && allFiltered.length > 6 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="text-sm font-medium text-primary hover:text-accent transition"
          >
            View all {allFiltered.length} destinations &rarr;
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No destinations found for this category.
        </p>
      )}
    </div>
  )
}
