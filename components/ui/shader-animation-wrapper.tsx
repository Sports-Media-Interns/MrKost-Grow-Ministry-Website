"use client"

import { useState, useEffect } from "react"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { ShaderAnimation } from "@/components/ui/shader-animation"

export function ShaderAnimationWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="absolute inset-0 w-full h-full bg-black" />
  }

  return (
    <ErrorBoundary
      fallback={<div className="absolute inset-0 w-full h-full bg-black" />}
    >
      <ShaderAnimation />
    </ErrorBoundary>
  )
}
