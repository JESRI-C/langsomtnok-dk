import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { COMPANY, organizationSchema } from "@/components/legal/LegalPageLayout";
import { onlineStoreSchema, canonical } from "@/lib/seo";
import { Mail, MapPin, Phone, CheckCircle2, Loader2 } from "lucide-react";

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

type FormState = "idle" | "sending" | "success" | "error";

function ContactForm() {
  const startedAtRef = useRef<number>(Date.now());
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      subject: String(fd.get("subject") || ""),
      message: String(fd.get("message") || ""),
      website: String(fd.get("website") || ""), // honeypot
      startedAt: startedAtRef.current,
    };

    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Kunne ikke sende beskeden. Prøv igen.");
      }
      setState("success");
      form.reset();
      startedAtRef.current = Date.now();
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Noget gik galt. Prøv igen.");
    }
  }

  if (state === "success") {
    return (
      <div className="bg-white rounded-2xl p-8 md:p-10 border border-[rgba(90,59,46,0.16)] shadow-sm h-full flex flex-col items-center text-center">
        <CheckCircle2 className="w-12 h-12 text-cta mb-4" />
        <h2 className="font-serif text-2xl md:text-3xl mb-3">Tak for din besked</h2>
        <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
          Vi har modtaget din henvendelse og svarer som regel inden for 1-2 hverdage.
          Tjek gerne dit spamfilter, hvis du ikke hører fra os.
        </p>
        <Button variant="outline" onClick={() => setState("idle")}>Send en til</Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-2xl p-8 md:p-10 border border-[rgba(90,59,46,0.16)] shadow-sm h-full flex flex-col"
    >
      <p className="text-xs uppercase tracking-[0.18em] text-copper mb-3">Kontaktformular</p>
      <h2 className="font-serif text-2xl md:text-3xl mb-2">Send en besked</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Vi læser hver besked og svarer personligt inden for 1-2 hverdage.
      </p>

      {/* Honeypot — visually hidden, not announced by screen readers */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="website">Hjemmeside (lad stå tom)</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="name">Navn</Label>
          <Input id="name" name="name" type="text" required maxLength={100} autoComplete="name" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" required maxLength={255} autoComplete="email" className="mt-1.5" />
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="subject">Emne <span className="text-muted-foreground font-normal">(valgfrit)</span></Label>
        <Input id="subject" name="subject" type="text" maxLength={200} className="mt-1.5" />
      </div>

      <div className="mb-5 flex-1 flex flex-col">
        <Label htmlFor="message">Besked</Label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={5}
          maxLength={5000}
          rows={7}
          className="mt-1.5 flex-1 min-h-[160px]"
          placeholder="Skriv roligt — vi læser det hele."
        />
      </div>

      {state === "error" && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
          {errorMsg}
        </p>
      )}

      <Button
        type="submit"
        variant="cta"
        size="lg"
        disabled={state === "sending"}
        className="w-full sm:w-auto sm:self-start"
      >
        {state === "sending" ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sender…
          </>
        ) : (
          "Send besked"
        )}
      </Button>

      <p className="text-xs text-muted-foreground pt-6 mt-6 border-t border-[rgba(90,59,46,0.12)] flex flex-wrap gap-x-4 gap-y-1">
        <span>✓ Dansk webshop</span>
        <span>✓ 30 dages retur</span>
        <span>✓ Fri fragt over 599 kr</span>
        <span>✓ Sikker betaling</span>
      </p>
    </form>
  );
}

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
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

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
          { question: "Hvornår bliver min ordre sendt?", answer: "Vi pakker og sender din ordre fra Danmark, som regel inden for 1-2 hverdage. Når pakken er afsendt, modtager du en mail med tracking, så du kan følge den hjem til døren." },
          { question: "Hvordan returnerer jeg en vare?", answer: "Du har 30 dages fortrydelsesret. Skriv til os på hej@langsomtnok.dk med dit ordrenummer, så sender vi en kort vejledning. Varen skal være ubrugt og i original stand." },
          { question: "Kan jeg ændre min ordre?", answer: "Ja, hvis ordren ikke er pakket endnu. Skriv hurtigst muligt til hej@langsomtnok.dk med dit ordrenummer og det, du vil ændre, så hjælper vi gerne." },
          { question: "Hvordan kan jeg betale?", answer: "Du betaler sikkert i checkout med almindelige betalingskort og de betalingsmuligheder, der vises. Din ordre pakkes med omhu og sendes fra Danmark." },
          { question: "Har I Trustpilot?", answer: "Vi er stadig et nyt brand og har endnu ikke samlet anmeldelser på Trustpilot. Indtil da gør vi os umage med tydelige vilkår, tryg betaling, ordentlig pakning og direkte kontakt, hvis du har spørgsmål." },
        ]}
      />

      <NewsletterSignup />
    </div>
  );
}
