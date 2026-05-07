/**
 * "Passer til dig, hvis…" + "Hvis du er i tvivl" sections
 * for product pages — reduces hesitation and builds confidence.
 * Accepts parsed fit points from Shopify descriptions.
 */

import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface ProductFitSectionProps {
  fitPoints?: string[];
  doubtText?: string;
  doubtCta?: { label: string; to: string };
}

export function ProductFitSection({
  fitPoints,
  doubtText = "Start enkelt. Vælg ét godt redskab og lær ritualet stille og roligt.",
  doubtCta = { label: "Begynd med dette ritual", to: "/shop" },
}: ProductFitSectionProps) {
  if (!fitPoints || fitPoints.length === 0) return null;

  return (
    <>
      {/* Fit section */}
      <section className="mt-16 max-w-3xl">
        <h2 className="font-serif text-2xl mb-5">Passer til dig, hvis…</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fitPoints.map((point) => (
            <div key={point} className="flex items-start gap-3 p-4 rounded-lg bg-soft/50 border border-border/30">
              <span className="text-cta mt-0.5 flex-shrink-0 text-sm">✓</span>
              <span className="text-sm text-muted-foreground leading-relaxed">{point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Doubt removal */}
      <section className="mt-12 max-w-3xl">
        <div className="p-6 rounded-lg bg-soft/60 border border-border/50">
          <h3 className="font-serif text-lg mb-3">Hvis du er i tvivl</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{doubtText}</p>
          <Button variant="cta" size="default" asChild>
            <Link to={doubtCta.to}>{doubtCta.label}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
