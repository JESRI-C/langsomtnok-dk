import { createFileRoute } from "@tanstack/react-router";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ImageSlot, IMAGE_SLOTS } from "@/components/ImageSlot";
import { CalmCTASection } from "@/components/landing/CalmCTASection";

export const Route = createFileRoute("/om")({
  head: () => ({
    meta: [
      { title: "Om Langsomt Nok — Tid. Håndværk. Ro." },
      { name: "description", content: "Langsomt Nok er skabt til køkkenet som fristed. Til hænder, der mærker forskellen." },
      { property: "og:title", content: "Om Langsomt Nok — Tid. Håndværk. Ro." },
      { property: "og:description", content: "Langsomt Nok er skabt til køkkenet som fristed." },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/om" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="pt-24">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-calm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="fade-in-up">
              <span className="text-xs font-medium text-copper uppercase tracking-widest mb-4 block">Om brandet</span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-[1.05]">
                Tid.<br />Håndværk.<br />Ro.
              </h1>
              <div className="space-y-4 text-muted-foreground text-editorial">
                <p>
                  Langsomt Nok begyndte med en simpel idé: at køkkenredskaber fortjener den samme respekt som de ingredienser, de bearbejder.
                </p>
                <p>
                  Vi tror på, at et godt snit begynder før kniven rammer brættet. Det begynder med valget af stål. Med tålmodighed i smedjen. Med respekt for det køkken, redskabet ender i.
                </p>
                <p>
                  Vores redskaber er ikke skabt til hastværk. De er skabt til nærvær.
                </p>
              </div>
            </div>
            <ImageSlot
              name="about-brand-portrait"
              ratio="4/5"
              motif="Hænder der holder en kokkekniv ved et skærebræt med friske urter, varmt naturligt lys fra vindue"
              alt="Hænder med kokkekniv i et roligt nordisk køkken"
              variant="warm"
            />
          </div>
        </div>
      </section>

      {/* ── Manifest ─────────────────────────────────────────── */}
      <section className="section-padding bg-linen">
        <div className="container-calm max-w-3xl mx-auto text-center fade-in-up">
          <p className="font-serif text-2xl md:text-4xl leading-relaxed text-walnut mb-6">
            "Det her er ikke udstyr til travlhed.<br />Det er værktøj til nærvær."
          </p>
          <p className="text-muted-foreground text-sm uppercase tracking-widest">— Langsomt Nok</p>
        </div>
      </section>

      {/* ── Brand Formula ───────────────────────────────────── */}
      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl mb-8">Vores formel</h2>
          <p className="font-serif text-2xl md:text-3xl text-walnut mb-4">
            Ro + Præcision + Materiale + Ritual
          </p>
          <p className="font-serif text-xl text-copper mb-6">= Langsomt Nok</p>
          <p className="text-muted-foreground text-editorial mx-auto">
            Hvert produkt vi vælger opfylder alle fire. Ingen undtagelser.
          </p>
        </div>
      </section>

      {/* ── Four Elements ────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-calm">
          <h2 className="font-serif text-3xl text-center mb-12">Fire elementer. Ét formål.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { element: "Træ", desc: "Varme og karakter i hvert greb. Ældes smukt med tiden.", slot: IMAGE_SLOTS.materials.walnut },
              { element: "Stål", desc: "Præcision smedet i lag. Skarphed der varer.", slot: IMAGE_SLOTS.materials.damascusSteel },
              { element: "Olie", desc: "Pleje der forlænger glæden. En del af ritualet.", slot: IMAGE_SLOTS.materials.oilOnWood },
              { element: "Tid", desc: "Den vigtigste ingrediens. I køkkenet og i alt andet.", slot: IMAGE_SLOTS.materials.sharpeningStone },
            ].map((item) => (
              <div key={item.element} className="text-center">
                <ImageSlot
                  name={item.slot.name}
                  ratio="1/1"
                  motif={item.slot.motif}
                  variant="warm"
                  className="mb-4"
                />
                <h3 className="font-serif text-xl mb-2">{item.element}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Believe ──────────────────────────────────── */}
      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl text-center mb-12">Hvad vi tror på</h2>
          <div className="space-y-8">
            {[
              { title: "Materialer over marketing", desc: "Vi lader stål, træ og sten tale for sig selv." },
              { title: "Pleje over forbrug", desc: "Et godt redskab varer, når det passes. Vi hjælper dig med det." },
              { title: "Ro over hast", desc: "Gode ting tager tid. I køkkenet og i alt andet." },
              { title: "Håndværk over masseproduktion", desc: "Hvert produkt har en historie. Vi fortæller den." },
              { title: "Funktion over pynt", desc: "Skønhed der tjener et formål. Aldrig omvendt." },
            ].map((belief) => (
              <div key={belief.title} className="flex gap-6 items-start">
                <div className="w-2 h-2 rounded-full bg-copper mt-2.5 flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-lg mb-1">{belief.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{belief.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Codes ──────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-calm max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl text-center mb-12">Vores brandkoder</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              "Varmt træ",
              "Præcist stål",
              "Naturligt lys",
              "Negativ plads",
              "Hænder & ritualer",
              "Mosgrøn handling",
              "Rytmisk tekst",
              "Langsom bevægelse",
              "Materiale close-ups",
              "Rolig asymmetri",
            ].map((code) => (
              <div key={code} className="p-4 rounded-lg border border-border/50 bg-soft/30">
                <span className="text-sm text-muted-foreground font-medium">{code}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CalmCTASection
        headline="Stål holder formen. Træ holder varmen. Tiden holder resten."
        text="Udforsk vores redskaber og find dit eget køkkenritual."
        cta={{ label: "Udforsk ritualerne", to: "/shop" }}
        variant="warm"
      />

      <NewsletterSignup variant="dark" />
    </div>
  );
}
