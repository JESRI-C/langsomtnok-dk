import { PriceBadge, PriceLine } from "./PriceBadge";
import { BuyButton } from "./BuyButton";

interface HeroProps {
  videoUrl: string;
  posterUrl: string;
  alt: string;
  eyebrow?: string;
  headline: React.ReactNode;
  subline: string;
  buyUrl: string;
  sourcePage: string;
  campaignName: string;
}

export function Hero({
  videoUrl,
  posterUrl,
  alt,
  eyebrow,
  headline,
  subline,
  buyUrl,
  sourcePage,
  campaignName,
}: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#2D2D2D]">
      <div className="relative h-[92vh] min-h-[620px] w-full">
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
        {/* Dark gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/25" />

        {/* Badge */}
        <div className="absolute right-5 top-5 md:right-10 md:top-10">
          <PriceBadge size="lg" />
        </div>

        {/* Copy */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-12 md:px-16 md:pb-20 text-[#F4F1EA]">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#C9D4B5] mb-5">
                {eyebrow}
              </p>
            )}
            <h1 className="font-serif text-4xl leading-[1.05] md:text-6xl md:leading-[1.02]">
              {headline}
            </h1>
            <p className="mt-5 max-w-md text-base md:text-lg text-[#F4F1EA]/85 leading-relaxed">
              {subline}
            </p>
            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
              <PriceLine className="text-[#F4F1EA]" />
              <BuyButton
                href={buyUrl}
                sourcePage={sourcePage}
                campaignName={campaignName}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
