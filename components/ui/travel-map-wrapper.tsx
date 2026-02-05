"use client"

import dynamic from "next/dynamic"
import type { TravelLocation } from "@/components/ui/travel-map"

const TravelMap = dynamic(
  () => import("@/components/ui/travel-map").then((mod) => mod.TravelMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full rounded-xl bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    ),
  }
)

export function TravelMapWrapper({ locations }: { locations: TravelLocation[] }) {
  return <TravelMap locations={locations} />
}
