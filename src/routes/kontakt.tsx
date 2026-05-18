import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { COMPANY, organizationSchema } from "@/components/legal/LegalPageLayout";
import { onlineStoreSchema, canonical } from "@/lib/seo";
import { Mail, MapPin, Phone, Check } from "lucide-react";

const SHOPIFY_CONTACT_ACTION = "https://aqwut5-0n.myshopify.com/contact#contact_form";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt Langsomt Nok – skriv til os" },
      { name: "description", content: "Skriv roligt til Langsomt Nok om produkter, levering eller gaver. Vi svarer som regel inden for 1-2 hverdage." },
      { property: "og:title", content: "Kontakt Langsomt Nok – skriv til os" },
      { property: "og:description", content: "Skriv roligt til Langsomt Nok om produkter, levering eller gaver. Vi svarer som regel inden for 1-2 hverdage." },
    ],
    links: [canonical("/kontakt")],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(organizationSchema) },
      { type: "application/ld+json", children: JSON.stringify(onlineStoreSchema) },
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
                Har du spørgsmål til en ordre, et produkt eller noget, du gerne vil finde ud af i ro og mag, så skriv til os.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-copper mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium mb-1">E-mail</h3>
                    <a className="text-sm text-muted-foreground hover:text-cta" href={`mailto:${COMPANY.email}`}>
                      {COMPANY.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-copper mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium mb-1">Telefon</h3>
                    <a className="text-sm text-muted-foreground hover:text-cta" href="tel:+4527128497">
                      {COMPANY.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-copper mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium mb-1">Adresse</h3>
                    <p className="text-sm text-muted-foreground">
                      {COMPANY.legalName}<br />
                      CVR-nr.: {COMPANY.cvr}<br />
                      {COMPANY.addressLine}<br />
                      {COMPANY.postalCity}<br />
                      {COMPANY.country}
                    </p>
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
                  <label className="text-sm font-medium mb-1.5 block">Ordrenummer, hvis relevant</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cta/30"
                    placeholder="Fx #1001"
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
          {
            question: "Hvordan kan jeg være tryg ved at handle hos jer?",
            answer:
              "Du betaler sikkert via webshoppen, din ordre sendes fra Danmark, og du kan altid kontakte os direkte på hej@langsomtnok.dk.",
          },
          {
            question: "Har I Trustpilot?",
            answer:
              "Vi er stadig et nyt brand og har endnu ikke samlet anmeldelser på Trustpilot. Indtil da gør vi os umage med tydelige vilkår, tryg betaling, ordentlig pakning og direkte kontakt, hvis du har spørgsmål.",
          },
        ]}
      />

      <NewsletterSignup />
    </div>
  );
}
