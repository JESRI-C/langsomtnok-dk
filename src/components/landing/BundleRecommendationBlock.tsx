import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

interface Bundle {
  handle: string;
  title: string;
  description: string;
  price: string;
  items: string[];
  cta: string;
}

interface BundleRecommendationBlockProps {
  title?: string;
  subtitle?: string;
  bundles?: Bundle[];
}

const DEFAULT_BUNDLES: Bundle[] = [
  {
    handle: "ritual-startkit",
    title: "Ritual Startkit",
    description: "En god begyndelse: kniv, slibesten og pleje.",
    price: "1.499",
    items: ["Kokkekniv i damaskus-stål", "Slibesten 1000/5000", "Plejeolie i valnøddetræ"],
    cta: "Start her",
  },
  {
    handle: "craft-and-care",
    title: "Craft & Care",
    description: "Til dig, der vil holde skarpheden levende.",
    price: "899",
    items: ["Slibesten 1000/5000", "Læderstrop", "Plejeolie"],
    cta: "Se plejesættet",
  },
  {
    handle: "full-focus-set",
    title: "Full Focus Set",
    description: "Et samlet udtryk til køkkenet.",
    price: "2.499",
    items: ["Kokkekniv i damaskus-stål", "Santokukniv", "Magnetisk holder i valnød", "Plejeolie"],
    cta: "Udforsk sættet",
  },
];

export function BundleRecommendationBlock({ title = "Sæt ro sammen", subtitle, bundles = DEFAULT_BUNDLES }: BundleRecommendationBlockProps) {
  return (
    <section className="section-padding bg-soft">
      <div className="container-calm">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl mb-3">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-editorial mx-auto">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {bundles.map((bundle) => (
            <div key={bundle.handle} className="bg-background rounded-lg p-8 border border-border flex flex-col">
              <h3 className="font-serif text-xl mb-2">{bundle.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{bundle.description}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {bundle.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-cta mt-0.5">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <span className="font-serif text-lg">{bundle.price} kr.</span>
                <Button
                  asChild
                  variant="cta"
                  size="sm"
                  onClick={() => trackEvent('bundle_cta_click', { label: bundle.title })}
                >
                  <Link to="/product/$handle" params={{ handle: bundle.handle }}>{bundle.cta}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
