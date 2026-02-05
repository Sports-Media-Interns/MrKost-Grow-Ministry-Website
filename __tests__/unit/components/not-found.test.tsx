import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import NotFound from "@/app/not-found"

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe("NotFound page", () => {
  it("renders 404 text", () => {
    const { getByText } = render(<NotFound />)
    expect(getByText("404")).toBeTruthy()
  })

  it("renders Page Not Found heading", () => {
    const { getByText } = render(<NotFound />)
    expect(getByText("Page Not Found")).toBeTruthy()
  })

  it("renders Go Home link pointing to /", () => {
    const { getByText } = render(<NotFound />)
    const link = getByText("Go Home")
    expect(link.closest("a")?.getAttribute("href")).toBe("/")
  })

  it("renders Contact Us link pointing to /contact", () => {
    const { getByText } = render(<NotFound />)
    const link = getByText("Contact Us")
    expect(link.closest("a")?.getAttribute("href")).toBe("/contact")
  })
})
