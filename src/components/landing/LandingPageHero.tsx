import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface LandingPageHeroProps {
  headline: string;
  subheadline: string;
  primaryCta: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
  /** Optional hero image URL — renders as background */
  image?: string;
  /** "light" for light bg, "dark" for dark overlay on image */
  variant?: "light" | "dark";
}

export function LandingPageHero({
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  image,
  variant = "light",
}: LandingPageHeroProps) {
  const isDark = variant === "dark" || !!image;

  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={image ? { backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    >
      {image && <div className="absolute inset-0 bg-deep/60" />}
      {!image && <div className="absolute inset-0 bg-soft" />}

      <div className="relative z-10 container-calm max-w-3xl text-center py-24 md:py-32 fade-in-up">
        <h1
          className={`font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-6 ${
            isDark ? "text-deep-foreground" : "text-foreground"
          }`}
        >
          {headline}
        </h1>
        <p
          className={`text-editorial mx-auto text-lg md:text-xl mb-10 ${
            isDark ? "text-deep-foreground/70" : "text-muted-foreground"
          }`}
        >
          {subheadline}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild variant="cta" size="lg" className="min-w-[200px]">
            <Link to={primaryCta.to}>{primaryCta.label}</Link>
          </Button>
          {secondaryCta && (
            <Button asChild variant="outline" size="lg" className={`min-w-[200px] ${isDark ? "border-deep-foreground/20 text-deep-foreground hover:bg-deep-foreground/5" : ""}`}>
              <Link to={secondaryCta.to}>{secondaryCta.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
