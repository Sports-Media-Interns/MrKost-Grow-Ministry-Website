import { describe, it, expect, vi, afterEach } from "vitest"
import { render, fireEvent } from "@testing-library/react"
import ErrorPage from "@/app/error"

// Mock next/link
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

describe("Error page", () => {
  const testError = Object.assign(new globalThis.Error("Test error"), {
    digest: "test-digest",
  })
  const mockReset = vi.fn()

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders error heading", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    const { getByText } = render(
      <ErrorPage error={testError} reset={mockReset} />
    )
    expect(getByText("Something went wrong")).toBeTruthy()
  })

  it("renders Oops text", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    const { getByText } = render(
      <ErrorPage error={testError} reset={mockReset} />
    )
    expect(getByText("Oops")).toBeTruthy()
  })

  it("renders Try Again button that calls reset", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    const { getByText } = render(
      <ErrorPage error={testError} reset={mockReset} />
    )
    const btn = getByText("Try Again")
    fireEvent.click(btn)
    expect(mockReset).toHaveBeenCalled()
  })

  it("renders Go Home link", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    const { getByText } = render(
      <ErrorPage error={testError} reset={mockReset} />
    )
    const link = getByText("Go Home")
    expect(link.closest("a")?.getAttribute("href")).toBe("/")
  })

  it("logs error to console on mount", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    render(<ErrorPage error={testError} reset={mockReset} />)
    expect(consoleSpy).toHaveBeenCalledWith(
      "[GrowMinistry] Page error:",
      testError
    )
  })
})
