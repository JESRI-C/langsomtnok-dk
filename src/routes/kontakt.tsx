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
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get("contact[name]") as string)?.trim();
    const email = (data.get("contact[email]") as string)?.trim();
    const body = (data.get("contact[body]") as string)?.trim();
    if (!name || !email || !body) {
      e.preventDefault();
      setError("Der mangler lige et felt, før beskeden kan sendes.");
      return;
    }
    setError(null);
    // Let the native form POST to Shopify in the hidden iframe.
    // Show success state immediately (cross-origin response not readable).
    setTimeout(() => {
      setSubmitted(true);
      form.reset();
    }, 400);
  };

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

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-7 md:p-10 border border-[rgba(90,59,46,0.16)] shadow-sm">
                {submitted ? (
                  <div className="py-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-cta/10 mx-auto mb-5 flex items-center justify-center">
                      <Check className="w-6 h-6 text-cta" />
                    </div>
                    <h2 className="font-serif text-2xl mb-3">Tak for din besked</h2>
                    <p className="text-muted-foreground">Vi vender tilbage så hurtigt som muligt.</p>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="mb-6 rounded-lg border border-copper/30 bg-copper/5 text-text px-4 py-3 text-sm">
                        {error}
                      </div>
                    )}
                    <form
                      ref={formRef}
                      action={SHOPIFY_CONTACT_ACTION}
                      method="POST"
                      acceptCharset="UTF-8"
                      target="ln-contact-sink"
                      onSubmit={handleSubmit}
                      className="space-y-5"
                      noValidate
                    >
                      <input type="hidden" name="form_type" value="contact" />
                      <input type="hidden" name="utf8" value="✓" />

                      <div>
                        <label htmlFor="contact-name" className="text-sm font-medium mb-1.5 block">Navn</label>
                        <input
                          id="contact-name"
                          type="text"
                          name="contact[name]"
                          required
                          autoComplete="name"
                          className="w-full h-12 px-4 rounded-lg border border-[rgba(90,59,46,0.16)] bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-cta/30"
                          placeholder="Dit navn"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="text-sm font-medium mb-1.5 block">E-mail</label>
                        <input
                          id="contact-email"
                          type="email"
                          name="contact[email]"
                          required
                          autoComplete="email"
                          className="w-full h-12 px-4 rounded-lg border border-[rgba(90,59,46,0.16)] bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-cta/30"
                          placeholder="din@email.dk"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="contact-phone" className="text-sm font-medium mb-1.5 block">
                            Telefon <span className="text-muted-foreground font-normal">(valgfri)</span>
                          </label>
                          <input
                            id="contact-phone"
                            type="tel"
                            name="contact[phone]"
                            autoComplete="tel"
                            className="w-full h-12 px-4 rounded-lg border border-[rgba(90,59,46,0.16)] bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-cta/30"
                            placeholder="+45"
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-subject" className="text-sm font-medium mb-1.5 block">
                            Emne <span className="text-muted-foreground font-normal">(valgfrit)</span>
                          </label>
                          <input
                            id="contact-subject"
                            type="text"
                            name="contact[subject]"
                            className="w-full h-12 px-4 rounded-lg border border-[rgba(90,59,46,0.16)] bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-cta/30"
                            placeholder="Fx levering, gave, produkt"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="contact-body" className="text-sm font-medium mb-1.5 block">Besked</label>
                        <textarea
                          id="contact-body"
                          name="contact[body]"
                          required
                          rows={6}
                          className="w-full px-4 py-3 rounded-lg border border-[rgba(90,59,46,0.16)] bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-cta/30 resize-none"
                          placeholder="Hvad kan vi hjælpe med?"
                        />
                      </div>
                      <Button variant="cta" size="lg" type="submit" className="w-full">
                        Send besked
                      </Button>

                      <p className="text-xs text-muted-foreground pt-2 flex flex-wrap gap-x-4 gap-y-1">
                        <span>✓ Dansk webshop</span>
                        <span>✓ Sikker betaling</span>
                        <span>✓ 30 dages retur</span>
                        <span>✓ Fri fragt over 599 kr</span>
                      </p>
                    </form>
                    {/* Hidden iframe target so Shopify's cross-origin POST does not navigate away */}
                    <iframe
                      name="ln-contact-sink"
                      title="Shopify contact form sink"
                      style={{ display: "none" }}
                      aria-hidden="true"
                    />
                  </>
                )}
              </div>
            </div>

            <aside className="lg:col-span-2 space-y-6">
              <div className="bg-[#F3EEE7] rounded-2xl p-7 border border-[rgba(90,59,46,0.12)]">
                <h2 className="font-serif text-xl mb-5">Kontaktinformation</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-copper mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">E-mail</div>
                      <a className="text-sm hover:text-cta" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
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
                <p className="text-sm text-muted-foreground mt-6 pt-5 border-t border-[rgba(90,59,46,0.12)]">
                  Vi svarer som regel inden for 1-2 hverdage.
                </p>
              </div>
            </aside>
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
