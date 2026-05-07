import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY, formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, Minus, Plus, Check, Truck, RotateCcw, Shield, Package } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.handle} — Langsomt Nok` },
    ],
  }),
  component: ProductPage,
});

interface ProductNode {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  handle: string;
  productType: string;
  tags: string[];
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPriceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: { edges: Array<{ node: { id: string; title: string; price: { amount: string; currencyCode: string }; availableForSale: boolean; selectedOptions: Array<{ name: string; value: string }> } }> };
  options: Array<{ name: string; values: string[] }>;
}

function ProductPage() {
  const { handle } = Route.useParams();
  const [product, setProduct] = useState<ProductNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    setLoading(true);
    storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle })
      .then((data) => {
        if (data?.data?.productByHandle) setProduct(data.data.productByHandle);
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

  const handleAddToCart = async () => {
    if (!variant) return;
    const shopifyProduct: ShopifyProduct = {
      node: {
        id: product.id,
        title: product.title,
        description: product.description,
        handle: product.handle,
        productType: product.productType,
        tags: product.tags,
        priceRange: product.priceRange,
        images: product.images,
        variants: product.variants,
        options: product.options,
      }
    };
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

  return (
    <div className="pt-24 pb-16">
      <div className="container-calm">
        <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block">
          ← Tilbage til shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-linen">
              {images[selectedImage]?.node && (
                <img
                  src={images[selectedImage].node.url}
                  alt={images[selectedImage].node.altText || product.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      i === selectedImage ? "border-walnut" : "border-transparent"
                    }`}
                  >
                    <img src={img.node.url} alt={img.node.altText || ""} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl mb-3">{product.title}</h1>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <div className="text-2xl font-serif">
              {variant && formatPrice(variant.price.amount, variant.price.currencyCode)}
            </div>

            {/* Variant selector */}
            {hasMultipleVariants && (
              <div>
                <label className="text-sm font-medium mb-2 block">Variant</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map((v, i) => (
                    <button
                      key={v.node.id}
                      onClick={() => setSelectedVariantIdx(i)}
                      disabled={!v.node.availableForSale}
                      className={`px-4 py-2 rounded-md border text-sm transition-all ${
                        i === selectedVariantIdx
                          ? "border-walnut bg-walnut/5 text-walnut"
                          : "border-border hover:border-walnut/50"
                      } disabled:opacity-30 disabled:cursor-not-allowed`}
                    >
                      {v.node.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to cart */}
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
                {isCartLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tilføj til ritualet"}
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

            {/* Product story */}
            <div className="pt-6 border-t border-border">
              <h2 className="font-serif text-xl mb-3">Skabt til rolig præcision</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Et godt snit begynder før kniven rammer brættet. Det begynder med valget af materiale, med tålmodighed i smedjen og med respekt for det køkken, redskabet ender i.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
