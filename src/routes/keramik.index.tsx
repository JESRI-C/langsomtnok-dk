import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { TrustBar } from "@/components/landing/TrustBar";
import { ProductCard } from "@/components/ProductCard";
import { fetchProductsByQuery, type ShopifyProduct } from "@/lib/shopify";
import { trackEvent } from "@/lib/analytics";
import { useCampaignContent } from "@/hooks/useCampaignContent";
import type { CampaignContent } from "@/lib/campaign-content";
import { buildCampaignHead, SITE_ORIGIN } from "@/lib/campaign-seo";

const HERO_IMAGE =
  "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/Keramik_header.png?v=1778396909";

const FALLBACK: CampaignContent = {
  seo_title: "Håndlavet keramik i små serier | Langsomt Nok",
  seo_description:
    "Kopper, skåle og vaser med spor af hænder, glasur og tid. Håndlavet keramik fra danske atelierer — små serier, og nogle findes kun én gang.",
  hero_eyebrow: "Atelieret",
  hero_headline: "Håndlavet keramik i små serier",
  hero_subheading:
    "Kopper, skåle og vaser med spor af hænder, glasur og tid. Hvert stykke varierer let — og nogle findes kun én gang.",
  primary_cta_text: "Se aktuelle værker",
  primary_cta_url: "#vaerker",
  intro_section_title: "Det, der bliver til mellem to hænder",
  intro_section_body:
    "Keramik kan ikke skyndes.\nLer skal vente, drejes, tørres, brændes — og så vente igen.\n\nDet er den langsomhed, du holder, når du løfter en håndlavet kop.",
  story_section_body:
    "Hver kategori er en lille verden for sig — men de hører sammen i den samme rolige bevægelse.",
  final_cta_headline: "Mød hænderne bag",
  final_cta_body:
    "Susan Riel drejer hver eneste kop, skål og vase i sit atelier. Lær hende at kende.",
  final_cta_button_text: "Mød Susan Riel",
  final_cta_button_url: "/keramik/susan-riel",
};

const CATEGORIES = [
  {
    slug: "kopper",
    title: "Kopper",
    text: "Til kaffen, teen, den stille morgen.",
    motif: "Håndlavet keramikkop på linned med dampende kaffe i naturligt morgenlys",
  },
  {
    slug: "skaale",
    title: "Skåle",
    text: "Til servering, samling og bordets ro.",
    motif: "Håndlavet keramikskål med olivenolie og brød på lyst egetræ",
  },
  {
    slug: "vaser",
    title: "Vaser",
    text: "Små former til grene og blomster.",
    motif: "Håndlavet keramikvase med en enkelt gren mod hvid kalket væg",
  },
  {
    slug: "unika",
    title: "Unika",
    text: "Ét værk. Ét hjem. Aldrig to ens.",
    motif: "Unika keramikobjekt på rå træhylde i sidelys, sanseligt",
  },
] as const;

const HEAD = buildCampaignHead({
  pathname: "/keramik",
  title: FALLBACK.seo_title!,
  description: FALLBACK.seo_description!,
  ogImage: HERO_IMAGE,
  breadcrumbs: [
    { name: "Forside", url: `${SITE_ORIGIN}/` },
    { name: "Håndlavet keramik", url: `${SITE_ORIGIN}/keramik` },
  ],
  itemListName: "Keramik kategorier",
  itemList: CATEGORIES.map((c) => ({
    name: c.title,
    url: `${SITE_ORIGIN}/keramik/${c.slug}`,
  })),
});

export const Route = createFileRoute("/keramik/")({
  head: () => HEAD,
  component: KeramikHub,
});

