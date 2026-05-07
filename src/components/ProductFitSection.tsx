/**
 * "Passer til dig, hvis…" + "Hvis du er i tvivl" sections
 * for product pages — reduces hesitation and builds confidence.
 */

import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface ProductFitSectionProps {
  fitPoints?: string[];
  doubtText?: string;
  doubtCta?: { label: string; to: string };
}

const DEFAULT_FIT_POINTS = [
  "Du vil have et værktøj, der føles rigtigt i hånden",
  "Du ønsker mere ro og præcision i madlavningen",
  "Du vil vælge noget, der holder længere end en sæson",
];

export function ProductFitSection({
  fitPoints = DEFAULT_FIT_POINTS,
  doubtText = "Start enkelt. Vælg én god kniv, én god slibesten og lær ritualet stille og roligt.",
  doubtCta = { label: "Begynd med dette ritual", to: "/shop" },
}: ProductFitSectionProps) {
  return (
    <>
      {/* Fit section */}
      <section className="mt-16 max-w-3xl">
        <h2 className="font-serif text-2xl mb-5">Passer til dig, hvis…</h2>
        <ul className="space-y-3">
          {fitPoints.map((point) => (
            <li key={point} className="flex items-start gap-3 text-muted-foreground text-sm leading-relaxed">
              <span className="text-cta mt-0.5 flex-shrink-0">✓</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
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
