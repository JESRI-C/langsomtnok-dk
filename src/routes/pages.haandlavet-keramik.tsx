import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { ProductRecommendationBlock } from "@/components/landing/ProductRecommendationBlock";
import { TrustBar } from "@/components/landing/TrustBar";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ImageSlot } from "@/components/ImageSlot";
import { InternalLinksSection } from "@/components/landing/InternalLinksSection";
import { PaymentTrustSection } from "@/components/landing/PaymentTrustSection";
import { EmptyProductsFallback } from "@/components/landing/EmptyProductsFallback";
import { fetchProductsByHandles, type ShopifyProduct } from "@/lib/shopify";
import { buildFaqSchemaScript } from "@/lib/faq-schema";

const PAGE_SLUG = "haandlavet-keramik";
const CATEGORY = "ceramics";

const FAQ_ITEMS = [
  { question: "Tåler keramikken opvaskemaskine?", answer: "Ja, men håndvask forlænger glasurens liv og holder farverne friske." },
  { question: "Er det normalt med små variationer?", answer: "Ja. Hvert stykke er drejet og glaseret i hånden — variation er en del af håndværket, ikke en fejl." },
  { question: "Kan keramikken bruges i ovn?", answer: "Mindre skåle og fade tåler ovn op til 180°C. Vi mærker hvert produkt med dets brug." },
];

const HANDLES: string[] = [
  "lille-kop-i-perlemor-glasur-susan-riel",
  "rillet-kop-i-lys-blagron-glasur-susan-riel",
  "spiralskal-i-lys-bla-glasur-susan-riel",
  "handformet-skal-i-mork-gronbla-glasur-susan-riel",
  "skal-i-gron-og-bla-glasur-susan-riel",
  "indskudte-skale-i-stenbla-glasur-susan-riel",
];

export const Route = createFileRoute("/pages/haandlavet-keramik")({
  head: () => ({
    meta: [
      { title: "Keramik med spor af hænder — Langsomt Nok" },
      { name: "description", content: "Håndlavet keramik af Susan Riel. Drejet, brændt og pakket et stykke ad gangen. Kopper, skåle og krukker til hverdagens små ritualer." },
      { property: "og:title", content: "Keramik med spor af hænder" },
      { property: "og:description", content: "Håndlavet keramik af Susan Riel — drejet og brændt et stykke ad gangen." },
      { property: "og:image", content: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/Kunsteren_Susan_Riel.png?v=1778398741" },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/pages/haandlavet-keramik" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Forside", item: "https://langsomtnok.dk/" },
            { "@type": "ListItem", position: 2, name: "Guides", item: "https://langsomtnok.dk/guides" },
            { "@type": "ListItem", position: 3, name: "Keramik med spor af hænder", item: "https://langsomtnok.dk/pages/haandlavet-keramik" },
          ],
        }),
      },
      buildFaqSchemaScript(FAQ_ITEMS),
    ],
  }),
  component: Page,
});

