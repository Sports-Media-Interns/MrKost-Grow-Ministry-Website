"use client"

import { useEffect, useCallback, type RefObject } from "react"

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Traps keyboard focus within a container when `isActive` is true.
 * Handles Tab/Shift+Tab cycling, Escape to close, and auto-focus on open.
 *
 * @param ref - Ref to the container element
 * @param isActive - Whether the focus trap is currently active
 * @param onClose - Callback invoked when Escape is pressed
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  isActive: boolean,
  onClose: () => void
) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }
      if (e.key === "Tab" && ref.current) {
        const focusable = ref.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClose]
  )

  useEffect(() => {
    if (!isActive) return

    document.addEventListener("keydown", handleKeyDown)

    // Auto-focus first interactive element on open
    const timer = setTimeout(() => {
      ref.current?.querySelector<HTMLElement>("input, button")?.focus()
    }, 0)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, handleKeyDown])
}
