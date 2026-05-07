import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { storefrontApiRequest, COLLECTION_BY_HANDLE_QUERY, type ShopifyProduct } from "@/lib/shopify";

export const Route = createFileRoute("/collections/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.handle} — Langsomt Nok` },
      { name: "description", content: `Udforsk vores ${params.handle} kollektion.` },
    ],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  const { handle } = Route.useParams();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [collection, setCollection] = useState<{ title: string; description: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    storefrontApiRequest(COLLECTION_BY_HANDLE_QUERY, { handle, first: 50 })
      .then((data) => {
        const col = data?.data?.collection;
        if (col) {
          setCollection({ title: col.title, description: col.description });
          setProducts(col.products?.edges || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [handle]);

  return (
    <div className="pt-24">
      <div className="container-calm">
        <div className="max-w-2xl mb-12">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">{collection?.title || handle}</h1>
          {collection?.description && (
            <p className="text-editorial text-muted-foreground">{collection.description}</p>
          )}
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
          <div className="text-center py-20">
            <p className="font-serif text-xl text-muted-foreground">Ingen produkter i denne kollektion endnu</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <NewsletterSignup />
    </div>
  );
}
