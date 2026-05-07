import { Truck, RotateCcw, Shield, Package, Heart, Leaf } from "lucide-react";

interface TrustBarProps {
  variant?: "light" | "dark";
  layout?: "horizontal" | "grid";
}

const TRUST_ITEMS = [
  { icon: Package, text: "Pakket med omhu" },
  { icon: Shield, text: "Sikker betaling" },
  { icon: RotateCcw, text: "30 dages returret" },
  { icon: Truck, text: "Sendes fra Danmark" },
  { icon: Heart, text: "Plejeguide medfølger" },
  { icon: Leaf, text: "Skabt til at vare" },
];

export function TrustBar({ variant = "light", layout = "horizontal" }: TrustBarProps) {
  const isDark = variant === "dark";
  const items = layout === "horizontal" ? TRUST_ITEMS.slice(0, 4) : TRUST_ITEMS;

  if (layout === "grid") {
    return (
      <section className={`section-padding ${isDark ? "bg-deep" : "bg-soft"}`}>
        <div className="container-calm">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {items.map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isDark ? "text-cta" : "text-cta"}`} />
                <span className={`text-sm ${isDark ? "text-deep-foreground/70" : "text-muted-foreground"}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-6 border-y ${isDark ? "bg-deep border-deep-foreground/10" : "bg-soft/50 border-border/50"}`}>
      <div className="container-calm">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {items.map((item, i) => (
            <div key={item.text} className="flex items-center gap-2">
              <item.icon className={`w-4 h-4 ${isDark ? "text-cta" : "text-cta"}`} />
              <span className={`text-xs font-medium ${isDark ? "text-deep-foreground/60" : "text-muted-foreground"}`}>{item.text}</span>
              {i < items.length - 1 && <span className={`ml-6 hidden md:inline ${isDark ? "text-deep-foreground/10" : "text-border"}`}>·</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
