import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  fetchProductsByHandles,
  formatPrice,
  type ShopifyProduct,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { trackAddToCart, trackEvent } from "@/lib/analytics";
import { CTATrust } from "./CTATrust";

interface StartRitualetBundleProps {
  handles?: [string, string];
  title?: string;
  subtitle?: string;
  rationale?: string;
}

/**
 * StartRitualetBundle — “Start Ritualet”: a calm two-product bundle that
 * explains why the products belong together. Adds both to cart in one click.
 *
 * Events:
 *   • bundle_view          — once on first mount with both products loaded
 *   • bundle_add_to_cart   — on add-bundle click
 */
export function StartRitualetBundle({
  handles = ["magnetic-knife-display-stand-walnut", "double-sided-whetstone-1000-5000"],
  title = "Start Ritualet",
  subtitle = "To redskaber, der hører sammen — og giver dit køkken ro fra dag ét.",
  rationale = "Den magnetiske knivlist holder knivene synlige og sikre. Slibestenen holder dem skarpe år efter år. Sammen bliver de et stille ritual: orden, omhu og en kniv, der altid er klar til brug.",
}: StartRitualetBundleProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const isLoading = useCartStore((s) => s.isLoading);
  const viewedRef = useRef(false);

  useEffect(() => {
    fetchProductsByHandles(handles).then(setProducts);
  }, [handles]);

  useEffect(() => {
    if (products.length >= 2 && !viewedRef.current) {
      viewedRef.current = true;
      trackEvent("bundle_view", {
        bundle: "start_ritualet",
        handles: products.map((p) => p.node.handle).join(","),
      });
    }
  }, [products]);

  if (products.length < 2) return null;

  const total = products.reduce((sum, p) => {
    const v = p.node.variants.edges[0]?.node;
    return sum + (v ? parseFloat(v.price.amount) : 0);
  }, 0);
  const currency =
    products[0]?.node.variants.edges[0]?.node.price.currencyCode || "DKK";

  const handleAddBundle = async () => {
    trackEvent("bundle_add_to_cart", {
      bundle: "start_ritualet",
      handles: products.map((p) => p.node.handle).join(","),
      value: total,
      currency,
    });
    for (const p of products) {
      const variant = p.node.variants.edges[0]?.node;
      if (!variant || !variant.availableForSale) continue;
      await addItem({
        product: p,
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions || [],
      });
      trackAddToCart({
        product_id: p.node.id,
        product_title: p.node.title,
        variant_id: variant.id,
        price: parseFloat(variant.price.amount),
        currency: variant.price.currencyCode,
        quantity: 1,
        product_type: p.node.productType,
      });
    }
    toast.success("Sættet er lagt i kurven.", {
      description: "Start Ritualet",
      position: "top-center",
    });
    setOpen(true);
  };

  const allAvailable = products.every(
    (p) => p.node.variants.edges[0]?.node.availableForSale,
  );

  return (
    <section
      className="section-padding bg-soft/50"
      data-block="bundle"
      data-bundle="start_ritualet"
    >
      <div className="container-calm max-w-5xl">
        <div className="text-center mb-10">
          <span className="text-[11px] tracking-[0.25em] uppercase text-copper">
            Sæt ritualet sammen
          </span>
          <h2 className="font-serif text-3xl md:text-4xl mt-2 mb-3">{title}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-4 items-center mb-10">
          {products.slice(0, 2).map((p, i) => {
            const v = p.node.variants.edges[0]?.node;
            const img = p.node.images.edges[0]?.node;
            return (
              <Fragment key={p.node.id}>
                {i === 1 && (
                  <div
                    key="plus"
                    className="hidden md:flex items-center justify-center font-serif text-3xl text-walnut/60"
                    aria-hidden
                  >
                    +
                  </div>
                )}
                <div
                  key={p.node.id}
                  className="rounded-xl border border-border/60 bg-background overflow-hidden"
                >
                  <div className="aspect-[4/3] bg-soft overflow-hidden">
                    {img && (
                      <img
                        src={img.url}
                        alt={img.altText ?? p.node.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg mb-1.5">{p.node.title}</h3>
                    {v && (
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(v.price.amount, v.price.currencyCode)}
                      </p>
                    )}
                  </div>
                </div>
              </>
            );
          })}
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-muted-foreground italic leading-relaxed mb-6">
            {rationale}
          </p>
          <div className="flex items-baseline justify-center gap-3 mb-5">
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
              Sættet samlet
            </span>
            <span className="font-serif text-2xl">{formatPrice(total.toString(), currency)}</span>
          </div>
          <button
            onClick={handleAddBundle}
            disabled={!allAvailable || isLoading}
            className="btn-cta inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Læg sættet i kurven"}
          </button>
          <CTATrust className="mt-5 justify-center" />
        </div>
      </div>
    </section>
  );
}
