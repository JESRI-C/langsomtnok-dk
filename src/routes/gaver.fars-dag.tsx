import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { ProductRecommendationBlock } from "@/components/landing/ProductRecommendationBlock";
import { TrustBar } from "@/components/landing/TrustBar";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { IMAGE_SLOTS } from "@/components/ImageSlot";
import { fetchProductsByQuery, type ShopifyProduct } from "@/lib/shopify";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/gaver/fars-dag")({
  head: () => ({
    meta: [
      { title: "Farsdagsgaver til far | Langsomt Nok" },
      { name: "description", content: "Find rolige og brugbare farsdagsgaver til far, der elsker mad, gode redskaber og et smukt køkken." },
      { property: "og:title", content: "Farsdagsgaver til far | Langsomt Nok" },
      { property: "og:description", content: "Rolige og brugbare farsdagsgaver til far, der elsker mad og gode redskaber." },
    ],
  }),
  component: FarsdagPage,
});

const GIFT_CARDS = [
  { title: "Til far der elsker mad", desc: "Slibesten og knivpleje, der bliver brugt hver uge.", anchor: "#farsdag-produkter" },
  { title: "Til far der har alt", desc: "En knivsliber i valnød — smuk og brugbar.", anchor: "#farsdag-produkter" },
  { title: "Til far der går op i design", desc: "Magnetisk knivlist i træ til det rolige køkken.", anchor: "#farsdag-produkter" },
  { title: "Gaver under 500 kr.", desc: "Rolige ritualer i et tilgængeligt prisleje.", anchor: "#farsdag-budget" },
];

function FarsdagPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    trackEvent("landing_page_view" as never, { page: "farsdag_2026" });
    // Prioriter Ritual Set + Calm Kitchen — ingen knive som primært
    fetchProductsByQuery(
      "product_type:'The Ritual Set' OR product_type:'The Calm Kitchen' OR product_type:'The Gift Chapter'",
      20
    ).then(setProducts);
  }, []);

  const budgetProducts = products.filter(
    (p) => parseFloat(p.node.priceRange.minVariantPrice.amount) <= 500
  );

  return (
    <div data-page-type="campaign_landing" data-campaign="farsdag_2026" data-product-category="gift">
      <LandingPageHero
        headline="Farsdagsgaver, han faktisk får brugt"
        subheadline="Slibning, pleje og rolig opbevaring til far, der elsker gode redskaber."
        primaryCta={{ label: "Find gaven", to: "/gaver/fars-dag" }}
        secondaryCta={{ label: "Se gaver under 500 kr.", to: "/gaver/fars-dag" }}
        imageSlot={{ name: IMAGE_SLOTS.heroes.giftLandingHero.name, motif: "Slibesten, valnødde-knivsliber og linneklud i blødt morgenlys" }}
        variant="overlay"
      />

      <TrustBar />

      {/* Gift guide */}
      <section className="section-padding">
        <div className="container-calm">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl mb-3">Find gaven der passer</h2>
            <p className="text-muted-foreground text-editorial mx-auto">Fire roligt udvalgte retninger.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {GIFT_CARDS.map((c) => (
              <a
                key={c.title}
                href={c.anchor}
                onClick={() => trackEvent("cta_click_landing_secondary" as never, { label: c.title })}
                data-event="gift_card_click"
                className="group block p-6 rounded-lg border border-border hover:border-walnut/30 hover:shadow-sm transition-all duration-300 bg-background"
              >
                <h3 className="font-serif text-lg mb-2 group-hover:text-walnut transition-colors">{c.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{c.desc}</p>
                <span className="text-xs text-cta font-medium">Se udvalget →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div id="farsdag-produkter">
        <ProductRecommendationBlock
          title="Gaver til far"
          subtitle="Redskaber der bliver brugt — ikke gemt væk."
          products={products}
        />
      </div>

      {/* Story */}
      <section className="section-padding bg-soft">
        <div className="container-calm max-w-2xl text-center">
          <p className="font-serif text-xl md:text-2xl leading-relaxed text-foreground/90">
            Det bedste køkkenudstyr larmer ikke.<br />
            Det ligger klar.<br />
            Det bliver brugt.<br />
            Og med tiden bliver det en del af hverdagen.
          </p>
        </div>
      </section>

      {/* Budget products */}
      {budgetProducts.length > 0 && (
        <div id="farsdag-budget">
          <ProductRecommendationBlock
            title="Gaver under 500 kr."
            subtitle="Små ritualer i et tilgængeligt prisleje."
            products={budgetProducts}
          />
        </div>
      )}

      <TrustBar layout="grid" />

      <CalmCTASection
        headline="Giv ham et lille ritual."
        text="En gave med vægt, ro og brugsværdi."
        cta={{ label: "Find en gave med ro", to: "/gaver/fars-dag" }}
        variant="warm"
      />
    </div>
  );
}
