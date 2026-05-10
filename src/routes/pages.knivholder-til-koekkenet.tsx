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
import { fetchProductsByHandles, type ShopifyProduct } from "@/lib/shopify";
import { buildFaqSchemaScript } from "@/lib/faq-schema";

const PAGE_SLUG = "knivholder-til-koekkenet";
const CATEGORY = "knife_holder";

const FAQ_ITEMS = [
  { question: "Skader magneten kniven?", answer: "Nej. Magneten holder bladet, men er skånsom. Løft kniven af — lad den ikke glide hen over træet." },
  { question: "Kan holderen sidde på en gipsvæg?", answer: "Ja. Vi leverer beslag, der passer til gips. For tunge knivsæt anbefaler vi at ramme en lægte." },
  { question: "Hvor mange knive kan den bære?", answer: "De fleste af vores holdere kan bære 4–6 knive afhængigt af længde og vægt." },
  { question: "Skal træet plejes?", answer: "Et tyndt lag plejeolie 2–4 gange om året holder træet levende og roligt i farven." },
];

export const Route = createFileRoute("/pages/knivholder-til-koekkenet")({
  head: () => ({
    meta: [
      { title: "Knivholderen, der samler køkkenet — Langsomt Nok" },
      { name: "description", content: "Magnetiske knivholdere og knivlister i træ. Skab overblik, beskyt bladet og lad redskaberne være en del af køkkenet." },
      { property: "og:title", content: "Knivholderen, der samler køkkenet" },
      { property: "og:description", content: "Magnetiske knivholdere og knivlister i træ. Overblik, beskyttelse og ro i køkkenet." },
      { property: "og:image", content: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/IMG_6147.jpg?v=1773564482" },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/pages/knivholder-til-koekkenet" }],
    scripts: [buildFaqSchemaScript(FAQ_ITEMS)],
  }),
  component: Page,
});

const HANDLES = [
  "magnetic-knife-holder-acacia-19-6",
  "magnetic-knife-display-stand-acacia",
  "magnetic-knife-display-stand-walnut",
  "magnetic-knife-holder-walnut-19-6",
];

function Page() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  useEffect(() => { fetchProductsByHandles(HANDLES).then(setProducts); }, []);

  return (
    <div>
      <LandingPageHero
        headline="Knivholderen, der samler køkkenet."
        subheadline="Træ, magnet og ro. Et sted, hvor kniven hører til — og altid er klar til hånden."
        primaryCta={{ label: "Se udvalget", to: "/shop", intent: "view_products" }}
        secondaryCta={{ label: "Find dit ritual", to: "/find-dit-ritual", intent: "find_ritual" }}
        imageSlot={{
          name: "image_knivholder_hero",
          motif: "Magnetisk knivholder i træ med køkkenknive i roligt nordisk køkken",
          alt: "Magnetisk knivholder i træ med køkkenknive i roligt nordisk køkken",
          src: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/IMG_6147.jpg?v=1773564482",
        }}
        variant="overlay"
        trackingPage={PAGE_SLUG}
        trackingCategory={CATEGORY}
      />

      <TrustBar />

      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Et roligt sted til et skarpt værktøj</h2>
          <p className="text-muted-foreground text-editorial">
            En kniv hører ikke hjemme i en skuffe. Den hører hjemme et sted, hvor den ses, beskyttes og hentes med samme bevægelse, hver gang. En knivholder er ikke pynt. Det er en daglig vane, der gør resten af køkkenet roligere.
          </p>
        </div>
      </section>

      <section className="section-padding bg-soft">
        <div className="container-calm max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Overblik", desc: "Du ser, hvad du har. Og du griber den rigtige kniv første gang." },
              { title: "Beskyttelse", desc: "Magneten holder bladet frit i luften. Æggen rører ingenting." },
              { title: "Æstetik", desc: "Træ og stål bliver en del af køkkenet. Ikke noget der skal gemmes væk." },
            ].map((b) => (
              <div key={b.title}>
                <h3 className="font-serif text-xl mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductRecommendationBlock title="Knivholdere i træ" subtitle="Håndlavet i valnød og akacie. Stærke magneter. Rolige linjer." products={products} />

      <section className="section-padding bg-soft">
        <div className="container-calm max-w-4xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6 text-center">Sådan monterer du din knivholder</h2>
          <ImageSlot name="video_knivblok_setup" ratio="16/9" motif="Video: opsætning af magnetisk knivholder på væg" alt="Video: opsætning af magnetisk knivholder på væg" variant="warm" />
          <p className="text-center text-sm text-muted-foreground mt-4 max-w-xl mx-auto">
            Videoen lægges ind her, når optagelsen er klar. Indtil da kan du gå direkte til produkterne eller læse guiden trin for trin.
          </p>
          <div className="text-center mt-6">
            <Link
              to="/pages/hvilken-knivholder-skal-jeg-vaelge"
              className="cta-video-watch text-sm font-medium text-cta hover:text-cta/80"
              data-track-event="landing_video_cta_click"
              data-track-page={PAGE_SLUG}
              data-track-intent="watch_guide"
              data-track-product-category={CATEGORY}
            >
              Hvilken holder passer til dit køkken? →
            </Link>
          </div>
        </div>
      </section>

      <PaymentTrustSection />

      <FAQAccordion items={FAQ_ITEMS} />

      <CalmCTASection
        headline="Lad kniven få sit eget sted."
        text="Når redskabet ses, bliver det også brugt — og passet på."
        cta={{ label: "Se udvalget", to: "/shop" }}
        secondaryCta={{ label: "Find dit ritual", to: "/find-dit-ritual" }}
        variant="warm"
        trackingPage={PAGE_SLUG}
        trackingCategory={CATEGORY}
      />

      <InternalLinksSection
        page={PAGE_SLUG}
        links={[
          { to: "/pages/hvilken-knivholder-skal-jeg-vaelge", title: "Hvilken holder passer til dit køkken?", description: "En rolig sammenligning af væglist, blok og stander.", category: "knife_holder" },
          { to: "/pages/gaver-med-ro", title: "Gaver, der bliver brugt", description: "En holder eller en kniv pakket i naturpapir.", category: "gifts" },
          { to: "/pages/koekkenet-som-fristed", title: "Køkkenet som fristed", description: "Vores manifest og hele universet samlet ét sted.", category: "brand_universe" },
        ]}
      />

      <NewsletterSignup variant="dark" />
    </div>
  );
}
