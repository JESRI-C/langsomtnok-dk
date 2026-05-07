import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface Bundle {
  handle: string;
  title: string;
  description: string;
  price: string;
  items: string[];
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
    description: "Det første skridt mod et roligere køkken.",
    price: "1.499",
    items: ["Kokkekniv i damaskus-stål", "Slibesten 1000/5000", "Plejeolie i valnøddetræ"],
  },
  {
    handle: "craft-and-care",
    title: "Craft & Care",
    description: "Alt hvad du behøver til vedligehold.",
    price: "899",
    items: ["Slibesten 1000/5000", "Læderstrop", "Plejeolie"],
  },
];

export function BundleRecommendationBlock({ title = "Startkits", subtitle, bundles = DEFAULT_BUNDLES }: BundleRecommendationBlockProps) {
  return (
    <section className="section-padding bg-soft">
      <div className="container-calm">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl mb-3">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-editorial mx-auto">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {bundles.map((bundle) => (
            <div key={bundle.handle} className="bg-background rounded-lg p-8 border border-border">
              <h3 className="font-serif text-xl mb-2">{bundle.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{bundle.description}</p>
              <ul className="space-y-2 mb-6">
                {bundle.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-cta mt-0.5">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg">{bundle.price} kr.</span>
                <Button asChild variant="cta" size="sm">
                  <Link to="/product/$handle" params={{ handle: bundle.handle }}>Udforsk kit</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
