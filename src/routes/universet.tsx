import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { UniversetHero } from "@/components/universet/UniversetHero";
import { FeaturedStoryBlock } from "@/components/universet/FeaturedStoryBlock";
import { StoryCard } from "@/components/universet/StoryCard";
import { RitualCategoryFilter } from "@/components/universet/RitualCategoryFilter";
import { CirklenSignupBlock } from "@/components/universet/CirklenSignupBlock";
import {
  STORIES,
  getFeaturedStory,
  getStoriesByCategory,
  type RitualCategory,
} from "@/lib/universet";
import { trackEvent } from "@/lib/analytics";

const SITE_ORIGIN = "https://langsomtnok.dk";
const TITLE = "Langsomt Nok Universet — fortællinger, ritualer og håndværk";
const DESCRIPTION =
  "Et roligt univers af køkkenritualer, slow living, knive, slibning og materialer. Træd ind i Langsomt Noks verden.";
const URL = `${SITE_ORIGIN}/universet`;

const FEATURED = getFeaturedStory();
const REST = STORIES.filter((s) => s.slug !== FEATURED.slug);

const HEAD = {
  meta: [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    { property: "og:title", content: TITLE },
    { property: "og:description", content: DESCRIPTION },
    { property: "og:url", content: URL },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Langsomt Nok" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: TITLE },
    { name: "twitter:description", content: DESCRIPTION },
  ],
  links: [{ rel: "canonical", href: URL }],
  scripts: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Langsomt Nok Universet",
        description: DESCRIPTION,
        url: URL,
        isPartOf: {
          "@type": "WebSite",
          name: "Langsomt Nok",
          url: SITE_ORIGIN,
        },
      }),
    },
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Forside", item: SITE_ORIGIN + "/" },
          { "@type": "ListItem", position: 2, name: "Universet", item: URL },
        ],
      }),
    },
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Langsomt Nok Universet — fortællinger",
        itemListElement: STORIES.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.title,
          url: `${SITE_ORIGIN}/universet/${s.slug}`,
        })),
      }),
    },
  ],
};

export const Route = createFileRoute("/universet")({
  head: () => HEAD,
  component: UniversetIndex,
});

function UniversetIndex() {
  const [active, setActive] = useState<RitualCategory | "Alle">("Alle");

  useEffect(() => {
    trackEvent("universet_view", { page: "universet" });
  }, []);

  const filtered = useMemo(() => {
    const list = getStoriesByCategory(active);
    return list.filter((s) => s.slug !== FEATURED.slug);
  }, [active]);

  const onChange = (cat: RitualCategory | "Alle") => {
    setActive(cat);
    trackEvent("universet_category_filter", { label: cat });
  };

  return (
    <div data-page-type="universet_hub">
      <UniversetHero
        eyebrow="Et roligt univers"
        title="Langsomt Nok Universet"
        subtitle="Fortællinger om ro, håndværk, køkkenritualer og de små bevægelser, der gør hverdagen mere nærværende."
        ctaLabel="Gå på opdagelse"
        ctaHref="#fortaellinger"
      />

      <FeaturedStoryBlock story={FEATURED} />

      <section id="fortaellinger" className="py-16 md:py-24 bg-background">
        <div className="container-calm">
          <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
            <span className="text-[10px] font-medium text-copper uppercase tracking-[0.22em]">
              Ritualspor
            </span>
            <h2 className="font-serif text-3xl md:text-4xl mt-3 mb-4 text-foreground">
              Hvor vil du begynde?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Vælg et spor, eller udforsk alle fortællinger.
            </p>
          </div>

          <div className="mb-12">
            <RitualCategoryFilter active={active} onChange={onChange} />
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground/70">Ingen fortællinger i dette spor endnu.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-x-8 md:gap-y-14">
              {filtered.map((story) => (
                <StoryCard key={story.slug} story={story} />
              ))}
            </div>
          )}
        </div>
      </section>

      {REST.length >= 3 && <CirklenSignupBlock variant="soft" />}
    </div>
  );
}
