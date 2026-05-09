import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { TrustBar } from "@/components/landing/TrustBar";
import { IMAGE_SLOTS } from "@/components/ImageSlot";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/find-dit-ritual")({
  head: () => ({
    meta: [
      { title: "Find dit køkkenritual | Langsomt Nok" },
      { name: "description", content: "Find det rette køkkenritual med slibning, pleje, opbevaring eller gaver fra Langsomt Nok." },
      { property: "og:title", content: "Find dit køkkenritual | Langsomt Nok" },
      { property: "og:description", content: "Et roligt sted at begynde — med skarphed, pleje, opbevaring eller en gave." },
    ],
  }),
  component: FindRitualPage,
});

const RITUAL_CARDS = [
  { title: "Min kniv er blevet sløv", text: "Start med slibning og pleje.", to: "/ritualer/hold-kniven-skarp" as const },
  { title: "Jeg vil passe bedre på mine redskaber", text: "Find sten, strop og små ritualer.", to: "/ritualer/hold-kniven-skarp" as const },
  { title: "Jeg vil skabe ro i køkkenet", text: "Se knivholdere og standere i træ.", to: "/ritualer/rolig-opbevaring" as const },
  { title: "Jeg leder efter en gave", text: "Find en gave, der faktisk bliver brugt.", to: "/gaver/fars-dag" as const },
];

function FindRitualPage() {
  useEffect(() => {
    trackEvent("landing_page_view", { page: "find_dit_ritual" });
  }, []);

  return (
    <div data-page-type="campaign_landing" data-campaign="find_dit_ritual">
      <LandingPageHero
        headline="Find dit køkkenritual"
        subheadline="Et roligt sted at begynde — med skarphed, pleje, opbevaring eller en gave."
        primaryCta={{ label: "Begynd her", to: "/find-dit-ritual" }}
        imageSlot={{ name: IMAGE_SLOTS.heroes.giftLandingHero.name, motif: "Stille køkkenbord med slibesten, valnødde-knivlist og linned" }}
        variant="overlay"
      />

      <TrustBar />

      <section className="section-padding">
        <div className="container-calm max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl mb-3">Hvor vil du begynde?</h2>
            <p className="text-muted-foreground text-editorial mx-auto">Vælg det, der ligner din hverdag lige nu.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {RITUAL_CARDS.map((card) => (
              <Link
                key={card.title}
                to={card.to}
                onClick={() => trackEvent("ritual_card_click" as never, { label: card.title })}
                data-event="ritual_card_click"
                className="group block p-8 rounded-lg border border-border hover:border-walnut/30 hover:shadow-sm transition-all duration-300 bg-background"
              >
                <h3 className="font-serif text-xl mb-3 group-hover:text-walnut transition-colors">{card.title}</h3>
                <p className="text-muted-foreground mb-5">{card.text}</p>
                <span className="text-sm text-cta font-medium">Begynd her →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TrustBar layout="grid" />
    </div>
  );
}
