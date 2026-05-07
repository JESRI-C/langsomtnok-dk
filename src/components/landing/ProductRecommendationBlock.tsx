import { Link } from "@tanstack/react-router";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface ProductRecommendationBlockProps {
  title?: string;
  subtitle?: string;
  /** SHOPIFY CONNECTION: Pass real ShopifyProduct[] from API. Fallback uses placeholder structure. */
  products?: ShopifyProduct[];
  /** Placeholder product handles for Shopify connection */
  handles?: string[];
}

/** Placeholder product structure for pre-Shopify display */
const PLACEHOLDER_PRODUCTS: Array<{ handle: string; title: string; price: string; type: string }> = [
  { handle: "kokkekniv-damaskus", title: "Kokkekniv — Damaskus", price: "1.299,00", type: "Kniv" },
  { handle: "slibesten-1000-5000", title: "Slibesten 1000/5000", price: "449,00", type: "Slibesten" },
  { handle: "magnetisk-knivholder-valnod", title: "Magnetisk holder — Valnød", price: "599,00", type: "Holder" },
];

export function ProductRecommendationBlock({ title = "Anbefalede produkter", subtitle, products, handles }: ProductRecommendationBlockProps) {
  const addItem = useCartStore((s) => s.addItem);

  if (products && products.length > 0) {
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
              const variant = node.variants.edges[0]?.node;
              return (
                <Link key={node.id} to="/product/$handle" params={{ handle: node.handle }} className="group block">
                  <div className="aspect-[4/5] rounded-lg overflow-hidden bg-linen mb-4">
                    {image ? (
                      <img src={image.url} alt={image.altText || node.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-serif">Langsomt Nok</div>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-copper uppercase tracking-wider">{node.productType}</span>
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

  // Placeholder mode
  return (
    <section className="section-padding">
      <div className="container-calm">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl mb-3">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-editorial mx-auto">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PLACEHOLDER_PRODUCTS.map((p) => (
            <Link key={p.handle} to="/product/$handle" params={{ handle: p.handle }} className="group block">
              <div className="aspect-[4/5] rounded-lg overflow-hidden bg-linen mb-4 flex items-center justify-center text-muted-foreground/20 font-serif text-lg">
                {p.type}
              </div>
              <span className="text-[10px] font-medium text-copper uppercase tracking-wider">{p.type}</span>
              <h3 className="font-serif text-base mt-1 group-hover:text-walnut transition-colors">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{p.price} kr.</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
