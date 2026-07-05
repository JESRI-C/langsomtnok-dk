import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchProductsByQuery, type ShopifyProduct } from "@/lib/shopify";
import { ACTIVE_THEME } from "@/lib/gift-occasion-theme";
import { ProductCard } from "@/components/ProductCard";
import { TrustBlok } from "@/components/TrustBlok";
import { trackEvent } from "@/lib/analytics";

const SITE_ORIGIN = "https://langsomtnok.dk";

export const Route = createFileRoute("/gaver/anledning")({
  head: () => ({
    meta: [
      { title: ACTIVE_THEME.seoTitle },
      { name: "description", content: ACTIVE_THEME.seoDescription },
      { property: "og:title", content: ACTIVE_THEME.headline },
      { property: "og:description", content: ACTIVE_THEME.subheadline },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_ORIGIN}/gaver/anledning` },
    ],
    links: [{ rel: "canonical", href: `${SITE_ORIGIN}/gaver/anledning` }],
  }),
  component: GaverAnledningPage,
});

function GaverAnledningPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackEvent("gaver_anledning_view", { theme: ACTIVE_THEME.id });
    let cancelled = false;
    (async () => {
      try {
        // Hent produkterne i den ønskede rækkefølge
        const results = await Promise.all(
          ACTIVE_THEME.productHandles.map((handle) =>
            fetchProductsByQuery(`handle:${handle}`, 1).then((r) => r[0]),
          ),
        );
        if (!cancelled) setProducts(results.filter(Boolean) as ShopifyProduct[]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F6F3] text-[#2D2D2D] pt-24 pb-24">
      {/* Hero */}
      <section className="container-calm max-w-4xl mx-auto text-center px-6 pt-8 pb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-[#4C574A] mb-6">
          {ACTIVE_THEME.eyebrow}
        </p>
        <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] mb-6">
          {ACTIVE_THEME.headline}
        </h1>
        <p className="text-lg md:text-xl text-foreground/70 max-w-xl mx-auto leading-relaxed">
          {ACTIVE_THEME.subheadline}
        </p>
      </section>

      {/* Intro */}
      <section className="container-calm max-w-2xl mx-auto text-center px-6 pb-16">
        <p className="text-base text-foreground/70 leading-relaxed">
          {ACTIVE_THEME.intro}
        </p>
      </section>

      {/* Produkter */}
      <section className="container-calm max-w-6xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ACTIVE_THEME.productHandles.map((h) => (
              <div
                key={h}
                className="aspect-square rounded-md bg-[#E6E0D7]/60 animate-pulse"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-center text-foreground/60">
            Ingen produkter fundet lige nu — kig forbi{" "}
            <Link to="/shop" className="underline">
              butikken
            </Link>
            .
          </p>
        )}
      </section>

      {/* Outro + trust */}
      <section className="container-calm max-w-2xl mx-auto text-center px-6 pt-20">
        <p className="font-serif text-2xl md:text-3xl text-foreground/80 italic leading-tight">
          {ACTIVE_THEME.outro}
        </p>
        <div className="mt-10">
          <TrustBlok />
        </div>
      </section>
    </main>
  );
}
