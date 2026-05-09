import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { ProductCard } from "@/components/ProductCard";
import { fetchProductsByQuery, type ShopifyProduct } from "@/lib/shopify";
import { trackEvent } from "@/lib/analytics";
import { useCampaignContent } from "@/hooks/useCampaignContent";
import type { CampaignContent } from "@/lib/campaign-content";
import { buildCampaignHead, SITE_ORIGIN } from "@/lib/campaign-seo";

const FALLBACK: CampaignContent = {
  seo_title: "Susan Riel — Håndlavet keramik | Langsomt Nok",
  seo_description:
    "Mød keramikeren Susan Riel. Hendes værker — kopper, skåle, vaser og unika — drejes og glasereres i hånden i hendes atelier.",
  hero_eyebrow: "Mød keramikeren",
  hero_headline: "Susan Riel",
  hero_subheading:
    "Hænder, der har formet ler i mange år. Hvert værk bærer spor af den ro, hun arbejder i.",
  primary_cta_text: "Se hendes værker",
  primary_cta_url: "#vaerker",
  intro_section_title: "I atelieret",
  intro_section_body:
    "Susan arbejder alene i sit atelier. Drejeskiven kører roligt, glasuren blandes i små portioner, og ovnen står tændt om natten.\n\nDer er ingen masseproduktion. Kun de værker, hænderne kan nå.",
  story_section_body:
    "Hver kop er drejet for sig. Hver skål glaseret med en lille forskel. Det er det, der gør, at to værker aldrig bliver helt ens.",
  final_cta_headline: "Tag et stykke atelier med hjem",
  final_cta_body: "Susans værker findes i fire rolige kategorier.",
  final_cta_button_text: "Se hele keramik-universet",
  final_cta_button_url: "/keramik",
};

const HEAD = buildCampaignHead({
  pathname: "/keramik/susan-riel",
  title: FALLBACK.seo_title!,
  description: FALLBACK.seo_description!,
  breadcrumbs: [
    { name: "Forside", url: `${SITE_ORIGIN}/` },
    { name: "Håndlavet keramik", url: `${SITE_ORIGIN}/keramik` },
    { name: "Susan Riel", url: `${SITE_ORIGIN}/keramik/susan-riel` },
  ],
});

export const Route = createFileRoute("/keramik/susan-riel")({
  head: () => HEAD,
  component: SusanRielPage,
});

function SusanRielPage() {
  const c = useCampaignContent("keramik-susan-riel", FALLBACK);
  const [products, setProducts] = useState<ShopifyProduct[] | null>(null);

  useEffect(() => {
    trackEvent("landing_page_view", { page: "keramik_susan_riel" });
    fetchProductsByQuery('vendor:"Susan Riel"', 12)
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  return (
    <div data-page-type="keramik_artist" data-artist="susan-riel">
      <LandingPageHero
        headline={c.hero_headline!}
        subheadline={c.hero_subheading!}
        primaryCta={{ label: c.primary_cta_text!, to: c.primary_cta_url! }}
        imageSlot={{
          name: "keramik-susan-riel-hero",
          motif: "Susan ved drejeskiven, hænder i ler, sidelys gennem atelier-vinduet",
        }}
        variant="overlay"
      />

      <section className="section-padding">
        <div className="container-calm max-w-2xl text-center">
          <span className="text-[10px] font-medium text-copper uppercase tracking-[0.2em]">
            {c.hero_eyebrow}
          </span>
          <h2 className="font-serif text-2xl md:text-3xl mt-3 mb-6">{c.intro_section_title}</h2>
          <p className="text-editorial text-muted-foreground whitespace-pre-line">
            {c.intro_section_body}
          </p>
        </div>
      </section>

      {/* Filosofi-sektion */}
      <section className="pb-16">
        <div className="container-calm max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Leret", text: "Lokalt, råt, valgt med omhu — det bestemmer formen." },
              { title: "Hånden", text: "Drejeskivens rolige bevægelse. Ingen forme. Ingen hast." },
              { title: "Ovnen", text: "Brændes langsomt, så glasuren får lov at finde sin egen tone." },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-lg bg-soft/60 border border-border/40"
              >
                <h3 className="font-serif text-base mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Værker */}
      <section id="vaerker" className="section-padding bg-soft">
        <div className="container-calm">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl mb-3">Værker fra atelieret</h2>
            <p className="text-muted-foreground text-editorial mx-auto max-w-xl">
              {c.story_section_body}
            </p>
          </div>

          {products === null ? (
            <p className="text-center text-muted-foreground text-sm">Henter værker …</p>
          ) : products.length === 0 ? (
            <div className="max-w-xl mx-auto text-center p-8 rounded-lg border border-border bg-background">
              <p className="text-editorial text-muted-foreground mb-4">
                Susans værker er ved at finde plads. Få besked, når de første kommer i atelieret.
              </p>
              <Link to="/cirklen" className="text-xs text-cta font-medium uppercase tracking-wider">
                Tilmeld Langsomt Cirklen →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          )}
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
