import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/fortryd-aftale")({
  head: () => ({
    meta: [
      { title: "Fortryd aftale — standardfortrydelsesformular | Langsomt Nok" },
      { name: "description", content: "Udfyld standardfortrydelsesformularen for at gøre brug af fortrydelsesretten hos Langsomt Nok. To trin, kvittering på e-mail." },
      { property: "og:title", content: "Fortryd aftale — Langsomt Nok" },
      { property: "og:description", content: "Standardfortrydelsesformular efter dansk forbrugerlovgivning." },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/fortryd-aftale" }],
  }),
  component: FortrydAftalePage,
});

type Status = "idle" | "loading" | "success" | "error";
type Step = "form" | "review" | "done";

interface CancellationData {
  fullName: string;
  address: string;
  email: string;
  phone: string;
  orderNumber: string;
  orderDate: string;
  receivedDate: string;
  reason: string;
  consent: boolean;
}

const EMPTY: CancellationData = {
  fullName: "",
  address: "",
  email: "",
  phone: "",
  orderNumber: "",
  orderDate: "",
  receivedDate: "",
  reason: "",
  consent: false,
};

function FortrydAftalePage() {
  const startedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState<Step>("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const [receivedAt, setReceivedAt] = useState<Date | null>(null);
  const [data, setData] = useState<CancellationData>(EMPTY);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setData({
      fullName: String(fd.get("fullName") ?? "").trim(),
      address: String(fd.get("address") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      orderNumber: String(fd.get("orderNumber") ?? "").trim(),
      orderDate: String(fd.get("orderDate") ?? "").trim(),
      receivedDate: String(fd.get("receivedDate") ?? "").trim(),
      reason: String(fd.get("reason") ?? "").trim(),
      consent: fd.get("consent") === "on",
    });
    setStep("review");
    trackEvent("cancellation_confirm_view");
    // Scroll til top så kunden ser opsummeringen
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirm = async () => {
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/public/cancellation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: honeypotRef.current?.value ?? "",
          startedAt: startedAt.current,
        }),
      });
      const body = await res.json();
      if (!res.ok || body.error) {
        setStatus("error");
        setErrorMsg(body.error ?? "Noget gik galt — prøv igen.");
        return;
      }
      setStatus("success");
      setStep("done");
      setReference(body.referenceId ?? null);
      setReceivedAt(new Date());
      trackEvent("cancellation_submitted");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
      setErrorMsg("Netværksfejl — prøv igen om lidt.");
    }
  };

  // ── TRIN 3: Kvittering ─────────────────────────────────────────────────
  if (step === "done") {
    const receivedLabel = receivedAt
      ? receivedAt.toLocaleString("da-DK", {
          dateStyle: "long",
          timeStyle: "short",
        })
      : "";
    return (
      <LegalPageLayout
        title="Tak — vi har modtaget din fortrydelse"
        intro={`Modtaget ${receivedLabel}. Vi har sendt en bekræftelse til ${data.email} med kopi af det indsendte.`}
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
            Så snart varen er retur og godkendt, tilbagebetaler vi købsbeløbet — senest 14 dage efter din besked. Skriv til <a className="text-cta hover:underline" href="mailto:hej@langsomtnok.dk">hej@langsomtnok.dk</a> hvis du har spørgsmål.
          </p>
        </LegalSection>

        <LegalSection title="Kopi af din indsendelse">
          <SummaryList data={data} />
        </LegalSection>
      </LegalPageLayout>
    );
  }

  // ── TRIN 2: Bekræft ────────────────────────────────────────────────────
  if (step === "review") {
    return (
      <LegalPageLayout
        title="Bekræft din fortrydelse"
        intro="Læs igennem — er alt korrekt, trykker du på 'Bekræft fortrydelse'. Vi sender straks en kvittering til din e-mail."
      >
        <LegalSection title="Din indsendelse">
          <SummaryList data={data} />

          {status === "error" && (
            <p className="text-sm text-red-500 mt-4">{errorMsg}</p>
          )}

          <div className="flex flex-wrap gap-3 pt-6">
            <Button variant="cta" size="lg" onClick={handleConfirm} disabled={status === "loading"}>
              {status === "loading" ? "Sender…" : "Bekræft fortrydelse"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              type="button"
              onClick={() => {
                setStep("form");
                setStatus("idle");
                setErrorMsg("");
              }}
              disabled={status === "loading"}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Rediger
            </Button>
          </div>

          <p className="text-xs text-muted-foreground pt-4">
            Ingen dokumentation eller obligatorisk årsag kræves. Vi behandler fortrydelsen straks ved bekræftelse.
          </p>
        </LegalSection>
      </LegalPageLayout>
    );
  }

  // ── TRIN 1: Formular ───────────────────────────────────────────────────
  return (
    <LegalPageLayout
      title="Fortryd aftale"
      intro="Udfyld standardfortrydelsesformularen for at gøre brug af din 14-dages fortrydelsesret. To trin: udfyld nu — bekræft på næste side. Kvittering sendes straks på e-mail."
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

        <form onSubmit={handleFormSubmit} className="space-y-5 mt-6" noValidate>
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

          <Field label="Fulde navn *" name="fullName" required autoComplete="name" defaultValue={data.fullName} />
          <Field label="E-mail *" name="email" type="email" required autoComplete="email" defaultValue={data.email} />
          <Field label="Adresse" name="address" autoComplete="street-address" defaultValue={data.address} />
          <Field label="Telefon" name="phone" type="tel" autoComplete="tel" defaultValue={data.phone} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Ordrenummer" name="orderNumber" defaultValue={data.orderNumber} />
            <Field label="Bestillingsdato" name="orderDate" type="date" defaultValue={data.orderDate} />
            <Field label="Modtaget varen" name="receivedDate" type="date" defaultValue={data.receivedDate} />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Årsag (valgfri)
            </label>
            <textarea
              name="reason"
              rows={4}
              maxLength={2000}
              defaultValue={data.reason}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cta/30"
              placeholder="Du behøver ikke oplyse en grund — men det hjælper os."
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-foreground/80">
            <input
              type="checkbox"
              name="consent"
              required
              defaultChecked={data.consent}
              className="mt-1 h-4 w-4 rounded border-border text-cta focus:ring-cta/30"
            />
            <span>
              Jeg bekræfter, at jeg ønsker at fortryde ovenstående aftale. Ved indsendelse gemmer vi oplysningerne for at kunne behandle fortrydelsen.
            </span>
          </label>

          <Button variant="cta" size="lg" type="submit">
            Fortryd aftale
          </Button>

          <p className="text-xs text-muted-foreground pt-2">
            Ved klik ser du en opsummering og bekræfter på næste trin. Se{" "}
            <a href="/privatlivspolitik" className="underline hover:text-foreground">privatlivspolitik</a> og{" "}
            <a href="/returpolitik" className="underline hover:text-foreground">returnering og fortrydelse</a>.
          </p>
        </form>
      </LegalSection>
    </LegalPageLayout>
  );
}

function SummaryList({ data }: { data: CancellationData }) {
  const rows: Array<[string, string]> = [
    ["Fulde navn", data.fullName],
    ["E-mail", data.email],
    ["Adresse", data.address || "—"],
    ["Telefon", data.phone || "—"],
    ["Ordrenummer", data.orderNumber || "—"],
    ["Bestillingsdato", data.orderDate || "—"],
    ["Modtaget varen", data.receivedDate || "—"],
    ["Årsag", data.reason || "— (ikke oplyst)"],
  ];
  return (
    <dl className="divide-y divide-border/40 rounded-lg border border-border/60 bg-card/40">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-5 py-3 text-sm">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="sm:col-span-2 text-foreground whitespace-pre-wrap">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Field({
  label, name, type = "text", required, autoComplete, defaultValue,
}: {
  label: string; name: string; type?: string; required?: boolean; autoComplete?: string; defaultValue?: string;
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
        defaultValue={defaultValue}
        className="w-full h-11 rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cta/30"
      />
    </div>
  );
}
