import { createFileRoute } from "@tanstack/react-router";
import { CompanyDetails, LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/reklamation")({
  head: () => ({
    meta: [
      { title: "Reklamation | Langsomt Nok" },
      { name: "description", content: "Læs om reklamationsret og hvordan du kontakter Langsomt Nok, hvis en vare har en fejl eller mangel." },
      { property: "og:title", content: "Reklamation | Langsomt Nok" },
      { property: "og:description", content: "Læs om reklamationsret og hvordan du kontakter Langsomt Nok, hvis en vare har en fejl eller mangel." },
    ],
  }),
  component: ReklamationPage,
});

function ReklamationPage() {
  return (
    <LegalPageLayout
      title="Reklamation"
      intro="Du har 2 års reklamationsret efter købeloven, når du handler som forbruger hos Langsomt Nok."
    >
      <LegalSection title="1. Hvis varen har en fejl">
        <p>Hvis du oplever en fejl eller mangel ved en vare, skal du kontakte os hurtigst muligt og inden for rimelig tid.</p>
        <p>
          Skriv til <a className="text-cta hover:underline" href="mailto:hej@langsomtnok.dk">hej@langsomtnok.dk</a> og send gerne ordrenummer, beskrivelse af fejlen samt billeder eller video af problemet.
        </p>
      </LegalSection>

      <LegalSection title="2. Hvad sker der derefter?">
        <p>Hvis reklamationen er berettiget, finder vi en passende løsning.</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Reparation</li>
          <li>Ombytning</li>
          <li>Afslag i prisen</li>
          <li>Tilbagebetaling</li>
        </ul>
        <p>Løsningen afhænger af den konkrete situation og varens stand.</p>
      </LegalSection>

      <LegalSection title="3. Skader som følge af forkert brug">
        <p>Reklamationsretten dækker ikke fejl, skader eller slid, der skyldes forkert brug, manglende vedligeholdelse, uheld eller almindeligt slid.</p>
      </LegalSection>

      <LegalSection title="4. Kontaktoplysninger">
        <CompanyDetails />
      </LegalSection>
    </LegalPageLayout>
  );
}
