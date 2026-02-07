import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import Loading from "@/app/loading"

describe("Loading", () => {
  it("renders a spinner", () => {
    const { container } = render(<Loading />)
    const spinner = container.querySelector(".animate-spin")
    expect(spinner).toBeTruthy()
  })

  it("displays loading text", () => {
    const { getByText } = render(<Loading />)
    expect(getByText("Loading...")).toBeTruthy()
  })

  it("is centered on the page", () => {
    const { container } = render(<Loading />)
    // Uses <div> (not <main>) since layout.tsx already wraps in <main>
    const wrapper = container.firstElementChild
    expect(wrapper?.className).toContain("flex")
    expect(wrapper?.className).toContain("items-center")
    expect(wrapper?.className).toContain("justify-center")
  })
})
