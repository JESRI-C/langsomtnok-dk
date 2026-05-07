import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/fragt")({
  head: () => ({
    meta: [
      { title: "Fragt — Langsomt Nok" },
      { name: "description", content: "Sendes fra Danmark. Fri fragt ved køb over 499 kr. Leveringstid 2–5 hverdage." },
      { property: "og:title", content: "Fragt — Langsomt Nok" },
    ],
  }),
  component: FragtPage,
});

function FragtPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container-calm max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl mb-8">Fragt</h1>
        <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground text-editorial">
          <p>Alle ordrer sendes fra Danmark med omhu og omsorg.</p>
          <h2 className="font-serif text-xl text-foreground">Leveringstid</h2>
          <p>Forventet leveringstid er 2–5 hverdage inden for Danmark.</p>
          <h2 className="font-serif text-xl text-foreground">Fragtpriser</h2>
          <p>Fri fragt ved køb over 499 kr. Under 499 kr. tillægges en fragtpris på 49 kr.</p>
          <h2 className="font-serif text-xl text-foreground">Pakket med omhu</h2>
          <p>Hver ordre pakkes omhyggeligt for at beskytte dit nye køkkenritual undervejs.</p>
        </div>
      </div>
    </div>
  );
}
