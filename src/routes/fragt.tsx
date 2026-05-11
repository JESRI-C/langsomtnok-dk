import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/fragt")({
  head: () => ({
    meta: [
      { title: "Levering | Langsomt Nok" },
      { name: "description", content: "Læs om levering, fragt, leveringstid og håndtering af beskadigede eller manglende pakker hos Langsomt Nok." },
      { property: "og:title", content: "Levering | Langsomt Nok" },
      { property: "og:description", content: "Læs om levering, fragt, leveringstid og håndtering af beskadigede eller manglende pakker hos Langsomt Nok." },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/fragt" }],
  }),
  component: FragtPage,
});

function FragtPage() {
  return (
    <LegalPageLayout
      title="Levering"
      intro="Vi pakker hver ordre med omhu. Leveringstid og fragtpris fremgår altid, inden du betaler."
    >
      <LegalSection title="1. Leveringsområde">
        <p>Langsomt Nok leverer som udgangspunkt til Danmark, medmindre andet fremgår på produktsiden eller i checkout.</p>
      </LegalSection>

      <LegalSection title="2. Leveringstid">
        <p>Den forventede leveringstid fremgår ved checkout. Leveringstiden kan variere afhængigt af produkt, lagerstatus og fragtmetode.</p>
      </LegalSection>

      <LegalSection title="3. Fragtpris">
        <p>Fragtprisen vises altid i checkout, før du gennemfører din ordre.</p>
      </LegalSection>

      <LegalSection title="4. Beskadiget pakke">
        <p>Hvis din pakke er beskadiget ved modtagelse, skal du kontakte os hurtigst muligt på <a className="text-cta hover:underline" href="mailto:hej@langsomtnok.dk">hej@langsomtnok.dk</a>.</p>
        <p>Send gerne ordrenummer, billeder af pakken, billeder af varen og en kort beskrivelse af problemet.</p>
      </LegalSection>

      <LegalSection title="5. Manglende levering">
        <p>Hvis din pakke ikke dukker op som forventet, så kontakt os på <a className="text-cta hover:underline" href="mailto:hej@langsomtnok.dk">hej@langsomtnok.dk</a>, så undersøger vi sagen.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
