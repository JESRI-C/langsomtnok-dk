import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { TopHook } from "@/components/kampagne/knivsliber/TopHook";
import { Hero } from "@/components/kampagne/knivsliber/Hero";
import { ProblemSolution } from "@/components/kampagne/knivsliber/ProblemSolution";
import { Trust } from "@/components/kampagne/knivsliber/Trust";
import { FaqCta } from "@/components/kampagne/knivsliber/FaqCta";
import { StickyBuyBar } from "@/components/kampagne/knivsliber/StickyBuyBar";
import { KNIVSLIBER_CONFIG } from "@/lib/knivsliber-config";
import { trackEvent, trackProductView } from "@/lib/analytics";
import heroVideo from "@/assets/knivsliber/ugc-3trin.mp4.asset.json";
import heroPoster from "@/assets/knivsliber/ugc-3trin-poster.jpg.asset.json";
import trustImg from "@/assets/knivsliber/img_1339.jpg.asset.json";

const SOURCE_PAGE = "/pages/knivsliber-3-trin";
const CAMPAIGN = "3_trin";
const BUY_URL = `https://langsomtnok.dk/products/${KNIVSLIBER_CONFIG.PRODUCT_HANDLE}`;

export const Route = createFileRoute("/pages/knivsliber-3-trin")({
  head: () => ({
    meta: [
      { title: "Knivsliber i tre rolige trin — 379 kr | Langsomt Nok" },
      { name: "description", content: "Grov. Fin. Polér. Tre trin, fem minutter — og din kniv er skarp igen. Knivsliber i valnød, 379 kr (før 499 kr)." },
      { property: "og:title", content: "Tre rolige trin — og kniven er skarp igen" },
      { property: "og:description", content: "Grov. Fin. Polér. Se hvordan det virker — og køb sliberen." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "https://langsomtnok.dk/pages/knivsliber-3-trin" },
      { property: "og:image", content: `https://langsomtnok.dk${heroPoster.url}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/pages/knivsliber-3-trin" }],
  }),
  component: Page,
});

function Page() {
  useEffect(() => {
    trackEvent("landing_page_view", { page: SOURCE_PAGE, campaign: CAMPAIGN });
    trackProductView({
      product_id: "gid://shopify/Product/10326655697232",
      product_title: KNIVSLIBER_CONFIG.PRODUCT_TITLE,
      variant_id: KNIVSLIBER_CONFIG.DEFAULT_VARIANT_ID,
      variant_title: "Valnød",
      price: 379,
      currency: "DKK",
      product_type: "The Ritual Set",
    });
  }, []);

  return (
    <main
      className="min-h-screen bg-[#F4F1EA] text-[#2D2D2D] pb-24 md:pb-0"
      style={{ fontFamily: '"Inter", system-ui, sans-serif' }}
    >
      <style>{`.font-serif { font-family: "Fraunces", "Playfair Display", Georgia, serif; }`}</style>

      <TopHook label="Sådan virker den" />

      <Hero
        videoUrl={heroVideo.url}
        posterUrl={heroPoster.url}
        alt="Video: knivsliberen i brug — tre trin fra grov til polér"
        eyebrow="Grov · Fin · Polér"
        headline={<>Tre rolige trin — og kniven er <em className="italic font-light">skarp igen</em></>}
        subline="Se hvordan det virker. Fem minutter ved køkkenbordet, ét trin ad gangen. Ingen vandsten, ingen viden krævet."
        buyUrl={BUY_URL}
        sourcePage={SOURCE_PAGE}
        campaignName={CAMPAIGN}
      />

      <ProblemSolution
        heading={<>Hvordan det <em className="italic font-light text-[#6E7B4F]">gøres</em></>}
        points={[
          { problem: "Trin 1 — Grov (360# diamant)", solution: "Kun når kniven er tydeligt sløv. 3–5 rolige træk fra hæfte mod spids." },
          { problem: "Trin 2 — Fin (600# diamant)", solution: "Den daglige skarphed. 5–7 træk pr. side, samme rolige tempo." },
          { problem: "Trin 3 — Polér (1200# keramik)", solution: "Den bløde afslutning. 3–4 lette træk, og æggen står ren." },
          { problem: "Bagefter", solution: "Tør kniven af med et viskestykke. Ingen olie, ingen efterbehandling." },
        ]}
        footnote="Passer til almindelige køkkenknive med stålklinge. Keramiske og enkeltslebne knive kræver vandsten."
      />

      <Trust
        imageUrl={trustImg.url}
        alt="Nærbillede af knivsliberens tre slidsæt — 1 Coarse, 2 Fine, 3 Polish"
        quote="Jeg lavede den for min egen skyld — jeg ville have ét redskab, hvor rækkefølgen var indlysende og resultatet blev ens hver gang. Tre trin. Det er hele hemmeligheden."
      />

      <FaqCta
        faq={[
          { q: "Skal jeg bruge alle tre trin hver gang?", a: "Nej. Til daglig: kun fin + polér. Grov kun når kniven er tydeligt sløv." },
          { q: "Hvor hårdt skal jeg trykke?", a: "Let. Knivens egen vægt er nok — diamanten gør arbejdet, ikke armen." },
          { q: "Hvor lang tid tager det?", a: "3–5 minutter for en almindelig kokkekniv. Rolige træk, ikke hurtige." },
          { q: "Kan den slibe saks?", a: "Nej — kun lige klinger. Sakse kræver et andet værktøj." },
        ]}
        ctaHeadline={<>Læg den <em className="italic font-light text-[#6E7B4F]">i kurven</em></>}
        buyUrl={BUY_URL}
        sourcePage={SOURCE_PAGE}
        campaignName={CAMPAIGN}
      />

      <StickyBuyBar buyUrl={BUY_URL} sourcePage={SOURCE_PAGE} campaignName={CAMPAIGN} />
    </main>
  );
}
