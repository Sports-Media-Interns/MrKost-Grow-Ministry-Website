"use client"

import { useState, useEffect, useRef } from "react"
import { X, Download, Loader2 } from "lucide-react"
import { loadRecaptchaScript, getRecaptchaToken } from "@/lib/recaptcha-client"
import { useFocusTrap } from "@/hooks/use-focus-trap"

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  serviceName: string
  downloadUrl: string
}

export function ServiceModal({ isOpen, onClose, serviceName, downloadUrl }: ServiceModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)

  useFocusTrap(modalRef, isOpen, onClose)

  useEffect(() => {
    if (!isOpen) return
    loadRecaptchaScript()
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const recaptchaToken = await getRecaptchaToken("lead_capture")
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "white_paper_download",
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          source: "service-modal",
          serviceName,
          offer: `${serviceName} White Paper`,
          recaptchaToken,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Submission failed")
      }

      setSubmitted(true)
    } catch (err) {
      console.error("[ServiceModal] Submission error:", err)
      // Still show download on error — don't block the user
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setName("")
    setEmail("")
    setPhone("")
    setSubmitted(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div ref={modalRef} className="relative bg-background rounded-2xl shadow-2xl max-w-md w-full p-8 z-10">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        {!submitted ? (
          <>
            <h3 id="service-modal-title" className="text-xl font-semibold font-[family-name:var(--font-playfair)]">
              Get the {serviceName} White Paper
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your details below to receive instant access to the full document.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="modal-name" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  id="modal-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="modal-email" className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  id="modal-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@church.org"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="modal-phone" className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  id="modal-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary text-primary-foreground py-3 text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Get Access"
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-accent/30 flex items-center justify-center mb-4">
              <Download className="size-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold font-[family-name:var(--font-playfair)]">
              Thank You, {name.split(" ")[0]}!
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your {serviceName} white paper is ready to download.
            </p>
            <a
              href={downloadUrl}
              download
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition"
            >
              <Download className="size-4" />
              Download White Paper
            </a>
            <button
              onClick={handleClose}
              className="mt-3 block mx-auto text-sm text-muted-foreground hover:text-foreground transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
