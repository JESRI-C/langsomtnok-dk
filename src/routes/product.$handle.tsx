/**
 * ============================================================================
 * PRODUCT DETAIL PAGE — /product/{handle}
 * ============================================================================
 * Fetches product from Shopify Storefront API and parses the structured
 * descriptionHtml into editorial sections: story, fit, materials, care, FAQ.
 * ============================================================================
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { ProductFitSection } from "@/components/ProductFitSection";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { TrustBar } from "@/components/landing/TrustBar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCartStore } from "@/stores/cartStore";
import {
  storefrontApiRequest,
  PRODUCT_BY_HANDLE_QUERY,
  formatPrice,
  hasDiscount,
  getDiscountPercentage,
  fetchProductRecommendations,
  type ShopifyProduct,
  type ShopifyMetafield,
} from "@/lib/shopify";
import { parseProductDescription, type ParsedSection } from "@/lib/parse-product-description";
import { trackEvent } from "@/lib/analytics";
import { Loader2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.handle} — Langsomt Nok` },
    ],
  }),
  component: ProductPage,
});

interface ProductNode {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  handle: string;
  productType: string;
  vendor?: string;
  tags: string[];
  seo?: { title: string | null; description: string | null };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string }; maxVariantPrice?: { amount: string; currencyCode: string } };
  compareAtPriceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string; altText: string | null; width?: number; height?: number } }> };
  variants: { edges: Array<{ node: { id: string; title: string; price: { amount: string; currencyCode: string }; compareAtPrice?: { amount: string; currencyCode: string } | null; availableForSale: boolean; quantityAvailable?: number; sku?: string; selectedOptions: Array<{ name: string; value: string }> } }> };
  options: Array<{ id?: string; name: string; values: string[] }>;
  metafields?: ShopifyMetafield[] | null;
}

function ProductPage() {
  const { handle } = Route.useParams();
  const [product, setProduct] = useState<ProductNode | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    setLoading(true);
    setSelectedImage(0);
    setSelectedVariantIdx(0);
    setQuantity(1);
    storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle })
      .then((data) => {
        const p = data?.data?.productByHandle;
        if (p) {
          setProduct(p);
          fetchProductRecommendations(p.id).then(setRelatedProducts);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) {
    return (
      <div className="pt-24 container-calm min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 container-calm min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl mb-2">Produkt ikke fundet</h1>
          <Link to="/shop" className="text-cta text-sm">← Tilbage til shop</Link>
        </div>
      </div>
    );
  }

  const variant = product.variants.edges[selectedVariantIdx]?.node;
  const images = product.images.edges;
  const hasMultipleVariants = product.variants.edges.length > 1 && product.variants.edges[0].node.title !== "Default Title";

  // Parse structured description from Shopify HTML
  const parsed = parseProductDescription(product.descriptionHtml || "");

  const shopifyProduct: ShopifyProduct = {
    node: {
      id: product.id,
      title: product.title,
      description: product.description,
      handle: product.handle,
      productType: product.productType,
      tags: product.tags,
      priceRange: product.priceRange,
      compareAtPriceRange: product.compareAtPriceRange,
      images: product.images,
      variants: product.variants,
      options: product.options,
    }
  };
  const isOnSale = hasDiscount(shopifyProduct);
  const discountPct = getDiscountPercentage(shopifyProduct);

  const handleAddToCart = async () => {
    if (!variant) return;
    await addItem({
      product: shopifyProduct,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions || [],
    });
    trackEvent('add_to_cart_product_page', { product_id: product.id, product_title: product.title });
    toast.success("Tilføjet med ro.", { description: product.title, position: "top-center" });
  };

  // Determine doubt CTA based on product type
  const doubtCta = product.productType === "The Chef Line"
    ? { label: "Se slibesten og pleje", to: "/pages/sadan-holder-du-din-kniv-skarp" }
    : product.productType === "The Ritual Set"
    ? { label: "Find din første kniv", to: "/pages/den-forste-rigtige-kokkekniv" }
    : product.productType === "The Calm Kitchen"
    ? { label: "Se knivene", to: "/shop" }
    : { label: "Udforsk ritualerne", to: "/shop" };

  return (
    <div className="pt-24 pb-16">
      <div className="container-calm">
        <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block">
          ← Tilbage til shop
        </Link>

        {/* ── 1. Product Hero: Gallery + Info ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-linen relative">
              {images[selectedImage]?.node ? (
                <img
                  src={images[selectedImage].node.url}
                  alt={images[selectedImage].node.altText || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-soft border border-border/40">
                  <span className="font-serif text-lg text-foreground/15 mb-2">Langsomt Nok</span>
                  <span className="text-[11px] font-mono text-copper/60 bg-copper/5 px-2 py-1 rounded">
                    Billede mangler — indsæt Shopify Files URL
                  </span>
                </div>
              )}
              {isOnSale && (
                <span className="absolute top-4 left-4 bg-copper text-cta-foreground text-xs font-medium px-3 py-1 rounded-md">
                  -{discountPct}%
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      i === selectedImage ? "border-walnut" : "border-transparent hover:border-border"
                    }`}
                  >
                    <img src={img.node.url} alt={img.node.altText || ""} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              {product.productType && (
                <span className="text-xs font-medium text-copper uppercase tracking-wider">
                  {product.productType}
                </span>
              )}
              <h1 className="font-serif text-3xl md:text-4xl mb-3 mt-1">{product.title}</h1>
              {/* Intro from Shopify description */}
              {parsed.intro && (
                <div
                  className="text-muted-foreground leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: parsed.intro }}
                />
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-serif">
                {variant && formatPrice(variant.price.amount, variant.price.currencyCode)}
              </span>
              {variant?.compareAtPrice && parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount) && (
                <span className="text-lg text-muted-foreground/50 line-through">
                  {formatPrice(variant.compareAtPrice.amount, variant.compareAtPrice.currencyCode)}
                </span>
              )}
            </div>

            {/* Variant selector */}
            {hasMultipleVariants && product.options.map((option) => (
              <div key={option.name}>
                <label className="text-sm font-medium mb-2 block">{option.name}</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map((v, i) => {
                    const optionValue = v.node.selectedOptions.find(o => o.name === option.name)?.value;
                    if (!optionValue) return null;
                    const isFirst = product.variants.edges.findIndex(
                      vv => vv.node.selectedOptions.find(o => o.name === option.name)?.value === optionValue
                    ) === i;
                    if (!isFirst) return null;
                    return (
                      <button
                        key={`${option.name}-${optionValue}`}
                        onClick={() => setSelectedVariantIdx(i)}
                        disabled={!v.node.availableForSale}
                        className={`px-4 py-2 rounded-md border text-sm transition-all ${
                          i === selectedVariantIdx
                            ? "border-walnut bg-walnut/5 text-walnut"
                            : "border-border hover:border-walnut/50"
                        } disabled:opacity-30 disabled:cursor-not-allowed`}
                      >
                        {optionValue}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-3 hover:bg-accent transition-colors rounded-l-lg">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-3 min-w-[3rem] text-center text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-3 hover:bg-accent transition-colors rounded-r-lg">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button variant="cta" size="lg" className="flex-1" onClick={handleAddToCart} disabled={isCartLoading || !variant?.availableForSale}>
                {isCartLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : !variant?.availableForSale ? (
                  "Udsolgt"
                ) : (
                  "Tilføj til ritualet"
                )}
              </Button>
            </div>

            {/* Trust line */}
            <p className="text-xs text-muted-foreground text-center italic mt-3">
              Pakket med omhu. Sendes trygt fra Danmark.
            </p>
          </div>
        </div>

        {/* ── 2. Trust Bar ──────────────────────────────────────── */}
        <div className="mt-12">
          <TrustBar />
        </div>

        {/* ── 3–8. All editorial sections from descriptionHtml ── */}
        {parsed.sections.map((section, i) => (
          <EditorialSection
            key={i}
            section={section}
            relatedProducts={section.type === "crossSell" ? relatedProducts : []}
            doubtCta={section.type === "fit" ? doubtCta : undefined}
          />
        ))}

        {/* Related products (if no crossSell section exists) */}
        {!parsed.sections.some(s => s.type === "crossSell") && relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="font-serif text-2xl mb-4">Relaterede produkter</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rp) => (
                <ProductCard key={rp.node.id} product={rp} />
              ))}
            </div>
          </section>
        )}

        {/* ── 9. Final CTA ──────────────────────────────────────── */}
        <section className="mt-20 max-w-3xl">
          <div className="p-8 md:p-10 rounded-lg bg-deep text-center">
            <h2 className="font-serif text-2xl text-deep-foreground mb-3">Begynd med dette ritual</h2>
            <p className="text-sm text-deep-foreground/60 mb-6 max-w-md mx-auto">
              Et godt redskab er begyndelsen. Resten følger naturligt.
            </p>
            <Button variant="cta" size="lg" onClick={handleAddToCart} disabled={isCartLoading || !variant?.availableForSale}>
              {isCartLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : !variant?.availableForSale ? (
                "Udsolgt"
              ) : (
                "Tilføj til ritualet"
              )}
            </Button>
          </div>
        </section>
      </div>

      {/* Sticky mobile CTA */}
      <StickyMobileCTA
        productTitle={product.title}
        price={variant ? formatPrice(variant.price.amount, variant.price.currencyCode) : ''}
        onAddToCart={handleAddToCart}
        isLoading={isCartLoading}
        isAvailable={variant?.availableForSale ?? false}
      />
    </div>
  );
}
