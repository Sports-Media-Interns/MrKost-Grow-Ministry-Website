"use client"

import dynamic from "next/dynamic"

const ShaderAnimation = dynamic(
  () => import("@/components/ui/shader-animation").then((mod) => mod.ShaderAnimation),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-black" />
    ),
  }
)

export function ShaderAnimationWrapper() {
  return <ShaderAnimation />
}
