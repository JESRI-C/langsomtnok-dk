/**
 * SocialProofPlaceholder — diskret linje der signalerer at produktet er valgt
 * af rigtige kunder, uden at love stjerner eller antal. Bruges indtil vi har
 * en anmeldelseskilde (Judge.me / Trustpilot). Rolig, whispered typografi.
 */
import { Sprout } from "lucide-react";

interface Props {
  /** Kort valgfri kontekst — fx "af madelskere" */
  context?: string;
  /** Kompakt variant til plads under CTA */
  compact?: boolean;
}

export function SocialProofPlaceholder({ context, compact = false }: Props) {
  const label = context
    ? `Valgt af tidlige kunder ${context}`
    : "Valgt af tidlige kunder — vi samler snart de første rolige ord.";

  if (compact) {
    return (
      <p className="flex items-center gap-2 text-xs text-muted-foreground/80 mt-3">
        <Sprout className="h-3.5 w-3.5 text-cta/70" strokeWidth={1.5} aria-hidden />
        <span>{label}</span>
      </p>
    );
  }

  return (
    <div className="border-y border-border/40 bg-soft/40 px-5 py-3 rounded-md">
      <p className="flex items-center gap-2 text-sm text-foreground/70">
        <Sprout className="h-4 w-4 text-cta" strokeWidth={1.5} aria-hidden />
        <span>{label}</span>
      </p>
    </div>
  );
}
