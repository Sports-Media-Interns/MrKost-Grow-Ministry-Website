"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import { ErrorBoundary } from "@/components/ui/error-boundary"
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
  // Lazy-load Mapbox CSS only when this component mounts (travel page only)
  useEffect(() => {
    const id = "mapbox-gl-css"
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href = "https://api.mapbox.com/mapbox-gl-js/v3.18.1/mapbox-gl.css"
    document.head.appendChild(link)
  }, [])

  return (
    <ErrorBoundary
      fallback={
        <div className="h-[500px] w-full rounded-xl bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Map could not be loaded. Please refresh the page.</p>
        </div>
      }
    >
      <TravelMap locations={locations} />
    </ErrorBoundary>
  )
}
