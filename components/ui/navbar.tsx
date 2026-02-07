"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

const navLinks = [
  { text: "Home", href: "/" },
  { text: "Services", href: "/services" },
  { text: "Travel", href: "/travel" },
  { text: "About", href: "/about" },
  { text: "Contact", href: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const closeMenu = useCallback(() => setIsOpen(false), [])

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  // Focus trap + Escape to close for mobile menu
  useEffect(() => {
    if (!isOpen || !menuRef.current) return

    const menu = menuRef.current
    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeMenu()
        toggleRef.current?.focus()
        return
      }
      if (e.key !== "Tab") return

      const focusable = menu.querySelectorAll<HTMLElement>(focusableSelector)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    // Focus first link in menu
    const firstLink = menu.querySelector<HTMLElement>(focusableSelector)
    firstLink?.focus()

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, closeMenu])

  return (
    <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="size-14 rounded-full overflow-hidden shrink-0">
              <Image
                src="/images/grow-ministry-logo.webp"
                alt="Grow Ministry"
                width={80}
                height={80}
                priority
                className="w-full h-full object-cover scale-[1.45]"
              />
            </div>
            <span className="text-lg font-semibold text-foreground font-[family-name:var(--font-playfair)]">
              Grow Ministry
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ text, href }) => (
              <Link
                key={text}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className={`text-sm font-medium transition ${
                  pathname === href
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {text}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={toggleRef}
            className="md:hidden flex items-center justify-center size-11 rounded-lg text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div ref={menuRef} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu" className="md:hidden bg-background border-b border-border">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map(({ text, href }) => (
              <Link
                key={text}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className={`block text-sm font-medium transition ${
                  pathname === href
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {text}
              </Link>
            ))}
            <Link
              href="/contact"
              className="block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground text-center hover:bg-primary/90 transition"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
