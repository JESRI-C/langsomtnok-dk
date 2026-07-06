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
  sourcePage,
  campaignName,
}: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#F8F6F3] md:bg-[#2D2D2D]">
      {/* ─────────────────────────────────────────────────────────────
          MOBILE — editorial stack: tekst · indrammet video · pris + CTA
          Videoen får plads til at ånde, underteksterne dækkes ikke.
         ───────────────────────────────────────────────────────────── */}
      <div className="md:hidden bg-[#F8F6F3] px-5 pt-8 pb-10">
        <div className="mx-auto flex max-w-[420px] flex-col">
          {/* Header copy */}
          <div className="text-center mb-6">
            {eyebrow && (
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#5A3B2E] font-semibold mb-3">
                {eyebrow}
              </p>
            )}
            <h1 className="font-serif text-[32px] leading-[1.1] text-[#1E1E1E] mb-4">
              {headline}
            </h1>
            <p className="text-sm leading-relaxed text-[#1E1E1E]/70 max-w-[300px] mx-auto">
              {subline}
            </p>
          </div>

          {/* Framed video */}
          <div className="relative mb-8">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-[#5A3B2E]/10 bg-[#2D2D2D]">
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
              {/* Badge — inde i rammen, øverst højre */}
              <div className="absolute top-4 right-4">
                <PriceBadge size="sm" />
              </div>
            </div>
          </div>

          {/* Price + CTA below video */}
          <div className="flex flex-col items-center gap-5">
            <PriceLine className="text-[#1E1E1E] justify-center" />
            <BuyButton
              sourcePage={sourcePage}
              campaignName={campaignName}
            />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          DESKTOP — uændret: fuldskærms video med overlay-copy
         ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:block relative h-[92vh] min-h-[620px] w-full">
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
        <div className="absolute right-10 top-1/2 -translate-y-1/2">
          <PriceBadge size="lg" />
        </div>

        {/* Copy — placeret i toppen så undertekster nederst i videoen ikke dækkes */}
        <div className="absolute inset-x-0 top-0 px-16 pt-14 text-[#F4F1EA]">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#C9D4B5] mb-4">
                {eyebrow}
              </p>
            )}
            <h1 className="font-serif text-6xl leading-[1.02]">
              {headline}
            </h1>
            <p className="mt-4 max-w-md text-lg text-[#F4F1EA]/85 leading-relaxed">
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
