/**
 * ============================================================================
 * COLLECTION PAGE — /collections/{handle}
 * ============================================================================
 * Fetches collection from Shopify with editorial intro copy per collection.
 * ============================================================================
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { TrustBar } from "@/components/landing/TrustBar";
import { storefrontApiRequest, COLLECTION_BY_HANDLE_QUERY, type ShopifyProduct } from "@/lib/shopify";

const SORT_OPTIONS = [
  { label: "Anbefalet", key: "COLLECTION_DEFAULT", reverse: false },
  { label: "Pris: Lav til høj", key: "PRICE", reverse: false },
  { label: "Pris: Høj til lav", key: "PRICE", reverse: true },
  { label: "Nyeste", key: "CREATED", reverse: true },
  { label: "Titel: A-Å", key: "TITLE", reverse: false },
];

/** Editorial intro copy for known collections */
const COLLECTION_INTROS: Record<string, { tagline: string; intro: string }> = {
  knive: {
    tagline: "The Chef Line",
    intro: "Knive til hænder, der gerne vil mærke forskellen.",
  },
  slibesten: {
    tagline: "The Ritual Set",
    intro: "Skarphed er ikke tilfældig. Den er plejet.",
  },
  "slibning-pleje": {
    tagline: "The Ritual Set",
    intro: "Skarphed er ikke tilfældig. Den er plejet.",
  },
  "magnetiske-holdere": {
    tagline: "The Calm Kitchen",
    intro: "Når værktøjet er smukt, skal det ikke gemmes væk.",
  },
  gaver: {
    tagline: "The Gift Chapter",
    intro: "Gaver, der bliver brugt. Ikke bare pakket ud.",
  },
  "start-dit-ritual": {
    tagline: "Begynd her",
    intro: "Begynd med det, du faktisk får lyst til at bruge igen.",
  },
};

export const Route = createFileRoute("/collections/$handle")({
  head: ({ params }) => {
    const info = COLLECTION_INTROS[params.handle];
    const title = info ? `${info.tagline} — Langsomt Nok` : `${params.handle} — Langsomt Nok`;
    const desc = info?.intro || `Udforsk vores ${params.handle} kollektion.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { handle } = Route.useParams();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [collection, setCollection] = useState<{ title: string; description: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortIdx, setSortIdx] = useState(0);

  const editorialInfo = COLLECTION_INTROS[handle];

  useEffect(() => {
    setLoading(true);
    const sort = SORT_OPTIONS[sortIdx];
    storefrontApiRequest(COLLECTION_BY_HANDLE_QUERY, {
      handle,
      first: 50,
      sortKey: sort.key,
      reverse: sort.reverse,
    })
      .then((data) => {
        const col = data?.data?.collection;
        if (col) {
          setCollection({ title: col.title, description: col.description });
          setProducts(col.products?.edges || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [handle, sortIdx]);

  return (
    <div className="pt-24">
      <div className="container-calm">
        {/* Editorial header */}
        <div className="max-w-2xl mb-12">
          {editorialInfo && (
            <span className="text-xs font-medium text-copper uppercase tracking-widest mb-3 block">
              {editorialInfo.tagline}
            </span>
          )}
          <h1 className="font-serif text-4xl md:text-5xl mb-4">{collection?.title || handle}</h1>
          <p className="text-editorial text-muted-foreground">
            {editorialInfo?.intro || collection?.description || ""}
          </p>
          {collection?.description && editorialInfo && (
            <p className="text-sm text-muted-foreground/70 mt-3">{collection.description}</p>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
          <p className="text-sm text-muted-foreground">{products.length} produkter</p>
          <select
            value={sortIdx}
            onChange={(e) => setSortIdx(Number(e.target.value))}
            className="text-sm bg-transparent border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-cta/30"
          >
            {SORT_OPTIONS.map((opt, i) => (
              <option key={`${opt.key}-${opt.reverse}`} value={i}>{opt.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-linen rounded-lg mb-4" />
                <div className="h-4 bg-linen rounded w-2/3 mb-2" />
                <div className="h-3 bg-linen rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 mb-16">
            <p className="font-serif text-xl text-muted-foreground mb-2">Ingen produkter i denne kollektion endnu</p>
            <p className="text-sm text-muted-foreground/60">Produkter tilføjes snart.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <TrustBar />
      <NewsletterSignup />
    </div>
  );
}
