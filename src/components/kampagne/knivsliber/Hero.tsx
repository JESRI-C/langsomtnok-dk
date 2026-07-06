import { PriceBadge, PriceLine } from "./PriceBadge";
import { DirectAddToCart } from "@/components/knivsliber-landing/DirectAddToCart";
import { KNIVSLIBER_CONFIG } from "@/lib/knivsliber-config";

interface HeroProps {
  imageUrl?: string;
  videoUrl?: string;
  posterUrl?: string;
  alt: string;
  eyebrow?: string;
  headline: React.ReactNode;
  subline: string;
  sourcePage: string;
  campaignName: string;
}

export function Hero({
  imageUrl,
  videoUrl,
  posterUrl,
  alt,
  eyebrow,
  headline,
  subline,
  sourcePage,
  campaignName,
}: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#F4F1EA]">
      <div className="grid md:grid-cols-[1.15fr_1fr] min-h-[70vh] md:min-h-[85vh]">
        {/* Media */}
        <div className="relative order-1 md:order-2 h-[52vh] md:h-auto bg-[#E6E0D7]">
          {videoUrl ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={videoUrl}
              poster={posterUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={alt}
            />
          ) : (
            <img
              src={imageUrl}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              // @ts-expect-error fetchpriority is valid HTML
              fetchpriority="high"
            />
          )}
          <div className="pointer-events-none absolute right-4 top-4 md:right-6 md:top-6">
            <PriceBadge size="lg" />
          </div>
        </div>

        {/* Copy */}
        <div className="order-2 md:order-1 flex flex-col justify-center px-6 py-14 md:px-14 md:py-20">
          <div className="max-w-lg">
            {eyebrow && (
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#6E7B4F] mb-6">
                {eyebrow}
              </p>
            )}
            <h1 className="font-serif text-4xl leading-[1.05] md:text-6xl md:leading-[1.02] text-[#2D2D2D]">
              {headline}
            </h1>
            <p className="mt-6 max-w-md text-base md:text-lg text-[#2D2D2D]/75 leading-relaxed">
              {subline}
            </p>
            <div className="mt-8">
              <PriceLine className="text-[#2D2D2D] mb-6" />
              <div className="max-w-md">
                <DirectAddToCart
                  productHandle={KNIVSLIBER_CONFIG.PRODUCT_HANDLE}
                  variantId={KNIVSLIBER_CONFIG.DEFAULT_VARIANT_ID}
                  sourcePage={sourcePage}
                  campaignName={campaignName}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
