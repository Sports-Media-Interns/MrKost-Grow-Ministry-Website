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
    const main = container.querySelector("main")
    expect(main?.className).toContain("flex")
    expect(main?.className).toContain("items-center")
    expect(main?.className).toContain("justify-center")
  })
})
