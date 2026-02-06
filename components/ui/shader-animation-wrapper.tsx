"use client"

import dynamic from "next/dynamic"
import { ErrorBoundary } from "@/components/ui/error-boundary"

const ShaderAnimation = dynamic(
  () => import("@/components/ui/shader-animation").then((mod) => mod.ShaderAnimation),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 w-full h-full bg-black" />
    ),
  }
)

export function ShaderAnimationWrapper() {
  return (
    <ErrorBoundary
      fallback={<div className="absolute inset-0 w-full h-full bg-black" />}
    >
      <ShaderAnimation />
    </ErrorBoundary>
  )
}
