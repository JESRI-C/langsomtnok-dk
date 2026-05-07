import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/returpolitik")({
  head: () => ({
    meta: [
      { title: "Returpolitik — Langsomt Nok" },
      { name: "description", content: "30 dages returret hos Langsomt Nok. Læs om vores returproces." },
      { property: "og:title", content: "Returpolitik — Langsomt Nok" },
    ],
  }),
  component: ReturpolitikPage,
});

function ReturpolitikPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container-calm max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl mb-8">Returpolitik</h1>
        <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground text-editorial">
          <p>
            Vi ønsker, at du er helt tilfreds med dit køb. Hvis ikke, har du 30 dages returret fra modtagelsesdagen.
          </p>
          <h2 className="font-serif text-xl text-foreground">Betingelser for retur</h2>
          <p>Varen skal returneres i ubrugt og original stand med al original emballage. Knive, der har været brugt eller slebet, kan ikke returneres.</p>
          <h2 className="font-serif text-xl text-foreground">Sådan returnerer du</h2>
          <p>Kontakt os via <a href="/kontakt" className="text-cta hover:underline">kontaktsiden</a>, så sender vi en returlabel og vejledning.</p>
          <h2 className="font-serif text-xl text-foreground">Refundering</h2>
          <p>Når vi har modtaget og godkendt din retur, refunderer vi beløbet inden for 5–7 hverdage til den betalingsmetode, du brugte ved købet.</p>
        </div>
      </div>
    </div>
  );
}
