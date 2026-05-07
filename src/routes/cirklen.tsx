import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ImageSlot } from "@/components/ImageSlot";
import { CalmCTASection } from "@/components/landing/CalmCTASection";

export const Route = createFileRoute("/cirklen")({
  head: () => ({
    meta: [
      { title: "Langsomt Cirklen — Langsomt Nok" },
      { name: "description", content: "Et stille fællesskab for dem, der tror på tid, håndværk og gode måltider." },
      { property: "og:title", content: "Langsomt Cirklen — Langsomt Nok" },
      { property: "og:description", content: "Et stille fællesskab for dem, der tror på tid, håndværk og gode måltider." },
    ],
  }),
  component: CirklenPage,
});

function CirklenPage() {
  return (
    <div className="pt-24">
      <section className="section-padding bg-linen">
        <div className="container-calm text-center max-w-3xl mx-auto fade-in-up">
          <h1 className="font-serif text-4xl md:text-6xl mb-6">Velkommen i Cirklen</h1>
          <p className="text-editorial mx-auto text-muted-foreground">
            Et stille fællesskab for dem, der tror på tid, håndværk og gode måltider.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-calm max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl mb-6">Manifestet</h2>
          <div className="space-y-4 text-muted-foreground text-editorial mx-auto">
            <p>Vi tror på, at de bedste måltider ikke laves i hast.</p>
            <p>Vi tror på hænder, der kender deres redskaber.</p>
            <p>Vi tror på materialer, der fortæller en historie.</p>
            <p>Vi tror på pleje som en del af glæden.</p>
            <p className="font-serif text-foreground text-lg pt-4">Langsomt Nok er ikke en hastighed. Det er en holdning.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-soft">
        <div className="container-calm">
          <h2 className="font-serif text-3xl text-center mb-12">Hvad Cirklen giver dig</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { title: "Langsomt Brev", desc: "Månedlige breve med guides, ritualer og historier fra køkkenet." },
              { title: "Plejeguides", desc: "Detaljerede guides til vedligeholdelse af dine redskaber." },
              { title: "Fællesskab", desc: "Adgang til et fællesskab af mennesker, der tror på tid og håndværk." },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <h3 className="font-serif text-xl mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-calm max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl text-center mb-12">Månedlige ritualer</h2>
          <div className="space-y-8">
            {[
              { month: "Slib din kniv", desc: "Hvert kvartal guider vi dig igennem et komplet sliberitual." },
              { month: "Olie dit træ", desc: "Månedligt ritual for at holde skafter og brædder levende." },
              { month: "Stil skarpt", desc: "Fokus på én teknik. Én ingrediens. Ét måltid." },
            ].map((ritual) => (
              <div key={ritual.month} className="flex gap-6 items-start p-6 rounded-lg border border-border">
                <div className="w-12 h-12 rounded-full bg-linen flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-walnut">✦</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg mb-1">{ritual.month}</h3>
                  <p className="text-sm text-muted-foreground">{ritual.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-linen">
        <div className="container-calm text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl mb-6">Historier fra Cirklen</h2>
          <ImageSlot name="cirklen-stories" ratio="16/9" motif="Hænder der arbejder med kniv og skærebræt i roligt køkken" variant="warm" className="mb-8" />
          <p className="text-muted-foreground/60 text-sm">— Kommende historier fra fællesskabet</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-calm text-center max-w-lg mx-auto">
          <h2 className="font-serif text-2xl mb-4">Indre Cirkel</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Snart kan du logge ind og få adgang til eksklusive guides, tidlig adgang til nye produkter og et personligt pleje-arkiv.
          </p>
          <Button variant="outline" disabled>Kommer snart</Button>
        </div>
      </section>

      <NewsletterSignup variant="dark" />
    </div>
  );
}
