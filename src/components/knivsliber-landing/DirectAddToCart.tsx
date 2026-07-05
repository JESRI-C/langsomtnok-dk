/**
 * ============================================================================
 * <DirectAddToCart />
 * ============================================================================
 * Genanvendeligt købskort til de tre post-click landingssider.
 *
 * Ansvar:
 *   1. Henter aktuel pris + lagerstatus fra Shopify Storefront API (live).
 *   2. Tilføjer direkte til Shopify cart via cartStore (Cart API).
 *   3. Åbner den eksisterende cart drawer efter succes (ingen redirect).
 *   4. Sender AddToCart tracking event (GA4 + Meta Pixel + dataLayer).
 *   5. UTM-parametre bevares automatisk via tracking-laget og appendes
 *      til checkoutUrl'en, når brugeren går videre fra drawer.
 *   6. Viser diskret udsolgt-state.
 *   7. Viser varianter diskret hvis produktet har flere end én.
 *
 * Props:
 *   - productHandle     Shopify handle
 *   - variantId         Fuld GraphQL ID (gid://shopify/ProductVariant/…)
 *   - quantity          Startantal (default 1)
 *   - sourcePage        Route-slug — bruges i analytics-payload
 *   - campaignName      Kampagnenavn — bruges i analytics-payload
 * ============================================================================
 */

import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchProductsByHandles,
  formatPrice,
  type ShopifyProduct,
  type ShopifyVariant,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { trackAddToCart, trackEvent } from "@/lib/analytics";

interface Props {
  productHandle: string;
  variantId: string;
  quantity?: number;
  sourcePage: string;
  campaignName: string;
  /** Kompakt variant til sticky bar */
  compact?: boolean;
}

export function DirectAddToCart({
  productHandle,
  variantId,
  quantity: initialQty = 1,
  sourcePage,
  campaignName,
  compact = false,
}: Props) {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState(variantId);
  const [qty, setQty] = useState(initialQty);
  const [justAdded, setJustAdded] = useState(false);
  const isCartLoading = useCartStore((s) => s.isLoading);
  const addItem = useCartStore((s) => s.addItem);

  // Hent live produktdata fra Shopify (pris, varianter, lagerstatus)
  useEffect(() => {
    let cancelled = false;
    setLoadingProduct(true);
    fetchProductsByHandles([productHandle])
      .then((list) => {
        if (cancelled) return;
        setProduct(list[0] ?? null);
      })
      .catch(() => !cancelled && setProduct(null))
      .finally(() => !cancelled && setLoadingProduct(false));
    return () => {
      cancelled = true;
    };
  }, [productHandle]);

  const variants: ShopifyVariant[] = useMemo(
    () => product?.node.variants.edges.map((e) => e.node) ?? [],
    [product],
  );

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId) ?? variants[0] ?? null,
    [variants, selectedVariantId],
  );

  const image = product?.node.images.edges[0]?.node;
  const available = selectedVariant?.availableForSale ?? false;

  const handleAdd = async () => {
    if (!product || !selectedVariant || !available) return;
    trackEvent("landing_page_primary_cta_click", {
      source_page: sourcePage,
      campaign: campaignName,
      variant_id: selectedVariant.id,
    });
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: qty,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    trackAddToCart({
      product_id: product.node.id,
      product_title: product.node.title,
      variant_id: selectedVariant.id,
      variant_title: selectedVariant.title,
      price: parseFloat(selectedVariant.price.amount),
      currency: selectedVariant.price.currencyCode,
      quantity: qty,
      product_type: product.node.productType,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2400);
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loadingProduct) {
    return (
      <div
        className={`rounded-md border border-foreground/10 bg-[#F8F6F3] ${compact ? "p-3" : "p-6"} flex items-center gap-3 text-sm text-foreground/60`}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        Henter aktuelle priser…
      </div>
    );
  }

  if (!product || !selectedVariant) {
    return (
      <div className="rounded-md border border-foreground/10 bg-[#F8F6F3] p-6 text-sm text-foreground/70">
        Produktet er ikke tilgængeligt lige nu.
      </div>
    );
  }

  const priceEl = (
    <div className="flex items-baseline gap-2">
      <span className="text-lg font-medium text-[#2D2D2D]">
        {formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
      </span>
      {selectedVariant.compareAtPrice &&
        parseFloat(selectedVariant.compareAtPrice.amount) >
          parseFloat(selectedVariant.price.amount) && (
          <span className="text-sm text-foreground/50 line-through">
            {formatPrice(
              selectedVariant.compareAtPrice.amount,
              selectedVariant.compareAtPrice.currencyCode,
            )}
          </span>
        )}
    </div>
  );

  // ── Kompakt (sticky mobile bar) ───────────────────────────────────────────
  if (compact) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-[#F8F6F3] border-t border-foreground/10">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-foreground/60 truncate">Knivsliber · Valnød</p>
          {priceEl}
        </div>
        <Button
          variant="commerce"
          size="lg"
          onClick={handleAdd}
          disabled={!available || isCartLoading}
          className="shrink-0"
        >
          {justAdded ? "Tilføjet" : available ? "Tilføj til ritualet" : "Udsolgt"}
        </Button>
      </div>
    );
  }

  // ── Fuldt købskort ────────────────────────────────────────────────────────
  return (
    <div className="rounded-md border border-foreground/10 bg-[#F8F6F3] p-6 space-y-5 shadow-sm">
      <div className="flex gap-4">
        {image && (
          <div className="w-20 h-20 rounded-md overflow-hidden bg-[#E6E0D7] shrink-0">
            <img
              src={image.url}
              alt={image.altText ?? "Knivsliber i valnød"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg leading-tight text-[#2D2D2D]">
            {product.node.title}
          </h3>
          <div className="mt-2">{priceEl}</div>
        </div>
      </div>

      {/* Variantvælger — vises kun ved >1 variant */}
      {variants.length > 1 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.14em] text-foreground/60">
            Variant
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const active = v.id === selectedVariantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    active
                      ? "border-[#4C574A] bg-[#4C574A]/10 text-[#2D2D2D]"
                      : "border-foreground/15 text-foreground/70 hover:border-foreground/40"
                  }`}
                >
                  {v.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Antal */}
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-[0.14em] text-foreground/60">
          Antal
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-8 h-8 rounded-md border border-foreground/15 flex items-center justify-center hover:bg-[#E6E0D7]/60"
            aria-label="Reducér antal"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="w-8 h-8 rounded-md border border-foreground/15 flex items-center justify-center hover:bg-[#E6E0D7]/60"
            aria-label="Øg antal"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primær CTA */}
      <Button
        variant="commerce"
        size="lg"
        onClick={handleAdd}
        disabled={!available || isCartLoading}
        className="w-full"
      >
        {isCartLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Lægger i kurv…
          </>
        ) : justAdded ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Tilføjet til kurven
          </>
        ) : available ? (
          "Tilføj til ritualet"
        ) : (
          "Udsolgt lige nu"
        )}
      </Button>

      <p className="text-xs text-foreground/60 text-center leading-relaxed">
        {justAdded
          ? "Knivsliberen er lagt i kurven."
          : available
            ? "Lægges direkte i din kurv."
            : "Vi giver besked, når den er tilbage."}
      </p>
    </div>
  );
}
