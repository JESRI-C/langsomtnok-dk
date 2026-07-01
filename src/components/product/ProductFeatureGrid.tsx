/**
 * ProductFeatureGrid — "Hvorfor dette redskab" 3-point visual grid.
 * Sits below the hero, gives mobile users a fast scan of value.
 */
import { Leaf, Shield, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface FeaturePoint {
  icon: LucideIcon;
  title: string;
  body: string;
}

interface ProductFeatureGridProps {
  features?: FeaturePoint[];
  eyebrow?: string;
  heading?: string;
}

const DEFAULT_FEATURES: FeaturePoint[] = [
  { icon: Leaf, title: "Massiv valnød", body: "Massivt træ, olieret hånd — patina der modnes med tiden." },
  { icon: Shield, title: "Beskytter æggen", body: "Kraftige neodym-magneter holder knivene fri af skuffens slid." },
  { icon: Sparkles, title: "Uden boremaskine", body: "Monteres med industriel 3M-tape — færdig på under fem minutter." },
];

export function ProductFeatureGrid({
  features = DEFAULT_FEATURES,
  eyebrow = "Hvorfor dette redskab",
  heading = "Tre grunde til at det hører hjemme i køkkenet",
}: ProductFeatureGridProps) {
  return (
    <section className="mt-16 md:mt-24">
      <header className="max-w-2xl mb-8 md:mb-10">
        <p className="text-[11px] uppercase tracking-[0.25em] text-copper mb-3">{eyebrow}</p>
        <h2 className="font-serif text-2xl md:text-3xl leading-[1.15]">{heading}</h2>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {features.map((f) => (
          <div key={f.title} className="p-6 md:p-7 rounded-[14px] bg-soft/40 border border-border/40">
            <div className="w-10 h-10 rounded-full bg-cta/10 flex items-center justify-center mb-4">
              <f.icon className="w-5 h-5 text-cta" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-lg mb-2 text-foreground">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
