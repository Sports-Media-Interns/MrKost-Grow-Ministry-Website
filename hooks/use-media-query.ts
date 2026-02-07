import { useSyncExternalStore } from "react"

function subscribe(query: string, callback: () => void): () => void {
  const media = window.matchMedia(query)
  media.addEventListener("change", callback)
  return () => media.removeEventListener("change", callback)
}

function getSnapshot(query: string): boolean {
  return window.matchMedia(query).matches
}

function getServerSnapshot(): boolean {
  return false
}

export function useMediaQuery(query: string): boolean {
  // useSyncExternalStore avoids hydration mismatch by returning
  // getServerSnapshot during SSR and first client render
  return useSyncExternalStore(
    (callback) => subscribe(query, callback),
    () => getSnapshot(query),
    getServerSnapshot
  )
}