function Page() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  useEffect(() => { if (HANDLES.length) fetchProductsByHandles(HANDLES).then(setProducts); }, []);

  return (
    <div>
      <LandingPageHero
        headline="Keramik med spor af hænder."
        subheadline="Drejet, brændt og pakket et stykke ad gangen. To kopper er aldrig helt ens — og det er hele pointen."
        primaryCta={{ label: "Se udvalget", to: "/keramik", intent: "view_products" }}
        secondaryCta={{ label: "Mød kunsteren", to: "/keramik/susan-riel", intent: "meet_artist" }}
        imageSlot={{
          name: "image_keramik_hero",
          motif: "Håndlavet keramikkop fra Susan Riel på lyst bord",
          alt: "Håndlavet keramikkop fra Susan Riel på lyst bord",
          src: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/Kunsteren_Susan_Riel.png?v=1778398741",
        }}
        variant="overlay"
        trackingPage={PAGE_SLUG}
        trackingCategory={CATEGORY}
      />

      <TrustBar />

      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Det langsomme håndværk</h2>
          <div className="space-y-4 text-muted-foreground text-editorial">
            <p>Keramik bliver til af tre ting: ler, vand og tid. Susan drejer hver kop, skål og krukke i hånden i sit værksted, lader det tørre langsomt og brænder det to gange. Ingen forme. Ingen kopier.</p>
            <p>Du kan se det, når du holder en kop. Hanken sidder, hvor en finger har trykket. Glasuren samler sig, hvor stykket er rørt sidst. Det er ikke fejl. Det er sporet af et menneske.</p>
          </div>
        </div>
      </section>

      {products.length > 0 ? (
        <ProductRecommendationBlock title="Udvalgte stykker" subtitle="Hver hånddrejet og signeret af Susan." products={products} />
      ) : (
        <EmptyProductsFallback
          title="Et håndlavet udvalg på vej"
          subtitle="Kuratet i ro"
          body="Susan drejer det næste batch netop nu. Skriv dig op til Langsomt Brev, så du hører, når kopperne forlader ovnen — eller udforsk vores andre håndværksstykker imens."
          ctaLabel="Se gaver med ro"
          ctaTo="/pages/gaver-med-ro"
          secondaryLabel="Mød Susan"
          secondaryTo="/keramik/susan-riel"
          imageSlot={{
            name: "ceramic-artist-portrait",
            motif: "Portræt af keramiker Susan Riel ved drejeskiven",
            src: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/Kunsteren_Susan_Riel.png?v=1778398741",
          }}
          trackingPage={PAGE_SLUG}
          trackingCategory={CATEGORY}
        />
      )}

      <section className="section-padding bg-soft">
        <div className="container-calm max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <ImageSlot name="ceramic-artist-portrait" ratio="4/5" motif="Portræt af keramiker Susan Riel ved drejeskiven" alt="Portræt af keramiker Susan Riel ved drejeskiven" src="https://cdn.shopify.com/s/files/1/0915/7227/3488/files/Kunsteren_Susan_Riel.png?v=1778398741" variant="warm" />
            <div>
              <span className="text-[10px] font-medium text-copper uppercase tracking-wider">Mød kunsteren</span>
              <h2 className="font-serif text-2xl md:text-3xl mt-2 mb-4">Susan Riel</h2>
              <p className="text-muted-foreground text-editorial mb-4">Susan arbejder fra et lille værksted, hvor hver dag begynder ved drejeskiven. Hendes stykker er drejet til hverdagsbrug — ikke til at stå bag glas.</p>
              <p className="text-muted-foreground text-editorial mb-6">Hun signerer hvert stykke selv, før det forlader ovnen anden gang.</p>
              <Link
                to="/keramik/susan-riel"
                className="cta-secondary text-sm font-medium text-cta hover:text-cta/80"
                data-track-event="landing_internal_link_click"
                data-track-page={PAGE_SLUG}
                data-track-intent="meet_artist"
                data-track-product-category={CATEGORY}
              >
                Læs mere om Susan →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PaymentTrustSection />

      <FAQAccordion items={FAQ_ITEMS} />

      <CalmCTASection
        headline="Drikkekoppen, du henter først om morgenen."
        text="Hånddrejet keramik til hverdagens små ritualer."
        cta={{ label: "Se udvalget", to: "/keramik" }}
        secondaryCta={{ label: "Mød Susan", to: "/keramik/susan-riel" }}
        variant="warm"
        trackingPage={PAGE_SLUG}
        trackingCategory={CATEGORY}
      />

      <InternalLinksSection
        page={PAGE_SLUG}
        links={[
          { to: "/pages/sommerbord-med-keramik", title: "Dæk sommerbordet langsomt", description: "Keramik kuratet til de lange aftener.", category: "ceramics" },
          { to: "/pages/gaver-med-ro", title: "Gaver, der bliver brugt", description: "Et hånddrejet stykke pakket i naturpapir.", category: "gifts" },
          { to: "/pages/koekkenet-som-fristed", title: "Køkkenet som fristed", description: "Hele Langsomt Noks univers samlet ét sted.", category: "brand_universe" },
        ]}
      />

      <NewsletterSignup variant="dark" />
    </div>
  );
}
