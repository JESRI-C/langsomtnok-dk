import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { ProductRecommendationBlock } from "@/components/landing/ProductRecommendationBlock";
import { TrustBar } from "@/components/landing/TrustBar";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { FeaturedRitualProducts } from "@/components/ritualer/FeaturedRitualProducts";
import { FounderRitualBox } from "@/components/ritualer/FounderRitualBox";
import { IMAGE_SLOTS } from "@/components/ImageSlot";
import { fetchProductsByQuery, type ShopifyProduct } from "@/lib/shopify";
import { trackEvent } from "@/lib/analytics";
import { useCampaignContent } from "@/hooks/useCampaignContent";
import type { CampaignContent } from "@/lib/campaign-content";
import { buildCampaignHead, SITE_ORIGIN } from "@/lib/campaign-seo";

// Edit live in: Shopify Admin → Content → Metaobjects → Campaign Landing Page → "rolig-opbevaring"
const FALLBACK: CampaignContent = {
  seo_title: "Magnetiske knivholdere i træ | Langsomt Nok",
  seo_description:
    "Magnetiske knivlister og knivstandere i træ til rolig, synlig og smuk opbevaring af dine køkkenknive.",
  hero_eyebrow: "Rolig opbevaring",
  hero_headline: "Når knivene får en fast plads, falder køkkenet til ro.",
  hero_subheading: "Magnetiske knivlister og standere i træ til redskaber, der gerne må være synlige.",
  primary_cta_text: "Find din holder",
  primary_cta_url: "#opbevaring-produkter",
  intro_section_title: "Væk fra skuffen",
  intro_section_body:
    "Knive, der ligger løst, mister både plads og nærvær.\nNår de får en fast plads, bliver køkkenet lettere at bruge.",
  guide_cards: [
    { title: "Knivliste på væggen", text: "Mere plads på bordet · ro på væggen · synlige redskaber." },
    { title: "Knivstander på bordet", text: "Ingen boring · tæt på hånden · roligt objekt i køkkenet." },
  ],
  story_section_body: "Når redskaberne har et hjem, har hverdagen et.",
  final_cta_headline: "Skab ro i køkkenet",
  final_cta_body: "Når redskaberne har et hjem, har hverdagen et.",
  final_cta_button_text: "Find din holder",
  final_cta_button_url: "#opbevaring-produkter",
};

const HEAD = buildCampaignHead({
  pathname: "/ritualer/rolig-opbevaring",
  title: FALLBACK.seo_title!,
  description: FALLBACK.seo_description!,
  breadcrumbs: [
    { name: "Forside", url: `${SITE_ORIGIN}/` },
    { name: "Ritualer", url: `${SITE_ORIGIN}/find-dit-ritual` },
    { name: "Rolig opbevaring", url: `${SITE_ORIGIN}/ritualer/rolig-opbevaring` },
  ],
  itemListName: "Rolig opbevaring — guide",
  itemList: (FALLBACK.guide_cards ?? []).map(() => ({
    name: "Rolig opbevaring",
    url: `${SITE_ORIGIN}/ritualer/rolig-opbevaring`,
  })),
});

export const Route = createFileRoute("/ritualer/rolig-opbevaring")({
  head: () => HEAD,
  component: OpbevaringPage,
});

const MATERIALS = [
  { title: "Valnød", text: "Varm, mørk og rolig." },
  { title: "Akacie", text: "Lys, moderne og balanceret." },
];

