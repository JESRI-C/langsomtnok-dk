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
import trustImg from "@/assets/knivsliber/img_1344.jpg.asset.json";

const SOURCE_PAGE = "/pages/knivsliber-varme-dage";
const CAMPAIGN = "varme_dage";
const BUY_URL = `https://langsomtnok.dk/products/${KNIVSLIBER_CONFIG.PRODUCT_HANDLE}`;

export const Route = createFileRoute("/pages/knivsliber-varme-dage")({
  head: () => ({
    meta: [
      { title: "Knivsliber til varme dage — 379 kr | Langsomt Nok" },
      { name: "description", content: "Skarpe knive til grill, salater og lange sommeraftener. Knivsliber i valnød — sommerrabat: 379 kr (før 499 kr)." },
      { property: "og:title", content: "Skarpe knive til varme dage — 379 kr" },
      { property: "og:description", content: "Til grill, salater og lange aftener. Tre rolige trin — og knivene er klar." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "https://langsomtnok.dk/pages/knivsliber-varme-dage" },
      { property: "og:image", content: `https://langsomtnok.dk${heroImg.url}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/pages/knivsliber-varme-dage" }],
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

      <TopHook label="Sommerrabat" />

      <Hero
        imageUrl={heroImg.url}
        alt="Knivsliber i valnød på terrassebord med krydderurter"
        eyebrow="Sommerrabat · Spar 24 %"
        headline={<>Skarpe knive til <em className="italic font-light text-[#6E7B4F]">varme dage</em></>}
        subline="Til grill, salater og lange aftener på terrassen. Tre rolige trin — og knivene er klar til sommermaden."
        sourcePage={SOURCE_PAGE}
        campaignName={CAMPAIGN}
      />

      <ProblemSolution
        heading={<>Bygget til <em className="italic font-light text-[#6E7B4F]">sommermaden</em></>}
        points={[
          { problem: "Tomaten mases i stedet for at snittes", solution: "En skarp kniv giver et rent snit." },
          { problem: "Grillkødet flosser ved udskæring", solution: "Skarpe knive skærer med, ikke imod." },
          { problem: "Urterne bliver sorte og trætte", solution: "Et rent snit holder farven i basilikum og persille." },
          { problem: "Slibning føles teknisk og besværligt", solution: "Tre trin. Grov, fin, polér. Ingen viden krævet." },
        ]}
        footnote="Bemærk: Passer til almindelige køkkenknive med stålklinge — ikke keramiske."
      />

      <Trust
        imageUrl={trustImg.url}
        alt="Knivsliberen i valnød ved siden af krydderurter i terracotta-krukke"
        quote="Jeg har den her, fordi tomat-sæsonen fortjener bedre end en sløv kniv fra skuffen. Tre trin ved køkkenbordet — og alt bliver skåret rent hele sommeren."
      />

      <FaqCta
        faq={[
          { q: "Er den svær at bruge?", a: "Nej. Tre trin — grov, fin og polér — i den rækkefølge. Rolige, lige træk fra hæfte mod spids." },
          { q: "Hvor ofte skal jeg slibe?", a: "Til daglig brug: fin + polér én gang om ugen. Grov kun når kniven er tydeligt sløv." },
          { q: "Passer den til alle knive?", a: "Til almindelige køkkenknive med stålklinge. Keramiske knive og japanske enkeltslebne knive skal på vandsten." },
          { q: "Hvad hvis jeg ikke er tilfreds?", a: "30 dages fortrydelse. Skriv til os, så ordner vi det roligt." },
        ]}
        ctaHeadline={<>Tag den med ud <em className="italic font-light text-[#6E7B4F]">i sommer</em></>}
        sourcePage={SOURCE_PAGE}
        campaignName={CAMPAIGN}
      />

      <StickyBuyBar sourcePage={SOURCE_PAGE} campaignName={CAMPAIGN} />
    </main>
  );
}
