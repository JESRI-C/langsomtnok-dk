import { useEffect, useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  fetchProductsByHandles,
  formatPrice,
  type ShopifyProduct,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { trackAddToCart, trackEvent } from "@/lib/analytics";
import { CTATrust } from "./CTATrust";

interface HeroOfferProps {
  handle?: string;
  eyebrow?: string;
  headline?: string;
  body?: string;
  ctaLabel?: string;
}

/**
 * HeroOffer — calm, editorial hero promoting a single Shopify product.
 * Pulls live product, price, stock + image. No discount language.
 *
 * Events:
 *   • hero_offer_view       — once on first mount with product
 *   • hero_offer_cta_click  — on add-to-cart
 */
export function HeroOffer({
  handle = "magnetic-knife-display-stand-walnut",
  eyebrow = "Et roligere køkken",
  headline = "Få knivene væk fra skuffen — uden boremaskine.",
  body = "En magnetisk knivholder i massiv valnød. Står stille på bordet, holder knivene synlige og sikre — og kræver hverken bor, skruer eller værktøj.",
  ctaLabel = "Læg knivholder i kurv",
}: HeroOfferProps) {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const isLoading = useCartStore((s) => s.isLoading);
  const viewedRef = useRef(false);

  useEffect(() => {
    fetchProductsByHandles([handle]).then((list) => {
      if (list[0]) setProduct(list[0]);
    });
  }, [handle]);

  useEffect(() => {
    if (product && !viewedRef.current) {
      viewedRef.current = true;
      trackEvent("hero_offer_view", {
        product_id: product.node.id,
        product_title: product.node.title,
        handle: product.node.handle,
      });
    }
  }, [product]);

  if (!product) return null;
  const { node } = product;
  const variant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const inStock = variant?.availableForSale ?? false;

  const handleAdd = async () => {
    if (!variant) return;
    trackEvent("hero_offer_cta_click", {
      product_id: node.id,
      product_title: node.title,
      handle: node.handle,
    });
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    trackAddToCart({
      product_id: node.id,
      product_title: node.title,
      variant_id: variant.id,
      price: parseFloat(variant.price.amount),
      currency: variant.price.currencyCode,
      quantity: 1,
      product_type: node.productType,
    });
    toast.success("Tilføjet med ro.", { description: node.title, position: "top-center" });
    setOpen(true);
  };

  return (
    <section
      className="section-padding bg-linen/40"
      data-block="hero-offer"
      data-product-handle={node.handle}
    >
      <div className="container-calm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 md:order-1">
            <span className="text-[11px] tracking-[0.25em] uppercase text-copper">{eyebrow}</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-3 mb-5 leading-[1.1]">
              {headline}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">{body}</p>

            <div className="flex items-baseline gap-3 mb-5">
              <span className="font-serif text-2xl md:text-3xl text-foreground">
                {formatPrice(price.amount, price.currencyCode)}
              </span>
              <span
                className={`text-xs tracking-wide ${
                  inStock ? "text-cta" : "text-muted-foreground"
                }`}
              >
                {inStock ? "På lager" : "Udsolgt — vender tilbage"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={handleAdd}
                disabled={!inStock || isLoading}
                className="btn-cta inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {ctaLabel}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <Link
                to="/products/$handle"
                params={{ handle: node.handle }}
                className="btn-outline-calm inline-flex items-center justify-center"
              >
                Se detaljer
              </Link>
            </div>

            <CTATrust className="mt-4" />
          </div>

          <div className="order-1 md:order-2">
            <div className="overflow-hidden rounded-xl bg-soft aspect-[4/5]">
              {image && (
                <img
                  src={image.url}
                  alt={image.altText ?? node.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