function KeramikHub() {
  const c = useCampaignContent("keramik-univers", FALLBACK);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    trackEvent("landing_page_view", { page: "keramik_hub" });
    fetchProductsByQuery("product_type:Keramik", 6)
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  return (
    <div data-page-type="keramik_hub">
      <LandingPageHero
        headline={c.hero_headline!}
        subheadline={c.hero_subheading!}
        primaryCta={{ label: c.primary_cta_text!, to: c.primary_cta_url! }}
        imageSlot={{
          name: "keramik-univers-hero",
          motif: "Keramik-atelier med drejeskiver, skåle og en blå keramikskål i forgrunden",
          src: HERO_IMAGE,
        }}
        variant="overlay"
      />

      <TrustBar />

      {/* Trust line directly under hero */}
      <div className="text-center pt-4 pb-2">
        <p className="text-xs md:text-sm font-medium" style={{ color: "#A67C52" }}>
          Sendes fra Danmark · Små serier · 30 dages returret
        </p>
      </div>

      {/* Kategorier — moved up so visitors see what they can buy in the first 5 seconds */}
      <section id="kategorier" className="pt-8 pb-12 md:pt-12 md:pb-16 bg-soft">
        <div className="container-calm">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-serif text-2xl md:text-3xl mb-3">Fire rolige rum</h2>
            {c.story_section_body && (
              <p className="text-muted-foreground text-editorial mx-auto max-w-xl">
                {c.story_section_body}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 max-w-6xl mx-auto">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to="/keramik/$slug"
                params={{ slug: cat.slug }}
                data-cta={`cta_keramik_${cat.slug}`}
                onClick={() => trackEvent("keramik_category_click", { category: cat.slug })}
                className="group block p-5 md:p-6 rounded-lg border border-border hover:border-walnut/30 hover:shadow-sm transition-all duration-300 bg-background"
              >
                <h3 className="font-serif text-base md:text-lg mb-1.5 group-hover:text-walnut transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-3">{cat.text}</p>
                <span className="text-xs text-cta font-medium">Træd ind →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Udvalgte værker — products shown high on the page */}
      {products.length > 0 && (
        <section id="vaerker" className="pt-10 pb-12 md:pt-14 md:pb-16">
          <div className="container-calm">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="font-serif text-2xl md:text-3xl mb-3">Udvalgte værker</h2>
              <p className="text-muted-foreground text-editorial mx-auto max-w-xl">
                Et lille udsnit fra atelieret lige nu.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Scarcity — calm, no urgency */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#E6E0D7" }}>
        <div className="container-calm max-w-3xl text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] block mb-3" style={{ color: "#A67C52" }}>
            Små serier
          </span>
          <h2 className="font-serif text-2xl md:text-3xl mb-4" style={{ color: "#1E1E1E" }}>
            Når et stykke er væk, er det væk
          </h2>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: "#2D2D2D" }}>
            Keramikken kommer hjem i små partier. Små variationer i form og glasur er ikke fejl —
            det er det, der gør hvert stykke levende.
          </p>
        </div>
      </section>

      {/* Intro / atelier text */}
      <section className="section-padding">
        <div className="container-calm max-w-2xl text-center">
          <span className="text-[10px] font-medium text-copper uppercase tracking-[0.2em]">
            {c.hero_eyebrow}
          </span>
          <h2 className="font-serif text-2xl md:text-3xl mt-3 mb-6">{c.intro_section_title}</h2>
          {c.intro_section_body && (
            <p className="text-editorial text-muted-foreground whitespace-pre-line">
              {c.intro_section_body}
            </p>
          )}
        </div>
      </section>

      {/* Susan Riel introduktion */}
      <section className="pb-16">
        <div className="container-calm max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 rounded-lg bg-soft/60 border border-border/40">
            <div>
              <span className="text-[10px] font-medium text-copper uppercase tracking-[0.2em]">
                Keramikeren
              </span>
              <h3 className="font-serif text-2xl md:text-3xl mt-2 mb-4">Susan Riel</h3>
              <p className="text-editorial text-muted-foreground mb-6">
                Susan drejer hver kop, hver skål og hver vase i sit atelier. Hendes værker bærer
                rolige spor af hænder, glasur og tid.
              </p>
              <Link
                to="/keramik/susan-riel"
                onClick={() => trackEvent("keramik_artist_click", { artist: "susan-riel" })}
                className="text-sm text-cta font-medium uppercase tracking-wider"
              >
                Mød Susan →
              </Link>
            </div>
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-linen/40 border border-border/30">
              <img
                src="https://cdn.shopify.com/s/files/1/0915/7227/3488/files/Kunsteren_Susan_Riel.png?v=1778398741"
                alt="Keramik fra Susan Riels atelier"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gift angle */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#F8F6F3" }}>
        <div className="container-calm max-w-3xl text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] block mb-3" style={{ color: "#A67C52" }}>
            Gave
          </span>
          <h2 className="font-serif text-2xl md:text-3xl mb-4" style={{ color: "#1E1E1E" }}>
            En gave der bliver brugt
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-6" style={{ color: "#2D2D2D" }}>
            Til kaffe, bord, blomster og de små pauser i dagen.
          </p>
          <Link
            to="/collections/$handle"
            params={{ handle: "gaver" }}
            data-cta="cta_see_ceramics_gift"
            onClick={() => trackEvent("keramik_gift_click" as never, {} as never)}
            className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-semibold tracking-wide uppercase text-cta-foreground transition-colors"
            style={{ backgroundColor: "#4C574A" }}
          >
            Find en gave i keramik
          </Link>
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
