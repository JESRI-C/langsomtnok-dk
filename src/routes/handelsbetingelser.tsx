import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/handelsbetingelser")({
  head: () => ({
    meta: [
      { title: "Handelsbetingelser — Langsomt Nok" },
      { name: "description", content: "Læs vores handelsbetingelser for køb hos Langsomt Nok." },
      { property: "og:title", content: "Handelsbetingelser — Langsomt Nok" },
    ],
  }),
  component: HandelsbetingelserPage,
});

function HandelsbetingelserPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container-calm max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl mb-8">Handelsbetingelser</h1>
        <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground text-editorial">
          <p>
            Disse handelsbetingelser gælder for alle køb foretaget hos Langsomt Nok.
            Ved at gennemføre et køb accepterer du nedenstående betingelser.
          </p>
          <h2 className="font-serif text-xl text-foreground">Priser</h2>
          <p>Alle priser er angivet i DKK og inkluderer moms.</p>
          <h2 className="font-serif text-xl text-foreground">Betaling</h2>
          <p>Vi accepterer betaling via de betalingsmetoder, der vises ved checkout. Alle transaktioner er krypterede og sikre.</p>
          <h2 className="font-serif text-xl text-foreground">Levering</h2>
          <p>Vi sender fra Danmark. Forventet leveringstid er 2–5 hverdage. Fri fragt ved køb over 499 kr.</p>
          <h2 className="font-serif text-xl text-foreground">Fortrydelsesret</h2>
          <p>Du har 30 dages fortrydelsesret fra den dag, du modtager din ordre. Varen skal returneres i ubrugt og original stand.</p>
          <h2 className="font-serif text-xl text-foreground">Kontakt</h2>
          <p>Har du spørgsmål til dine handelsbetingelser, er du velkommen til at kontakte os via <a href="/kontakt" className="text-cta hover:underline">kontaktsiden</a>.</p>
        </div>
      </div>
    </div>
  );
}
