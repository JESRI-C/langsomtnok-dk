import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { GuideArticleCard } from "@/components/landing/GuideArticleCard";
import { ARTICLES, ARTICLE_CATEGORIES } from "@/lib/articles";

export const Route = createFileRoute("/guides/")({
  head: () => ({
    meta: [
      { title: "Guides til roligere køkkenritualer — Langsomt Nok" },
      { name: "description", content: "Guides til roligere køkkenritualer. Knivvalg, slibning, pleje, materialer, gaver og langsom mad." },
      { property: "og:title", content: "Guides til roligere køkkenritualer — Langsomt Nok" },
      { property: "og:description", content: "Viden, teknikker og historier for dem, der vil forstå deres redskaber bedre." },
    ],
  }),
  component: GuidesPage,
});

function GuidesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredArticles = activeCategory
    ? ARTICLES.filter((a) => a.category === activeCategory)
    : ARTICLES;

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="section-padding bg-soft">
        <div className="container-calm">
          <div className="max-w-2xl fade-in-up">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Guides til roligere køkkenritualer</h1>
            <p className="text-editorial text-muted-foreground">
              Viden, teknikker og historier for dem, der vil forstå deres redskaber bedre.
            </p>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="py-6 border-b border-border">
        <div className="container-calm">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                !activeCategory ? "bg-cta text-cta-foreground" : "bg-soft text-muted-foreground hover:text-foreground"
              }`}
            >
              Alle
            </button>
            {ARTICLE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  activeCategory === cat ? "bg-cta text-cta-foreground" : "bg-soft text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section className="section-padding">
        <div className="container-calm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <GuideArticleCard
                key={article.slug}
                slug={article.slug}
                title={article.title}
                intro={article.intro}
                category={article.category}
                readTime={article.readTime}
                image={article.image}
              />
            ))}
          </div>
          {filteredArticles.length === 0 && (
            <p className="text-center text-muted-foreground py-12">Ingen guides i denne kategori endnu.</p>
          )}
        </div>
      </section>

      <NewsletterSignup />
    </div>
  );
}
