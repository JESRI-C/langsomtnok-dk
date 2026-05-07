/**
 * ============================================================================
 * PRODUCT DETAIL PAGE — /product/{handle}
 * ============================================================================
 *
 * SHOPIFY CONNECTION POINTS:
 * - Product data: fetched via PRODUCT_BY_HANDLE_QUERY using the route handle
 * - Variants: rendered from product.variants.edges (size, material, etc.)
 * - Images: from product.images.edges via Shopify CDN
 * - Add to cart: uses cartStore → Storefront Cart API
 * - Related products: fetched via PRODUCT_RECOMMENDATIONS_QUERY
 * - Specs/care: currently placeholder, connect to Shopify metafields
 * - Reviews: empty structure, connect to Shopify app (Judge.me, Yotpo, etc.)
 *
 * EXTENDING WITH METAFIELDS:
 * Add metafield identifiers to PRODUCT_BY_HANDLE_QUERY in shopify.ts,
 * then use getMetafieldValue() to read custom data here.
 * ============================================================================
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useCartStore } from "@/stores/cartStore";
import {
  storefrontApiRequest,
  PRODUCT_BY_HANDLE_QUERY,
  formatPrice,
  hasDiscount,
  getDiscountPercentage,
  fetchProductRecommendations,
  getMetafieldValue,
  type ShopifyProduct,
  type ShopifyMetafield,
} from "@/lib/shopify";
import { Loader2, Minus, Plus, Truck, RotateCcw, Shield, Package, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.handle} — Langsomt Nok` },
    ],
  }),
  component: ProductPage,
});

/** Product node shape from the Storefront API */
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

/**
 * Placeholder specifications structure.
 * SHOPIFY CONNECTION: Replace with metafield data.
 * Add metafield namespace "custom" key "technical_specs" (JSON type) in Shopify admin,
 * then parse here: JSON.parse(getMetafieldValue(product.metafields, 'custom', 'technical_specs'))
 */
interface ProductSpec {
  label: string;
  value: string;
}

function getPlaceholderSpecs(productType: string): ProductSpec[] {
  // SHOPIFY CONNECTION: Replace this with metafield-driven specs
  // when metafields are configured in Shopify admin.
  const baseSpecs: ProductSpec[] = [
    { label: "Materiale", value: "Damascus stål / Valnøddetræ" },
    { label: "Ståltype", value: "VG-10 kerne, 67 lag" },
    { label: "Hårdhed", value: "60±1 HRC" },
    { label: "Skaft", value: "Valnøddetræ, ergonomisk" },
    { label: "Længde", value: "33 cm (blad: 20 cm)" },
    { label: "Vægt", value: "185 g" },
    { label: "Pleje", value: "Håndvask, olie regelmæssigt" },
  ];
  return baseSpecs;
}

/**
 * Placeholder FAQ structure.
 * SHOPIFY CONNECTION: Store FAQ in a metafield (JSON type) or Shopify page content.
 * Namespace: "custom", Key: "product_faq"
 */
interface FAQItem {
  question: string;
  answer: string;
}

const PLACEHOLDER_FAQ: FAQItem[] = [
  {
    question: "Kan kniven komme i opvaskemaskinen?",
    answer: "Nej. Alle vores knive skal håndvaskes med varmt vand og mild sæbe. Tør dem af umiddelbart efter vask og opbevar dem tørt.",
  },
  {
    question: "Hvor ofte skal jeg slibe min kniv?",
    answer: "Det afhænger af brug. For de fleste hjemmekokke anbefaler vi slibning hver 2-3 måned og jævnlig brug af en keramisk strygestål.",
  },
  {
    question: "Hvad er forskellen på slibning og hvæsning?",
    answer: "Hvæsning retter bladet op og gøres ofte. Slibning fjerner metal og skaber en ny æg — det gøres sjældnere men er afgørende for langtidsholdbarheden.",
  },
  {
    question: "Hvornår skal jeg olie træskaftet?",
    answer: "Når træet føles tørt eller lyst. Typisk hver 4-6 uge. Brug vores Langsomt Nok skaftolie eller en fødevaresikker mineralolie.",
  },
];

