import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { ProductRecommendationBlock } from "@/components/landing/ProductRecommendationBlock";
import { TrustBar } from "@/components/landing/TrustBar";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ImageSlot } from "@/components/ImageSlot";
import { InternalLinksSection } from "@/components/landing/InternalLinksSection";
import { PaymentTrustSection } from "@/components/landing/PaymentTrustSection";
import { EmptyProductsFallback } from "@/components/landing/EmptyProductsFallback";
import { fetchProductsByHandles, type ShopifyProduct } from "@/lib/shopify";

const PAGE_SLUG = "sommerbord-med-keramik";
const CATEGORY = "ceramics";

const HANDLES: string[] = [];

export const Route = createFileRoute("/pages/sommerbord-med-keramik")({
  head: () => ({
    meta: [
      { title: "Dæk sommerbordet langsomt — Langsomt Nok" },
      { name: "description", content: "Hånddrejet keramik til sommerbordet. Kopper til morgenkaffen, små skåle til oliven, krukker til urter — kuratet til de lange aftener." },
      { property: "og:title", content: "Dæk sommerbordet langsomt" },
      { property: "og:description", content: "Hånddrejet keramik til sommerbordet — kopper, små skåle og krukker." },
      { property: "og:image", content: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/Kunsteren_Susan_Riel.png?v=1778398741" },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/pages/sommerbord-med-keramik" }],
  }),
  component: Page,
});

function Page() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  useEffect(() => { if (HANDLES.length) fetchProductsByHandles(HANDLES).then(setProducts); }, []);

  const sections = [
    { title: "Til morgenkaffen", desc: "Kopper med tyngde og en hank, der passer til hånden. Den, du henter først.", slot: "ceramic-coffee" },
    { title: "Til de små serveringer", desc: "Skåle til oliven, dressing, salt og urter. De små stykker, der gør et bord rigtigt.", slot: "ceramic-small-servings" },
    { title: "Som en gave", desc: "Et hånddrejet stykke pakket i naturpapir. Bruges i morgen og året efter.", slot: "ceramic-gift" },
  ];

  return (
    <div>
      <LandingPageHero
        headline="Dæk sommerbordet langsomt."
        subheadline="Hånddrejet keramik til de lange aftener. Et stykke ad gangen — som maden selv."
        primaryCta={{ label: "Se udvalget", to: "/keramik", intent: "view_products" }}
        secondaryCta={{ label: "Mød kunsteren", to: "/keramik/susan-riel", intent: "meet_artist" }}
        imageSlot={{
          name: "image_sommerbord_keramik_hero",
          motif: "Sommerbord dækket med håndlavet keramik, oliven og brød i aftenlys",
          alt: "Sommerbord dækket med håndlavet keramik fra Susan Riel i aftenlys",
          src: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/Kunsteren_Susan_Riel.png?v=1778398741",
        }}
        variant="overlay"
        trackingPage={PAGE_SLUG}
        trackingCategory={CATEGORY}
      />

      <TrustBar />

      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Bordet, der bliver siddende ved</h2>
          <p className="text-muted-foreground text-editorial">
            Sommerbordet behøver ikke at være pyntet. Det skal bare føles ægte. Et par hånddrejede skåle, en kop med tyngde, en lille krukke til olien — og pludselig bliver aftenen længere af sig selv.
          </p>
        </div>
      </section>

      <section className="section-padding bg-soft">
        <div className="container-calm max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sections.map((s) => (
              <div key={s.title}>
                <ImageSlot name={s.slot} ratio="4/5" motif={s.desc} alt={s.desc} variant="warm" className="mb-4" />
                <h3 className="font-serif text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ImageSlot name="video_keramik_sommerbord" ratio="16/9" motif="Video: dæk sommerbordet langsomt med håndlavet keramik" alt="Video: dæk sommerbordet langsomt med håndlavet keramik" variant="warm" className="container-calm max-w-4xl mt-12" />

      {products.length > 0 ? (
        <ProductRecommendationBlock title="Til sommerbordet" subtitle="Hånddrejet i Susans værksted — et stykke ad gangen." products={products} />
      ) : (
        <EmptyProductsFallback
          title="Sommerbordets stykker er på vej"
          subtitle="Kuratet i ro"
          body="Susans næste batch til sommerbordet kommer snart. Imens kan du udforske vores håndværksstykker — eller finde en gave med ro."
          ctaLabel="Se udvalget"
          ctaTo="/keramik"
          secondaryLabel="Se gaver med ro"
          secondaryTo="/pages/gaver-med-ro"
          imageSlot={{ name: "ceramic-coffee", motif: "Hånddrejet keramikkop på linnedserviet", src: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/Kunsteren_Susan_Riel.png?v=1778398741" }}
          trackingPage={PAGE_SLUG}
          trackingCategory={CATEGORY}
        />
      )}

      <PaymentTrustSection />

      <section className="section-padding">
        <div className="container-calm max-w-3xl text-center">
          <p className="text-muted-foreground text-editorial mb-4">Tænker du gave til en sommerfest?</p>
          <Link
            to="/pages/gaver-med-ro"
            className="cta-secondary text-sm font-medium text-cta hover:text-cta/80"
            data-track-event="landing_internal_link_click"
            data-track-page={PAGE_SLUG}
            data-track-intent="explore_related"
            data-track-product-category="gifts"
          >
            Se gaver med ro →
          </Link>
        </div>
      </section>

      <CalmCTASection
        headline="Lad bordet bære aftenen."
        text="Hånddrejet keramik, hverdagsbrug — sommer eller vinter."
        cta={{ label: "Se udvalget", to: "/keramik" }}
        secondaryCta={{ label: "Læs om håndværket", to: "/pages/haandlavet-keramik" }}
        variant="warm"
        trackingPage={PAGE_SLUG}
        trackingCategory={CATEGORY}
      />

      <InternalLinksSection
        page={PAGE_SLUG}
        links={[
          { to: "/pages/haandlavet-keramik", title: "Keramik med spor af hænder", description: "Læs om håndværket bag hvert stykke.", category: "ceramics" },
          { to: "/pages/gaver-med-ro", title: "Gaver, der bliver brugt", description: "Keramik som gave — pakket i naturpapir.", category: "gifts" },
          { to: "/pages/koekkenet-som-fristed", title: "Køkkenet som fristed", description: "Hele Langsomt Noks univers.", category: "brand_universe" },
        ]}
      />

      <NewsletterSignup variant="dark" />
    </div>
  );
}
