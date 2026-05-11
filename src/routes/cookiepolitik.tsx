import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/cookiepolitik")({
  head: () => ({
    meta: [
      { title: "Cookiepolitik | Langsomt Nok" },
      { name: "description", content: "Læs hvordan Langsomt Nok bruger cookies, og hvordan du kan ændre dit samtykke." },
      { property: "og:title", content: "Cookiepolitik | Langsomt Nok" },
      { property: "og:description", content: "Læs hvordan Langsomt Nok bruger cookies, og hvordan du kan ændre dit samtykke." },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/cookiepolitik" }],
  }),
  component: CookiepolitikPage,
});

function CookiepolitikPage() {
  return (
    <LegalPageLayout
      title="Cookiepolitik"
      intro="Langsomt Nok bruger cookies for at få webshoppen til at fungere, forbedre brugeroplevelsen og - hvis du giver samtykke - til statistik og markedsføring."
    >
      <LegalSection title="1. Hvad er cookies?">
        <p>Cookies er små tekstfiler, der gemmes på din enhed, når du besøger en hjemmeside. De kan bruges til at huske valg, få webshoppen til at fungere og måle brugen af siden.</p>
      </LegalSection>

      <LegalSection title="2. Typer af cookies">
        <p>Vi kan bruge følgende typer cookies:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong className="text-foreground">Nødvendige cookies:</strong> bruges fx til indkøbskurv, checkout og sikkerhed.</li>
          <li><strong className="text-foreground">Statistikcookies:</strong> hjælper os med at forstå, hvordan besøgende bruger siden.</li>
          <li><strong className="text-foreground">Marketingcookies:</strong> kan bruges til relevant markedsføring og måling af annoncering.</li>
          <li><strong className="text-foreground">Funktionelle cookies:</strong> kan bruges til at huske dine valg og forbedre oplevelsen.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Samtykke">
        <p>Nødvendige cookies kan bruges uden samtykke, fordi de er nødvendige for, at webshoppen fungerer.</p>
        <p>Statistik-, marketing- og funktionelle cookies bruges kun, hvis der er indhentet samtykke, hvor det er påkrævet.</p>
      </LegalSection>

      <LegalSection title="4. Ændring af samtykke">
        <p>Hvis der findes et cookie-banner eller cookieindstillinger på siden, kan du ændre eller trække dit samtykke tilbage via denne funktion.</p>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
          className="inline-flex items-center justify-center rounded-md bg-cta px-5 py-3 text-sm font-medium text-cta-foreground transition-colors hover:bg-cta/90"
        >
          Åbn cookieindstillinger
        </button>
      </LegalSection>

      <LegalSection title="5. Kontakt">
        <p>Har du spørgsmål til cookies, kan du kontakte os på <a className="text-cta hover:underline" href="mailto:hej@langsomtnok.dk">hej@langsomtnok.dk</a>.</p>
        <p>JBR Freelance, CVR-nr. 30782240</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
