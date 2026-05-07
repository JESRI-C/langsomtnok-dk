import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ImageSlot } from "@/components/ImageSlot";

interface GiftTier {
  budget: string;
  title: string;
  description: string;
  handle: string;
}

interface GiftGuideBlockProps {
  title?: string;
  subtitle?: string;
  tiers?: GiftTier[];
}

const DEFAULT_TIERS: GiftTier[] = [
  { budget: "Under 300 kr.", title: "Plejeolie & voks", description: "Et lille, omsorgsfuldt ritual.", handle: "pleje-ritualer" },
  { budget: "300–800 kr.", title: "Slibesten eller læderstrop", description: "For den, der allerede har redskaberne.", handle: "slibesten" },
  { budget: "800–1.500 kr.", title: "Kokkekniv i damaskus", description: "Det vigtigste redskab i ethvert køkken.", handle: "knive" },
  { budget: "Over 1.500 kr.", title: "Ritual Startkit", description: "Kniv, sten og olie samlet i ét.", handle: "startkits" },
];

export function GiftGuideBlock({ title = "Gaver efter budget", subtitle, tiers = DEFAULT_TIERS }: GiftGuideBlockProps) {
  return (
    <section className="section-padding">
      <div className="container-calm">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl mb-3">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-editorial mx-auto">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <Link
              key={tier.budget}
              to="/collections/$handle"
              params={{ handle: tier.handle }}
              className="group block p-6 rounded-lg border border-border hover:border-walnut/30 hover:shadow-sm transition-all duration-300"
            >
              <span className="text-xs font-medium text-copper uppercase tracking-wider">{tier.budget}</span>
              <h3 className="font-serif text-lg mt-2 mb-2 group-hover:text-walnut transition-colors">{tier.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
              <span className="text-xs text-cta font-medium">Se udvalget →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
