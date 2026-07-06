import { trackEvent } from "@/lib/analytics";

interface Props {
  href: string;
  label?: string;
  sourcePage?: string;
  campaignName?: string;
  className?: string;
}

export function BuyButton({
  href,
  label = "Køb knivsliberen",
  sourcePage,
  campaignName,
  className = "",
}: Props) {
  return (
    <a
      href={href}
      onClick={() => {
        if (sourcePage) {
          trackEvent("landing_page_primary_cta_click", {
            source_page: sourcePage,
            campaign: campaignName,
            destination: href,
          });
        }
      }}
      className={`inline-flex items-center justify-center rounded-full bg-[#2D2D2D] px-10 py-5 text-[#F4F1EA] text-sm md:text-base tracking-[0.16em] uppercase font-medium transition-all hover:bg-[#6E7B4F] focus:outline-none focus:ring-2 focus:ring-[#6E7B4F] focus:ring-offset-2 focus:ring-offset-[#F4F1EA] ${className}`}
    >
      {label}
    </a>
  );
}
