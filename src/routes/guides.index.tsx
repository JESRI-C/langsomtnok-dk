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

      {/* Dybdegående guider — landing pages */}
      <section className="section-padding bg-soft border-t border-border">
        <div className="container-calm">
          <div className="max-w-2xl mb-10">
            <span className="text-[10px] font-medium text-copper uppercase tracking-wider">Dybdegående guider</span>
            <h2 className="font-serif text-3xl md:text-4xl mt-2 mb-3">Tematiske universer</h2>
            <p className="text-muted-foreground">Længere fortællinger samlet i ro — om knivholdere, slibning, keramik og gaver.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LANDING_GUIDES.map((g) => (
              <Link
                key={g.to}
                to={g.to}
                className="group block p-6 rounded-lg border border-border bg-background hover:border-cta transition-colors"
              >
                <span className="text-[10px] font-medium text-copper uppercase tracking-wider">{g.category}</span>
                <h3 className="font-serif text-xl mt-2 mb-2 group-hover:text-walnut transition-colors">{g.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{g.description}</p>
                <span className="text-xs text-cta font-medium">Læs guiden →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSignup />
    </div>
  );
}

const LANDING_GUIDES: Array<{ to: string; title: string; description: string; category: string }> = [
  { to: "/pages/knivholder-til-koekkenet", title: "Knivholderen, der samler køkkenet", description: "Hvorfor magnetiske holdere giver kniven et hjem — og dig overblik.", category: "Knivholdere" },
  { to: "/pages/hvilken-knivholder-skal-jeg-vaelge", title: "Hvilken knivholder skal jeg vælge?", description: "Magnetisk væglist, knivblok eller stander — find den rette til dit køkken.", category: "Knivholdere" },
  { to: "/pages/slibesten-guide", title: "Slibesten — den rolige guide", description: "Grit, teknik og det 5-trins ritual, der holder kniven skarp.", category: "Slibning" },
  { to: "/pages/saadan-sliber-du-din-kniv", title: "Sådan sliber du din kniv", description: "En tålmodig, video-baseret introduktion til slibning trin for trin.", category: "Slibning" },
  { to: "/pages/haandlavet-keramik", title: "Håndlavet keramik fra Susan Riel", description: "Fortællingen om leret, hænderne og det stille håndværk.", category: "Keramik" },
  { to: "/pages/sommerbord-med-keramik", title: "Sommerbord med keramik", description: "Sæsonens rolige borddækning — keramik, lin og lys.", category: "Keramik" },
  { to: "/pages/gaver-med-ro", title: "Gaver med ro", description: "Gaver, der bliver brugt — fundet efter pris og modtager.", category: "Gaver" },
  { to: "/pages/koekkenet-som-fristed", title: "Køkkenet som fristed", description: "Langsomt Noks manifest og indgangen til hele universet.", category: "Brand" },
];
