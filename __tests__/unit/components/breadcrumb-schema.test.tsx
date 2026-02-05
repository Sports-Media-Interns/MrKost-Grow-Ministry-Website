import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"

describe("BreadcrumbSchema", () => {
  it("renders a script tag with JSON-LD breadcrumb data", () => {
    const { container } = render(
      <BreadcrumbSchema
        items={[{ name: "Services", url: "https://growministry.com/services" }]}
      />
    )
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeTruthy()

    const data = JSON.parse(script!.textContent || "")
    expect(data["@context"]).toBe("https://schema.org")
    expect(data["@type"]).toBe("BreadcrumbList")
  })

  it("always includes Home as position 1", () => {
    const { container } = render(
      <BreadcrumbSchema
        items={[{ name: "About", url: "https://growministry.com/about" }]}
      />
    )
    const data = JSON.parse(
      container.querySelector("script")!.textContent || ""
    )
    const home = data.itemListElement[0]
    expect(home.position).toBe(1)
    expect(home.name).toBe("Home")
    expect(home.item).toBe("https://growministry.com")
  })

  it("positions items starting at 2", () => {
    const { container } = render(
      <BreadcrumbSchema
        items={[
          { name: "Services", url: "https://growministry.com/services" },
          { name: "CRM", url: "https://growministry.com/services#crm" },
        ]}
      />
    )
    const data = JSON.parse(
      container.querySelector("script")!.textContent || ""
    )
    expect(data.itemListElement).toHaveLength(3)
    expect(data.itemListElement[1].position).toBe(2)
    expect(data.itemListElement[1].name).toBe("Services")
    expect(data.itemListElement[2].position).toBe(3)
    expect(data.itemListElement[2].name).toBe("CRM")
  })

  it("renders correct structure with single item", () => {
    const { container } = render(
      <BreadcrumbSchema
        items={[{ name: "FAQ", url: "https://growministry.com/faq" }]}
      />
    )
    const data = JSON.parse(
      container.querySelector("script")!.textContent || ""
    )
    expect(data.itemListElement).toHaveLength(2)
    expect(data.itemListElement[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "FAQ",
      item: "https://growministry.com/faq",
    })
  })

  it("handles empty items array with just Home", () => {
    const { container } = render(<BreadcrumbSchema items={[]} />)
    const data = JSON.parse(
      container.querySelector("script")!.textContent || ""
    )
    expect(data.itemListElement).toHaveLength(1)
    expect(data.itemListElement[0].name).toBe("Home")
  })
})
