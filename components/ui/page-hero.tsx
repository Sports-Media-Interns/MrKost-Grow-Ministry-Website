import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children?: React.ReactNode;
}

/**
 * Reusable hero section for inner pages.
 *
 * Renders the centered text overlay (badge, heading, subtitle) that sits on
 * top of the page's background image + color overlay. Wrap it in a `<section>`
 * that also contains the `<Image>` and overlay `<div>` so the layout stays
 * identical to the existing hero sections.
 *
 * @example
 * ```tsx
 * <section className="relative text-primary-foreground py-24 px-4 overflow-hidden">
 *   <Image src="/images/heroes/about-hero.webp" alt="" fill className="object-cover" priority />
 *   <div className="absolute inset-0 bg-primary/75" />
 *   <PageHero badge="About Grow Ministry" title="Empowering Ministries to Thrive" subtitle="..." />
 * </section>
 * ```
 */
export function PageHero({ title, subtitle, badge, children }: PageHeroProps) {
  return (
    <div className="relative mx-auto max-w-screen-xl text-center">
      {badge && (
        <p className="text-sm uppercase tracking-widest text-primary-foreground/50 mb-4">
          {badge}
        </p>
      )}
      <h1
        className={cn(
          "text-4xl md:text-6xl font-semibold tracking-tight",
          "font-[family-name:var(--font-playfair)]"
        )}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-6 text-lg text-primary-foreground/70 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
