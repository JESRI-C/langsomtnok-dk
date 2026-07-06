import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { fetchProductsByHandles, type ShopifyProduct } from "@/lib/shopify";
import { KNIVSLIBER_CONFIG } from "@/lib/knivsliber-config";
import { trackAddToCart, trackEvent } from "@/lib/analytics";

interface Props {
  label?: string;
  sourcePage: string;
  campaignName: string;
  className?: string;
}

export function BuyButton({
  label = "Køb knivsliberen",
  sourcePage,
  campaignName,
  className = "",
}: Props) {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    let cancelled = false;
    fetchProductsByHandles([KNIVSLIBER_CONFIG.PRODUCT_HANDLE])
      .then((list) => !cancelled && setProduct(list[0] ?? null))
      .catch(() => !cancelled && setProduct(null));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleClick = async () => {
    if (!product) return;
    const variant =
      product.node.variants.edges.find(
        (e) => e.node.id === KNIVSLIBER_CONFIG.DEFAULT_VARIANT_ID,
      )?.node ?? product.node.variants.edges[0]?.node;
    if (!variant) return;

    trackEvent("landing_page_primary_cta_click", {
      source_page: sourcePage,
      campaign: campaignName,
      variant_id: variant.id,
    });

    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });

    trackAddToCart({
      product_id: product.node.id,
      product_title: product.node.title,
      variant_id: variant.id,
      variant_title: variant.title,
      price: parseFloat(variant.price.amount),
      currency: variant.price.currencyCode,
      quantity: 1,
      product_type: product.node.productType,
    });

    setJustAdded(true);
    setOpen(true);
    window.setTimeout(() => setJustAdded(false), 2400);
  };

  const disabled = !product || isLoading;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#2D2D2D] px-10 py-5 text-[#F4F1EA] text-sm md:text-base tracking-[0.16em] uppercase font-medium transition-all hover:bg-[#6E7B4F] focus:outline-none focus:ring-2 focus:ring-[#6E7B4F] focus:ring-offset-2 focus:ring-offset-[#F4F1EA] disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" /> Lægger i kurv…
        </>
      ) : justAdded ? (
        <>
          <Check className="w-4 h-4" /> Lagt i kurven
        </>
      ) : (
        label
      )}
    </button>
  );
}
