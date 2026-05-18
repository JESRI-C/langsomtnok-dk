import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Truck, X } from "lucide-react";

/**
 * Premium announcement bar — calm, mosgrøn, dismissable.
 * Roterer 2 beskeder hver 5. sekund.
 */
const MESSAGES = [
  { icon: Truck, text: "Klar til levering fra Danmark — 1-2 hverdage", cta: "Se favoritter", to: "/shop" as const },
  { icon: Truck, text: "Fri fragt på ordrer over 599 kr", cta: "Shop nu", to: "/shop" as const },
];

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("ln_announcement_dismissed") === "1") setDismissed(true);
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % MESSAGES.length), 5000);
    return () => clearInterval(t);
  }, [dismissed]);

  if (dismissed) return null;

  const m = MESSAGES[idx];
  const Icon = m.icon;

  return (
    <div className="bg-cta text-cta-foreground relative z-[51]">
      <div className="container-calm">
        <div className="flex items-center justify-center gap-3 py-2 text-[12px] md:text-[13px] font-medium tracking-wide">
          <Icon className="w-3.5 h-3.5 flex-shrink-0 opacity-90" strokeWidth={1.8} />
          <span className="truncate">{m.text}</span>
          <Link
            to={m.to}
            className="hidden sm:inline-block underline underline-offset-4 decoration-cta-foreground/40 hover:decoration-cta-foreground transition-all whitespace-nowrap"
            data-event="announcement_cta_click"
            data-target={m.to}
          >
            {m.cta} →
          </Link>
        </div>
        <button
          onClick={() => {
            setDismissed(true);
            try { sessionStorage.setItem("ln_announcement_dismissed", "1"); } catch {}
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-cta-foreground/60 hover:text-cta-foreground transition-colors"
          aria-label="Luk besked"
        >
          <X className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
