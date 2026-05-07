import { Link } from "@tanstack/react-router";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

interface ProductRecommendationBlockProps {
  title?: string;
  subtitle?: string;
  /** SHOPIFY CONNECTION: Pass real ShopifyProduct[] from API. */
  products?: ShopifyProduct[];
}

export function ProductRecommendationBlock({ title = "Anbefalede produkter", subtitle, products }: ProductRecommendationBlockProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container-calm">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl mb-3">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-editorial mx-auto">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const { node } = product;
            const image = node.images.edges[0]?.node;
            return (
              <Link key={node.id} to="/product/$handle" params={{ handle: node.handle }} className="group block">
                <div className="aspect-[4/5] rounded-lg overflow-hidden bg-linen mb-4">
                  {image ? (
                    <img src={image.url} alt={image.altText || node.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30">
                      <span className="font-serif text-lg mb-1">Langsomt Nok</span>
                      <span className="text-xs text-copper/50">Billede mangler</span>
                    </div>
                  )}
                </div>
                {node.productType && (
                  <span className="text-[10px] font-medium text-copper uppercase tracking-wider">{node.productType}</span>
                )}
                <h3 className="font-serif text-base mt-1 group-hover:text-walnut transition-colors">{node.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatPrice(node.priceRange.minVariantPrice.amount, node.priceRange.minVariantPrice.currencyCode)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
