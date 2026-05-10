import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ImageSlot } from "@/components/ImageSlot";

interface CTAConfig {
  label: string;
  to: string;
  className?: string;
  intent?: string;
}

interface LandingPageHeroProps {
  headline: string;
  subheadline: string;
  primaryCta: CTAConfig;
  secondaryCta?: CTAConfig;
  /** ImageSlot props for the background */
  imageSlot?: {
    name: string;
    motif: string;
    src?: string;
    alt?: string;
  };
  variant?: "light" | "dark" | "overlay";
  /** Tracking metadata propagated to both CTAs */
  trackingPage?: string;
  trackingCategory?: string;
}

export function LandingPageHero({
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  imageSlot,
  variant = "overlay",
  trackingPage = "",
  trackingCategory = "brand_universe",
}: LandingPageHeroProps) {
  const isDark = variant === "dark" || variant === "overlay";
  const heroAlt = imageSlot?.alt || imageSlot?.motif || "";

  const trackProps = (intent: string, cls: string) => ({
    className: cls,
    "data-track-event": "hero_cta_click",
    "data-track-page": trackingPage,
    "data-track-intent": intent,
    "data-track-product-category": trackingCategory,
  });

  // Overlay variant: image as background with text on top
  if (variant === "overlay" && imageSlot) {
    return (
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {imageSlot.src ? (
          <>
            <img src={imageSlot.src} alt={heroAlt} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-deep/60" />
          </>
        ) : (
          <div className="absolute inset-0">
            <ImageSlot name={imageSlot.name} ratio="16/9" motif={imageSlot.motif} alt={heroAlt} variant="dark" className="w-full h-full rounded-none" />
            <div className="absolute inset-0 bg-deep/40" />
          </div>
        )}
        <div className="relative z-10 container-calm max-w-3xl text-center py-24 md:py-32 fade-in-up">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-6 text-deep-foreground">
            {headline}
          </h1>
          <p className="text-editorial mx-auto text-lg md:text-xl mb-10 text-deep-foreground/70">
            {subheadline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="cta" size="lg" className="min-w-[200px]">
              <Link to={primaryCta.to} {...trackProps(primaryCta.intent || "view_products", `cta-primary ${primaryCta.className || ""}`.trim())}>
                {primaryCta.label}
              </Link>
            </Button>
            {secondaryCta && (
              <Button asChild variant="hero-outline" size="lg" className="min-w-[200px] border-deep-foreground/30 text-deep-foreground hover:bg-deep-foreground/10">
                <Link to={secondaryCta.to} {...trackProps(secondaryCta.intent || "explore_related", `cta-secondary ${secondaryCta.className || ""}`.trim())}>
                  {secondaryCta.label}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Light/dark text-only hero with optional image below
  return (
    <section className={`section-padding ${isDark ? "bg-deep" : "bg-soft"}`}>
      <div className="container-calm fade-in-up">
        <div className="max-w-3xl mx-auto text-center py-12 md:py-20">
          <h1 className={`font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-6 ${isDark ? "text-deep-foreground" : "text-foreground"}`}>
            {headline}
          </h1>
          <p className={`text-editorial mx-auto text-lg md:text-xl mb-10 ${isDark ? "text-deep-foreground/70" : "text-muted-foreground"}`}>
            {subheadline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="cta" size="lg" className="min-w-[200px]">
              <Link to={primaryCta.to} {...trackProps(primaryCta.intent || "view_products", `cta-primary ${primaryCta.className || ""}`.trim())}>
                {primaryCta.label}
              </Link>
            </Button>
            {secondaryCta && (
              <Button asChild variant="outline" size="lg" className={`min-w-[200px] ${isDark ? "border-deep-foreground/20 text-deep-foreground hover:bg-deep-foreground/5" : ""}`}>
                <Link to={secondaryCta.to} {...trackProps(secondaryCta.intent || "explore_related", `cta-secondary ${secondaryCta.className || ""}`.trim())}>
                  {secondaryCta.label}
                </Link>
              </Button>
            )}
          </div>
        </div>
        {imageSlot && (
          <div className="max-w-5xl mx-auto mt-4">
            <ImageSlot
              name={imageSlot.name}
              ratio="21/9"
              src={imageSlot.src}
              motif={imageSlot.motif}
              alt={heroAlt}
              variant={isDark ? "dark" : "warm"}
            />
          </div>
        )}
      </div>
    </section>
  );
}
