"use client"

import { useState, useEffect } from "react"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { TravelMap, type TravelLocation } from "@/components/ui/travel-map"

export function TravelMapWrapper({ locations }: { locations: TravelLocation[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Inject Mapbox CSS when this component mounts (travel page only)
    const id = "mapbox-gl-css"
    if (!document.getElementById(id)) {
      const link = document.createElement("link")
      link.id = id
      link.rel = "stylesheet"
      link.href = "https://api.mapbox.com/mapbox-gl-js/v3.18.1/mapbox-gl.css"
      document.head.appendChild(link)
    }

    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-[700px] w-full rounded-xl bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    )
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="h-[700px] w-full rounded-xl bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Map could not be loaded. Please refresh the page.</p>
        </div>
      }
    >
      <TravelMap locations={locations} />
    </ErrorBoundary>
  )
}
