import { trackEvent } from "@/lib/analytics";

interface Props {
  buyUrl: string;
  sourcePage: string;
  campaignName: string;
}

export function StickyBuyBar({ buyUrl, sourcePage, campaignName }: Props) {
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
        <a
          href={buyUrl}
          onClick={() => trackEvent("landing_page_primary_cta_click", {
            source_page: sourcePage,
            campaign: campaignName,
          })}
          className="shrink-0 rounded-full bg-[#2D2D2D] px-6 py-3 text-[#F4F1EA] text-xs tracking-[0.14em] uppercase font-medium hover:bg-[#6E7B4F] transition-colors"
        >
          Køb nu
        </a>
      </div>
    </div>
  );
}
