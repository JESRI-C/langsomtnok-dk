import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ImageSlot, IMAGE_SLOTS } from "@/components/ImageSlot";

/**
 * Visual bundle section — linker til relevante collections.
 * Ingen Shopify bundle-produkter — bare ro, klarhed og en sti videre.
 */
const BUNDLES = [
  {
    eyebrow: "Start ritualet",
    title: "Knivholder + slibesten",
    text: "Få knivene op af skuffen — og hold dem skarpe.",
    badge: "Mest valgte sammen",
    href: "/shop" as const,
    cta: "Se sættet",
    slot: IMAGE_SLOTS.categories.magneticHolders,
  },
  {
    eyebrow: "Craft & care",
    title: "Pleje & vedligehold",
    text: "Slibesten, olie og det rolige ritual omkring knivpleje.",
    badge: "Udvalgt af os",
    href: "/collections/slibning-pleje" as const,
    cta: "Se plejen",
    slot: IMAGE_SLOTS.categories.sharpeningStones,
  },
  {
    eyebrow: "Full kitchen calm",
    title: "Komplet køkkenstart",
    text: "Kniv, holder og slibning — alt i ét roligt setup.",
    badge: "Hele setuppet",
    href: "/collections/knive" as const,
    cta: "Se kollektionen",
    slot: IMAGE_SLOTS.categories.knives,
  },
] as const;

export function BundleSection() {
  return (
    <section className="section-padding bg-soft/40">
      <div className="container-calm">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-[11px] tracking-[0.25em] uppercase text-copper">Sæt ro sammen</span>
            <h2 className="font-serif text-3xl md:text-5xl mt-2 leading-tight">Et helt setup — i én rolig bevægelse</h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            Tre forslag til at komme i gang. Vælg dér, hvor det giver mest mening for dit køkken.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {BUNDLES.map((b) => (
            <Link
              key={b.title}
              to={b.href}
              className="group block rounded-xl border border-border/70 bg-card overflow-hidden lift-on-hover"
              data-event="bundle_card_click"
              data-section="homepage_bundles"
              data-target={b.href}
            >
              <div className="relative overflow-hidden bg-soft">
                <div className="transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                  <ImageSlot
                    name={b.slot.name}
                    ratio="4/5"
                    motif={b.slot.motif}
                    alt={b.title}
                    variant="warm"
                    className="rounded-none"
                  />
                </div>
                <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-[10px] font-semibold tracking-wide uppercase text-cta px-2.5 py-1 rounded">
                  {b.badge}
                </span>
              </div>
              <div className="p-5 md:p-6">
                <span className="text-[10px] tracking-[0.25em] uppercase text-copper">{b.eyebrow}</span>
                <h3 className="font-serif text-xl mt-2 mb-2 text-foreground group-hover:text-walnut transition-colors">
                  {b.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{b.text}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-cta group-hover:gap-2.5 transition-all">
                  {b.cta} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
