"use client"

import { useState } from "react"
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
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
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition"
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
            className="md:hidden text-foreground"
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
        <div id="mobile-menu" className="md:hidden bg-background border-b border-border">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map(({ text, href }) => (
              <Link
                key={text}
                href={href}
                className="block text-sm font-medium text-foreground/70 hover:text-foreground transition"
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
