import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/unsubscribe")({
  head: () => ({
    meta: [
      { title: "Afmeld nyhedsbrev – Langsomt Nok" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: UnsubscribePage,
});

type Status = "loading" | "valid" | "already" | "invalid" | "confirming" | "done" | "error";

function UnsubscribePage() {
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    setToken(t);
    if (!t) {
      setStatus("invalid");
      return;
    }
    fetch(`/email/unsubscribe?token=${encodeURIComponent(t)}`)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) {
          setStatus("invalid");
          return;
        }
        if (data.valid) setStatus("valid");
        else if (data.reason === "already_unsubscribed") setStatus("already");
        else setStatus("invalid");
      })
      .catch(() => setStatus("invalid"));
  }, []);

  async function confirm() {
    if (!token) return;
    setStatus("confirming");
    try {
      const res = await fetch("/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Noget gik galt");
      if (data.success) setStatus("done");
      else if (data.reason === "already_unsubscribed") setStatus("already");
      else throw new Error("Noget gik galt");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Noget gik galt");
    }
  }

  return (
    <div className="pt-24 bg-bg min-h-screen">
      <section className="section-padding">
        <div className="container-calm max-w-xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-[rgba(90,59,46,0.16)] shadow-sm">
            {status === "loading" && (
              <>
                <Loader2 className="w-10 h-10 text-copper animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Validerer dit link…</p>
              </>
            )}

            {status === "valid" && (
              <>
                <h1 className="font-serif text-3xl mb-4">Afmeld nyhedsbrev</h1>
                <p className="text-muted-foreground mb-6">
                  Bekræft, at du gerne vil afmelde dig fremtidige mails fra Langsomt Nok.
                </p>
                <Button variant="cta" size="lg" onClick={confirm}>
                  Bekræft afmelding
                </Button>
              </>
            )}

            {status === "confirming" && (
              <>
                <Loader2 className="w-10 h-10 text-copper animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Afmelder…</p>
              </>
            )}

            {status === "done" && (
              <>
                <CheckCircle2 className="w-12 h-12 text-cta mx-auto mb-4" />
                <h1 className="font-serif text-2xl mb-3">Du er afmeldt</h1>
                <p className="text-muted-foreground mb-6">
                  Du vil ikke længere modtage mails fra os. Tak fordi du kiggede forbi.
                </p>
                <Button asChild variant="outline">
                  <Link to="/">Gå til forsiden</Link>
                </Button>
              </>
            )}

            {status === "already" && (
              <>
                <CheckCircle2 className="w-12 h-12 text-cta mx-auto mb-4" />
                <h1 className="font-serif text-2xl mb-3">Allerede afmeldt</h1>
                <p className="text-muted-foreground mb-6">Du er allerede afmeldt vores mails.</p>
                <Button asChild variant="outline">
                  <Link to="/">Gå til forsiden</Link>
                </Button>
              </>
            )}

            {status === "invalid" && (
              <>
                <AlertCircle className="w-12 h-12 text-walnut mx-auto mb-4" />
                <h1 className="font-serif text-2xl mb-3">Ugyldigt link</h1>
                <p className="text-muted-foreground mb-6">
                  Linket er udløbet eller ikke gyldigt. Skriv til os på hej@langsomtnok.dk, hvis du gerne vil afmeldes.
                </p>
                <Button asChild variant="outline">
                  <Link to="/">Gå til forsiden</Link>
                </Button>
              </>
            )}

            {status === "error" && (
              <>
                <AlertCircle className="w-12 h-12 text-walnut mx-auto mb-4" />
                <h1 className="font-serif text-2xl mb-3">Noget gik galt</h1>
                <p className="text-muted-foreground mb-6">{errorMsg}</p>
                <Button variant="cta" onClick={confirm}>Prøv igen</Button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
