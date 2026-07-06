import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { fetchProductsByHandles, type ShopifyProduct } from "@/lib/shopify";
import { KNIVSLIBER_CONFIG } from "@/lib/knivsliber-config";
import { trackAddToCart, trackEvent } from "@/lib/analytics";

interface Props {
  sourcePage: string;
  campaignName: string;
}

export function StickyBuyBar({ sourcePage, campaignName }: Props) {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
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
      placement: "sticky",
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

    setOpen(true);
  };

  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-[#F4F1EA] border-t border-[#2D2D2D]/10 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)]">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#6E7B4F] leading-none">
            Knivsliber · Valnød
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-serif text-lg text-[#2D2D2D]">379 kr</span>
            <span className="text-xs text-[#2D2D2D]/50 line-through">499 kr</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={!product || isLoading}
          className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#2D2D2D] px-6 py-3 text-[#F4F1EA] text-xs tracking-[0.14em] uppercase font-medium hover:bg-[#6E7B4F] transition-colors disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Læg i kurv"}
        </button>
      </div>
    </div>
  );
}
