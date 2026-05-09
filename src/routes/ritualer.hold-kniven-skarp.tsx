import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { ProductRecommendationBlock } from "@/components/landing/ProductRecommendationBlock";
import { TrustBar } from "@/components/landing/TrustBar";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { IMAGE_SLOTS } from "@/components/ImageSlot";
import { fetchProductsByQuery, type ShopifyProduct } from "@/lib/shopify";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/ritualer/hold-kniven-skarp")({
  head: () => ({
    meta: [
      { title: "Hold din kniv skarp | Slibesten og knivpleje" },
      { name: "description", content: "Slibesten, læderstropper og knivslibere til dig, der vil holde dine køkkenknive skarpe med ro og omhu." },
      { property: "og:title", content: "Hold din kniv skarp | Langsomt Nok" },
      { property: "og:description", content: "Slibesten, læderstropper og knivslibere — rolig vedligeholdelse af din kniv." },
    ],
  }),
  component: SkarpPage,
});

const RITUAL_CARDS = [
  { title: "Hurtig løsning", text: "Til hverdagen, hvor kniven bare skal tilbage i form.", handle: "walnut-sharpener-xz-mdq01-htm" },
  { title: "Klassisk ritual", text: "Til dig, der vil lære slibningen rigtigt.", handle: "double-sided-whetstone-1000-5000" },
  { title: "Fin afslutning", text: "Når æggen skal poleres og forfines.", handle: "double-sided-whetstone-3000-8000" },
  { title: "Sidste finish", text: "Til den rolige bevægelse over læderet.", handle: "leather-strop-green-and-yellow-compound" },
  { title: "Stabil base", text: "Når stenen skal ligge fast, mens du arbejder.", handle: "sharpening-stone-holder-acacia" },
];

const BUNDLES = [
  { title: "Sten + holder", text: "Det giver mening sammen med slibestensholderen — så stenen ligger fast." },
  { title: "Sten + læderstrop", text: "Det giver mening sammen med en læderstrop — for den polerede æg." },
  { title: "Knivsliber + læderstrop", text: "Det giver mening sammen — hverdagens hurtige tur og den rolige finish." },
];

function SkarpPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    trackEvent("landing_page_view", { page: "slibning_ritual" });
    fetchProductsByQuery('product_type:"The Ritual Set"', 20).then(setProducts);
  }, []);

  return (
    <div data-page-type="campaign_landing" data-campaign="slibning_ritual" data-product-category="sharpening">
      <LandingPageHero
        headline="Din kniv er ikke dårlig. Den er bare blevet sløv."
        subheadline="Giv skarpheden tilbage med sten, strop og rolig vedligeholdelse."
        primaryCta={{ label: "Start sliberitualet", to: "/ritualer/hold-kniven-skarp" }}
        imageSlot={{ name: IMAGE_SLOTS.heroes.giftLandingHero.name, motif: "Slibesten på valnøddetræ med vanddråber og linned i naturligt sidelys" }}
        variant="overlay"
      />

      <TrustBar />

      {/* Problem */}
      <section className="section-padding">
        <div className="container-calm max-w-2xl text-center">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Før du køber nyt</h2>
          <p className="text-editorial text-muted-foreground">
            De fleste knive skal ikke udskiftes.<br />
            De skal bare have tid, pleje og en rolig hånd.
          </p>
        </div>
      </section>

      {/* Ritual guide */}
      <section className="section-padding bg-soft">
        <div className="container-calm">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl mb-3">Find dit næste skridt</h2>
            <p className="text-muted-foreground text-editorial mx-auto">Fem rolige måder at holde kniven skarp.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 max-w-6xl mx-auto">
            {RITUAL_CARDS.map((card, i) => (
              <Link
                key={card.title}
                to="/product/$handle"
                params={{ handle: card.handle }}
                onClick={() => trackEvent("cta_click_landing_secondary" as never, { label: card.title })}
                data-event="ritual_card_click"
                className="group block p-5 rounded-lg border border-border hover:border-walnut/30 hover:shadow-sm transition-all duration-300 bg-background"
              >
                <span className="text-[10px] font-medium text-copper uppercase tracking-wider">Trin {i + 1}</span>
                <h3 className="font-serif text-base mt-1 mb-2 group-hover:text-walnut transition-colors">{card.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{card.text}</p>
                <span className="text-xs text-cta font-medium">Se produktet →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ProductRecommendationBlock
        title="Til sliberitualet"
        subtitle="Sten, slibere, strop og holder — vælg det, der passer din hånd."
        products={products}
      />

      {/* Bundles */}
      <section className="section-padding bg-soft">
        <div className="container-calm max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl mb-3">Sæt ro sammen</h2>
            <p className="text-muted-foreground text-editorial mx-auto">Roligt afstemte par. Ingen hast.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BUNDLES.map((b) => (
              <div key={b.title} className="p-6 rounded-lg border border-border bg-background">
                <h3 className="font-serif text-base mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{b.text}</p>
                <Link
                  to="/collections/$handle"
                  params={{ handle: "slibning-pleje" }}
                  onClick={() => trackEvent("bundle_cta_click", { label: b.title })}
                  className="text-xs text-cta font-medium"
                >
                  Tilføj til ritualet →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CalmCTASection
        headline="Gør din kniv skarp igen"
        text="Begynd med ét trin. Resten følger med tiden."
        cta={{ label: "Start sliberitualet", to: "/ritualer/hold-kniven-skarp" }}
        variant="warm"
      />
    </div>
  );
}
