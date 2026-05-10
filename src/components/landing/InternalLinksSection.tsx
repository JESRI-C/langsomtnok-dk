import { Link } from "@tanstack/react-router";

export interface InternalLink {
  to: string;
  title: string;
  description: string;
  /** tracking metadata */
  category?: string;
}

interface InternalLinksSectionProps {
  page: string; // current page slug, used for tracking
  links: InternalLink[];
  title?: string;
}

/**
 * Calm internal links section — placed near the bottom of landing pages.
 * Helps the visitor continue exploring without commercial pressure.
 */
export function InternalLinksSection({ page, links, title = "Gå videre i roligt tempo" }: InternalLinksSectionProps) {
  if (!links?.length) return null;
  return (
    <section className="section-padding bg-soft" data-block="internal-links">
      <div className="container-calm max-w-5xl">
        <h2 className="font-serif text-2xl md:text-3xl mb-8 text-center">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="cta-secondary group block p-6 rounded-lg border border-border bg-background hover:border-walnut/40 transition-colors"
              data-track-event="landing_internal_link_click"
              data-track-page={page}
              data-track-intent="explore_related"
              data-track-product-category={l.category || "brand_universe"}
            >
              <h3 className="font-serif text-lg mb-2 group-hover:text-walnut transition-colors">{l.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{l.description}</p>
              <span className="text-sm font-medium text-cta">Udforsk →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
