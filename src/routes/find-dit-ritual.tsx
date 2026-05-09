import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { TrustBar } from "@/components/landing/TrustBar";
import { IMAGE_SLOTS } from "@/components/ImageSlot";
import { trackEvent } from "@/lib/analytics";
import { useCampaignContent } from "@/hooks/useCampaignContent";
import type { CampaignContent } from "@/lib/campaign-content";
import { buildCampaignHead, SITE_ORIGIN } from "@/lib/campaign-seo";

// Edit live in: Shopify Admin → Content → Metaobjects → Campaign Landing Page → "find-dit-ritual"
const FALLBACK: CampaignContent = {
  seo_title: "Find dit køkkenritual | Langsomt Nok",
  seo_description:
    "Find det rette køkkenritual med slibning, pleje, opbevaring eller gaver fra Langsomt Nok.",
  hero_eyebrow: "Begynd her",
  hero_headline: "Find dit køkkenritual",
  hero_subheading: "Et roligt sted at begynde — med skarphed, pleje, opbevaring eller en gave.",
  primary_cta_text: "Begynd her",
  primary_cta_url: "#ritual-valg",
  intro_section_title: "Hvor vil du begynde?",
  intro_section_body: "Vælg det, der ligner din hverdag lige nu.",
  guide_cards: [
    {
      title: "Min kniv er blevet sløv",
      text: "Start med slibning og pleje.",
      href: "/ritualer/hold-kniven-skarp",
    },
    {
      title: "Jeg vil passe bedre på mine redskaber",
      text: "Find sten, strop og små ritualer.",
      href: "/ritualer/hold-kniven-skarp",
    },
    {
      title: "Jeg vil skabe ro i køkkenet",
      text: "Se knivholdere og standere i træ.",
      href: "/ritualer/rolig-opbevaring",
    },
    {
      title: "Jeg leder efter en gave",
      text: "Find en gave, der faktisk bliver brugt.",
      href: "/gaver/fars-dag",
    },
  ],
};

export const Route = createFileRoute("/find-dit-ritual")({
  head: () =>
    buildCampaignHead({
      pathname: "/find-dit-ritual",
      title: FALLBACK.seo_title!,
      description: FALLBACK.seo_description!,
      breadcrumbs: [
        { name: "Forside", url: `${SITE_ORIGIN}/` },
        { name: "Find dit ritual", url: `${SITE_ORIGIN}/find-dit-ritual` },
      ],
      itemListName: "Find dit køkkenritual",
      itemList: (FALLBACK.guide_cards ?? []).map((c) => ({
        name: c.title,
        url: c.href?.startsWith("http") ? c.href : `${SITE_ORIGIN}${c.href ?? "/find-dit-ritual"}`,
      })),
    }),
  component: FindRitualPage,
});

function FindRitualPage() {
  const c = useCampaignContent("find-dit-ritual", FALLBACK);

  useEffect(() => {
    trackEvent("landing_page_view", { page: "find_dit_ritual" });
  }, []);

  return (
    <div data-page-type="campaign_landing" data-campaign="find_dit_ritual">
      <LandingPageHero
        headline={c.hero_headline!}
        subheadline={c.hero_subheading!}
        primaryCta={{ label: c.primary_cta_text!, to: c.primary_cta_url! }}
        imageSlot={{
          name: IMAGE_SLOTS.heroes.giftLandingHero.name,
          motif: "Stille køkkenbord med slibesten, valnødde-knivlist og linned",
        }}
        variant="overlay"
      />

      <TrustBar />

      <section className="pt-12">
        <div className="container-calm max-w-2xl">
          <div className="p-6 md:p-8 rounded-lg bg-soft/60 border border-border/40 text-center">
            <p className="text-editorial text-foreground/80 leading-relaxed">
              Et køkkenritual er en lille gentagen handling, der gør madlavningen mere rolig. Det
              kan være at slibe en kniv, pleje et redskab, rydde op på bordet eller give tingene
              en fast plads.
            </p>
          </div>
        </div>
      </section>

      <section id="ritual-valg" className="section-padding">
        <div className="container-calm max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl mb-3">{c.intro_section_title}</h2>
            {c.intro_section_body && (
              <p className="text-muted-foreground text-editorial mx-auto">{c.intro_section_body}</p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(c.guide_cards ?? []).map((card) => (
              <a
                key={card.title}
                href={card.href || "#"}
                onClick={() => trackEvent("ritual_card_click", { label: card.title })}
                data-event="ritual_card_click"
                className="group block p-8 rounded-lg border border-border hover:border-walnut/30 hover:shadow-sm transition-all duration-300 bg-background"
              >
                <h3 className="font-serif text-xl mb-3 group-hover:text-walnut transition-colors">
                  {card.title}
                </h3>
                <p className="text-muted-foreground mb-5">{card.text}</p>
                <span className="text-sm text-cta font-medium">Begynd her →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <TrustBar layout="grid" />
    </div>
  );
}
