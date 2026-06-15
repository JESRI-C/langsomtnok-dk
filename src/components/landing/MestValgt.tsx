import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/**
 * MestValgt — "Mest valgt lige nu"
 * Calm, editorial four-card section that points to the highest-traffic
 * collections. Used on /shop and the homepage.
 */
const CARDS = [
  {
    label: "Magnetiske knivholdere",
    text: "Få knivene ud af skuffen — synligt, sikkert og roligt.",
    href: "/collections/magnetiske-holdere",
    cta: "Se knivholderne",
    ctaId: "cta_see_magnetic_holders",
    motif: "Walnut magnetisk knivlist på lys væg med knive",
    img: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/holder-card.jpg",
  },
  {
    label: "Håndlavet keramik",
    text: "Kopper, skåle og vaser i små serier.",
    href: "/keramik",
    cta: "Se keramikken",
    ctaId: "cta_see_ceramics",
    motif: "Håndlavet keramikkop og skål i naturligt lys",
    img: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/Keramik_header.png?v=1778396909",
  },
  {
    label: "Slibesten",
    text: "Når kniven maser tomaten — tid til rolig skarphed.",
    href: "/collections/slibesten",
    cta: "Find din slibesten",
    ctaId: "cta_see_sharpening",
    motif: "Slibesten 1000/5000 på træplade ved siden af kniv",
    img: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/slibesten-card.jpg",
  },
  {
    label: "Gaver",
    text: "Rolige gaver der bliver brugt — ikke bare pakket ud.",
    href: "/collections/gaver",
    cta: "Se gaverne",
    ctaId: "cta_see_gifts",
    motif: "Indpakket gavesæt på linned",
    img: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/gaver-card.jpg",
  },
] as const;

export function MestValgt() {
  return (
    <section className="section-padding" style={{ backgroundColor: "#F8F6F3" }}>
      <div className="container-calm">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] block mb-3" style={{ color: "#A67C52" }}>
            Mest valgt lige nu
          </span>
          <h2 className="font-serif text-3xl md:text-4xl mb-3" style={{ color: "#1E1E1E" }}>
            De ritualer flest finder vej til først
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Et roligt startsted — uanset om du leder efter orden, skarphed eller en gave.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {CARDS.map((c) => (
            <Link
              key={c.href}
              to={c.href}
              data-cta={c.ctaId}
              onClick={() => trackEvent("most_chosen_click", { card: c.label, cta_id: c.ctaId })}
              className="group block rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(90,59,46,0.16)" }}
            >
              <div className="aspect-[4/3] overflow-hidden" style={{ backgroundColor: "#E6E0D7" }}>
                <img
                  src={c.img}
                  alt={c.motif}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className="p-4 md:p-5">
                <h3 className="font-serif text-base md:text-lg mb-1.5 group-hover:text-walnut transition-colors" style={{ color: "#1E1E1E" }}>
                  {c.label}
                </h3>
                <p className="text-xs md:text-sm leading-relaxed mb-3" style={{ color: "#2D2D2D" }}>
                  {c.text}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider" style={{ color: "#4C574A" }}>
                  {c.cta} <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
