/**
 * Sticky bottom bar til mobil — altid tilgængelig købsknap på landingssiderne.
 * Vises kun under `md` breakpoint.
 */
import { DirectAddToCart } from "./DirectAddToCart";
import { KNIVSLIBER_CONFIG } from "@/lib/knivsliber-config";

export function StickyBuyBar({
  sourcePage,
  campaignName,
}: {
  sourcePage: string;
  campaignName: string;
}) {
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-40 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)]">
      <DirectAddToCart
        productHandle={KNIVSLIBER_CONFIG.PRODUCT_HANDLE}
        variantId={KNIVSLIBER_CONFIG.DEFAULT_VARIANT_ID}
        sourcePage={sourcePage}
        campaignName={campaignName}
        compact
      />
    </div>
  );
}
