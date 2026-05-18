import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { ProductRecommendationBlock } from "@/components/landing/ProductRecommendationBlock";
import { TrustBar } from "@/components/landing/TrustBar";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { InternalLinksSection } from "@/components/landing/InternalLinksSection";
import { PaymentTrustSection } from "@/components/landing/PaymentTrustSection";
import { fetchProductsByHandles, type ShopifyProduct } from "@/lib/shopify";
import { buildFaqSchemaScript } from "@/lib/faq-schema";

const PAGE_SLUG = "hvilken-knivholder-skal-jeg-vaelge";
const CATEGORY = "knife_holder";

const FAQ_ITEMS = [
  { question: "Kan jeg flytte en magnetisk stander?", answer: "Ja. Den står frit på bordpladen — ingen montering, ingen huller." },
  { question: "Hvor stærk skal magneten være?", answer: "Stærk nok til at holde de tungeste knive uden at de glider. Vores holdere er testet til kokkeknive på 250 g+." },
  { question: "Hvad med rustfri knive?", answer: "Næsten alle køkkenknive indeholder nok jern til at hænge magnetisk." },
];

export const Route = createFileRoute("/pages/hvilken-knivholder-skal-jeg-vaelge")({
  head: () => ({
    meta: [
      { title: "Hvilken knivholder passer til dit køkken? — Langsomt Nok" },
      { name: "description", content: "Magnetisk knivlist, knivblok eller frit-stående stander? En rolig guide til at vælge den rette knivholder til dit køkken." },
      { property: "og:title", content: "Hvilken knivholder passer til dit køkken?" },
      { property: "og:description", content: "En rolig guide til at vælge mellem væglist, blok og stander." },
      { property: "og:image", content: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/IMG_6147.jpg?v=1773564482" },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/pages/hvilken-knivholder-skal-jeg-vaelge" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Forside", item: "https://langsomtnok.dk/" },
            { "@type": "ListItem", position: 2, name: "Guides", item: "https://langsomtnok.dk/guides" },
            { "@type": "ListItem", position: 3, name: "Hvilken knivholder passer til dit køkken?", item: "https://langsomtnok.dk/pages/hvilken-knivholder-skal-jeg-vaelge" },
          ],
        }),
      },
    ],
    scripts: [buildFaqSchemaScript(FAQ_ITEMS)],
  }),
  component: Page,
});

const HANDLES = [
  "magnetic-knife-holder-acacia-19-6",
  "magnetic-knife-display-stand-walnut",
  "magnetic-knife-display-stand-acacia",
];

