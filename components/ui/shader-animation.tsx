"use client"

import { useEffect, useRef } from "react"

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationIdRef = useRef(0)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let cancelled = false

    // Track mutable resources for cleanup (assigned inside async init)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let renderer: any = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let geometry: any = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let material: any = null
    let observer: IntersectionObserver | null = null
    let onResize: (() => void) | null = null

    async function init() {
      // Dynamic import with destructuring - only loads client-side (useEffect never
      // runs on server). Destructured imports enable webpack tree-shaking, reducing
      // the Three.js chunk from ~600KB to ~50-80KB.
      const { OrthographicCamera, Scene, PlaneGeometry, ShaderMaterial, Mesh, WebGLRenderer, Vector2 } = await import("three")
      if (cancelled || !container) return

      // Vertex shader
      const vertexShader = `
        void main() {
          gl_Position = vec4( position, 1.0 );
        }
      `

      // Fragment shader
      const fragmentShader = `
        #define TWO_PI 6.2831853072
        #define PI 3.14159265359

        precision highp float;
        uniform vec2 resolution;
        uniform float time;

        void main(void) {
          vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
          float t = time*0.05;
          float lineWidth = 0.002;

          vec3 color = vec3(0.0);
          for(int j = 0; j < 3; j++){
            for(int i=0; i < 5; i++){
              color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
            }
          }

          gl_FragColor = vec4(color[0],color[1],color[2],1.0);
        }
      `

      // Initialize Three.js scene
      const camera = new OrthographicCamera(-1, 1, 1, -1, -1, 1)

      const scene = new Scene()
      geometry = new PlaneGeometry(2, 2)

      const uniforms = {
        time: { value: 1.0 },
        resolution: { value: new Vector2() },
      }

      material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      })

      const mesh = new Mesh(geometry, material)
      scene.add(mesh)

      try {
        renderer = new WebGLRenderer({ antialias: false, powerPreference: "low-power" })
      } catch {
        // WebGL not supported -- silently fail, container keeps its black background
        return
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      container.appendChild(renderer.domElement)

      // Handle window resize
      onResize = () => {
        const width = container.clientWidth
        const height = container.clientHeight
        renderer.setSize(width, height)
        uniforms.resolution.value.x = renderer.domElement.width
        uniforms.resolution.value.y = renderer.domElement.height
      }

      // Initial resize
      onResize()
      window.addEventListener("resize", onResize, false)

      // Check prefers-reduced-motion -- render a single frame instead of animating
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      // If user prefers reduced motion, render one frame and stop
      if (prefersReducedMotion) {
        uniforms.time.value = 2.0
        renderer.render(scene, camera)
        return
      }

      // Track visibility to pause animation when off-screen
      let isVisible = true

      // Animation loop
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate)
        if (isVisible) {
          uniforms.time.value += 0.05
          renderer.render(scene, camera)
        }
      }

      // Use IntersectionObserver to pause when scrolled out of viewport
      observer = new IntersectionObserver(
        ([entry]) => { isVisible = entry.isIntersecting },
        { threshold: 0 }
      )
      observer.observe(container)

      // Start animation
      animate()
    }

    init()

    // Cleanup function
    return () => {
      cancelled = true
      cancelAnimationFrame(animationIdRef.current)
      if (onResize) window.removeEventListener("resize", onResize)
      if (observer) observer.disconnect()

      if (container && renderer?.domElement) {
        container.removeChild(renderer.domElement)
      }

      renderer?.dispose()
      geometry?.dispose()
      material?.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full"
      style={{
        background: "#000",
        overflow: "hidden",
      }}
    />
  )
}
