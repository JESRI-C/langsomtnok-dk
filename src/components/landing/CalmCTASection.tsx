import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

interface CTAConfig {
  label: string;
  to: string;
}

interface CalmCTASectionProps {
  headline: string;
  text?: string;
  cta: CTAConfig;
  secondaryCta?: CTAConfig;
  variant?: "light" | "dark" | "warm";
  /** Tracking */
  trackingPage?: string;
  trackingCategory?: string;
}

export function CalmCTASection({
  headline,
  text,
  cta,
  secondaryCta,
  variant = "warm",
  trackingPage = "",
  trackingCategory = "brand_universe",
}: CalmCTASectionProps) {
  const bgMap = { light: "bg-background", dark: "bg-deep", warm: "bg-linen" };
  const textMap = { light: "text-foreground", dark: "text-deep-foreground", warm: "text-foreground" };
  const subMap = { light: "text-muted-foreground", dark: "text-deep-foreground/60", warm: "text-muted-foreground" };

  return (
    <section className={`section-padding ${bgMap[variant]}`}>
      <div className="container-calm text-center max-w-2xl mx-auto">
        <h2 className={`font-serif text-3xl md:text-4xl mb-4 ${textMap[variant]}`}>{headline}</h2>
        {text && <p className={`text-editorial mx-auto mb-8 ${subMap[variant]}`}>{text}</p>}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild variant="cta" size="lg" onClick={() => trackEvent('cta_click_landing_primary', { label: cta.label })}>
            <Link
              to={cta.to}
              className="cta-primary"
              data-track-event="landing_cta_click"
              data-track-page={trackingPage}
              data-track-intent="view_products"
              data-track-product-category={trackingCategory}
            >
              {cta.label}
            </Link>
          </Button>
          {secondaryCta && (
            <Button
              asChild
              variant="outline"
              size="lg"
              className={variant === "dark" ? "border-deep-foreground/20 text-deep-foreground hover:bg-deep-foreground/5" : ""}
            >
              <Link
                to={secondaryCta.to}
                className="cta-secondary"
                data-track-event="landing_cta_click"
                data-track-page={trackingPage}
                data-track-intent="explore_related"
                data-track-product-category={trackingCategory}
              >
                {secondaryCta.label}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
