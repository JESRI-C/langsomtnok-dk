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
import { trackEvent } from "@/lib/analytics";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ProductCard({ product }: { product: ShopifyProduct }) {
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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    trackEvent('add_to_cart_product_card', { product_id: node.id, product_title: node.title });
    toast.success("Tilføjet med ro.", { description: node.title, position: "top-center" });
  };

  return (
    <Link to="/product/$handle" params={{ handle: node.handle }} className="group block">
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
      </div>
      <div className="space-y-1">
        {node.productType && (
          <span className="text-[10px] font-medium text-copper uppercase tracking-wider">{node.productType}</span>
        )}
        <h3 className="font-serif text-base leading-tight group-hover:text-walnut transition-colors">{node.title}</h3>
        
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium">{formatPrice(price.amount, price.currencyCode)}</span>
            {isOnSale && product.node.compareAtPriceRange?.minVariantPrice && (
              <span className="text-xs text-muted-foreground/50 line-through">
                {formatPrice(product.node.compareAtPriceRange.minVariantPrice.amount, product.node.compareAtPriceRange.minVariantPrice.currencyCode)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isLoading || !variant?.availableForSale}
            className="text-xs font-medium text-cta hover:text-cta/80 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : !variant?.availableForSale ? "Udsolgt" : "Tilføj til ritualet"}
          </button>
        </div>
      </div>
    </Link>
  );
}
