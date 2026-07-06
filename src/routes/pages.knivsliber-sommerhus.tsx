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
import trustImg from "@/assets/knivsliber/img_1343.jpg.asset.json";

const SOURCE_PAGE = "/pages/knivsliber-sommerhus";
const CAMPAIGN = "sommerhus";

export const Route = createFileRoute("/pages/knivsliber-sommerhus")({
  head: () => ({
    meta: [
      { title: "Knivsliber til sommerhuset — 379 kr | Langsomt Nok" },
      { name: "description", content: "Sommerhusets knive er altid de sløveste. Tag knivsliberen med — 379 kr (før 499 kr). Ingen skruer, ingen montering." },
      { property: "og:title", content: "Tag den med i sommerhuset — 379 kr" },
      { property: "og:description", content: "Sommerhusets knive er sløve. Knivsliberen flytter med. Tre rolige trin." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "https://langsomtnok.dk/pages/knivsliber-sommerhus" },
      { property: "og:image", content: `https://langsomtnok.dk${heroPoster.url}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/pages/knivsliber-sommerhus" }],
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

      <TopHook label="Sommerferie · Fri fragt" />

      <Hero
        videoUrl={heroVideo.url}
        posterUrl={heroPoster.url}
        alt="Knivsliberen i brug — tre trin, roligt og enkelt"
        eyebrow="Til sommerhuset · Spar 24 %"
        headline={<>Sommerhusets knive er altid <em className="italic font-light">de sløveste</em></>}
        subline="Læg knivsliberen i tasken sammen med badetøjet. Tre trin på køkkenbordet — og aftensmaden bliver et rent snit."
        
        sourcePage={SOURCE_PAGE}
        campaignName={CAMPAIGN}
      />

      <ProblemSolution
        heading={<>Den <em className="italic font-light text-[#6E7B4F]">flytter med</em></>}
        points={[
          { problem: "Sommerhusets brødkniv er sløv siden 90'erne", solution: "Slib den, når du ankommer — 5 minutter, og du er klar." },
          { problem: "Der er ingen plads i tasken", solution: "23 cm lang. Passer ved siden af skærebrættet." },
          { problem: "Ingen fastmontering — du er kun på lån", solution: "Stilles på bordet. Tages med hjem igen." },
          { problem: "Vandstenene bliver hjemme", solution: "Diamant og keramik indbygget. Intet at pakke ud." },
        ]}
        footnote="Bemærk: Standeren stilles på bordet — den monteres ikke på væggen."
      />

      <Trust
        imageUrl={trustImg.url}
        alt="Knivsliber og kokkekniv på magnetisk stander på terrassebord ved sommerhuset"
        quote="Jeg tog den med til sommerhuset første gang i påsken. Nu ligger der én i tasken hver gang — den vejer ingenting, og aftensmaden bliver aldrig igen skåret med en sløv kniv."
      />

      <FaqCta
        faq={[
          { q: "Kan den ligge i tasken?", a: "Ja. 23 cm, letvægt. Ingen skarpe kanter udenpå — de tre slidsæt sidder indbygget." },
          { q: "Er den svær at bruge?", a: "Nej. Tre trin — grov, fin, polér — i den rækkefølge. Rolige træk fra hæfte mod spids." },
          { q: "Passer den til sommerhusets knive?", a: "Til alle almindelige køkkenknive med stålklinge. Også de gamle, glemte fra skuffen." },
          { q: "Fri fragt?", a: "Ja, gratis fragt i Danmark. Sendes i dag ved ordre inden kl. 14." },
        ]}
        ctaHeadline={<>Læg den <em className="italic font-light text-[#6E7B4F]">i tasken</em></>}
        
        sourcePage={SOURCE_PAGE}
        campaignName={CAMPAIGN}
      />

      <StickyBuyBar  sourcePage={SOURCE_PAGE} campaignName={CAMPAIGN} />
    </main>
  );
}
