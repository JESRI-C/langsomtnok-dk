import { createFileRoute } from "@tanstack/react-router";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { ProductRecommendationBlock } from "@/components/landing/ProductRecommendationBlock";
import { TrustBar } from "@/components/landing/TrustBar";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ImageSlot, IMAGE_SLOTS } from "@/components/ImageSlot";

export const Route = createFileRoute("/pages/knivholder-i-trae")({
  head: () => ({
    meta: [
      { title: "Knivholder i træ — Langsomt Nok" },
      { name: "description", content: "Magnetiske knivholdere i træ skaber ro, overblik og varme i køkkenet. Se vores kollektion i valnød og acacia." },
      { property: "og:title", content: "Knivholder i træ — Langsomt Nok" },
      { property: "og:description", content: "Magnetiske knivholdere i træ skaber ro, overblik og varme i køkkenet." },
    ],
  }),
  component: KnifeHolderPage,
});

function KnifeHolderPage() {
  return (
    <div>
      <LandingPageHero
        headline="Når værktøjet er smukt, skal det ikke gemmes væk."
        subheadline="Magnetiske knivholdere i træ skaber ro, overblik og varme i køkkenet."
        primaryCta={{ label: "Se magnetiske holdere", to: "/collections/magnetiske-holdere" }}
        secondaryCta={{ label: "Læs om materialerne", to: "/guides/gode-koekkenredskaber-der-holder" }}
        imageSlot={{ name: IMAGE_SLOTS.heroes.woodenKnifeHolderLandingHero.name, motif: IMAGE_SLOTS.heroes.woodenKnifeHolderLandingHero.motif }}
        variant="overlay"
      />

      <TrustBar />

      {/* Why magnetic */}
      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Hvorfor en magnetisk knivholder?</h2>
          <div className="space-y-4 text-muted-foreground text-editorial">
            <p>En skuffe ødelægger dine knive. En knivblok samler støv og bakterier. En magnetisk holder gør det modsatte: den viser dine redskaber frem, beskytter bladene og giver dig overblik.</p>
            <p>Med en magnetisk holder er kniven altid inden for rækkevidde. Du griber den naturligt — og lægger den lige så naturligt på plads igen.</p>
          </div>
        </div>
      </section>

      {/* Wood types */}
      <section className="section-padding bg-soft">
        <div className="container-calm max-w-4xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-8 text-center">Træsorter og køkkenæstetik</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Valnød", desc: "Dyb, varm og tidløs. Passer til de fleste køkkener og ældes smukt.", slot: IMAGE_SLOTS.materials.walnut },
              { name: "Acacia", desc: "Lysere toner med et organisk mønster. Giver et let, nordisk udtryk.", slot: IMAGE_SLOTS.materials.acacia },
              { name: "Oliventræ", desc: "Levende, hvirvlende mønster. Hvert stykke er unikt som et fingeraftryk.", slot: IMAGE_SLOTS.materials.oliveWood },
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

      {/* Wall mounting */}
      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl mb-4">Montering og daglig brug</h2>
              <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>Montering tager 10 minutter. Medfølgende beslag passer til de fleste vægtyper — muret, gips eller træ.</p>
                <p>Holderen bærer 3-5 knive afhængig af størrelse. De stærkeste magneter holder selv tunge kokkeknive sikkert på plads.</p>
                <p>Placér holderen i bekvem højde — du skal nå knivene naturligt uden at strække dig.</p>
              </div>
            </div>
            <ImageSlot name="knife-holder-mounted" ratio="4/5" motif="Knivholder monteret på hvid væg med knive, set let fra siden" variant="warm" />
          </div>
        </div>
      </section>

      {/* Match with knives */}
      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Match med dine knive</h2>
          <p className="text-muted-foreground text-editorial mb-6">
            Valnød passer perfekt til knive med mørke skafter. Acacia og oliven giver kontrast til stålblade. Det vigtigste er, at kombinationen giver dig glæde, hver gang du kigger på den.
          </p>
        </div>
      </section>

      <ProductRecommendationBlock
        title="Magnetiske holdere"
        subtitle="Håndlavet i massivt træ med stærke neodymium-magneter."
      />

      <FAQAccordion items={[
        { question: "Skader magneten mine knive?", answer: "Nej. Neodymium-magneter er stærke nok til at holde, men skånsomme mod bladet. Undgå at lade kniven glide langs holderen — løft den af." },
        { question: "Kan holderen bære tunge kokkeknive?", answer: "Ja. Vores holdere bruger N52-grade neodymium-magneter, der holder selv de tungeste kokkeknive sikkert på plads." },
        { question: "Hvad hvis min væg er af gips?", answer: "Medfølgende beslag passer til gipsvægge. Vi anbefaler montering i lægter for de tungeste belastninger." },
        { question: "Kan jeg bruge holderen til andre ting?", answer: "Ja — sakse, rivejern eller andre magnetiske redskaber. Mange bruger den også til nøgler i entréen." },
      ]} />

      <CalmCTASection
        headline="Vis dine redskaber frem."
        text="Når stål og træ mødes på væggen, bliver køkkenet lidt smukkere."
        cta={{ label: "Se magnetiske holdere", to: "/collections/magnetiske-holdere" }}
        variant="warm"
      />

      <NewsletterSignup variant="dark" />
    </div>
  );
}
