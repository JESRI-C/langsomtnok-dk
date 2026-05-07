import { createFileRoute } from "@tanstack/react-router";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { GiftGuideBlock } from "@/components/landing/GiftGuideBlock";
import { BundleRecommendationBlock } from "@/components/landing/BundleRecommendationBlock";
import { TrustBar } from "@/components/landing/TrustBar";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ImageSlot, IMAGE_SLOTS } from "@/components/ImageSlot";

export const Route = createFileRoute("/pages/gave-til-madelskeren")({
  head: () => ({
    meta: [
      { title: "Gave til madelskeren — Langsomt Nok" },
      { name: "description", content: "En gave, der bliver brugt. Ikke bare pakket ud. Find køkkenredskaber med mening til den, der elsker mad." },
      { property: "og:title", content: "Gave til madelskeren — Langsomt Nok" },
      { property: "og:description", content: "En gave, der bliver brugt. Ikke bare pakket ud." },
    ],
  }),
  component: GiftPage,
});

function GiftPage() {
  return (
    <div>
      <LandingPageHero
        headline="En gave, der bliver brugt. Ikke bare pakket ud."
        subheadline="Til den, der elsker mad, materialer og ting med varighed."
        primaryCta={{ label: "Find en gave med ro", to: "/shop" }}
        secondaryCta={{ label: "Se gaveidéer", to: "/collections/gaver" }}
        imageSlot={{ name: IMAGE_SLOTS.heroes.giftLandingHero.name, motif: IMAGE_SLOTS.heroes.giftLandingHero.motif }}
        variant="overlay"
      />

      <TrustBar />

      {/* Why kitchen tools make meaningful gifts */}
      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Gaver med mening</h2>
          <div className="space-y-4 text-muted-foreground text-editorial">
            <p>De bedste gaver er dem, der bliver brugt. Ikke dem, der ender i en skuffe. Et godt køkkenredskab bliver en del af hverdagen — hvert måltid, hver aften, hvert ritual.</p>
            <p>Når du giver en kniv, giver du en måde at lave mad på. Når du giver en slibesten, giver du en ny færdighed. Når du giver plejeolie, giver du omsorg for noget, der allerede er elsket.</p>
          </div>
        </div>
      </section>

      {/* Gifts by budget */}
      <GiftGuideBlock
        title="Gaver efter budget"
        subtitle="Uanset budget finder du noget, der varer."
      />

      {/* Starter kits */}
      <BundleRecommendationBlock
        title="Startkits som gave"
        subtitle="Sammensatte gaver med alt, hvad modtageren behøver for at begynde."
      />

      {/* Gift packaging */}
      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Indpakning og personligt kort</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ImageSlot name="gift-packaging" ratio="4/3" motif="Gavepakke i naturpapir med snor og tørret lavendel" variant="warm" />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-muted-foreground text-editorial mb-4">
                Alle gaver pakkes i vores karakteristiske naturpapir med bomuldssnor. Du kan tilføje et personligt kort med din besked.
              </p>
              <p className="text-muted-foreground text-editorial">
                Vi tror på, at udpakningen er en del af oplevelsen. Derfor pakker vi med ro, omhu og materialer, der føles rigtige.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery confidence */}
      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-8">Tryg levering og retur</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Fri fragt over 499 kr.", text: "Levering til pakkeshop eller direkte til døren." },
              { title: "30 dages returret", text: "Passer gaven ikke? Returner den uden besvær." },
              { title: "Pakket med omhu", text: "Beskyttet forsendelse i bæredygtige materialer." },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-lg border border-border">
                <h3 className="font-serif text-base mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQAccordion items={[
        { question: "Kan I pakke det ind som gave?", answer: "Ja, alle ordrer kan pakkes i vores gaveindpakning med naturpapir og bomuldssnor. Du kan tilføje et personligt kort ved checkout." },
        { question: "Hvad hvis modtageren allerede har en god kniv?", answer: "Overvej en slibesten, plejeolie eller en magnetisk holder. De fleste har brug for vedligeholdelse mere end nye knive." },
        { question: "Kan man returnere en gave?", answer: "Ja, vi har 30 dages returret på alle produkter. Modtageren kan bytte til en anden størrelse eller et andet produkt." },
        { question: "Hvornår skal jeg bestille for at nå det?", answer: "Vi sender normalt inden for 1-2 hverdage. Standard levering tager 2-4 hverdage i Danmark." },
      ]} />

      <CalmCTASection
        headline="Find en gave med ro."
        text="Gaver der varer længere end én aften. Og huskes længere."
        cta={{ label: "Se gaveidéer", to: "/collections/gaver" }}
        variant="warm"
      />

      <NewsletterSignup variant="dark" />
    </div>
  );
}
