import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Langsomt Nok" },
      { name: "description", content: "Udforsk vores samling af knive, slibesten, holdere og plejeritualer." },
      { property: "og:title", content: "Shop — Langsomt Nok" },
      { property: "og:description", content: "Udforsk vores samling af knive, slibesten, holdere og plejeritualer." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storefrontApiRequest(PRODUCTS_QUERY, { first: 50 })
      .then((data) => {
        if (data?.data?.products?.edges) setProducts(data.data.products.edges);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24">
      <div className="container-calm">
        <div className="max-w-2xl mb-12">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Shop</h1>
          <p className="text-editorial text-muted-foreground">
            Køkkenredskaber skabt med tålmodighed. Hvert produkt er valgt for sin kvalitet, sit materiale og den ro, det bringer til dit køkken.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
            <p className="font-serif text-xl text-muted-foreground">Ingen produkter fundet</p>
            <p className="text-sm text-muted-foreground/60 mt-2">Produkter tilføjes snart.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <NewsletterSignup variant="dark" />
    </div>
  );
}
