import { Truck, ShieldCheck, RotateCcw, Package } from "lucide-react";

/**
 * CTATrust — discreet reassurance row to place directly below a primary
 * product CTA. Calm, editorial tone. No urgency, no discount language.
 *
 * Variants:
 *   • inline (default) — small icons + text, wraps gracefully
 *   • stacked          — vertical list, used inside narrow cards
 */
export function CTATrust({
  variant = "inline",
  className = "",
}: {
  variant?: "inline" | "stacked";
  className?: string;
}) {
  const items = [
    { icon: Package, text: "På lager — sendes fra Danmark på 1–2 hverdage" },
    { icon: Truck, text: "Fri fragt over 599 kr." },
    { icon: RotateCcw, text: "30 dages returret" },
    { icon: ShieldCheck, text: "Sikker betaling" },
  ];

  if (variant === "stacked") {
    return (
      <ul className={`space-y-1.5 text-xs text-muted-foreground ${className}`}>
        {items.map((it) => (
          <li key={it.text} className="flex items-start gap-2">
            <it.icon className="w-3.5 h-3.5 mt-0.5 text-cta flex-shrink-0" strokeWidth={1.5} />
            <span>{it.text}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul
      className={`flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] md:text-xs text-muted-foreground ${className}`}
      data-block="cta-trust"
    >
      {items.map((it) => (
        <li key={it.text} className="flex items-center gap-1.5">
          <it.icon className="w-3.5 h-3.5 text-cta flex-shrink-0" strokeWidth={1.5} />
          <span>{it.text}</span>
        </li>
      ))}
    </ul>
  );
}
