import { PriceBadge, PriceLine } from "./PriceBadge";
import { BuyButton } from "./BuyButton";

interface HeroProps {
  videoUrl: string;
  posterUrl: string;
  alt: string;
  eyebrow?: string;
  headline: React.ReactNode;
  subline: string;
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
        {/* Gradient — top-heavy, so undertekster nederst i videoen står frit */}
        <div className="absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-black/80 via-black/45 to-transparent" />

        {/* Badge — rykket ned i højre side, væk fra tekst og undertekster */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 md:right-10">
          <PriceBadge size="lg" />
        </div>

        {/* Copy — placeret i toppen så undertekster nederst i videoen ikke dækkes */}
        <div className="absolute inset-x-0 top-0 px-6 pt-10 md:px-16 md:pt-14 text-[#F4F1EA]">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#C9D4B5] mb-4">
                {eyebrow}
              </p>
            )}
            <h1 className="font-serif text-4xl leading-[1.05] md:text-6xl md:leading-[1.02]">
              {headline}
            </h1>
            <p className="mt-4 max-w-md text-base md:text-lg text-[#F4F1EA]/85 leading-relaxed">
              {subline}
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <PriceLine className="text-[#F4F1EA]" />
              <BuyButton
                
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
