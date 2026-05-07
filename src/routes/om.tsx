import { createFileRoute } from "@tanstack/react-router";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import materialWalnut from "@/assets/material-walnut.jpg";

export const Route = createFileRoute("/om")({
  head: () => ({
    meta: [
      { title: "Om Langsomt Nok" },
      { name: "description", content: "Langsomt Nok er skabt til køkkenet som fristed. Til hænder, der mærker forskellen." },
      { property: "og:title", content: "Om Langsomt Nok" },
      { property: "og:description", content: "Langsomt Nok er skabt til køkkenet som fristed." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="pt-24">
      <section className="section-padding">
        <div className="container-calm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
                Tid. Håndværk. Ro.
              </h1>
              <div className="space-y-4 text-muted-foreground text-editorial">
                <p>
                  Langsomt Nok begyndte med en simpel idé: at køkkenredskaber fortjener den samme respekt som de ingredienser, de bearbejder.
                </p>
                <p>
                  Vi tror på, at et godt snit begynder før kniven rammer brættet. Det begynder med valget af stål. Med tålmodighed i smedjen. Med respekt for det køkken, redskabet ender i.
                </p>
                <p>
                  Vores redskaber er ikke skabt til hastværk. De er skabt til nærvær. Til dem, der mærker forskellen mellem et redskab og et værktøj.
                </p>
                <p className="font-serif text-foreground text-lg">
                  Det her er ikke udstyr til travlhed. Det er værktøj til nærvær.
                </p>
              </div>
            </div>
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-linen">
              <img src={materialWalnut} alt="Valnøddetræ" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl mb-8">Vores formler</h2>
          <div className="space-y-6">
            <p className="font-serif text-2xl text-walnut">
              Funktion + Følelse + Fortælling = Langsomt Nok
            </p>
            <p className="text-muted-foreground">
              Hvert produkt vi vælger opfylder alle tre. Ingen undtagelser.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-calm max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl text-center mb-12">Hvad vi tror på</h2>
          <div className="space-y-8">
            {[
              { title: "Materialer over marketing", desc: "Vi lader stål, træ og sten tale for sig selv." },
              { title: "Pleje over forbrug", desc: "Et godt redskab varer, når det passes. Vi hjælper dig med det." },
              { title: "Ro over hast", desc: "Gode ting tager tid. I køkkenet og i alt andet." },
              { title: "Håndværk over masseproduktion", desc: "Hvert produkt har en historie. Vi fortæller den." },
            ].map((belief) => (
              <div key={belief.title} className="flex gap-6 items-start">
                <div className="w-2 h-2 rounded-full bg-copper mt-2 flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-lg mb-1">{belief.title}</h3>
                  <p className="text-sm text-muted-foreground">{belief.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSignup variant="dark" />
    </div>
  );
}
