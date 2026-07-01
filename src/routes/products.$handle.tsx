/**
 * ============================================================================
 * PRODUCT DETAIL PAGE — /product/{handle}
 * ============================================================================
 * Fetches product from Shopify Storefront API and parses the structured
 * descriptionHtml into editorial sections: story, fit, materials, care, FAQ.
 * ============================================================================
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { ProductFitSection } from "@/components/ProductFitSection";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { TrustBar } from "@/components/landing/TrustBar";
import { RitualScoreBadge, RitualScoreAccordion } from "@/components/product/RitualTrustModule";
import { ProductMoodVideo } from "@/components/product/ProductMoodVideo";
import { VideoShowcase } from "@/components/VideoShowcase";
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
import { trackEvent, trackProductView, attachScrollDepthTracker } from "@/lib/analytics";
import DOMPurify from "isomorphic-dompurify";

const sanitizeHtml = (html: string) => DOMPurify.sanitize(html, {
  ALLOWED_TAGS: ["p", "br", "ul", "ol", "li", "strong", "em", "b", "i", "h3", "h4", "a", "span"],
  ALLOWED_ATTR: ["href", "target", "rel"],
});
import { Loader2, Minus, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { CTATrust } from "@/components/landing/CTATrust";
import { MicroTrustBar } from "@/components/product/MicroTrustBar";
import { FounderNote } from "@/components/product/FounderNote";
import { ProductFeatureGrid } from "@/components/product/ProductFeatureGrid";

export const Route = createFileRoute("/products/$handle")({
  head: ({ params }) => {
    const url = `https://langsomtnok.dk/products/${params.handle}`;
    const title = `${params.handle.replace(/-/g, " ")} — Langsomt Nok`;
    return {
      meta: [
        { title },
        { property: "og:title", content: title },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
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
  media?: {
    edges: Array<{
      node: {
        mediaContentType: "IMAGE" | "VIDEO" | "EXTERNAL_VIDEO" | "MODEL_3D";
        alt?: string | null;
        previewImage?: { url: string; altText: string | null } | null;
        sources?: Array<{ url: string; mimeType: string; format?: string }>;
        embedUrl?: string | null;
        host?: "YOUTUBE" | "VIMEO" | null;
      };
    }>;
  };
  variants: { edges: Array<{ node: { id: string; title: string; price: { amount: string; currencyCode: string }; compareAtPrice?: { amount: string; currencyCode: string } | null; availableForSale: boolean; quantityAvailable?: number; sku?: string; selectedOptions: Array<{ name: string; value: string }> } }> };
  options: Array<{ id?: string; name: string; values: string[] }>;
  metafields?: ShopifyMetafield[] | null;
}

/** Renders a single editorial section based on its detected type */
function EditorialSection({
  section,
  relatedProducts = [],
  doubtCta,
}: {
  section: ParsedSection;
  relatedProducts?: ShopifyProduct[];
  doubtCta?: { label: string; to: string };
}) {
  const { heading, content, type, listItems } = section;

  // Skip "Product description" meta-headings
  if (heading.toLowerCase() === "product description" || heading.toLowerCase() === "produktbeskrivelse") {
    return null;
  }

  // FAQ → accordion
  if (type === "faq") {
    const faqs = section.listItems.length > 0 ? [] : [];
    // Re-parse FAQ from content
    const pBlocks = content.split(/<p[^>]*>/i).filter(Boolean);
    const faqItems: Array<{ q: string; a: string }> = [];
    for (const block of pBlocks) {
      const strongMatch = block.match(/<(?:strong|b)>([\s\S]*?)<\/(?:strong|b)>/i);
      if (strongMatch) {
        const q = strongMatch[1].replace(/<[^>]*>/g, "").trim();
        const a = block
          .substring((block.indexOf("</strong>") !== -1 ? block.indexOf("</strong>") + 9 : block.indexOf("</b>") + 4))
          .replace(/<br\s*\/?>/gi, " ").replace(/<\/p>/gi, "").replace(/<[^>]*>/g, "").trim();
        if (q && a) faqItems.push({ q, a });
      }
    }
    if (faqItems.length === 0) return null;
    return (
      <section className="mt-16 max-w-3xl">
        <h2 className="font-serif text-2xl mb-6">{heading}</h2>
        <Accordion type="single" collapsible className="border border-border rounded-lg overflow-hidden">
          {faqItems.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className={i > 0 ? "border-t border-border" : "border-b-0"}>
              <AccordionTrigger className="px-4 text-sm font-medium hover:no-underline">{faq.q}</AccordionTrigger>
              <AccordionContent className="px-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    );
  }

  // Fit → ProductFitSection
  if (type === "fit" && listItems.length > 0 && doubtCta) {
    return <ProductFitSection fitPoints={listItems} doubtCta={doubtCta} />;
  }

  // Materials / specs → table card
  if (type === "materials" && listItems.length > 0) {
    return (
      <section className="mt-16 max-w-3xl">
        <h2 className="font-serif text-2xl mb-6">{heading}</h2>
        <div className="border border-border rounded-lg overflow-hidden">
          {listItems.map((item, i) => {
            const colonIdx = item.indexOf(":");
            const label = colonIdx > -1 ? item.substring(0, colonIdx).trim() : item;
            const value = colonIdx > -1 ? item.substring(colonIdx + 1).trim() : "";
            return (
              <div key={i} className={`flex justify-between py-3 px-4 text-sm ${i % 2 === 0 ? "bg-soft/30" : "bg-transparent"}`}>
                <span className="text-muted-foreground font-medium">{label}</span>
                {value && <span className="text-foreground text-right">{value}</span>}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // Care → calm card
  if (type === "care") {
    return (
      <section className="mt-16 max-w-3xl">
        <div className="p-6 md:p-8 rounded-lg bg-soft/50 border border-border/30">
          <h2 className="font-serif text-2xl mb-4">{heading}</h2>
          <div
            className="text-muted-foreground leading-relaxed text-sm [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
          />
        </div>
      </section>
    );
  }

  // Cross-sell → text + related products grid
  if (type === "crossSell") {
    return (
      <section className="mt-20">
        <h2 className="font-serif text-2xl mb-4">{heading}</h2>
        <div
          className="text-muted-foreground leading-relaxed mb-8 max-w-3xl [&>p]:mb-3"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        />
        {relatedProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rp) => (
              <ProductCard key={rp.node.id} product={rp} />
            ))}
          </div>
        )}
      </section>
    );
  }

  // Generic / story → editorial section with bullet list card if applicable
  if (listItems.length > 0) {
    return (
      <section className="mt-16 max-w-3xl">
        <h2 className="font-serif text-2xl mb-4">{heading}</h2>
        {/* Render prose content before the list */}
        {content.includes("<p") && (
          <div
            className="text-muted-foreground leading-relaxed mb-4 [&>p]:mb-3 [&>p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.replace(/<ul[\s\S]*<\/ul>/gi, "")) }}
          />
        )}
        <div className="p-5 rounded-lg bg-soft/40 border border-border/20">
          <ul className="space-y-2">
            {listItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-copper mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  // Generic prose section
  return (
    <section className="mt-16 max-w-3xl">
      <h2 className="font-serif text-2xl mb-4">{heading}</h2>
      <div
        className="text-muted-foreground leading-relaxed [&>p]:mb-4 [&>p:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      />
    </section>
  );
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
  const scrollCleanupRef = useRef<(() => void) | null>(null);

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
          // Track product view with first available variant data
          const firstVariant = p.variants?.edges?.[0]?.node;
          trackProductView({
            product_id: p.id,
            product_title: p.title,
            variant_id: firstVariant?.id,
            variant_title: firstVariant?.title !== 'Default Title' ? firstVariant?.title : undefined,
            price: parseFloat(firstVariant?.price?.amount ?? p.priceRange?.minVariantPrice?.amount ?? '0'),
            currency: firstVariant?.price?.currencyCode ?? p.priceRange?.minVariantPrice?.currencyCode ?? 'DKK',
            product_type: p.productType,
          });
          scrollCleanupRef.current?.();
          scrollCleanupRef.current = attachScrollDepthTracker();
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    return () => {
      scrollCleanupRef.current?.();
      scrollCleanupRef.current = null;
    };
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

  // Build a unified media gallery: videos (from Shopify Media) first, then images.
  type GalleryItem =
    | { kind: "video"; src: string; mimeType: string; poster?: string; alt?: string }
    | { kind: "image"; url: string; alt?: string };

  const videoMedia = (product.media?.edges ?? [])
    .map((e) => e.node)
    .filter((n) => n.mediaContentType === "VIDEO" && n.sources && n.sources.length > 0);

  const videoItems: GalleryItem[] = videoMedia.map((n) => {
    // Prefer mp4 for broadest browser support
    const mp4 = n.sources!.find((s) => s.mimeType === "video/mp4") ?? n.sources![0];
    return {
      kind: "video",
      src: mp4.url,
      mimeType: mp4.mimeType,
      poster: n.previewImage?.url,
      alt: n.alt || product.title,
    };
  });

  const imageItems: GalleryItem[] = images.map((img) => ({
    kind: "image",
    url: img.node.url,
    alt: img.node.altText || product.title,
  }));

  const galleryItems: GalleryItem[] = [...imageItems, ...videoItems];
  const activeItem = galleryItems[selectedImage];
  const firstVideo = videoItems[0];

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
    const prevCount = useCartStore.getState().items.length;
    await addItem({
      product: shopifyProduct,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions || [],
    });
    // Only fire tracking if cart actually changed (addItem succeeded)
    const newCount = useCartStore.getState().items.length;
    const itemChanged = newCount > prevCount || useCartStore.getState().items.some(i => i.variantId === variant.id);
    if (itemChanged) {
      const { trackAddToCart } = await import('@/lib/analytics');
      trackAddToCart({
        product_id: product.id,
        product_title: product.title,
        variant_id: variant.id,
        variant_title: variant.title !== 'Default Title' ? variant.title : undefined,
        price: parseFloat(variant.price.amount),
        currency: variant.price.currencyCode,
        quantity,
        product_type: product.productType,
      });
      trackEvent('add_to_cart_product_page', { product_id: product.id, product_title: product.title });
    }
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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: images.map((e) => e.node.url),
    sku: variant?.sku || product.handle,
    brand: { "@type": "Brand", name: "Langsomt Nok" },
    url: `https://langsomtnok.dk/products/${product.handle}`,
    offers: {
      "@type": "Offer",
      price: variant?.price?.amount || product.priceRange.minVariantPrice.amount,
      priceCurrency: variant?.price?.currencyCode || product.priceRange.minVariantPrice.currencyCode || "DKK",
      availability: variant?.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://langsomtnok.dk/products/${product.handle}`,
    },
  };

  return (
    <div className="pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="container-calm">
        <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
          ← Tilbage til shop
        </Link>

        <MicroTrustBar />

        {/* ── 1. Product Hero: Gallery + Info ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-linen relative">
              {activeItem?.kind === "video" ? (
                <video
                  key={activeItem.src}
                  src={activeItem.src}
                  poster={activeItem.poster}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover bg-black"
                  aria-label={activeItem.alt}
                />
              ) : activeItem?.kind === "image" ? (
                <img
                  src={activeItem.url}
                  alt={activeItem.alt || product.title}
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
            {galleryItems.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {galleryItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      i === selectedImage ? "border-walnut" : "border-transparent hover:border-border"
                    }`}
                    aria-label={item.kind === "video" ? "Afspil video" : "Vis billede"}
                  >
                    {item.kind === "video" ? (
                      <>
                        {item.poster ? (
                          <img src={item.poster} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-deep" />
                        )}
                        <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </>
                    ) : (
                      <img src={item.url} alt={item.alt || ""} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-5">
            <div>
              {/* Social proof line — above title */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5" aria-label="Kurateret">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-copper text-copper" strokeWidth={0} />
                  ))}
                </div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Udvalgt af Langsomt Nok
                </span>
              </div>

              {product.productType && (
                <span className="text-xs font-medium text-copper uppercase tracking-wider">
                  {product.productType}
                </span>
              )}
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-3 mt-1 leading-[1.1]">
                {product.title}
              </h1>
              {/* Intro from Shopify description — the "hook" */}
              {parsed.intro && (
                <div
                  className="text-base md:text-lg text-muted-foreground leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(parsed.intro) }}
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

            {/* Premium Score badge — direkte under pris, over Add to Cart */}
            <RitualScoreBadge tags={product.tags || []} metafields={product.metafields} />

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

            {/* Stock / dispatch line — subtle urgency, right under CTA */}
            {variant?.availableForSale && (
              <div className="flex items-center gap-2 text-xs text-foreground/70">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cta/40 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cta" />
                </span>
                <span className="font-medium">På lager</span>
                <span className="text-muted-foreground">— sendes fra Danmark i dag ved bestilling før kl. 14</span>
              </div>
            )}

            {/* Compact trust line — direkte under primær CTA */}
            <CTATrust className="mt-1" />
            <p className="text-xs text-muted-foreground mt-2">
              Spørgsmål? Skriv til{" "}
              <a href="mailto:hej@langsomtnok.dk" className="text-cta font-medium hover:text-cta-hover">
                hej@langsomtnok.dk
              </a>
            </p>
            {/* Stort trust-modul flyttet længere ned (RitualScoreAccordion) for at undgå dobbeltarbejde med RitualScoreBadge over Add to Cart. */}


            {/* Fordelspunkter — magnetiske knivholdere */}
            {(/knivholder|magnet/i.test(product.handle) || /knivholder|magnet/i.test(product.title)) && (
              <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-foreground/80">
                {[
                  "Knivene væk fra skuffen",
                  "Mere orden på køkkenbordet",
                  "Sættes op med tape — uden boremaskine",
                  "En rolig opgradering til køkkenet",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="text-cta mt-0.5">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── 1b. Why: fast visual scan of the value proposition ── */}
        <ProductFeatureGrid />

        {/* ── 1c. Founder note — "Udvalgt af Jesper" ── */}
        <FounderNote
          quote={
            /knivholder|magnet/i.test(product.handle) || /knivholder|magnet/i.test(product.title)
              ? "Jeg valgte den her, fordi den giver knivene et fast sted at bo — væk fra skuffen, tæt på hånden. Det er den mindste ændring i køkkenet, der giver den største ro."
              : "Jeg valgte den her, fordi den holder til hverdag efter hverdag — uden at råbe. Præcis det redskab et roligt køkken har brug for."
          }
          productType={product.productType}
        />

        {/* ── 2. Product mood video — stort, roligt produktudtryk (når der findes en video) ── */}
        <ProductMoodVideo
          tags={product.tags || []}
          productType={product.productType}
          metafields={product.metafields}
          videoUrl={firstVideo && firstVideo.kind === "video" ? firstVideo.src : undefined}
          posterUrl={firstVideo && firstVideo.kind === "video" ? firstVideo.poster : undefined}
        />


        {/* ── 3. Video: Så nemt sættes den op (kun magnetiske knivholdere) ── */}
        {(product.productType === "The Calm Kitchen" ||
          /knivholder|magnet/i.test(product.handle) ||
          /knivholder|magnet/i.test(product.title)) && (
          <div className="mt-16 md:mt-20 -mx-6 md:-mx-10">
            <VideoShowcase
              eyebrow="Montering"
              title="Sat op på under 5 minutter — uden boremaskine."
              body="Den dobbeltklæbende 3M-tape følger med. Du behøver kun et vaterpas og rene hænder."
              steps={[
                "Tør væggen af med en let fugtig klud.",
                "Mærk op med vaterpas, og træk beskyttelsesfilmen af tapen.",
                "Tryk holderen fast i 30 sekunder — lad sidde i 1 time før knivene sættes op.",
              ]}
              trustNote="Tape følger med · Ingen skruer · Ingen boremaskine"
              background="soft"
              videoSide="left"
              compact
            />
          </div>
        )}

        {/* ── 4. “Hvorfor vi har valgt den” — samlet kurateret panel ── */}
        <RitualScoreAccordion tags={product.tags || []} metafields={product.metafields} />

        {/* ── 5. Om produktet + andre editorial sections (filtreret for dubletter) ── */}
        {(() => {
          // Filtrér sektioner, der dubleret indholdet i det samlede panel ovenfor.
          // Vi beholder fit, materials, faq, crossSell, story og generisk indhold,
          // men fjerner standalone Care/Brug- og Score-/Jesper-/Tryghed-sektioner.
          const DUPLICATE_HEADING =
            /(^|\s)(care\s*score|ritual\s*score|display\s*score|circle\s*score|start\s*score|gift\s*score|jesper\s*anbefaler|tryghed\s*f[øo]r\s*k[øo]b|hvorfor\s*vi\s*har\s*valgt|score\s*er\s*langsomt)/i;
          const filtered = parsed.sections.filter((s) => {
            if (s.type === "care") return false;
            if (DUPLICATE_HEADING.test(s.heading)) return false;
            return true;
          });
          return filtered.map((section, i) => (
            <EditorialSection
              key={i}
              section={section}
              relatedProducts={section.type === "crossSell" ? relatedProducts : []}
              doubtCta={section.type === "fit" ? doubtCta : undefined}
            />
          ));
        })()}

        {/* ── 6. Contextual ritual / gift guide link ── */}
        {(() => {
          const ritualLink =
            product.productType === "The Ritual Set"
              ? { href: "/ritualer/hold-kniven-skarp", label: "Læs guiden til at holde din kniv skarp" }
              : product.productType === "The Calm Kitchen"
                ? { href: "/ritualer/rolig-opbevaring", label: "Se guiden til rolig knivopbevaring" }
                : product.productType === "The Gift Chapter"
                  ? { href: "/gaver/fars-dag", label: "Se farsdagsgaver med ro og brugsværdi" }
                  : null;
          if (!ritualLink) return null;
          return (
            <div className="mt-12 max-w-3xl">
              <a
                href={ritualLink.href}
                className="inline-flex items-center gap-2 text-sm font-medium text-walnut border-b border-walnut/30 pb-1 hover:gap-3 transition-all"
              >
                {ritualLink.label} →
              </a>
            </div>
          );
        })()}

        {/* ── 7. Det giver mening sammen med ── */}
        {!parsed.sections.some((s) => s.type === "crossSell") && relatedProducts.length > 0 && (
          <section className="mt-20 md:mt-24">
            <header className="mb-8 max-w-2xl">
              <h2 className="font-serif text-3xl md:text-4xl mb-3 leading-[1.15]" style={{ color: "#2D2D2D" }}>
                Det giver mening sammen med
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "rgba(45,45,45,0.72)" }}>
                Byg dit køkkenritual videre med produkter, der passer naturligt sammen.
              </p>
            </header>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rp) => (
                <ProductCard key={rp.node.id} product={rp} />
              ))}
            </div>
          </section>
        )}

        {/* ── 8. Slim service bar — flyttet hertil, væk fra hero ── */}
        <div className="mt-20 md:mt-24">
          <TrustBar />
        </div>

        {/* ── 9. Final CTA — varm premium panel ── */}
        <section className="mt-16 md:mt-20 max-w-4xl">
          <div
            className="p-8 md:p-14 text-center rounded-[18px]"
            style={{
              backgroundColor: "#4C574A",
              border: "1px solid rgba(90,59,46,0.16)",
            }}
          >
            <h2
              className="font-serif text-3xl md:text-4xl mb-3 leading-[1.15]"
              style={{ color: "#F8F6F3" }}
            >
              Begynd med dette ritual
            </h2>
            <p
              className="text-base md:text-lg mb-7 max-w-md mx-auto leading-relaxed"
              style={{ color: "rgba(248,246,243,0.78)" }}
            >
              Et enkelt redskab. En roligere vane. Et bedre snit.
            </p>
            <Button
              variant="cta"
              size="lg"
              onClick={handleAddToCart}
              disabled={isCartLoading || !variant?.availableForSale}
              className="bg-[#F8F6F3] text-[#2D2D2D] hover:bg-white hover:text-[#2D2D2D]"
            >
              {isCartLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : !variant?.availableForSale ? (
                "Udsolgt"
              ) : (
                "Tilføj til ritualet"
              )}
            </Button>
            <p
              className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs md:text-[13px]"
              style={{ color: "rgba(248,246,243,0.72)" }}
            >
              <span style={{ color: "#A67C52" }} className="tracking-tight">★★★★★</span>
              <span>Kurateret af Langsomt Nok</span>
              <span style={{ color: "rgba(248,246,243,0.35)" }}>·</span>
              <span>Fri fragt over 599 kr</span>
              <span style={{ color: "rgba(248,246,243,0.35)" }}>·</span>
              <span>30 dages retur</span>
            </p>
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
