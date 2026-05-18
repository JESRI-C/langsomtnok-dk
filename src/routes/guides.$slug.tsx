import { createFileRoute, Link } from "@tanstack/react-router";
import { SEOArticleHero } from "@/components/landing/SEOArticleHero";
import { ProductRecommendationBlock } from "@/components/landing/ProductRecommendationBlock";
import { RelatedArticles } from "@/components/landing/RelatedArticles";
import { InternalLinkBlock } from "@/components/landing/InternalLinkBlock";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { getArticleBySlug, getRelatedArticles } from "@/lib/articles";

export const Route = createFileRoute("/guides/$slug")({
  head: ({ params }) => {
    const article = getArticleBySlug(params.slug);
    // Canonical: /universet/$slug is the primary URL for articles.
    // /guides/$slug stays accessible but points canonical to /universet/ when the article exists.
    const canonical = article
      ? `https://langsomtnok.dk/universet/${params.slug}`
      : `https://langsomtnok.dk/guides/${params.slug}`;
    const url = `https://langsomtnok.dk/guides/${params.slug}`;
    const title = article?.seoTitle || `${params.slug} — Langsomt Nok Guides`;
    const desc = article?.metaDescription || "Guide fra Langsomt Nok.";
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Forside", item: "https://langsomtnok.dk/" },
        { "@type": "ListItem", position: 2, name: "Guides", item: "https://langsomtnok.dk/guides" },
        { "@type": "ListItem", position: 3, name: article?.title || params.slug, item: canonical },
      ],
    };
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "article" },
        // Avoid indexing duplicate URL — universet is the canonical home for articles.
        ...(article ? [{ name: "robots", content: "noindex, follow" }] : []),
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    const title = slug.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
    return (
      <div className="pt-24 pb-16">
        <div className="container-calm max-w-3xl mx-auto text-center py-20">
          <h1 className="font-serif text-3xl mb-4">{title}</h1>
          <p className="text-muted-foreground mb-6">Denne guide er under udarbejdelse.</p>
          <Link to="/guides" className="text-sm text-cta">← Alle guides</Link>
        </div>
      </div>
    );
  }

  const related = getRelatedArticles(article.relatedSlugs);

  return (
    <div className="pt-24 pb-16">
      <SEOArticleHero
        title={article.title}
        intro={article.intro}
        category={article.category}
        readingTime={article.readTime}
      />

      <article className="container-calm max-w-3xl mx-auto py-12">
        <Link to="/guides" className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block">← Alle guides</Link>

        {/* Table of contents */}
        <nav className="p-5 rounded-lg bg-soft border border-border mb-12">
          <h3 className="font-serif text-base mb-3">Indhold</h3>
          <ol className="space-y-1.5">
            {article.tableOfContents.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground hover:text-cta transition-colors">
                <span className="text-copper mr-2">{i + 1}.</span>{item}
              </li>
            ))}
          </ol>
        </nav>

        {/* Article sections */}
        <div className="space-y-10">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif text-2xl mb-4">{section.heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>

        {/* Internal links to collections */}
        {article.relatedCollections.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <InternalLinkBlock
              title="Udforsk produkterne"
              links={article.relatedCollections.map((h) => ({
                label: h.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
                to: `/collections/${h}`,
              }))}
              variant="list"
            />
          </div>
        )}
      </article>

      {/* Related products */}
      <ProductRecommendationBlock title="Anbefalede produkter" />

      {/* Related articles */}
      {related.length > 0 && (
        <RelatedArticles
          articles={related.map((a) => ({
            slug: a.slug,
            title: a.title,
            category: a.category,
            readTime: a.readTime,
            image: a.image,
          }))}
        />
      )}

      <NewsletterSignup variant="dark" />
    </div>
  );
}