function OpbevaringPage() {
  const c = useCampaignContent("rolig-opbevaring", FALLBACK);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    trackEvent("landing_page_view", { page: "rolig_opbevaring" });
    fetchProductsByQuery('product_type:"The Calm Kitchen"', 20).then(setProducts);
  }, []);

  const pickByHandlePart = (parts: string[]): ShopifyProduct | undefined => {
    return products.find((p) =>
      parts.some((part) => p.node.handle.toLowerCase().includes(part.toLowerCase())),
    );
  };

  const { featured, secondary } = useMemo(() => {
    const f =
      pickByHandlePart(["magnetic-knife-strip-walnut", "knivlist", "magnetic-strip"]) ??
      products[0];
    const cands = [
      pickByHandlePart(["magnetic-knife-block-walnut", "knivstander-valnod"]),
      pickByHandlePart(["magnetic-knife-block-acacia", "knivstander-akacie"]),
      pickByHandlePart(["magnetic-knife-strip-acacia"]),
    ].filter((x): x is ShopifyProduct => !!x && x.node.id !== f?.node.id);
    return { featured: f, secondary: cands.slice(0, 2) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  return (
    <div data-page-type="campaign_landing" data-campaign="rolig_opbevaring" data-product-category="storage">
      <LandingPageHero
        headline={c.hero_headline!}
        subheadline={c.hero_subheading!}
        primaryCta={{ label: c.primary_cta_text!, to: c.primary_cta_url! }}
        imageSlot={{
          name: IMAGE_SLOTS.heroes.giftLandingHero.name,
          motif: "Lyst skandinavisk køkken med magnetisk knivlist i valnød over stenbordplade",
        }}
        variant="overlay"
      />


      <TrustBar />

      {/* 2. Featured products — Start her */}
      <FeaturedRitualProducts
        title="Start her"
        subtitle="Tre udvalgte måder at give knivene en fast plads."
        scoreLabel="Display Score"
        scoreNumber="4.8"
        featuredLabel="Et godt sted at begynde"
        featuredBenefit="Magnetisk knivliste i træ — synlig opbevaring, der løfter hele køkkenet."
        featured={featured}
        secondary={secondary}
      />

      {/* 3. Ritual promise / intro */}
      <section className="section-padding">
        <div className="container-calm max-w-2xl text-center">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">{c.intro_section_title}</h2>
          {c.intro_section_body && (
            <p className="text-editorial text-muted-foreground whitespace-pre-line">{c.intro_section_body}</p>
          )}
        </div>
      </section>

      {/* 4. Product journey — guide cards */}
      <section className="section-padding bg-soft">
        <div className="container-calm max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl mb-3">Væg eller bord?</h2>
            <p className="text-muted-foreground text-editorial mx-auto">To rolige måder at give knivene en fast plads.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(c.guide_cards ?? []).map((card) => (
              <div
                key={card.title}
                data-event="ritual_card_click"
                className="p-6 rounded-lg border border-border bg-background"
              >
                <h3 className="font-serif text-lg mb-3">{card.title}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Founder box */}
      <FounderRitualBox
        subtitle="Jeg ville vælge dette ritual, hvis du vil give dine redskaber en fast plads og skabe mere ro i køkkenet."
        bullets={[
          "Giver knivene en synlig og sikker plads",
          "Skaber mere ro på køkkenbordet",
          "Løfter køkkenets samlede udtryk",
        ]}
        link={{ label: "Se hvorfor det passer ind i ritualet", href: "#opbevaring-produkter" }}
      />

      {/* 7. Full product grid */}
      <div id="opbevaring-produkter">
        <ProductRecommendationBlock
          title="Alle produkter i ritualet"
          subtitle="Se hele udvalget og byg ritualet i dit eget tempo."
          products={products}
        />
      </div>

      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl mb-3">Vælg dit træ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MATERIALS.map((m) => (
              <div key={m.title} className="p-6 rounded-lg border border-border bg-background text-center">
                <h3 className="font-serif text-lg mb-2">{m.title}</h3>
                <p className="text-sm text-muted-foreground">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CalmCTASection
        headline={c.final_cta_headline!}
        text={c.final_cta_body}
        cta={{ label: c.final_cta_button_text!, to: c.final_cta_button_url! }}
        variant="warm"
      />
    </div>
  );
}
