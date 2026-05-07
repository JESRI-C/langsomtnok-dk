import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privatlivspolitik")({
  head: () => ({
    meta: [
      { title: "Privatlivspolitik — Langsomt Nok" },
      { name: "description", content: "Læs om hvordan Langsomt Nok behandler dine personoplysninger." },
      { property: "og:title", content: "Privatlivspolitik — Langsomt Nok" },
    ],
  }),
  component: PrivatlivspolitikPage,
});

function PrivatlivspolitikPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container-calm max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl mb-8">Privatlivspolitik</h1>
        <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground text-editorial">
          <p>
            Hos Langsomt Nok tager vi din privatliv alvorligt. Denne politik beskriver, hvilke data vi indsamler, og hvordan vi bruger dem.
          </p>
          <h2 className="font-serif text-xl text-foreground">Hvilke oplysninger indsamler vi?</h2>
          <p>Vi indsamler kun de oplysninger, der er nødvendige for at behandle din ordre: navn, adresse, e-mail og betalingsoplysninger.</p>
          <h2 className="font-serif text-xl text-foreground">Hvordan bruger vi dine oplysninger?</h2>
          <p>Dine oplysninger bruges udelukkende til at behandle ordrer, sende forsendelser og kommunikere om din bestilling.</p>
          <h2 className="font-serif text-xl text-foreground">Cookies</h2>
          <p>Vi bruger cookies til at huske din indkøbskurv og forbedre din oplevelse. Du kan til enhver tid slette cookies i din browser.</p>
          <h2 className="font-serif text-xl text-foreground">Dine rettigheder</h2>
          <p>Du har ret til at se, rette eller slette dine personoplysninger. Kontakt os via <a href="/kontakt" className="text-cta hover:underline">kontaktsiden</a>.</p>
        </div>
      </div>
    </div>
  );
}
