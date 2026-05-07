import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { ProductRecommendationBlock } from "@/components/landing/ProductRecommendationBlock";
import { TrustBar } from "@/components/landing/TrustBar";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ImageSlot, IMAGE_SLOTS } from "@/components/ImageSlot";
import { fetchProductsByHandles, type ShopifyProduct } from "@/lib/shopify";

export const Route = createFileRoute("/pages/knivholder-i-trae")({
  head: () => ({
    meta: [
      { title: "Knivholder i træ — Langsomt Nok" },
      { name: "description", content: "Magnetiske knivholdere i træ skaber ro, overblik og varme i køkkenet. Se vores kollektion i valnød og akacie." },
      { property: "og:title", content: "Knivholder i træ — Langsomt Nok" },
      { property: "og:description", content: "Magnetiske knivholdere i træ skaber ro, overblik og varme i køkkenet." },
    ],
  }),
  component: KnifeHolderPage,
});

const RECOMMENDED_HANDLES = [
  "magnetic-knife-strip-acacia-50cm",
  "magnetic-knife-stand-acacia",
  "magnetic-knife-stand-walnut",
  "magnetic-knife-strip-walnut-50cm",
];

function KnifeHolderPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    fetchProductsByHandles(RECOMMENDED_HANDLES).then(setProducts);
  }, []);

  return (
    <div>
      <LandingPageHero
        headline="Når værktøjet er smukt, skal det ikke gemmes væk."
        subheadline="Magnetiske knivholdere i træ skaber ro, overblik og varme i køkkenet."
        primaryCta={{ label: "Se magnetiske holdere", to: "/shop" }}
        secondaryCta={{ label: "Læs om materialerne", to: "/guides/gode-koekkenredskaber-der-holder" }}
        imageSlot={{ name: IMAGE_SLOTS.heroes.woodenKnifeHolderLandingHero.name, motif: IMAGE_SLOTS.heroes.woodenKnifeHolderLandingHero.motif }}
        variant="overlay"
      />

      <TrustBar />

      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Hvorfor en magnetisk knivholder?</h2>
          <div className="space-y-4 text-muted-foreground text-editorial">
            <p>En skuffe ødelægger dine knive. En knivblok samler støv. En magnetisk holder gør det modsatte: den viser dine redskaber frem, beskytter bladene og giver dig overblik.</p>
            <p>Med en magnetisk holder er kniven altid inden for rækkevidde. Du griber den naturligt — og lægger den lige så naturligt på plads igen.</p>
          </div>
        </div>
      </section>

      {/* Wood types */}
      <section className="section-padding bg-soft">
        <div className="container-calm max-w-4xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-8 text-center">Træsorter og køkkenæstetik</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: "Valnød", desc: "Dyb, varm og tidløs. Passer til de fleste køkkener og ældes smukt.", slot: IMAGE_SLOTS.materials.walnut },
              { name: "Akacie", desc: "Lysere toner med et organisk mønster. Giver et let, nordisk udtryk.", slot: IMAGE_SLOTS.materials.acacia },
            ].map((wood) => (
              <div key={wood.name}>
                <ImageSlot name={wood.slot.name} ratio="1/1" motif={wood.slot.motif} alt={wood.name} variant="warm" className="mb-4" />
                <h3 className="font-serif text-lg mb-2">{wood.name}</h3>
                <p className="text-sm text-muted-foreground">{wood.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wall vs stand */}
      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Væg eller bord?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg border border-border">
              <h3 className="font-serif text-lg mb-3">Knivlist til væg</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Monteres på væggen og giver et rent, synligt udtryk. Ideel til køkkener med god vægplads.</p>
            </div>
            <div className="p-6 rounded-lg border border-border">
              <h3 className="font-serif text-lg mb-3">Knivstander til bord</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Stiller frit på bordpladen. Ingen montering nødvendig. Ideel til lejligheder eller køkkener uden vægplads.</p>
            </div>
          </div>
        </div>
      </section>

      <ProductRecommendationBlock
        title="Magnetiske holdere"
        subtitle="Håndlavet i massivt træ med stærke magneter."
        products={products}
      />

      <FAQAccordion items={[
        { question: "Skader magneten mine knive?", answer: "Nej. Magneterne er stærke nok til at holde, men skånsomme mod bladet. Løft kniven af — lad den ikke glide." },
        { question: "Kan holderen bære tunge kokkeknive?", answer: "Ja. Vores holdere er designet til at holde selv de tungeste kokkeknive sikkert på plads." },
        { question: "Hvad hvis min væg er af gips?", answer: "Medfølgende beslag passer til gipsvægge. Vi anbefaler montering i lægter for de tungeste belastninger." },
      ]} />

      <CalmCTASection
        headline="Vis dine redskaber frem."
        text="Når stål og træ mødes på væggen, bliver køkkenet lidt smukkere."
        cta={{ label: "Se magnetiske holdere", to: "/shop" }}
        secondaryCta={{ label: "Læs om materialerne", to: "/guides/gode-koekkenredskaber-der-holder" }}
        variant="warm"
      />

      <NewsletterSignup variant="dark" />
    </div>
  );
}
