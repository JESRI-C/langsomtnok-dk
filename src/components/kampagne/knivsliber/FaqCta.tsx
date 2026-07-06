import { PriceBadge, PriceLine } from "./PriceBadge";
import { DirectAddToCart } from "@/components/knivsliber-landing/DirectAddToCart";
import { KNIVSLIBER_CONFIG } from "@/lib/knivsliber-config";

interface FaqItem { q: string; a: string; }

interface Props {
  faq: FaqItem[];
  ctaHeadline: React.ReactNode;
  sourcePage: string;
  campaignName: string;
}

export function FaqCta({ faq, ctaHeadline, sourcePage, campaignName }: Props) {
  return (
    <section className="bg-[#F4F1EA] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-serif text-3xl md:text-4xl text-[#2D2D2D] text-center leading-tight">
          Spørgsmål
        </h2>
        <dl className="mt-12 divide-y divide-[#2D2D2D]/10 border-y border-[#2D2D2D]/10">
          {faq.map((f, i) => (
            <details key={i} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[#2D2D2D]">
                <dt className="font-serif text-lg md:text-xl leading-snug">{f.q}</dt>
                <span className="text-[#6E7B4F] text-xl transition-transform group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <dd className="mt-3 text-[#2D2D2D]/75 leading-relaxed text-base">{f.a}</dd>
            </details>
          ))}
        </dl>

        <div className="mt-20 flex flex-col items-center gap-6 text-center">
          <PriceBadge size="lg" />
          <h3 className="font-serif text-3xl md:text-4xl text-[#2D2D2D] leading-tight max-w-md">
            {ctaHeadline}
          </h3>
          <PriceLine className="text-[#2D2D2D]" />
          <div className="w-full max-w-md">
            <DirectAddToCart
              productHandle={KNIVSLIBER_CONFIG.PRODUCT_HANDLE}
              variantId={KNIVSLIBER_CONFIG.DEFAULT_VARIANT_ID}
              sourcePage={sourcePage}
              campaignName={campaignName}
            />
          </div>
          <p className="text-xs text-[#2D2D2D]/50 max-w-xs">
            Lægges direkte i din kurv — ingen omvej.
          </p>
        </div>
      </div>
    </section>
  );
}
