import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { fetchProductsByQuery, type ShopifyProduct } from "@/lib/shopify";
import { trackEvent } from "@/lib/analytics";

interface Props {
  title?: string;
  query?: string;
  limit?: number;
  ctaLabel?: string;
}

export function RelatedRitualProducts({
  title = "Det hører til ritualet",
  query,
  limit = 4,
  ctaLabel = "Se ritualet",
}: Props) {
  const [products, setProducts] = useState<ShopifyProduct[] | null>(null);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      return;
    }
    let cancelled = false;
    fetchProductsByQuery(query, limit)
      .then((res) => {
        if (!cancelled) setProducts(res ?? []);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [query, limit]);

  if (!query) return null;

  return (
    <section
      className="py-16 md:py-20 bg-soft"
      data-block="related-ritual-products"
      onClick={() => trackEvent("related_products_click")}
    >
      <div className="container-calm">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <span className="text-[10px] font-medium text-copper uppercase tracking-[0.22em]">Ritual</span>
          <h2 className="font-serif text-2xl md:text-3xl mt-3 text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground mt-2">{ctaLabel}.</p>
        </div>

        {products === null ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-lg bg-linen/60 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground/70 text-sm">
            Vi har ingen produkter til dette ritual lige nu.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
            {products.slice(0, limit).map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
