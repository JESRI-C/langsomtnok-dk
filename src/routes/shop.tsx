import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ImageSlot, IMAGE_SLOTS } from "@/components/ImageSlot";
import { TrustBar } from "@/components/landing/TrustBar";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Langsomt Nok" },
      { name: "description", content: "Udforsk vores samling af kokkeknive, slibesten, magnetiske holdere og plejeritualer. Skabt med tålmodighed." },
      { property: "og:title", content: "Shop — Langsomt Nok" },
      { property: "og:description", content: "Udforsk vores samling af kokkeknive, slibesten, holdere og plejeritualer." },
    ],
  }),
  component: ShopPage,
});

const CATEGORIES = [
  { label: "Alle", query: "" },
  { label: "Knive", query: "product_type:\"The Chef Line\"" },
  { label: "Slibning & pleje", query: "product_type:\"The Ritual Set\"" },
  { label: "Opbevaring", query: "product_type:\"The Calm Kitchen\"" },
  { label: "Gaver", query: "product_type:\"The Gift Chapter\"" },
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
      <section className="section-padding pb-0">
        <div className="container-calm">
          <div className="max-w-2xl mb-12 fade-in-up">
            <span className="text-xs font-medium text-copper uppercase tracking-widest mb-3 block">Kollektion</span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">Udvalgte redskaber</h1>
            <p className="text-editorial text-muted-foreground">
              Køkkenredskaber skabt med tålmodighed. Hvert produkt er valgt for sin kvalitet, sit materiale og den ro, det bringer til dit køkken.
            </p>
          </div>

          {/* ── Category Filter ──────────────────────────── */}
          <div className="flex flex-wrap gap-2 mb-12">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(i)}
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
              { title: "Knive", desc: "Knive til hænder, der gerne vil mærke forskellen.", handle: "knive", slot: IMAGE_SLOTS.categories.knives },
              { title: "Slibning & pleje", desc: "Skarphed er ikke tilfældig. Den er plejet.", handle: "slibesten", slot: IMAGE_SLOTS.categories.sharpeningStones },
              { title: "Magnetisk opbevaring", desc: "Når værktøjet er smukt, skal det ikke gemmes væk.", handle: "magnetiske-holdere", slot: IMAGE_SLOTS.categories.magneticHolders },
              { title: "Gaver", desc: "Gaver, der bliver brugt. Ikke bare pakket ud.", handle: "gaver", slot: IMAGE_SLOTS.categories.giftSets },
            ].map((cat) => (
              <Link key={cat.title} to="/collections/$handle" params={{ handle: cat.handle }} className="group block">
                <ImageSlot
                  name={cat.slot.name}
                  ratio="3/4"
                  motif={cat.slot.motif}
                  alt={cat.title}
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
