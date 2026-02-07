"use client"

import { useState, useEffect, useRef } from "react"
import { ErrorBoundary } from "@/components/ui/error-boundary"

// ---- Exported types ----

export interface TravelLocation {
  id: string
  name: string
  description: string
  coordinates: [number, number] // [lat, lng]
  type: "mission" | "pilgrimage" | "retreat" | "workshop"
  country: string
}

// ---- Map constants ----

const typeColors: Record<TravelLocation["type"], string> = {
  mission: "#e74c3c",
  pilgrimage: "#f39c12",
  retreat: "#27ae60",
  workshop: "#3498db",
}

const typeLabels: Record<TravelLocation["type"], string> = {
  mission: "Mission Trip",
  pilgrimage: "Pilgrimage",
  retreat: "Retreat",
  workshop: "Workshop",
}

/** Escape HTML special characters to prevent XSS. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// Region center coordinates for fly-to animations
const regionCenters: Record<string, { center: [number, number]; zoom: number }> = {
  "all": { center: [10, 20], zoom: 1.5 },
  "holy-land": { center: [35.5, 31.5], zoom: 5 },
  "latin-america": { center: [-80, 15], zoom: 3.5 },
  "africa": { center: [35, 0], zoom: 3.5 },
  "asia": { center: [100, 15], zoom: 3.5 },
  "united-states": { center: [-98, 38], zoom: 3.5 },
  "retreats": { center: [-105, 40], zoom: 3.5 },
  "europe": { center: [5, 45], zoom: 4 },
}

const MAPBOX_CDN = "https://api.mapbox.com/mapbox-gl-js/v3.18.1/mapbox-gl.js"

/** Load mapbox-gl from CDN to bypass webpack bundling issues */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadMapboxGL(): Promise<any> {
  return new Promise((resolve, reject) => {
    // Already loaded
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).mapboxgl) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve((window as any).mapboxgl)
      return
    }
    // Check if script is already loading
    const existing = document.querySelector(`script[src="${MAPBOX_CDN}"]`) as HTMLScriptElement | null
    if (existing) {
      // If script already loaded, resolve immediately
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).mapboxgl) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolve((window as any).mapboxgl)
        return
      }
      existing.addEventListener("load", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolve((window as any).mapboxgl)
      })
      existing.addEventListener("error", () => reject(new Error("Failed to load Mapbox GL JS")))
      return
    }
    const script = document.createElement("script")
    script.src = MAPBOX_CDN
    script.async = true
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve((window as any).mapboxgl)
    }
    script.onerror = () => reject(new Error("Failed to load Mapbox GL JS"))
    document.head.appendChild(script)
  })
}

// ---- Inner map component (merged from travel-map.tsx to prevent Sentry
//      webpack chunk corruption — a separate "use client" file gets its own
//      chunk which Sentry's withSentryConfig wrapper corrupts) ----

