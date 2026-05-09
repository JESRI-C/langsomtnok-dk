import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { ProductRecommendationBlock } from "@/components/landing/ProductRecommendationBlock";
import { TrustBar } from "@/components/landing/TrustBar";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { IMAGE_SLOTS } from "@/components/ImageSlot";
import { fetchProductsByQuery, type ShopifyProduct } from "@/lib/shopify";
import { trackEvent } from "@/lib/analytics";
import { useCampaignContent } from "@/hooks/useCampaignContent";
import type { CampaignContent } from "@/lib/campaign-content";
import { buildCampaignHead, SITE_ORIGIN } from "@/lib/campaign-seo";

// Fallback copy — used when Shopify Metaobject is missing or empty.
// Edit live in: Shopify Admin → Content → Metaobjects → Campaign Landing Page → "fars-dag"
const FALLBACK: CampaignContent = {
  seo_title: "Farsdagsgaver til far | Langsomt Nok",
  seo_description:
    "Find rolige og brugbare farsdagsgaver til far, der elsker mad, gode redskaber og et smukt køkken.",
  hero_eyebrow: "Farsdag · 5. juni",
  hero_headline: "Farsdagsgaver, han faktisk får brugt",
  hero_subheading: "Slibning, pleje og rolig opbevaring til far, der elsker gode redskaber.",
  primary_cta_text: "Find gaven",
  primary_cta_url: "#farsdag-produkter",
  secondary_cta_text: "Se gaver under 500 kr.",
  secondary_cta_url: "#farsdag-budget",
  intro_section_title: "Find gaven der passer",
  intro_section_body: "Fire roligt udvalgte retninger.",
  story_section_body:
    "Det bedste køkkenudstyr larmer ikke.\nDet ligger klar.\nDet bliver brugt.\nOg med tiden bliver det en del af hverdagen.",
  guide_cards: [
    { title: "Til far der elsker mad", text: "Slibesten og knivpleje, der bliver brugt hver uge.", href: "#farsdag-produkter" },
    { title: "Til far der har alt", text: "En knivsliber i valnød — smuk og brugbar.", href: "#farsdag-produkter" },
    { title: "Til far der går op i design", text: "Magnetisk knivlist i træ til det rolige køkken.", href: "#farsdag-produkter" },
    { title: "Gaver under 500 kr.", text: "Rolige ritualer i et tilgængeligt prisleje.", href: "#farsdag-budget" },
  ],
  final_cta_headline: "Giv ham et lille ritual.",
  final_cta_body: "En gave med vægt, ro og brugsværdi.",
  final_cta_button_text: "Find en gave med ro",
  final_cta_button_url: "#farsdag-produkter",
};

const HEAD = buildCampaignHead({
  pathname: "/gaver/fars-dag",
  title: FALLBACK.seo_title!,
  description: FALLBACK.seo_description!,
  breadcrumbs: [
    { name: "Forside", url: `${SITE_ORIGIN}/` },
    { name: "Gaver", url: `${SITE_ORIGIN}/collections/gaver` },
    { name: "Farsdagsgaver", url: `${SITE_ORIGIN}/gaver/fars-dag` },
  ],
  itemListName: "Farsdagsgaver — guideudvalg",
  itemList: (FALLBACK.guide_cards ?? []).map((c) => ({
    name: c.title,
    url: c.href?.startsWith("http")
      ? c.href
      : `${SITE_ORIGIN}/gaver/fars-dag${c.href ?? ""}`,
  })),
});

export const Route = createFileRoute("/gaver/fars-dag")({
  head: () => HEAD,
  component: FarsdagPage,
});

function FarsdagPage() {
  const c = useCampaignContent("fars-dag", FALLBACK);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    trackEvent("landing_page_view", { page: "farsdag_2026" });
    fetchProductsByQuery(
      'product_type:"The Ritual Set" OR product_type:"The Calm Kitchen" OR product_type:"The Gift Chapter"',
      20,
    ).then(setProducts);
  }, []);

  const budgetProducts = products.filter(
    (p) => parseFloat(p.node.priceRange.minVariantPrice.amount) <= 500,
  );

  return (
    <div data-page-type="campaign_landing" data-campaign="farsdag_2026" data-product-category="gift">
      <LandingPageHero
        headline={c.hero_headline!}
        subheadline={c.hero_subheading!}
        primaryCta={{ label: c.primary_cta_text!, to: c.primary_cta_url! }}
        secondaryCta={{ label: c.secondary_cta_text!, to: c.secondary_cta_url! }}
        imageSlot={{
          name: IMAGE_SLOTS.heroes.giftLandingHero.name,
          motif: "Slibesten, valnødde-knivsliber og linneklud i blødt morgenlys",
        }}
        variant="overlay"
      />

      <TrustBar />

      <section className="section-padding pb-0">
        <div className="container-calm max-w-2xl">
          <div className="p-6 md:p-8 rounded-lg bg-soft/60 border border-border/40 text-center">
            <p className="text-editorial text-foreground/80 leading-relaxed">
              En god farsdagsgave er en gave, der bliver brugt. Hos Langsomt Nok finder du rolige,
              funktionelle gaver til far, der holder af mad, køkkenredskaber og små daglige ritualer.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-calm">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl mb-3">{c.intro_section_title}</h2>
            {c.intro_section_body && (
              <p className="text-muted-foreground text-editorial mx-auto">{c.intro_section_body}</p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {(c.guide_cards ?? []).map((card) => (
              <a
                key={card.title}
                href={card.href || "#farsdag-produkter"}
                onClick={() => trackEvent("gift_card_click", { label: card.title })}
                data-event="gift_card_click"
                className="group block p-6 rounded-lg border border-border hover:border-walnut/30 hover:shadow-sm transition-all duration-300 bg-background"
              >
                <h3 className="font-serif text-lg mb-2 group-hover:text-walnut transition-colors">{card.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{card.text}</p>
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

      {c.story_section_body && (
        <section className="section-padding bg-soft">
          <div className="container-calm max-w-2xl text-center">
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-foreground/90 whitespace-pre-line">
              {c.story_section_body}
            </p>
          </div>
        </section>
      )}

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
        headline={c.final_cta_headline!}
        text={c.final_cta_body}
        cta={{ label: c.final_cta_button_text!, to: c.final_cta_button_url! }}
        variant="warm"
      />
    </div>
  );
}
