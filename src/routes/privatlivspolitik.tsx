import { createFileRoute } from "@tanstack/react-router";
import { CompanyDetails, LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/privatlivspolitik")({
  head: () => ({
    meta: [
      { title: "Privatlivspolitik | Langsomt Nok" },
      { name: "description", content: "Læs hvordan JBR Freelance behandler personoplysninger i forbindelse med køb, kundeservice, levering og markedsføring hos Langsomt Nok." },
      { property: "og:title", content: "Privatlivspolitik | Langsomt Nok" },
      { property: "og:description", content: "Læs hvordan JBR Freelance behandler personoplysninger i forbindelse med køb, kundeservice, levering og markedsføring hos Langsomt Nok." },
    ],
  }),
  component: PrivatlivspolitikPage,
});

function PrivatlivspolitikPage() {
  return (
    <LegalPageLayout
      title="Privatlivspolitik"
      intro="Denne privatlivspolitik beskriver, hvordan Langsomt Nok behandler personoplysninger i forbindelse med webshop, køb, kundeservice og kommunikation."
    >
      <LegalSection title="1. Dataansvarlig">
        <CompanyDetails />
        <p>JBR Freelance er dataansvarlig for behandlingen af de personoplysninger, der behandles i forbindelse med langsomtnok.dk.</p>
      </LegalSection>

      <LegalSection title="2. Hvilke oplysninger behandler vi?">
        <p>Vi kan behandle følgende oplysninger:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Navn</li>
          <li>Adresse</li>
          <li>E-mail</li>
          <li>Telefonnummer</li>
          <li>Ordreoplysninger</li>
          <li>Betalingsoplysninger, afhængigt af betalingsudbyder</li>
          <li>Leveringsoplysninger</li>
          <li>Kommunikation med kundeservice</li>
          <li>IP-adresse og cookieoplysninger, hvis relevant</li>
          <li>Samtykke til nyhedsbrev, hvis du tilmelder dig</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Formål med behandlingen">
        <p>Vi behandler oplysninger for at kunne:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Gennemføre og levere ordrer</li>
          <li>Sende ordrebekræftelser og leveringsinformation</li>
          <li>Håndtere betaling</li>
          <li>Yde kundeservice</li>
          <li>Behandle returneringer og reklamationer</li>
          <li>Opfylde bogføringskrav</li>
          <li>Sende nyhedsbreve, hvis du har givet samtykke</li>
          <li>Forbedre webshoppen via statistik og analyse, hvis relevant</li>
          <li>Vise relevant markedsføring, hvis du har givet samtykke</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Retsgrundlag">
        <p>Vi behandler oplysninger på baggrund af aftale, når du køber en vare, retlig forpligtelse, fx bogføring, samtykke, fx nyhedsbrev og visse cookies, samt legitim interesse, fx kundeservice og forbedring af webshoppen.</p>
      </LegalSection>

      <LegalSection title="5. Databehandlere og samarbejdspartnere">
        <p>Vi kan dele relevante oplysninger med nødvendige samarbejdspartnere, fx:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Shopify eller anden webshopplatform</li>
          <li>Betalingsudbydere</li>
          <li>Fragtleverandører</li>
          <li>E-mail- og nyhedsbrevssystemer</li>
          <li>Analyse- og cookieplatforme</li>
          <li>Regnskabs- og bogføringssystemer</li>
        </ul>
        <p>Vi deler kun oplysninger, når det er nødvendigt og relevant.</p>
      </LegalSection>

      <LegalSection title="6. Opbevaring">
        <p>Vi opbevarer personoplysninger så længe, det er nødvendigt for formålet.</p>
        <p>Ordre- og regnskabsoplysninger opbevares som udgangspunkt i henhold til bogføringslovens krav. Oplysninger til nyhedsbrev opbevares, indtil du trækker dit samtykke tilbage.</p>
      </LegalSection>

      <LegalSection title="7. Dine rettigheder">
        <p>Du har ret til:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>At få indsigt i dine oplysninger</li>
          <li>At få urigtige oplysninger rettet</li>
          <li>At få oplysninger slettet i visse tilfælde</li>
          <li>At få behandlingen begrænset</li>
          <li>At gøre indsigelse mod behandling</li>
          <li>At få udleveret dine oplysninger i et struktureret format, hvis betingelserne er opfyldt</li>
          <li>At trække samtykke tilbage</li>
        </ul>
        <p>Hvis du vil gøre brug af dine rettigheder, kan du skrive til <a className="text-cta hover:underline" href="mailto:hej@langsomtnok.dk">hej@langsomtnok.dk</a>.</p>
      </LegalSection>

      <LegalSection title="8. Klage">
        <p>Du kan klage til Datatilsynet, hvis du mener, at dine personoplysninger ikke behandles korrekt.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