function TravelMap({ locations }: { locations: TravelLocation[] }) {
  const mapContainer = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = useRef<any>(null)
  // Track click popup to remove before creating a new one (prevents leak)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clickPopup = useRef<any>(null)

  // Listen for region change events from DestinationTabs
  useEffect(() => {
    const handleRegionChange = (e: CustomEvent<{ region: string }>) => {
      if (!map.current) return
      const region = e.detail.region
      const target = regionCenters[region] || regionCenters["all"]
      map.current.flyTo({
        center: target.center,
        zoom: target.zoom,
        duration: 1500,
      })
    }

    window.addEventListener("travelRegionChange", handleRegionChange as EventListener)
    return () => window.removeEventListener("travelRegionChange", handleRegionChange as EventListener)
  }, [])

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    let cancelled = false

    async function initMap() {
      const mapboxgl = await loadMapboxGL()
      const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      if (!token) {
        console.warn("[TravelMap] NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not set — map will not load")
        return
      }
      mapboxgl.accessToken = token

      if (cancelled || !mapContainer.current) return

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [10, 20],
        zoom: 1.5,
        scrollZoom: false,
        projection: "globe",
      })

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

      map.current.on("style.load", () => {
        const m = map.current
        if (!m) return

        m.setFog({
          color: "rgb(186, 210, 235)",
          "high-color": "rgb(36, 92, 223)",
          "horizon-blend": 0.02,
          "space-color": "rgb(11, 11, 25)",
          "star-intensity": 0.6,
        })

        m.addSource("locations", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: locations.map((loc) => ({
              type: "Feature" as const,
              geometry: {
                type: "Point" as const,
                coordinates: [loc.coordinates[1], loc.coordinates[0]],
              },
              properties: {
                id: loc.id,
                name: loc.name,
                description: loc.description,
                type: loc.type,
                country: loc.country,
              },
            })),
          },
        })

        m.addLayer({
          id: "location-dots-shadow",
          type: "circle",
          source: "locations",
          paint: {
            "circle-radius": 10,
            "circle-color": "rgba(0,0,0,0.18)",
            "circle-blur": 0.8,
            "circle-translate": [0, 1],
          },
        })

        m.addLayer({
          id: "location-dots",
          type: "circle",
          source: "locations",
          paint: {
            "circle-radius": 7,
            "circle-color": [
              "match",
              ["get", "type"],
              "mission", "#e74c3c",
              "pilgrimage", "#f39c12",
              "retreat", "#27ae60",
              "workshop", "#3498db",
              "#999",
            ],
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 2.5,
          },
        })

        // Hover tooltip
        const hoverPopup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 15,
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        m.on("mouseenter", "location-dots", (e: any) => {
          m.getCanvas().style.cursor = "pointer"
          if (!e.features || e.features.length === 0) return
          const feature = e.features[0]
          const coords = feature.geometry.coordinates.slice() as [number, number]
          const name = escapeHtml(feature.properties?.name || "")
          const type = feature.properties?.type as TravelLocation["type"]
          const color = typeColors[type] || "#999"
          const label = escapeHtml(typeLabels[type] || "")

          hoverPopup
            .setLngLat(coords)
            .setHTML(
              `<div style="font-family:system-ui,sans-serif;padding:2px 0;">` +
              `<strong style="font-size:13px;">${name}</strong>` +
              `<span style="display:block;font-size:11px;color:${color};margin-top:2px;">${label}</span>` +
              `</div>`
            )
            .addTo(m)
        })

        m.on("mouseleave", "location-dots", () => {
          m.getCanvas().style.cursor = ""
          hoverPopup.remove()
        })

        // Click: fly-to + detail popup
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        m.on("click", "location-dots", (e: any) => {
          if (!e.features || e.features.length === 0) return
          const feature = e.features[0]
          const coords = feature.geometry.coordinates.slice() as [number, number]
          const props = feature.properties!
          const name = escapeHtml(props.name || "")
          const country = escapeHtml(props.country || "")
          const description = escapeHtml(props.description || "")
          const type = props.type as TravelLocation["type"]
          const color = typeColors[type] || "#999"
          const label = escapeHtml(typeLabels[type] || "")

          m.flyTo({ center: coords, zoom: 5, duration: 1200 })

          // Remove previous click popup to prevent leaked instances
          clickPopup.current?.remove()

          clickPopup.current = new mapboxgl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: true,
            maxWidth: "300px",
            focusAfterOpen: false,
          })
            .setLngLat(coords)
            .setHTML(
              `<div style="font-family:system-ui,sans-serif;padding:4px 0;">` +
              `<h3 style="font-weight:600;font-size:15px;margin:0 0 4px 0;">${name}</h3>` +
              `<p style="font-size:12px;color:#666;margin:0 0 6px 0;">${country}</p>` +
              `<p style="font-size:13px;margin:0 0 10px 0;line-height:1.5;">${description}</p>` +
              `<span style="display:inline-block;font-size:11px;padding:2px 8px;border-radius:999px;background:${color}20;color:${color};font-weight:500;margin-bottom:8px;">` +
              `${label}</span><br/>` +
              `<a href="#trip-planner" style="display:inline-block;margin-top:6px;font-size:13px;font-weight:500;color:#161821;text-decoration:none;">` +
              `Plan a Trip &rarr;</a></div>`
            )
            .addTo(m)
        })
      })
    }

    initMap().catch((err) => {
      console.error("[TravelMap] Failed to initialize map:", err)
    })

    return () => {
      cancelled = true
      map.current?.remove()
      map.current = null
    }
  }, [locations])

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div ref={mapContainer} className="h-[700px] w-full z-0" role="application" aria-label="Interactive map showing travel destinations" />
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg border border-border p-3 z-10">
        <p className="text-xs font-semibold mb-2">Trip Types</p>
        <div className="space-y-1.5">
          {Object.entries(typeLabels).map(([type, label]) => (
            <div key={type} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: typeColors[type as TravelLocation["type"]] }}
              />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---- Exported wrapper ----

export function TravelMapWrapper({ locations }: { locations: TravelLocation[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Preconnect to Mapbox CDN to save ~100-300ms on first load
    const preconnectId = "mapbox-preconnect"
    if (!document.getElementById(preconnectId)) {
      const preconnect = document.createElement("link")
      preconnect.id = preconnectId
      preconnect.rel = "preconnect"
      preconnect.href = "https://api.mapbox.com"
      preconnect.crossOrigin = "anonymous"
      document.head.appendChild(preconnect)
    }

    // Inject Mapbox CSS when this component mounts (travel page only)
    const cssId = "mapbox-gl-css"
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link")
      link.id = cssId
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
