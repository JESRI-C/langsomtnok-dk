import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/fortryd-aftale")({
  head: () => ({
    meta: [
      { title: "Fortryd aftale — standardfortrydelsesformular | Langsomt Nok" },
      { name: "description", content: "Udfyld standardfortrydelsesformularen for at gøre brug af fortrydelsesretten hos Langsomt Nok. Vi bekræfter modtagelsen på e-mail." },
      { property: "og:title", content: "Fortryd aftale — Langsomt Nok" },
      { property: "og:description", content: "Standardfortrydelsesformular efter dansk forbrugerlovgivning." },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/fortryd-aftale" }],
  }),
  component: FortrydAftalePage,
});

type Status = "idle" | "loading" | "success" | "error";

function FortrydAftalePage() {
  const startedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading" || status === "success") return;
    const fd = new FormData(e.currentTarget);

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/public/cancellation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: String(fd.get("fullName") ?? "").trim(),
          address: String(fd.get("address") ?? "").trim(),
          email: String(fd.get("email") ?? "").trim(),
          phone: String(fd.get("phone") ?? "").trim(),
          orderNumber: String(fd.get("orderNumber") ?? "").trim(),
          orderDate: String(fd.get("orderDate") ?? "").trim(),
          receivedDate: String(fd.get("receivedDate") ?? "").trim(),
          reason: String(fd.get("reason") ?? "").trim(),
          consent: fd.get("consent") === "on",
          website: honeypotRef.current?.value ?? "",
          startedAt: startedAt.current,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setStatus("error");
        setErrorMsg(data.error ?? "Noget gik galt — prøv igen.");
        return;
      }
      setStatus("success");
      setReference(data.referenceId ?? null);
    } catch {
      setStatus("error");
      setErrorMsg("Netværksfejl — prøv igen om lidt.");
    }
  };

  if (status === "success") {
    return (
      <LegalPageLayout
        title="Tak — vi har modtaget din fortrydelse"
        intro="Vi har sendt en bekræftelse til din e-mail og vender roligt tilbage inden for én hverdag."
      >
        <LegalSection title="Hvad sker der nu?">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-cta mt-0.5 shrink-0" strokeWidth={1.5} />
            <div>
              <p>Send varen retur uden unødig forsinkelse og senest 14 dage efter denne besked.</p>
              {reference ? (
                <p className="text-sm text-muted-foreground mt-2">Din reference: <span className="font-mono">{reference}</span></p>
              ) : null}
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-card/60 p-5 text-sm leading-7 mt-4">
            <strong className="block text-foreground">Returadresse</strong>
            JBR Freelance<br />
            Bøgevej 4<br />
            7160 Tørring<br />
            Danmark
          </div>
          <p>
            Så snart varen er retur og godkendt, tilbagebetaler vi købsbeløbet — senest 14 dage efter din besked. Skriv gerne til <a className="text-cta hover:underline" href="mailto:hej@langsomtnok.dk">hej@langsomtnok.dk</a> hvis du har spørgsmål.
          </p>
        </LegalSection>
      </LegalPageLayout>
    );
  }

  return (
    <LegalPageLayout
      title="Fortryd aftale"
      intro="Udfyld standardfortrydelsesformularen for at gøre brug af din 14-dages fortrydelsesret. Vi bekræfter modtagelsen på e-mail med det samme."
    >
      <LegalSection title="Standardfortrydelsesformular">
        <p className="italic text-muted-foreground">
          (Denne formular udfyldes og returneres kun, hvis fortrydelsesretten gøres gældende.)
        </p>
        <p>
          Til <strong>JBR Freelance, Bøgevej 4, 7160 Tørring, Danmark</strong> — e-mail{" "}
          <a className="text-cta hover:underline" href="mailto:hej@langsomtnok.dk">hej@langsomtnok.dk</a>:
        </p>
        <p>
          Jeg meddeler herved, at jeg ønsker at gøre fortrydelsesretten gældende i forbindelse med min købsaftale om følgende varer/tjenesteydelser.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6" noValidate>
          {/* Honeypot */}
          <input
            ref={honeypotRef}
            type="text"
            name="website"
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
            autoComplete="off"
          />

          <Field label="Fulde navn *" name="fullName" required autoComplete="name" />
          <Field label="E-mail *" name="email" type="email" required autoComplete="email" />
          <Field label="Adresse" name="address" autoComplete="street-address" />
          <Field label="Telefon" name="phone" type="tel" autoComplete="tel" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Ordrenummer" name="orderNumber" />
            <Field label="Bestillingsdato" name="orderDate" type="date" />
            <Field label="Modtaget varen" name="receivedDate" type="date" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Årsag (valgfri)
            </label>
            <textarea
              name="reason"
              rows={4}
              maxLength={2000}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cta/30"
              placeholder="Du behøver ikke oplyse en grund — men det hjælper os."
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-foreground/80">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-1 h-4 w-4 rounded border-border text-cta focus:ring-cta/30"
            />
            <span>
              Jeg bekræfter, at jeg ønsker at fortryde ovenstående aftale. Ved indsendelse gemmer vi oplysningerne for at kunne behandle fortrydelsen.
            </span>
          </label>

          {status === "error" && (
            <p className="text-sm text-red-500">{errorMsg}</p>
          )}

          <Button variant="cta" size="lg" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Sender…" : "Send fortrydelse"}
          </Button>

          <p className="text-xs text-muted-foreground pt-2">
            Ved indsendelse behandles dine oplysninger efter vores{" "}
            <a href="/privatlivspolitik" className="underline hover:text-foreground">privatlivspolitik</a>.
            Se også <a href="/returpolitik" className="underline hover:text-foreground">returnering og fortrydelse</a>.
          </p>
        </form>
      </LegalSection>
    </LegalPageLayout>
  );
}

function Field({
  label, name, type = "text", required, autoComplete,
}: {
  label: string; name: string; type?: string; required?: boolean; autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full h-11 rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cta/30"
      />
    </div>
  );
}
