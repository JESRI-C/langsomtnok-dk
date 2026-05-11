import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/returpolitik")({
  head: () => ({
    meta: [
      { title: "Returnering og fortrydelse | Langsomt Nok" },
      { name: "description", content: "Læs hvordan du returnerer en vare eller bruger din fortrydelsesret hos Langsomt Nok." },
      { property: "og:title", content: "Returnering og fortrydelse | Langsomt Nok" },
      { property: "og:description", content: "Læs hvordan du returnerer en vare eller bruger din fortrydelsesret hos Langsomt Nok." },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/returpolitik" }],
  }),
  component: ReturpolitikPage,
});

function ReturpolitikPage() {
  return (
    <LegalPageLayout
      title="Returnering og fortrydelse"
      intro="Hos Langsomt Nok ønsker vi, at du handler i ro. Hvis du fortryder dit køb, har du som forbruger som udgangspunkt 14 dages fortrydelsesret."
    >
      <LegalSection title="1. Sådan fortryder du">
        <p>
          Skriv til os på <a className="text-cta hover:underline" href="mailto:hej@langsomtnok.dk">hej@langsomtnok.dk</a> med dit ordrenummer og besked om, at du ønsker at fortryde købet.
        </p>
        <p>Fristen er 14 dage fra den dag, du eller en person valgt af dig modtager varen.</p>
      </LegalSection>

      <LegalSection title="2. Returnering">
        <p>Når du har givet besked om fortrydelse, skal varen sendes retur uden unødig forsinkelse og senest 14 dage efter.</p>
        <div className="rounded-lg border border-border/60 bg-card/60 p-5 text-sm leading-7">
          <strong className="block text-foreground">Returadresse</strong>
          JBR Freelance<br />
          Bøgevej 4<br />
          7160 Tørring<br />
          Danmark
        </div>
      </LegalSection>

      <LegalSection title="3. Returfragt">
        <p>Du betaler som udgangspunkt selv for returfragten, medmindre andet er aftalt.</p>
        <p>Vi anbefaler, at du sender varen med tracking, så pakken kan spores.</p>
      </LegalSection>

      <LegalSection title="4. Varens stand">
        <p>
          Du må undersøge varen på samme måde, som du ville gøre i en fysisk butik. Hvis varen er brugt mere end nødvendigt for at fastslå dens art, egenskaber og funktion, kan der ske en værdiforringelse.
        </p>
        <p>Varen skal sendes forsvarligt emballeret.</p>
      </LegalSection>

      <LegalSection title="5. Tilbagebetaling">
        <p>
          Når returneringen er godkendt, tilbagebetaler vi beløbet hurtigst muligt og senest 14 dage efter, at du har givet besked om fortrydelse.
        </p>
        <p>
          Vi kan tilbageholde betalingen, indtil vi har modtaget varen retur, eller du har fremlagt dokumentation for returnering.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
