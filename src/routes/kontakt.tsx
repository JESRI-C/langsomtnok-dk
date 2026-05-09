import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { Mail, MapPin } from "lucide-react";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt — Langsomt Nok" },
      { name: "description", content: "Har du spørgsmål? Vi svarer med ro og omtanke." },
      { property: "og:title", content: "Kontakt — Langsomt Nok" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="pt-24">
      <section className="section-padding">
        <div className="container-calm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl mb-6">Kontakt</h1>
              <p className="text-editorial text-muted-foreground mb-8">
                Har du spørgsmål om produkter, pleje eller bestillinger? Vi svarer med ro og omtanke.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-copper mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium mb-1">E-mail</h3>
                    <p className="text-sm text-muted-foreground">hej@langsomtnok.dk</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-copper mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium mb-1">Adresse</h3>
                    <p className="text-sm text-muted-foreground">København, Danmark</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground/60 mt-8">
                Vi svarer normalt inden for 1-2 hverdage.
              </p>
            </div>

            <div>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Navn</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cta/30"
                    placeholder="Dit navn"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">E-mail</label>
                  <input
                    type="email"
                    className="w-full h-12 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cta/30"
                    placeholder="Din e-mail"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Besked</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cta/30 resize-none"
                    placeholder="Hvad kan vi hjælpe med?"
                  />
                </div>
                <Button variant="cta" size="lg" type="submit" className="w-full">
                  Send besked
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <FAQAccordion
        title="Korte svar"
        items={[
          {
            question: "Hvordan kan jeg betale?",
            answer:
              "Du betaler sikkert via vores webshop. Du kan bruge almindelige betalingskort og de betalingsmuligheder, der vises i checkout. Din ordre pakkes med omhu og sendes fra Danmark.",
          },
          {
            question: "Er betalingen sikker?",
            answer:
              "Ja. Når du handler hos Langsomt Nok, betaler du trygt via vores webshop med kort og de betalingsmuligheder, der vises i checkout. Vi pakker din ordre i rolig rytme og sender fra Danmark.",
          },
          {
            question: "Hvor sendes ordren fra?",
            answer:
              "Alle ordrer pakkes og sendes fra Danmark. Vi pakker i rolig rytme og bruger materialer, der passer til indholdet.",
          },
        ]}
      />

      <NewsletterSignup />
    </div>
  );
}
