import { createFileRoute } from "@tanstack/react-router";
import { CompanyDetails, LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/handelsbetingelser")({
  head: () => ({
    meta: [
      { title: "Handelsbetingelser | Langsomt Nok" },
      { name: "description", content: "Læs handelsbetingelser for køb hos Langsomt Nok, herunder betaling, levering, fortrydelsesret, returnering og reklamation." },
      { property: "og:title", content: "Handelsbetingelser | Langsomt Nok" },
      { property: "og:description", content: "Læs handelsbetingelser for køb hos Langsomt Nok, herunder betaling, levering, fortrydelsesret, returnering og reklamation." },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/handelsbetingelser" }],
  }),
  component: HandelsbetingelserPage,
});

function HandelsbetingelserPage() {
  return (
    <LegalPageLayout
      title="Handelsbetingelser"
      intro="Disse handelsbetingelser gælder for køb på langsomtnok.dk. Vi har skrevet dem så klart som muligt, så du ved, hvad du siger ja til."
    >
      <LegalSection title="1. Virksomhed">
        <CompanyDetails />
      </LegalSection>

      <LegalSection title="2. Bestilling">
        <p>
          Når du afgiver en ordre på langsomtnok.dk, modtager du en ordrebekræftelse på e-mail. Aftalen er indgået, når ordren er bekræftet.
        </p>
        <p>
          Hvis du opdager en fejl i din ordre, skal du kontakte os hurtigst muligt på <a className="text-cta hover:underline" href="mailto:hej@langsomtnok.dk">hej@langsomtnok.dk</a>.
        </p>
      </LegalSection>

      <LegalSection title="3. Priser og betaling">
        <p>
          Alle priser vises i danske kroner og er inkl. moms, medmindre andet fremgår. Betaling sker via de betalingsløsninger, der vises i checkout.
        </p>
        <p>
          Beløbet trækkes som udgangspunkt først, når varen afsendes, medmindre andet følger af den valgte betalingsløsning.
        </p>
      </LegalSection>

      <LegalSection title="4. Levering">
        <p>
          Vi leverer til Danmark, medmindre andet fremgår på produktsiden eller i checkout. Leveringstid og fragtpris fremgår ved betaling.
        </p>
        <p>
          Vi pakker hver ordre med omhu. Hvis din pakke er forsinket, beskadiget eller ikke dukker op, skal du kontakte os på <a className="text-cta hover:underline" href="mailto:hej@langsomtnok.dk">hej@langsomtnok.dk</a>.
        </p>
      </LegalSection>

      <LegalSection title="5. Fortrydelsesret">
        <p>
          Som forbruger har du som udgangspunkt 14 dages fortrydelsesret ved køb på nettet. Fristen regnes fra den dag, du eller en anden person valgt af dig modtager varen.
        </p>
        <p>
          Hvis du ønsker at fortryde dit køb, skal du give os tydelig besked på <a className="text-cta hover:underline" href="mailto:hej@langsomtnok.dk">hej@langsomtnok.dk</a>.
        </p>
      </LegalSection>

      <LegalSection title="6. Returnering">
        <p>
          Hvis du fortryder dit køb, skal varen returneres uden unødig forsinkelse og senest 14 dage efter, at du har meddelt os, at du ønsker at fortryde købet.
        </p>
        <div className="rounded-lg border border-border/60 bg-card/60 p-5 text-sm leading-7">
          <strong className="block text-foreground">Returadresse</strong>
          JBR Freelance<br />
          Bøgevej 4<br />
          7160 Tørring<br />
          Danmark
        </div>
        <p>Kunden betaler som udgangspunkt selv returfragten, medmindre andet er aftalt.</p>
      </LegalSection>

      <LegalSection title="7. Varens stand ved returnering">
        <p>
          Du må undersøge varen på samme måde, som du ville gøre i en fysisk butik. Hvis varen er brugt mere end nødvendigt for at fastslå dens art, egenskaber og funktion, kan der ske en værdiforringelse.
        </p>
        <p>Varen skal returneres forsvarligt emballeret.</p>
      </LegalSection>

      <LegalSection title="8. Tilbagebetaling">
        <p>
          Ved godkendt fortrydelse tilbagebetaler vi beløbet hurtigst muligt og senest 14 dage efter, at vi har modtaget besked om fortrydelsen.
        </p>
        <p>
          Vi kan tilbageholde betalingen, indtil varen er modtaget retur, eller du har fremlagt dokumentation for returnering. Tilbagebetaling sker som udgangspunkt til samme betalingsmiddel, som blev brugt ved købet.
        </p>
      </LegalSection>

      <LegalSection title="9. Reklamationsret">
        <p>
          Du har 2 års reklamationsret efter købeloven. Hvis varen har en fejl eller mangel, skal du kontakte os hurtigst muligt og inden for rimelig tid.
        </p>
        <p>
          Skriv til <a className="text-cta hover:underline" href="mailto:hej@langsomtnok.dk">hej@langsomtnok.dk</a> med ordrenummer, beskrivelse af fejlen og billeder eller video af problemet.
        </p>
        <p>
          Hvis reklamationen er berettiget, finder vi en passende løsning. Det kan være reparation, ombytning, afslag i prisen eller tilbagebetaling afhængigt af den konkrete situation.
        </p>
      </LegalSection>

      <LegalSection title="10. Klageadgang">
        <p>
          Hvis du som forbruger vil klage over dit køb, skal du først kontakte os på <a className="text-cta hover:underline" href="mailto:hej@langsomtnok.dk">hej@langsomtnok.dk</a>.
        </p>
        <p>
          Hvis vi ikke finder en løsning, kan du klage via relevante offentlige klageinstanser, herunder Nævnenes Hus eller EU-Kommissionens online klageportal, hvis betingelserne er opfyldt.
        </p>
      </LegalSection>

      <LegalSection title="11. Persondata">
        <p>
          Vi behandler personoplysninger i forbindelse med køb, levering, kundeservice og markedsføring. Læs mere i vores <a className="text-cta hover:underline" href="/privatlivspolitik">privatlivspolitik</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