function ProductPage() {
  const { handle } = Route.useParams();
  const [product, setProduct] = useState<ProductNode | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);

  // Fetch product by handle from Shopify Storefront API
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
          // Fetch related products using Shopify's recommendation engine
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
  const specs = getPlaceholderSpecs(product.productType);

  // Check for compare-at (sale) pricing
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

  /**
   * SHOPIFY CONNECTION: Add to cart via Storefront Cart API.
   * The variant.id is the full GraphQL ID (gid://shopify/ProductVariant/xxxxx).
   * Cart is created on first add, then lines are added/updated via mutations.
   */
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
    toast.success("Tilføjet med ro", { description: product.title, position: "top-center" });
  };

  // SHOPIFY CONNECTION: Read care instructions from metafields
  const careInstructions = getMetafieldValue(product.metafields, 'custom', 'care_instructions');
  // SHOPIFY CONNECTION: Read sensory intro from metafields
  const sensoryIntro = getMetafieldValue(product.metafields, 'custom', 'sensory_intro');

  return (
    <div className="pt-24 pb-16">
      <div className="container-calm">
        <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block">
          ← Tilbage til shop
        </Link>

        {/* ── Product Hero: Gallery + Info ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Gallery — images from Shopify CDN */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-linen relative">
              {images[selectedImage]?.node && (
                <img
                  src={images[selectedImage].node.url}
                  alt={images[selectedImage].node.altText || product.title}
                  className="w-full h-full object-cover"
                />
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
            {/* Title + sensory intro */}
            <div>
              {product.productType && (
                <span className="text-xs font-medium text-copper uppercase tracking-wider">
                  {product.productType}
                </span>
              )}
              <h1 className="font-serif text-3xl md:text-4xl mb-3 mt-1">{product.title}</h1>
              <p className="text-muted-foreground leading-relaxed">
                {/* SHOPIFY CONNECTION: Use sensoryIntro metafield if available, fallback to description */}
                {sensoryIntro || product.description}
              </p>
            </div>

            {/* Price — with compare-at pricing support */}
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

            {/* Variant selector — renders Shopify product options */}
            {hasMultipleVariants && product.options.map((option) => (
              <div key={option.name}>
                <label className="text-sm font-medium mb-2 block">{option.name}</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map((v, i) => {
                    const optionValue = v.node.selectedOptions.find(o => o.name === option.name)?.value;
                    if (!optionValue) return null;
                    // Deduplicate: only show first variant for each option value
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

            {/* Quantity + Add to cart — SHOPIFY: uses Storefront Cart API */}
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

            {/* Trust points */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
              {[
                { icon: Truck, text: "Fri fragt over 499 kr" },
                { icon: RotateCcw, text: "30 dages returret" },
                { icon: Package, text: "Pakket med omhu" },
                { icon: Shield, text: "Betal sikkert" },
              ].map((trust) => (
                <div key={trust.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <trust.icon className="w-4 h-4 text-cta flex-shrink-0" />
                  <span>{trust.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Product Story ──────────────────────────────────────────── */}
        <section className="mt-20 max-w-3xl">
          <h2 className="font-serif text-2xl mb-4">Skabt til rolig præcision</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Et godt snit begynder før kniven rammer brættet. Det begynder med valget af materiale, med tålmodighed i smedjen og med respekt for det køkken, redskabet ender i.
          </p>
          {product.descriptionHtml && (
            <div
              className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}
        </section>

        {/* ── Sådan føles den ────────────────────────────────────────── */}
        <section className="mt-16 max-w-3xl">
          <h2 className="font-serif text-2xl mb-4">Sådan føles den</h2>
          <p className="text-muted-foreground leading-relaxed">
            Der er forskel på at holde et redskab og at mærke det. Vores produkter er skabt til at ligge naturligt i hånden — med en vægt og en balance, der fortæller historien om deres materiale.
          </p>
        </section>

        {/* ── Technical Specifications ────────────────────────────────── */}
        {/* SHOPIFY CONNECTION: Replace placeholder specs with metafield data.
            Configure metafield "custom.technical_specs" (JSON) in Shopify admin. */}
        <section className="mt-16 max-w-3xl">
          <h2 className="font-serif text-2xl mb-6">Specifikationer</h2>
          <div className="border border-border rounded-lg overflow-hidden">
            {specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`flex justify-between py-3 px-4 text-sm ${
                  i % 2 === 0 ? "bg-soft/30" : "bg-transparent"
                }`}
              >
                <span className="text-muted-foreground font-medium">{spec.label}</span>
                <span className="text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Care Instructions ───────────────────────────────────────── */}
        {/* SHOPIFY CONNECTION: Read from metafield "custom.care_instructions" (rich_text_field).
            Use getMetafieldValue() and render with dangerouslySetInnerHTML for rich text. */}
        <section className="mt-16 max-w-3xl">
          <h2 className="font-serif text-2xl mb-4">Pleje er en del af ritualet</h2>
          {careInstructions ? (
            <div
              className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: careInstructions }}
            />
          ) : (
            <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
              <p>Pleje er ikke en pligt. Det er en måde at forlænge glæden på.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Håndvask med varmt vand og mild sæbe umiddelbart efter brug.</li>
                <li>Tør bladet grundigt af — lad det aldrig lufttørre.</li>
                <li>Olie træskaftet hver 4-6 uge med vores skaftolie.</li>
                <li>Opbevar kniven på en magnetisk holder eller i en knivblok — aldrig løst i en skuffe.</li>
                <li>Brug en slibesten med jævne mellemrum for at vedligeholde æggen.</li>
              </ul>
            </div>
          )}
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
        {/* SHOPIFY CONNECTION: Store FAQ in metafield "custom.product_faq" (JSON type).
            Parse and render dynamically. */}
        <section className="mt-16 max-w-3xl">
          <h2 className="font-serif text-2xl mb-6">Ofte stillede spørgsmål</h2>
          <div className="space-y-0 border border-border rounded-lg overflow-hidden">
            {PLACEHOLDER_FAQ.map((faq, i) => (
              <div key={i} className={`${i > 0 ? "border-t border-border" : ""}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-soft/30 transition-colors"
                >
                  <span className="text-sm font-medium pr-4">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Related Products ────────────────────────────────────────── */}
        {/* SHOPIFY CONNECTION: Uses Shopify's productRecommendations query.
            Powered by Shopify's ML engine — no manual configuration needed. */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="font-serif text-2xl mb-8">Det giver mening sammen med…</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.slice(0, 3).map((rp) => (
                <ProductCard key={rp.node.id} product={rp} />
              ))}
            </div>
          </section>
        )}

        {/* ── Reviews Placeholder ─────────────────────────────────────── */}
        {/* SHOPIFY CONNECTION: Integrate with a reviews app (Judge.me, Yotpo, Loox, etc.)
            Reviews should come from real customers — never generate fake review content. */}
        <section className="mt-20 max-w-3xl">
          <h2 className="font-serif text-2xl mb-4">Anmeldelser</h2>
          <div className="p-8 rounded-lg border border-border text-center">
            <p className="text-muted-foreground text-sm">Ingen anmeldelser endnu</p>
            <p className="text-muted-foreground/50 text-xs mt-1">Vær den første til at dele din oplevelse.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
