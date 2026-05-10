import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ImageSlot } from "@/components/ImageSlot";

interface EmptyProductsFallbackProps {
  title?: string;
  subtitle?: string;
  body?: string;
  ctaLabel?: string;
  ctaTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  imageSlot?: { name: string; motif: string; src?: string };
  trackingPage?: string;
  trackingCategory?: string;
}

/**
 * Calm fallback used when a product grid would otherwise be empty.
 * Keeps the page useful, on-brand and never shows an empty grid.
 */
export function EmptyProductsFallback({
  title = "Et håndlavet udvalg på vej",
  subtitle = "Kuratet i ro",
  body = "Vi tilføjer nye stykker, efterhånden som de forlader værkstedet. Skriv dig op til Langsomt Brev — så hører du, når næste batch er klar.",
  ctaLabel = "Se udvalget",
  ctaTo = "/collections/all",
  secondaryLabel = "Se gaver med ro",
  secondaryTo = "/pages/gaver-med-ro",
  imageSlot,
  trackingPage = "",
  trackingCategory = "ceramics",
}: EmptyProductsFallbackProps) {
  return (
    <section className="section-padding bg-soft" data-block="empty-products-fallback">
      <div className="container-calm max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {imageSlot && (
            <ImageSlot
              name={imageSlot.name}
              ratio="4/5"
              motif={imageSlot.motif}
              src={imageSlot.src}
              variant="warm"
            />
          )}
          <div className={imageSlot ? "" : "md:col-span-2 text-center mx-auto max-w-xl"}>
            <span className="text-[10px] font-medium text-copper uppercase tracking-wider">{subtitle}</span>
            <h2 className="font-serif text-2xl md:text-3xl mt-2 mb-4">{title}</h2>
            <p className="text-muted-foreground text-editorial mb-6">{body}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="cta" size="lg">
                <Link
                  to={ctaTo}
                  className="cta-primary"
                  data-track-event="landing_cta_click"
                  data-track-page={trackingPage}
                  data-track-intent="view_products"
                  data-track-product-category={trackingCategory}
                >
                  {ctaLabel}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link
                  to={secondaryTo}
                  className="cta-secondary"
                  data-track-event="landing_cta_click"
                  data-track-page={trackingPage}
                  data-track-intent="explore_related"
                  data-track-product-category={trackingCategory}
                >
                  {secondaryLabel}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
