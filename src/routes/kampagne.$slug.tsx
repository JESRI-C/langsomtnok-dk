/**
 * ============================================================================
 * KAMPAGNE-SKABELON — /kampagne/[slug]
 * ============================================================================
 *
 * Konverteringskritisk landingsside til Meta-annoncetrafik.
 *
 * Design-principper:
 *   - Above the fold på mobil: billede, hook, pris, trust, ét CTA.
 *   - Én primær CTA ("Læg i kurv") — ingen distraktioner.
 *   - Minimal header (logo + kurv), ingen footer — sat i __root.tsx.
 *   - Produktdata SSR'es fra Shopify via loader'en → fuld HTML før hydration.
 *   - Kampagne-copy (hook, pris, FAQ) styres i src/lib/campaigns.ts.
 *
 * Tilføj en ny kampagne: opret en entry i CAMPAIGNS i src/lib/campaigns.ts.
 * Den specifikke rute /kampagne/magnetisk-knivstander vinder over denne
 * dynamiske skabelon (TanStack Router matcher mest-specifikke først).
 * ============================================================================
 */

import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, ArrowRight, ShieldCheck, Truck, RotateCcw, Package } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY, formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { getCampaign, type CampaignContent } from "@/lib/campaigns";
import { trackAddToCart, trackEvent, trackProductView } from "@/lib/analytics";
import { toast } from "sonner";

type LoadedProduct = ShopifyProduct["node"];

interface LoaderData {
  campaign: CampaignContent;
  product: LoadedProduct;
}

