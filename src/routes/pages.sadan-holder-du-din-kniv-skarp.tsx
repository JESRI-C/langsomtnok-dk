import { createFileRoute } from "@tanstack/react-router";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { ProductRecommendationBlock } from "@/components/landing/ProductRecommendationBlock";
import { TrustBar } from "@/components/landing/TrustBar";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ImageSlot, IMAGE_SLOTS } from "@/components/ImageSlot";

export const Route = createFileRoute("/pages/sadan-holder-du-din-kniv-skarp")({
  head: () => ({
    meta: [
      { title: "Sådan holder du din kniv skarp — Langsomt Nok" },
      { name: "description", content: "En skarp kniv er ikke tilfældig. Den er plejet. Lær den rolige måde at holde din kniv skarp på." },
      { property: "og:title", content: "Sådan holder du din kniv skarp — Langsomt Nok" },
      { property: "og:description", content: "En skarp kniv er ikke tilfældig. Den er plejet." },
    ],
  }),
  component: SharpeningPage,
});

function SharpeningPage() {
  return (
    <div>
      <LandingPageHero
        headline="En skarp kniv er ikke tilfældig. Den er plejet."
        subheadline="Lær den rolige måde at holde din kniv skarp på — uden maskiner, stress eller gætværk."
        primaryCta={{ label: "Se slibesten og pleje", to: "/collections/slibesten" }}
        secondaryCta={{ label: "Læs guiden", to: "/guides/hvordan-sliber-man-en-kniv" }}
        imageSlot={{ name: IMAGE_SLOTS.heroes.sharpeningLandingHero.name, motif: IMAGE_SLOTS.heroes.sharpeningLandingHero.motif }}
        variant="overlay"
      />

      <TrustBar />

      {/* Why knives become dull */}
      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Hvorfor knive bliver sløve</h2>
          <div className="space-y-4 text-muted-foreground text-editorial">
            <p>Selv det bedste stål mister sin æg med tiden. Det er ikke en fejl — det er fysik. Hver gang bladet møder et skærebræt, bøjes den mikroskopiske æg en smule. Over tid bliver snittet grovere, og du presser hårdere.</p>
            <p>Løsningen er ikke en ny kniv. Det er en god sten, lidt vand og tålmodighed.</p>
          </div>
        </div>
      </section>

      {/* Sharpening stones explained */}
      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Slibesten forklaret</h2>
          <div className="space-y-6">
            {[
              { grit: "400–600", title: "Grov sten", text: "Til beskadigede blade og knive der har mistet formen. Fjerner mest metal." },
              { grit: "1000", title: "Medium sten", text: "Den vigtigste sten. Genskaber æggen og giver en solid grundskarphed." },
              { grit: "3000–5000", title: "Fin sten", text: "Polerer æggen og giver en silkeblød skarphed. Til den der vil have det ekstra." },
            ].map((stone) => (
              <div key={stone.grit} className="flex gap-5 items-start p-5 rounded-lg border border-border bg-background">
                <span className="flex-shrink-0 text-xs font-mono text-copper bg-copper/10 px-2 py-1 rounded">{stone.grit}</span>
                <div>
                  <h3 className="font-serif text-base mb-1">{stone.title}</h3>
                  <p className="text-sm text-muted-foreground">{stone.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leather strop and oil */}
      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ImageSlot name="sharpening-leather-strop" ratio="4/5" motif="Læderstrop med kniv i hvæsningsbevægelse" variant="warm" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-2xl md:text-3xl mb-4">Læderstrop og olie</h2>
              <p className="text-muted-foreground text-editorial mb-4">
                Mellem slibningerne holder en læderstrop æggen rettet op. Et par strøg inden brug er alt, der skal til.
              </p>
              <p className="text-muted-foreground text-editorial">
                Plejeolie beskytter bladet mod oxidering og holder træskaftet levende. Det tager 30 sekunder og forlænger knivens levetid med år.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-step sharpening guide */}
      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-8">5 trin til en skarp kniv</h2>
          <div className="space-y-6">
            {[
              { step: "1", title: "Blødlæg stenen", text: "Læg din slibesten i vand i 10-15 minutter. Stenen skal være mættet." },
              { step: "2", title: "Find vinklen", text: "Hold kniven i 15-20 graders vinkel mod stenen. Japanske knive: 15°. Europæiske: 20°." },
              { step: "3", title: "Slib den ene side", text: "Træk bladet i jævne strøg fra hæl til spids. 5-10 strøg pr. sektion." },
              { step: "4", title: "Vend og gentag", text: "Slib den anden side med samme antal strøg. Konsistens er vigtigere end kraft." },
              { step: "5", title: "Afslut og tør", text: "Et par strøg på den fine sten eller læderstrop. Skyl kniven og tør grundigt af." },
            ].map((item) => (
              <div key={item.step} className="flex gap-5 items-start">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-cta text-cta-foreground flex items-center justify-center font-serif">{item.step}</span>
                <div>
                  <h3 className="font-serif text-base mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended products */}
      <ProductRecommendationBlock
        title="Anbefalede plejeprodukter"
        subtitle="Alt hvad du behøver til vedligeholdelse af dine knive."
      />

      <FAQAccordion items={[
        { question: "Hvor ofte skal jeg slibe min kniv?", answer: "For de fleste hjemmekokke anbefaler vi slibning hver 2-3 måned. Brug en læderstrop eller keramisk stål mellem slibningerne." },
        { question: "Kan jeg ødelægge min kniv ved at slibe forkert?", answer: "Det er svært at ødelægge en kniv med en slibesten, men du kan ændre æggens vinkel. Start med lette strøg og hold en konsistent vinkel." },
        { question: "Hvad er forskellen på 1000 og 5000 grit?", answer: "1000 grit genskaber æggen — det er den vigtigste. 5000 grit polerer og forfiner for en silkeblød skarphed. Start med 1000." },
        { question: "Skal stenen altid blødlægges?", answer: "De fleste japanske vandsten skal blødlægges 10-15 minutter. Tjek din stens anvisninger — nogle sten kræver kun overfladevand." },
      ]} />

      <CalmCTASection
        headline="Giv dit blad nyt liv."
        text="Slibning er ikke en pligt. Det er en måde at forlænge glæden på."
        cta={{ label: "Se slibesten og pleje", to: "/collections/slibesten" }}
        secondaryCta={{ label: "Læs slibeguiden", to: "/guides/hvordan-sliber-man-en-kniv" }}
        variant="dark"
      />

      <NewsletterSignup />
    </div>
  );
}
