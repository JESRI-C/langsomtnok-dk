import { Link } from "@tanstack/react-router";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const { node } = product;
  const variant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Tilføjet med ro", {
      description: node.title,
      position: "top-center",
    });
  };

  return (
    <Link
      to="/product/$handle"
      params={{ handle: node.handle }}
      className="group block"
    >
      <div className="aspect-[4/5] rounded-lg overflow-hidden bg-linen mb-4">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
            <span className="font-serif text-lg">Langsomt Nok</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="font-serif text-base leading-tight group-hover:text-walnut transition-colors">
          {node.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {node.description}
        </p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-medium">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isLoading || !variant?.availableForSale}
            className="text-xs font-medium text-cta hover:text-cta/80 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : !variant?.availableForSale ? (
              "Udsolgt"
            ) : (
              "Tilføj til ritualet"
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
