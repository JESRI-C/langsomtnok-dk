import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { COMPANY, organizationSchema } from "@/components/legal/LegalPageLayout";
import { onlineStoreSchema, canonical } from "@/lib/seo";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";

// Shopify-native contact page (real form with CAPTCHA + merchant email delivery).
// We cannot render Liquid here, so we route the user to the real form instead of
// faking a frontend-only submission that never reaches the inbox.
const SHOPIFY_CONTACT_URL = "https://aqwut5-0n.myshopify.com/pages/contact";
const CONTACT_EMAIL = COMPANY.email;
const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Kontakt fra langsomtnok.dk")}`;

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
    <div className="pt-24 bg-bg">
      <section className="section-padding">
        <div className="container-calm">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-xs uppercase tracking-[0.2em] text-copper mb-4">Kontakt Langsomt Nok</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">Skriv til os</h1>
            <p className="text-editorial text-muted-foreground">
              Har du spørgsmål til produkter, levering, gaver eller noget helt andet, så skriv roligt. Vi svarer så hurtigt, vi kan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
            {/* Primary action card — routes to the real Shopify contact form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 md:p-10 border border-[rgba(90,59,46,0.16)] shadow-sm h-full flex flex-col">
                <p className="text-xs uppercase tracking-[0.18em] text-copper mb-3">Kontaktformular</p>
                <h2 className="font-serif text-2xl md:text-3xl mb-4">Send en besked</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Brug vores formular, så når din besked direkte frem til indbakken. Formularen åbner i et nyt vindue og tager kun et øjeblik at udfylde.
                </p>

                <ul className="text-sm text-muted-foreground space-y-2 mb-8">
                  <li className="flex gap-2"><span className="text-cta">✓</span> Sikker indsendelse via vores butikssystem</li>
                  <li className="flex gap-2"><span className="text-cta">✓</span> Beskeder lander hos {CONTACT_EMAIL}</li>
                  <li className="flex gap-2"><span className="text-cta">✓</span> Svar som regel inden for 1-2 hverdage</li>
                </ul>

                <div className="mt-auto flex flex-col sm:flex-row gap-3">
                  <Button asChild variant="cta" size="lg" className="flex-1">
                    <a href={SHOPIFY_CONTACT_URL} target="_blank" rel="noopener noreferrer">
                      Åbn kontaktformular
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="flex-1">
                    <a href={MAILTO}>Skriv via e-mail</a>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground pt-6 mt-6 border-t border-[rgba(90,59,46,0.12)] flex flex-wrap gap-x-4 gap-y-1">
                  <span>✓ Dansk webshop</span>
                  <span>✓ 30 dages retur</span>
                  <span>✓ Fri fragt over 599 kr</span>
                  <span>✓ Sikker betaling</span>
                </p>
              </div>
            </div>

            {/* Direct contact info */}
            <aside className="lg:col-span-2 space-y-6">
              <div className="bg-[#F3EEE7] rounded-2xl p-7 border border-[rgba(90,59,46,0.12)]">
                <h2 className="font-serif text-xl mb-2">Du kan også skrive direkte</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Vi svarer som regel inden for 1-2 hverdage.
                </p>
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-copper mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">E-mail</div>
                      <a className="text-sm hover:text-cta break-all" href={MAILTO}>{CONTACT_EMAIL}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-copper mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Telefon</div>
                      <a className="text-sm hover:text-cta" href="tel:+4527128497">{COMPANY.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-copper mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Adresse</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {COMPANY.legalName}<br />
                        CVR-nr.: {COMPANY.cvr}<br />
                        {COMPANY.addressLine}<br />
                        {COMPANY.postalCity}<br />
                        {COMPANY.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <FAQAccordion
        title="Korte svar"
        items={[
          {
            question: "Hvornår bliver min ordre sendt?",
            answer:
              "Vi pakker og sender din ordre fra Danmark, som regel inden for 1-2 hverdage. Når pakken er afsendt, modtager du en mail med tracking, så du kan følge den hjem til døren.",
          },
          {
            question: "Hvordan returnerer jeg en vare?",
            answer:
              "Du har 30 dages fortrydelsesret. Skriv til os på hej@langsomtnok.dk med dit ordrenummer, så sender vi en kort vejledning. Varen skal være ubrugt og i original stand.",
          },
          {
            question: "Kan jeg ændre min ordre?",
            answer:
              "Ja, hvis ordren ikke er pakket endnu. Skriv hurtigst muligt til hej@langsomtnok.dk med dit ordrenummer og det, du vil ændre, så hjælper vi gerne.",
          },
          {
            question: "Hvordan kan jeg betale?",
            answer:
              "Du betaler sikkert i checkout med almindelige betalingskort og de betalingsmuligheder, der vises. Din ordre pakkes med omhu og sendes fra Danmark.",
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