function Page() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  useEffect(() => { fetchProductsByHandles(HANDLES).then(setProducts); }, []);

  const types = [
    { name: "Magnetisk væglist", best: "Stort køkken med ledig vægplads", pro: "Frigør bordpladen. Æstetisk fremvisning. Bedst overblik.", con: "Skal monteres på væggen." },
    { name: "Knivblok", best: "Klassisk køkken med fast plads", pro: "Velkendt format. God beskyttelse.", con: "Samler støv. Skjuler kniven." },
    { name: "Magnetisk stander", best: "Lejligheder, lejeboliger, små køkkener", pro: "Ingen montering. Kan flyttes. Smukt på bordpladen.", con: "Optager lidt bordplads." },
  ];

  return (
    <div>
      <LandingPageHero
        headline="Hvilken knivholder passer til dit køkken?"
        subheadline="Tre typer. Tre forskellige liv i køkkenet. Find den, der hører til dit."
        primaryCta={{ label: "Se sammenligning", to: "/pages/hvilken-knivholder-skal-jeg-vaelge", intent: "view_comparison" }}
        secondaryCta={{ label: "Se udvalget", to: "/shop", intent: "view_products" }}
        imageSlot={{
          name: "image_knivholder_guide_hero",
          motif: "Magnetisk knivholder i træ med køkkenknive i roligt nordisk køkken",
          alt: "Magnetisk knivholder i træ med køkkenknive i roligt nordisk køkken",
          src: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/IMG_6147.jpg?v=1773564482",
        }}
        variant="overlay"
        trackingPage={PAGE_SLUG}
        trackingCategory={CATEGORY}
      />

      <TrustBar />

      <section id="sammenligning" className="section-padding">
        <div className="container-calm max-w-5xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-8 text-center">Tre måder at give kniven et hjem</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {types.map((t) => (
              <div key={t.name} className="p-6 rounded-lg border border-border">
                <h3 className="font-serif text-lg mb-3">{t.name}</h3>
                <p className="text-xs uppercase tracking-wider text-copper mb-1">Bedst til</p>
                <p className="text-sm text-muted-foreground mb-4">{t.best}</p>
                <p className="text-xs uppercase tracking-wider text-copper mb-1">Plus</p>
                <p className="text-sm text-muted-foreground mb-4">{t.pro}</p>
                <p className="text-xs uppercase tracking-wider text-copper mb-1">Hvis ikke</p>
                <p className="text-sm text-muted-foreground">{t.con}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-8">Find ud fra dit køkken</h2>
          <div className="space-y-5">
            {[
              { q: "Du har en lang fri væg ved bordpladen", a: "Vælg en magnetisk væglist — den frigør bord og giver overblik." },
              { q: "Du bor til leje og må ikke bore", a: "Vælg en magnetisk stander — den står frit og kan flyttes med." },
              { q: "Du har børn i lav højde", a: "Stander placeret bagest på bordpladen, eller en væglist højt oppe." },
              { q: "Du har 1–2 knive", a: "En lille stander eller en kort væglist på 19 cm er rigeligt." },
            ].map((row) => (
              <div key={row.q} className="p-5 rounded-lg border border-border bg-background">
                <p className="font-serif text-base mb-1">{row.q}</p>
                <p className="text-sm text-muted-foreground">→ {row.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductRecommendationBlock title="Vores anbefalede holdere" subtitle="Håndlavet i træ. Stærke magneter. Roligt udtryk." products={products} />

      <PaymentTrustSection />

      <section className="section-padding">
        <div className="container-calm max-w-3xl text-center">
          <p className="text-muted-foreground text-editorial mb-4">Brug for at se den i sit eget køkken først?</p>
          <Link
            to="/pages/knivholder-til-koekkenet"
            className="cta-secondary text-sm font-medium text-cta hover:text-cta/80"
            data-track-event="landing_internal_link_click"
            data-track-page={PAGE_SLUG}
            data-track-intent="explore_related"
            data-track-product-category={CATEGORY}
          >
            Læs mere om knivholderen, der samler køkkenet →
          </Link>
        </div>
      </section>

      <FAQAccordion items={FAQ_ITEMS} />

      <CalmCTASection
        headline="Vælg den, der passer til dit liv."
        text="Holderen er ikke vigtigst. Det er, at kniven får et sted at høre til."
        cta={{ label: "Se udvalget", to: "/shop" }}
        secondaryCta={{ label: "Find dit ritual", to: "/find-dit-ritual" }}
        variant="warm"
        trackingPage={PAGE_SLUG}
        trackingCategory={CATEGORY}
      />

      <InternalLinksSection
        page={PAGE_SLUG}
        links={[
          { to: "/pages/knivholder-til-koekkenet", title: "Knivholderen, der samler køkkenet", description: "Hovedsiden om magnetiske holdere.", category: "knife_holder" },
          { to: "/pages/gaver-med-ro", title: "Gaver, der bliver brugt", description: "Find en gave med ro.", category: "gifts" },
          { to: "/pages/koekkenet-som-fristed", title: "Køkkenet som fristed", description: "Hele Langsomt Noks univers.", category: "brand_universe" },
        ]}
      />

      <NewsletterSignup variant="dark" />
    </div>
  );
}
