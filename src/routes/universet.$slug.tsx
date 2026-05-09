import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ImageSlot } from "@/components/ImageSlot";
import { CirklenSignupBlock } from "@/components/universet/CirklenSignupBlock";
import { RelatedRitualProducts } from "@/components/universet/RelatedRitualProducts";
import { UniversetFAQ } from "@/components/universet/UniversetFAQ";
import { StoryCard } from "@/components/universet/StoryCard";
import { getStoryBySlug, getRelatedStories } from "@/lib/universet";
import { getArticleBySlug } from "@/lib/articles";

const SITE_ORIGIN = "https://langsomtnok.dk";

function buildHeadForStory(slug: string) {
  const story = getStoryBySlug(slug);
  if (!story) {
    return {
      meta: [{ title: "Fortælling — Langsomt Nok Universet" }],
    };
  }
  const url = `${SITE_ORIGIN}/universet/${story.slug}`;
  const title = `${story.title} — Langsomt Nok Universet`;
  const description = story.excerpt;

  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: story.title,
    description,
    datePublished: story.publishedAt,
    dateModified: story.modifiedAt,
    author: { "@type": "Organization", name: "Langsomt Nok" },
    publisher: {
      "@type": "Organization",
      name: "Langsomt Nok",
      logo: {
        "@type": "ImageObject",
        url: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/ln-material-damascus-01.png?v=1778143706",
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: story.ritualCategory,
    inLanguage: "da-DK",
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Forside", item: SITE_ORIGIN + "/" },
      { "@type": "ListItem", position: 2, name: "Universet", item: SITE_ORIGIN + "/universet" },
      { "@type": "ListItem", position: 3, name: story.title, item: url },
    ],
  };

  const scripts: Array<{ type: string; children: string }> = [
    { type: "application/ld+json", children: JSON.stringify(blogPosting) },
    { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
  ];

  if (story.faq && story.faq.length > 0) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: story.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }),
    });
  }

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: story.title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },
      { property: "og:site_name", content: "Langsomt Nok" },
      { property: "article:published_time", content: story.publishedAt },
      { property: "article:modified_time", content: story.modifiedAt },
      { property: "article:section", content: story.ritualCategory },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: story.title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts,
  };
}

export const Route = createFileRoute("/universet/$slug")({
  head: ({ params }) => buildHeadForStory(params.slug),
  component: UniversetStoryPage,
  notFoundComponent: () => (
    <div className="container-calm max-w-2xl py-32 text-center">
      <h1 className="font-serif text-3xl mb-4">Fortællingen findes ikke</h1>
      <Link to="/universet" className="text-cta">
        ← Tilbage til Universet
      </Link>
    </div>
  ),
});

function UniversetStoryPage() {
  const { slug } = Route.useParams();
  const story = getStoryBySlug(slug);
  if (!story) throw notFound();

  const article = story.articleSlug ? getArticleBySlug(story.articleSlug) : undefined;
  const related = getRelatedStories(slug, 3);

  // Indsæt citat midt i fortællingen som åndepause
  const sections = article?.sections ?? [];
  const quoteIndex = Math.floor(sections.length / 2);

  return (
    <div data-page-type="universet_story" data-story={slug}>
      {/* Hero */}
      <header className="bg-soft pt-12 md:pt-20 pb-12">
        <div className="container-calm">
          <div className="max-w-3xl mx-auto mb-10">
            <Link
              to="/universet"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <span aria-hidden>←</span> Tilbage til Universet
            </Link>
            <div className="flex items-center gap-3 mb-6 text-xs font-medium uppercase tracking-[0.18em]">
              <span className="text-copper">{story.ritualCategory}</span>
              <span className="text-muted-foreground/30">·</span>
              <span className="text-muted-foreground">{story.readTime} læsetid</span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl leading-[1.15] tracking-tight mb-6 text-foreground">
              {story.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {story.excerpt}
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <ImageSlot
              name={story.imageSlot}
              ratio="21/9"
              motif={story.imageMotif}
              alt={story.title}
              variant="warm"
              priority
            />
          </div>
        </div>
      </header>

      {/* Body */}
      <article className="bg-background">
        <div className="container-calm">
          <div className="mx-auto max-w-[760px] py-14 md:py-20">
            {sections.length === 0 && (
              <p className="text-lg text-muted-foreground leading-[1.85]">
                {story.excerpt}
              </p>
            )}

            {sections.map((section, i) => (
              <div key={section.heading}>
                {i === quoteIndex && story.quote && (
                  <figure className="my-12 md:my-16 border-l-2 border-copper/40 pl-6 md:pl-8">
                    <blockquote className="font-serif text-2xl md:text-3xl italic leading-snug text-foreground/90">
                      “{story.quote}”
                    </blockquote>
                  </figure>
                )}
                <section className="mb-10 md:mb-14">
                  <h2 className="font-serif text-2xl md:text-3xl mb-5 mt-12 first:mt-0 leading-snug text-foreground">
                    {section.heading}
                  </h2>
                  <p className="text-[17px] md:text-lg text-foreground/75 leading-[1.85]">
                    {section.content}
                  </p>
                </section>
              </div>
            ))}

            {sections.length > 0 && quoteIndex >= sections.length && story.quote && (
              <figure className="my-12 md:my-16 border-l-2 border-copper/40 pl-6 md:pl-8">
                <blockquote className="font-serif text-2xl md:text-3xl italic leading-snug text-foreground/90">
                  “{story.quote}”
                </blockquote>
              </figure>
            )}

            <div
              aria-hidden
              className="h-px w-24 mx-auto my-16 bg-foreground/10"
            />
          </div>
        </div>
      </article>

      {/* Det hører til ritualet */}
      {story.relatedProductQuery && (
        <RelatedRitualProducts
          title={story.relatedProductBlockTitle ?? "Det hører til ritualet"}
          query={story.relatedProductQuery}
          limit={4}
          ctaLabel="Se ritualet"
        />
      )}

      {/* FAQ */}
      {story.faq && story.faq.length > 0 && (
        <UniversetFAQ items={story.faq} title="Korte svar" />
      )}

      {/* Cirklen */}
      <CirklenSignupBlock variant="soft" />

      {/* Relaterede fortællinger */}
      {related.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container-calm">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <span className="text-[10px] font-medium text-copper uppercase tracking-[0.22em]">
                Læs videre
              </span>
              <h2 className="font-serif text-2xl md:text-3xl mt-3 text-foreground">
                Flere fortællinger fra Universet
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-x-8 md:gap-y-14">
              {related.map((s) => (
                <StoryCard key={s.slug} story={s} size="compact" />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
