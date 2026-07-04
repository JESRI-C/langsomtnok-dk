import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ImageSlot, IMAGE_SLOTS } from "@/components/ImageSlot";
import { TrustBar } from "@/components/landing/TrustBar";
import { MestValgt } from "@/components/landing/MestValgt";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Langsomt Nok — udvalgte ting til køkkenet" },
      { name: "description", content: "Udvalgte ting til køkkenet — knive, slibesten, magnetiske holdere og håndlavet keramik. Skabt til brug, ro og materialefølelse." },
      { property: "og:title", content: "Shop Langsomt Nok — udvalgte ting til køkkenet" },
      { property: "og:description", content: "Udvalgte ting til køkkenet — skabt til brug, ro og materialefølelse." },
      { property: "og:url", content: "https://langsomtnok.dk/shop" },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/shop" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Shop Langsomt Nok",
          url: "https://langsomtnok.dk/shop",
          description: "Udvalgte ting til køkkenet — knive, slibesten, magnetiske holdere og håndlavet keramik.",
          isPartOf: { "@type": "WebSite", name: "Langsomt Nok", url: "https://langsomtnok.dk" },
        }),
      },
    ],
  }),
  component: ShopPage,
});

const CATEGORIES = [
  { label: "Alle", query: "", id: "all" },
  { label: "Keramik", query: "product_type:Keramik", id: "ceramics" },
  { label: "Knivholdere", query: "product_type:\"The Calm Kitchen\"", id: "holders" },
  { label: "Slibning", query: "product_type:\"The Ritual Set\"", id: "sharpening" },
  { label: "Gaver", query: "product_type:\"The Gift Chapter\"", id: "gifts" },
  { label: "Alt til køkkenet", query: "product_type:\"The Chef Line\"", id: "kitchen" },
];

function ShopPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    setLoading(true);
    const query = CATEGORIES[activeCategory].query;
    storefrontApiRequest(PRODUCTS_QUERY, { first: 50, ...(query ? { query } : {}) })
      .then((data) => {
        if (data?.data?.products?.edges) setProducts(data.data.products.edges);
        else setProducts([]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="pt-24">
      {/* ── Editorial Header ──────────────────────────── */}
      <section className="pt-8 md:pt-16 pb-0">
        <div className="container-calm">
          <div className="max-w-2xl mb-6 md:mb-10 fade-in-up">
            <span className="text-xs font-medium text-copper uppercase tracking-widest mb-3 block">Shop Langsomt Nok</span>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-3 md:mb-4">Shop Langsomt Nok</h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Udvalgte ting til køkkenet — skabt til brug, ro og materialefølelse.
            </p>
            <p className="text-xs md:text-sm font-medium mt-3" style={{ color: "#A67C52" }}>
              Sendes fra Danmark · Levering 1-2 dage · 30 dages returret
            </p>
          </div>

          {/* ── Category Filter ──────────────────────────── */}
          <div className="flex flex-wrap gap-2 mb-8 md:mb-10">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.label}
                data-cta={`cta_shop_filter_${cat.id}`}
                onClick={() => {
                  setActiveCategory(i);
                  trackEvent("shop_filter_click", { filter: cat.id });
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  i === activeCategory
                    ? "bg-cta text-cta-foreground"
                    : "bg-soft text-muted-foreground hover:bg-linen hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mest valgt lige nu ──────────────────────── */}
      <MestValgt />

      {/* ── Products Grid ─────────────────────────────── */}
      <section className="pb-16">
        <div className="container-calm">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-linen rounded-lg mb-4" />
                  <div className="h-4 bg-linen rounded w-2/3 mb-2" />
                  <div className="h-3 bg-linen rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-muted-foreground mb-2">Ingen produkter fundet</p>
              <p className="text-sm text-muted-foreground/60">Produkter tilføjes snart til denne kategori.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Collection Cards ──────────────────────────── */}
      <section className="section-padding bg-soft">
        <div className="container-calm">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">Udforsk kategorierne</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Knive", alt: "Kollektion af kokkeknive i damaskus-stål", desc: "Knive til hænder, der gerne vil mærke forskellen.", handle: "knive", slot: IMAGE_SLOTS.categories.knives },
              { title: "Slibning & pleje", alt: "Slibesten og læderstrop til knivpleje", desc: "Skarphed er ikke tilfældig. Den er plejet.", handle: "slibesten", slot: IMAGE_SLOTS.categories.sharpeningStones },
              { title: "Magnetisk opbevaring", alt: "Magnetisk knivholder i træ på væggen", desc: "Når værktøjet er smukt, skal det ikke gemmes væk.", handle: "magnetiske-holdere", slot: IMAGE_SLOTS.categories.magneticHolders },
              { title: "Gaver", alt: "Udvalgte gaveæsker med køkkenredskaber", desc: "Gaver, der bliver brugt. Ikke bare pakket ud.", handle: "gaver", slot: IMAGE_SLOTS.categories.giftSets },
            ].map((cat) => (
              <Link key={cat.title} to="/collections/$handle" params={{ handle: cat.handle }} className="group block">
                <ImageSlot
                  name={cat.slot.name}
                  ratio="3/4"
                  motif={cat.slot.motif}
                  alt={cat.alt}
                  variant="warm"
                  className="mb-4"
                />
                <h3 className="font-serif text-lg mb-1 group-hover:text-walnut transition-colors">{cat.title}</h3>
                <p className="text-sm text-muted-foreground">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TrustBar />
      <NewsletterSignup variant="dark" />
    </div>
  );
}
