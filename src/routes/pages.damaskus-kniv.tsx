import { createFileRoute } from "@tanstack/react-router";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { ProductRecommendationBlock } from "@/components/landing/ProductRecommendationBlock";
import { ProductComparisonTable } from "@/components/landing/ProductComparisonTable";
import { TrustBar } from "@/components/landing/TrustBar";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ImageSlot, IMAGE_SLOTS } from "@/components/ImageSlot";

export const Route = createFileRoute("/pages/damaskus-kniv")({
  head: () => ({
    meta: [
      { title: "Damaskus kniv — Langsomt Nok" },
      { name: "description", content: "Damaskus-stål er ikke kun mønster. Det er lag, styrke og tradition. Udforsk vores kollektion af damaskus kokkeknive." },
      { property: "og:title", content: "Damaskus kniv — Langsomt Nok" },
      { property: "og:description", content: "Damaskus-stål er ikke kun mønster. Det er lag, styrke og tradition." },
    ],
  }),
  component: DamascusPage,
});

function DamascusPage() {
  return (
    <div>
      <LandingPageHero
        headline="Damaskus-stål er ikke kun mønster. Det er lag, styrke og tradition."
        subheadline="Her får du roligt overblik over stålet, skarpheden, balancen og følelsen i hånden."
        primaryCta={{ label: "Udforsk Damascus-kollektionen", to: "/collections/knive" }}
        secondaryCta={{ label: "Læs om stålet", to: "/guides/damaskus-kniv-hvad-betyder-det" }}
        imageSlot={{ name: IMAGE_SLOTS.heroes.damascusLandingHero.name, motif: IMAGE_SLOTS.heroes.damascusLandingHero.motif }}
        variant="overlay"
      />

      <TrustBar />

      {/* What Damascus steel is */}
      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Hvad er damaskus-stål?</h2>
          <div className="space-y-4 text-muted-foreground text-editorial">
            <p>Damaskus-stål er ikke én type stål. Det er mange. Lag på lag af forskellige ståltyper smedet sammen under ekstrem varme. Resultatet er et blad med unik styrke, fleksibilitet og det karakteristiske bølgemønster.</p>
            <p>Hvert blad er unikt. Mønsteret afslører lagene — og historien om det håndværk, der skabte det.</p>
          </div>
        </div>
      </section>

      {/* Why layers matter */}
      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <ImageSlot name="damascus-layers-closeup" ratio="1/1" motif="Extreme close-up af damaskus stållag, synlige linjer" variant="warm" />
            <div>
              <h2 className="font-serif text-2xl md:text-3xl mb-4">Hvorfor lagene betyder noget</h2>
              <p className="text-muted-foreground text-editorial mb-4">
                67 lag lyder imponerende. Men det vigtige er, hvad de gør. De ydre lag af blødere stål absorberer stød og beskytter kernen. Kernen — typisk VG-10 — holder skarpheden.
              </p>
              <p className="text-muted-foreground text-editorial">
                Tænk på det som en sandwich: blød ydre for modstandsdygtighed, hård kerne for skarphed. Det bedste af begge verdener.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HRC explained */}
      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">HRC hårdhed — enkelt forklaret</h2>
          <div className="space-y-4 text-muted-foreground text-editorial mb-8">
            <p>HRC (Rockwell Hardness) måler, hvor hårdt stålet er. Jo højere tal, jo længere holder skarpheden — men jo mere forsigtig skal du være.</p>
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            {[
              { hrc: "54-56 HRC", type: "Blødt stål", desc: "Typisk europæisk. Nemt at slibe, men mister skarphed hurtigt." },
              { hrc: "58-60 HRC", type: "Mellem", desc: "God balance. Vores anbefalede startpunkt." },
              { hrc: "60-62 HRC", type: "Hårdt stål", desc: "Japansk tradition. Holder skarphed længst, kræver mere forsigtighed." },
            ].map((item, i) => (
              <div key={item.hrc} className={`flex flex-col md:flex-row md:items-center gap-2 md:gap-6 p-4 ${i % 2 === 0 ? "bg-soft/30" : ""} ${i > 0 ? "border-t border-border/50" : ""}`}>
                <span className="font-mono text-sm text-copper font-medium w-24 flex-shrink-0">{item.hrc}</span>
                <span className="font-serif text-sm font-medium w-28 flex-shrink-0">{item.type}</span>
                <span className="text-sm text-muted-foreground">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Handle, balance and feel */}
      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Skaft, balance og følelse</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Valnøddetræ", text: "Varmt, dybt og ældes smukt. Det mest populære valg." },
              { title: "Balance", text: "Tyngdepunktet hviler præcis ved bolsteren. Naturlig i hånden." },
              { title: "Følelsen", text: "Let nok til præcision. Tung nok til at lade stålet gøre arbejdet." },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-lg border border-border bg-background">
                <h3 className="font-serif text-base mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Damascus knives */}
      <ProductRecommendationBlock
        title="Udvalgte damaskus-knive"
        subtitle="Hvert blad er unikt. Find den, der passer dig."
      />

      {/* Care */}
      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Pleje af damaskus-stål</h2>
          <div className="space-y-4 text-muted-foreground text-editorial">
            <p>Damaskus-stål er robust, men det fortjener respekt. Håndvask altid — aldrig opvaskemaskine. Tør bladet af med det samme og opbevar det på en magnetisk holder.</p>
            <p>Med tiden kan mønsteret i stålet blive mere udtalt. Det er meningen. Din kniv fortæller historien om sit liv i dit køkken.</p>
          </div>
        </div>
      </section>

      <FAQAccordion items={[
        { question: "Er damaskus-stål bedre end normalt stål?", answer: "Det kombinerer det bedste fra flere ståltyper. VG-10 kernen giver exceptionel skarphed, mens de ydre lag giver fleksibilitet og modstandsdygtighed." },
        { question: "Kan mønsteret slides af?", answer: "Nej. Mønsteret er stålets struktur, ikke en overflade-effekt. Det går hele vejen igennem bladet og kan faktisk blive mere udtalt med tiden og slibning." },
        { question: "Er damaskus-stål sværere at slibe?", answer: "Nej, men det tager lidt længere tid pga. den højere hårdhed. En 1000/5000 vandsten er ideel." },
        { question: "Kan damaskus-stål ruste?", answer: "Vores damaskus-stål er højt legeret og modstandsdygtigt, men ikke rustfrit. Tør altid bladet efter brug og opbevar det tørt." },
      ]} />

      <CalmCTASection
        headline="Lag, styrke, tradition."
        text="Et damaskus-blad er ikke bare et redskab. Det er et stykke håndværk, du holder i hånden hver dag."
        cta={{ label: "Udforsk Damascus-kollektionen", to: "/collections/knive" }}
        variant="dark"
      />

      <NewsletterSignup />
    </div>
  );
}
