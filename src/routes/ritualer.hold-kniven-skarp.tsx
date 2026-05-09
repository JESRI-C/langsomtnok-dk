import { createFileRoute, Link } from "@tanstack/react-router";
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

// Edit live in: Shopify Admin → Content → Metaobjects → Campaign Landing Page → "hold-kniven-skarp"
const FALLBACK: CampaignContent = {
  seo_title: "Hold din kniv skarp | Slibesten og knivpleje",
  seo_description:
    "Slibesten, læderstropper og knivslibere til dig, der vil holde dine køkkenknive skarpe med ro og omhu.",
  hero_eyebrow: "Sliberitualet",
  hero_headline: "Din kniv er ikke dårlig. Den er bare blevet sløv.",
  hero_subheading: "Giv skarpheden tilbage med sten, strop og rolig vedligeholdelse.",
  primary_cta_text: "Start sliberitualet",
  primary_cta_url: "#sliberitual",
  intro_section_title: "Før du køber nyt",
  intro_section_body:
    "De fleste knive skal ikke udskiftes.\nDe skal bare have tid, pleje og en rolig hånd.",
  guide_cards: [
    { title: "Hurtig løsning", text: "Til hverdagen, hvor kniven bare skal tilbage i form.", href: "/product/walnut-sharpener-xz-mdq01-htm" },
    { title: "Klassisk ritual", text: "Til dig, der vil lære slibningen rigtigt.", href: "/product/double-sided-whetstone-1000-5000" },
    { title: "Fin afslutning", text: "Når æggen skal poleres og forfines.", href: "/product/double-sided-whetstone-3000-8000" },
    { title: "Sidste finish", text: "Til den rolige bevægelse over læderet.", href: "/product/leather-strop-green-and-yellow-compound" },
    { title: "Stabil base", text: "Når stenen skal ligge fast, mens du arbejder.", href: "/product/sharpening-stone-holder-acacia" },
  ],
  story_section_body: "Roligt afstemte par. Ingen hast.",
  final_cta_headline: "Gør din kniv skarp igen",
  final_cta_body: "Begynd med ét trin. Resten følger med tiden.",
  final_cta_button_text: "Start sliberitualet",
  final_cta_button_url: "#sliberitual",
};

const HEAD = buildCampaignHead({
  pathname: "/ritualer/hold-kniven-skarp",
  title: FALLBACK.seo_title!,
  description: FALLBACK.seo_description!,
  breadcrumbs: [
    { name: "Forside", url: `${SITE_ORIGIN}/` },
    { name: "Ritualer", url: `${SITE_ORIGIN}/find-dit-ritual` },
    { name: "Hold din kniv skarp", url: `${SITE_ORIGIN}/ritualer/hold-kniven-skarp` },
  ],
  itemListName: "Sliberitualet — trin",
  itemList: (FALLBACK.guide_cards ?? []).map((c) => ({
    name: c.title,
    url: c.href?.startsWith("http") ? c.href : `${SITE_ORIGIN}${c.href ?? ""}`,
  })),
});

export const Route = createFileRoute("/ritualer/hold-kniven-skarp")({
  head: () => HEAD,
  component: SkarpPage,
});

const BUNDLES = [
  { title: "Sten + holder", text: "Det giver mening sammen med slibestensholderen — så stenen ligger fast." },
  { title: "Sten + læderstrop", text: "Det giver mening sammen med en læderstrop — for den polerede æg." },
  { title: "Knivsliber + læderstrop", text: "Det giver mening sammen — hverdagens hurtige tur og den rolige finish." },
];

function SkarpPage() {
  const c = useCampaignContent("hold-kniven-skarp", FALLBACK);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    trackEvent("landing_page_view", { page: "slibning_ritual" });
    fetchProductsByQuery('product_type:"The Ritual Set"', 20).then(setProducts);
  }, []);

  return (
    <div data-page-type="campaign_landing" data-campaign="slibning_ritual" data-product-category="sharpening">
      <LandingPageHero
        headline={c.hero_headline!}
        subheadline={c.hero_subheading!}
        primaryCta={{ label: c.primary_cta_text!, to: c.primary_cta_url! }}
        imageSlot={{
          name: IMAGE_SLOTS.heroes.sharpeningLandingHero.name,
          motif: "Slibesten på valnøddetræ med vanddråber og linned i naturligt sidelys",
          src: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/ChatGPT_Image_9._maj_2026_21.36.26.png?v=1778355436",
        }}
        variant="overlay"
      />

      <TrustBar />

      <section className="section-padding">
        <div className="container-calm max-w-2xl text-center">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">{c.intro_section_title}</h2>
          {c.intro_section_body && (
            <p className="text-editorial text-muted-foreground whitespace-pre-line">{c.intro_section_body}</p>
          )}
        </div>
      </section>

      <section className="pb-16">
        <div className="container-calm max-w-2xl">
          <div className="p-6 md:p-8 rounded-lg bg-soft/60 border border-border/40">
            <p className="text-editorial text-foreground/80 leading-relaxed">
              Den bedste måde at holde en køkkenkniv skarp på er at vedligeholde æggen løbende med
              slibesten, strop eller en enkel knivsliber. Det forlænger knivens levetid og gør
              madlavningen mere rolig og præcis.
            </p>
          </div>
        </div>
      </section>

      <section id="sliberitual" className="section-padding bg-soft">
        <div className="container-calm">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl mb-3">Find dit næste skridt</h2>
            <p className="text-muted-foreground text-editorial mx-auto">Fem rolige måder at holde kniven skarp.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 max-w-6xl mx-auto">
            {(c.guide_cards ?? []).map((card, i) => (
              <a
                key={card.title}
                href={card.href || "#sliberitual"}
                onClick={() => trackEvent("ritual_card_click", { label: card.title })}
                data-event="ritual_card_click"
                className="group block p-5 rounded-lg border border-border hover:border-walnut/30 hover:shadow-sm transition-all duration-300 bg-background"
              >
                <span className="text-[10px] font-medium text-copper uppercase tracking-wider">Trin {i + 1}</span>
                <h3 className="font-serif text-base mt-1 mb-2 group-hover:text-walnut transition-colors">{card.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{card.text}</p>
                <span className="text-xs text-cta font-medium">Se produktet →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ProductRecommendationBlock
        title="Til sliberitualet"
        subtitle="Sten, slibere, strop og holder — vælg det, der passer din hånd."
        products={products}
      />

      <section className="section-padding bg-soft">
        <div className="container-calm max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl mb-3">Sæt ro sammen</h2>
            {c.story_section_body && (
              <p className="text-muted-foreground text-editorial mx-auto">{c.story_section_body}</p>
            )}
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
        headline={c.final_cta_headline!}
        text={c.final_cta_body}
        cta={{ label: c.final_cta_button_text!, to: c.final_cta_button_url! }}
        variant="warm"
      />
    </div>
  );
}
