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
import { trackEvent } from "@/lib/analytics";
import DOMPurify from "isomorphic-dompurify";

const sanitizeHtml = (html: string) => DOMPurify.sanitize(html, {
  ALLOWED_TAGS: ["p", "br", "ul", "ol", "li", "strong", "em", "b", "i", "h3", "h4", "a", "span"],
  ALLOWED_ATTR: ["href", "target", "rel"],
});
import { Loader2, Minus, Plus, CreditCard, Truck, RotateCcw, Package } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => {
    const url = `https://langsomtnok.dk/product/${params.handle}`;
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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: images.map((e) => e.node.url),
    sku: variant?.sku || product.handle,
    brand: { "@type": "Brand", name: "Langsomt Nok" },
    url: `https://langsomtnok.dk/product/${product.handle}`,
    offers: {
      "@type": "Offer",
      price: variant?.price?.amount || product.priceRange.minVariantPrice.amount,
      priceCurrency: variant?.price?.currencyCode || product.priceRange.minVariantPrice.currencyCode || "DKK",
      availability: variant?.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://langsomtnok.dk/product/${product.handle}`,
    },
  };

  return (
    <div className="pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
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
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-foreground/70 mt-4">
              <span className="inline-flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-cta" strokeWidth={1.5} />
                Levering 1–3 hverdage
              </span>
              <span className="text-border">·</span>
              <span className="inline-flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-cta" strokeWidth={1.5} />
                Sikker betaling
              </span>
              <span className="text-border">·</span>
              <span className="inline-flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-cta" strokeWidth={1.5} />
                Nem retur
              </span>
              <span className="text-border">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Package className="w-4 h-4 text-cta" strokeWidth={1.5} />
                Pakket med omhu
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Spørgsmål? Skriv til{" "}
              <a href="mailto:hej@langsomtnok.dk" className="text-cta font-medium hover:text-cta-hover">
                hej@langsomtnok.dk
              </a>
            </p>

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

        {/* ── 2. Trust Bar ──────────────────────────────────────── */}
        <div className="mt-12">
          <TrustBar />
        </div>

        {/* ── Video: Så nemt sættes den op (kun magnetiske knivholdere) ── */}
        {(product.productType === "The Calm Kitchen" ||
          /knivholder|magnet/i.test(product.handle) ||
          /knivholder|magnet/i.test(product.title)) && (
          <div className="mt-16 -mx-6 md:-mx-10">
            <VideoShowcase
              eyebrow="Så nemt sættes den op"
              title="Monteret på få minutter — uden boremaskine."
              body="Monteres med dobbeltklæbende tape, som følger med. Brug en laser eller et vaterpas, ret den ind og tryk den fast."
              background="soft"
              videoSide="left"
              compact
            />
          </div>
        )}

        {/* ── Contextual ritual / gift guide link (1 per product) ── */}
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
            <div className="mt-10 max-w-3xl">
              <a
                href={ritualLink.href}
                className="inline-flex items-center gap-2 text-sm font-medium text-walnut border-b border-walnut/30 pb-1 hover:gap-3 transition-all"
              >
                {ritualLink.label} →
              </a>
            </div>
          );
        })()}

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
