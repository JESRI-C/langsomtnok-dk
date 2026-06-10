/**
 * SHOPIFY CONNECTION: Product card component.
 * - Image, title, price from Shopify Storefront API
 * - Links to /product/{handle} (Shopify product handle)
 * - Add to cart via Storefront Cart API (cartStore)
 * - Compare-at pricing for sale badges
 */

import { Link } from "@tanstack/react-router";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, hasDiscount, getDiscountPercentage, type ShopifyProduct } from "@/lib/shopify";
import { trackEvent, trackAddToCart, trackProductClick } from "@/lib/analytics";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

/** Map produkt-handle/type til en kort, konkret benefit-linje */
function getBenefitLine(handle: string, productType?: string, tags: string[] = []): string | null {
  const h = (handle + " " + (productType || "") + " " + tags.join(" ")).toLowerCase();
  if (/knivholder|magnet/.test(h)) return "Sættes op uden boremaskine";
  if (/slibest|whetstone|sliber/.test(h)) return "Gør dine knive skarpe igen";
  if (/keramik|kop|skål|skaal|ceramic/.test(h)) return "Håndlavet — hvert stykke er unikt";
  if (/kniv|knife/.test(h)) return "Til dig, der vil lave mad med bedre grej";
  if (/gave|gift/.test(h)) return "Udvalgt med omtanke";
  return null;
}

/** Vælger et roligt premium-badge baseret på tags og pris-tier (ingen fake bestseller). */
function getEditorialBadge(handle: string, productType?: string, tags: string[] = []): string | null {
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));
  if (tagSet.has("favorit") || tagSet.has("favourite") || tagSet.has("bestseller")) return "Køkkenfavorit";
  if (tagSet.has("ny") || tagSet.has("new")) return "Ny i sortimentet";
  const h = (handle + " " + (productType || "")).toLowerCase();
  if (/knivholder|magnet/.test(h)) return "Udvalgt af os";
  if (/slibest/.test(h)) return "Mest valgte sammen";
  return null;
}

export function ProductCard({ product, section = "product_grid" }: { product: ShopifyProduct; section?: string }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const { node } = product;
  const variant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const isOnSale = hasDiscount(product);
  const discountPct = getDiscountPercentage(product);
  const tagsLower = (node.tags || []).map((t) => t.toLowerCase());
  const isUnika = tagsLower.includes("unika");
  const isLilleSerie = tagsLower.includes("lille serie") || tagsLower.includes("lille-serie");
  const soldOut = !variant?.availableForSale;
  const soldLabel = isUnika && soldOut ? "Solgt — videre til et nyt hjem" : "Udsolgt";
  const benefit = getBenefitLine(node.handle, node.productType, node.tags);
  const editorialBadge = !isUnika && !isLilleSerie && !isOnSale ? getEditorialBadge(node.handle, node.productType, node.tags) : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    const prevItem = useCartStore.getState().items.find(i => i.variantId === variant.id);
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    // Only fire tracking after confirmed cart update
    const afterItem = useCartStore.getState().items.find(i => i.variantId === variant.id);
    if (afterItem && (!prevItem || afterItem.quantity > prevItem.quantity)) {
      trackAddToCart({
        product_id: node.id,
        product_title: node.title,
        variant_id: variant.id,
        variant_title: variant.title !== 'Default Title' ? variant.title : undefined,
        price: parseFloat(variant.price.amount),
        currency: variant.price.currencyCode,
        quantity: 1,
        product_type: node.productType,
      });
      trackEvent('add_to_cart_product_card', { product_id: node.id, product_title: node.title, section });
    }
    toast.success("Tilføjet med ro.", { description: node.title, position: "top-center" });
  };

  const handleCardClick = () => {
    trackProductClick({
      product_id: node.id,
      product_title: node.title,
      price: parseFloat(price.amount),
      currency: price.currencyCode,
      product_type: node.productType,
      list_name: section,
    });
    trackEvent('product_card_click', { product_id: node.id, product_title: node.title, section });
  };

  return (
    <Link
      to="/products/$handle"
      params={{ handle: node.handle }}
      className="group block rounded-xl border border-border/70 bg-card p-3 lift-on-hover"
      onClick={handleCardClick}
      data-event="product_card_click"
      data-section={section}
      data-target={node.handle}
    >
      <div className="aspect-[4/5] rounded-lg overflow-hidden bg-linen mb-4 relative">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30">
            <span className="font-serif text-lg mb-1">Langsomt Nok</span>
            <span className="text-xs text-copper/50">Billede mangler</span>
          </div>
        )}
        {isOnSale && !soldOut && (
          <span className="absolute top-3 left-3 bg-copper text-cta-foreground text-[10px] font-medium px-2 py-0.5 rounded">
            -{discountPct}%
          </span>
        )}
        {(isUnika || isLilleSerie) && (
          <span className="absolute top-3 right-3 bg-background/85 backdrop-blur-sm text-foreground/70 text-[10px] font-medium tracking-wide px-2 py-0.5 rounded border border-border/40">
            {isUnika ? "Unika" : "Lille serie"}
          </span>
        )}
        {editorialBadge && (
          <span className="absolute top-3 right-3 bg-cta text-cta-foreground text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded">
            {editorialBadge}
          </span>
        )}
        {!soldOut && variant?.availableForSale && (
          <span className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm text-[10px] font-medium text-cta px-2 py-0.5 rounded">
            På lager · Sendes 1-2 dage
          </span>
        )}
      </div>
      <div className="space-y-1.5 px-1 pb-1">
        {node.productType && (
          <span className="text-[10px] font-medium text-copper uppercase tracking-wider">{node.productType}</span>
        )}
        <h3 className="font-serif text-base md:text-lg leading-tight text-foreground group-hover:text-walnut transition-colors">{node.title}</h3>

        {benefit && (
          <p className="text-xs text-muted-foreground leading-snug pt-0.5">{benefit}</p>
        )}

        <div className="flex items-center justify-between pt-2 gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              {parseFloat(price.amount) > 0 ? (
                <span className="text-base font-semibold text-cta">{formatPrice(price.amount, price.currencyCode)}</span>
              ) : (
                <span className="text-xs text-muted-foreground italic">Pris kommer snart</span>
              )}
              {isOnSale && parseFloat(price.amount) > 0 && product.node.compareAtPriceRange?.minVariantPrice && (
                <span className="text-xs text-muted-foreground/60 line-through">
                  {formatPrice(product.node.compareAtPriceRange.minVariantPrice.amount, product.node.compareAtPriceRange.minVariantPrice.currencyCode)}
                </span>
              )}
            </div>
            {isOnSale && discountPct > 0 && (
              <span className="text-[10px] font-semibold text-copper mt-0.5">Spar {discountPct}%</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isLoading || !variant?.availableForSale || parseFloat(price.amount) <= 0}
            className="text-[11px] font-semibold tracking-wide uppercase text-cta-foreground bg-cta hover:bg-cta-hover transition-colors disabled:opacity-40 px-3 py-2 rounded-md whitespace-nowrap"
            data-event="add_to_cart_click"
            data-section={section}
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : parseFloat(price.amount) <= 0 ? "På vej" : soldOut ? soldLabel : "Tilføj til ritualet"}
          </button>
        </div>
      </div>
    </Link>
  );
}