async function fetchCampaignProduct(handle: string): Promise<LoadedProduct | null> {
  try {
    const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
    return data?.data?.productByHandle ?? null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/kampagne/$slug")({
  loader: async ({ params }): Promise<LoaderData> => {
    const campaign = getCampaign(params.slug);
    if (!campaign) throw notFound();
    const product = await fetchCampaignProduct(campaign.productHandle);
    if (!product) throw notFound();
    return { campaign, product };
  },
  head: ({ params, loaderData }) => {
    const url = `https://langsomtnok.dk/kampagne/${params.slug}`;
    if (!loaderData) {
      return {
        meta: [
          { title: "Kampagne | Langsomt Nok" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { campaign, product } = loaderData;
    const title = `${campaign.headline} | Langsomt Nok`;
    const desc = campaign.subline;
    const image = product.images?.edges?.[0]?.node?.url;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: campaign.headline },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
        ...(image ? [{ property: "og:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: desc,
            image: product.images?.edges?.map((e) => e.node.url) ?? [],
            brand: { "@type": "Brand", name: "Langsomt Nok" },
            offers: {
              "@type": "Offer",
              price: campaign.priceNow ?? product.priceRange.minVariantPrice.amount,
              priceCurrency: "DKK",
              availability: product.variants.edges[0]?.node.availableForSale
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              url,
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: campaign.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  component: KampagneSide,
  notFoundComponent: KampagneNotFound,
});

function KampagneNotFound() {
  return (
    <div className="pt-24 min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-3xl mb-3">Kampagnen findes ikke</h1>
        <p className="text-muted-foreground mb-6">
          Denne kampagne er enten udløbet eller flyttet.
        </p>
        <Link to="/shop" className="text-cta font-medium">
          Se vores shop →
        </Link>
      </div>
    </div>
  );
}

function KampagneSide() {
  const { campaign, product } = Route.useLoaderData() as LoaderData;
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const variants = product.variants.edges;
  const variant = variants[selectedVariantIdx]?.node;
  const image = product.images?.edges?.[0]?.node;
  const hasVariants = variants.length > 1 && variants[0].node.title !== "Default Title";

  const priceNow = campaign.priceNow ?? parseFloat(variant?.price?.amount ?? "0");
  const priceBefore = campaign.priceBefore;
  const savings = priceBefore && priceNow ? Math.round(((priceBefore - priceNow) / priceBefore) * 100) : 0;

  const shopifyProduct: ShopifyProduct = { node: product };

  const handleAddToCart = async () => {
    if (!variant) return;
    await addItem({
      product: shopifyProduct,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    trackAddToCart({
      product_id: product.id,
      product_title: product.title,
      variant_id: variant.id,
      variant_title: variant.title !== "Default Title" ? variant.title : undefined,
      price: parseFloat(variant.price.amount),
      currency: variant.price.currencyCode,
      quantity: 1,
      product_type: product.productType,
    });
    trackEvent("landing_page_primary_cta_click", {
      product_id: product.id,
      page: `/kampagne/${campaign.slug}`,
    });
    toast.success("Tilføjet med ro.", { description: product.title, position: "top-center" });
  };

  // ViewContent fires on client mount for Meta Pixel matching
  useMountedProductView(product);

  return (
    <div className="bg-[#F8F6F3] text-foreground min-h-screen">
      {/* ── HERO — above the fold på mobil ─────────────────────── */}
      <section className="pt-8 md:pt-14 pb-10 md:pb-14">
        <div className="container-calm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Billede */}
            <div className="order-1 aspect-[4/5] md:aspect-square rounded-xl overflow-hidden bg-soft">
              {image ? (
                <img
                  src={image.url}
                  alt={image.altText ?? campaign.heroAlt}
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-sm">
                  Billede kommer
                </div>
              )}
            </div>

            {/* Info */}
            <div className="order-2 space-y-5 md:pt-4">
              <div>
                <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-copper mb-3">
                  {campaign.eyebrow}
                </span>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.08] text-deep">
                  {campaign.headline}
                </h1>
                <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                  {campaign.subline}
                </p>
              </div>

              {/* Pris */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-serif text-3xl md:text-4xl text-deep">
                  {priceNow.toLocaleString("da-DK")} kr.
                </span>
                {priceBefore && priceBefore > priceNow && (
                  <>
                    <span className="text-lg text-muted-foreground/60 line-through">
                      {priceBefore.toLocaleString("da-DK")} kr.
                    </span>
                    <span className="text-sm font-semibold text-copper">
                      Spar {savings}%
                    </span>
                  </>
                )}
              </div>

              {/* Variant-vælger */}
              {hasVariants &&
                product.options.map((option) => (
                  <div key={option.name}>
                    <label className="text-sm font-medium mb-2 block">{option.name}</label>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((v, i) => {
                        const optVal = v.node.selectedOptions.find((o) => o.name === option.name)?.value;
                        if (!optVal) return null;
                        const isFirst =
                          variants.findIndex(
                            (vv) => vv.node.selectedOptions.find((o) => o.name === option.name)?.value === optVal,
                          ) === i;
                        if (!isFirst) return null;
                        return (
                          <button
                            key={`${option.name}-${optVal}`}
                            onClick={() => setSelectedVariantIdx(i)}
                            disabled={!v.node.availableForSale}
                            className={`px-4 py-2 rounded-md border text-sm transition-all ${
                              i === selectedVariantIdx
                                ? "border-walnut bg-walnut/5 text-walnut"
                                : "border-border hover:border-walnut/50"
                            } disabled:opacity-30 disabled:cursor-not-allowed`}
                          >
                            {optVal}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

              {/* Primær CTA */}
              <Button
                variant="cta"
                size="lg"
                className="w-full text-base"
                onClick={handleAddToCart}
                disabled={isLoading || !variant?.availableForSale}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : !variant?.availableForSale ? (
                  "Udsolgt"
                ) : (
                  "Læg i kurv"
                )}
              </Button>

              {/* Trust bar */}
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs md:text-sm text-muted-foreground pt-2">
                <li className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-cta" strokeWidth={1.5} />
                  Sendes fra Danmark
                </li>
                <li className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-cta" strokeWidth={1.5} />
                  Levering 1-2 dage
                </li>
                <li className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-cta" strokeWidth={1.5} />
                  30 dages retur
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cta" strokeWidth={1.5} />
                  Sikker betaling
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 FORDELE ─────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-soft/50 border-y border-border/40">
        <div className="container-calm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {campaign.benefits.map((benefit, i) => (
              <div key={i} className="text-center md:text-left">
                <span className="font-serif text-copper text-lg mb-3 block">0{i + 1}</span>
                <p className="text-base leading-relaxed text-deep">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUNDLE (valgfri) ──────────────────────────────── */}
      {campaign.bundleHandle && (
        <section className="py-12 md:py-16">
          <div className="container-calm max-w-3xl text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-copper">
              Byg dit sæt
            </span>
            <h2 className="font-serif text-2xl md:text-3xl mt-3 mb-4">
              {campaign.bundleLabel ?? "Sammen med"}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Får du mest ud af produktet ved at parre det med noget, der hører til ritualet? Se vores anbefaling.
            </p>
            <Link
              to="/products/$handle"
              params={{ handle: campaign.bundleHandle }}
              className="inline-flex items-center gap-2 text-cta font-medium hover:gap-3 transition-all"
            >
              Se anbefalingen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ── SOCIAL PROOF (placeholder — venter på rigtige anmeldelser) ── */}
      <section className="py-12 md:py-16 bg-soft/40">
        <div className="container-calm max-w-2xl text-center">
          <p className="text-sm text-muted-foreground italic">
            Vores første kunder er ved at skrive historien. Anmeldelser vises her, når de rigtige er kommet ind.
          </p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-8 text-center">
            Ofte stillede spørgsmål
          </h2>
          <Accordion type="single" collapsible className="border border-border rounded-lg overflow-hidden">
            {campaign.faq.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className={i > 0 ? "border-t border-border" : "border-b-0"}>
                <AccordionTrigger className="px-4 text-sm font-medium hover:no-underline text-left">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="px-4 text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA IGEN — bunden af siden ────────────────────── */}
      <section className="py-14 md:py-20 bg-[#4C574A] text-cta-foreground">
        <div className="container-calm max-w-2xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4 text-[#F8F6F3]">
            Begynd med dette ritual
          </h2>
          <p className="text-[#F8F6F3]/80 mb-8 leading-relaxed">
            Ét enkelt redskab. En roligere vane.
          </p>
          <Button
            variant="cta"
            size="lg"
            onClick={handleAddToCart}
            disabled={isLoading || !variant?.availableForSale}
            className="bg-[#F8F6F3] text-[#2D2D2D] hover:bg-white hover:text-[#2D2D2D]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : !variant?.availableForSale ? (
              "Udsolgt"
            ) : (
              `Læg i kurv — ${priceNow.toLocaleString("da-DK")} kr.`
            )}
          </Button>
          <p className="mt-6 text-xs text-[#F8F6F3]/60">
            Sendes fra Danmark · 1-2 dages levering · 30 dages retur
          </p>
        </div>
      </section>
    </div>
  );
}

// ── Client-only ViewContent fire ──────────────────────────────────────
import { useEffect } from "react";
function useMountedProductView(product: LoadedProduct) {
  useEffect(() => {
    const firstVariant = product.variants?.edges?.[0]?.node;
    trackProductView({
      product_id: product.id,
      product_title: product.title,
      variant_id: firstVariant?.id,
      variant_title: firstVariant?.title !== "Default Title" ? firstVariant?.title : undefined,
      price: parseFloat(
        firstVariant?.price?.amount ?? product.priceRange?.minVariantPrice?.amount ?? "0",
      ),
      currency:
        firstVariant?.price?.currencyCode ?? product.priceRange?.minVariantPrice?.currencyCode ?? "DKK",
      product_type: product.productType,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);
}
