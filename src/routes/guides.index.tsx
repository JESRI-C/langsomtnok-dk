import { createFileRoute, Link } from "@tanstack/react-router";
import { NewsletterSignup } from "@/components/NewsletterSignup";

const articles = [
  { slug: "vaelg-din-foerste-kniv", category: "Knivvalg", title: "Vælg din første kniv", intro: "En guide til det vigtigste redskab i dit køkken.", readTime: "5 min", img: null },
  { slug: "slibning-for-begyndere", category: "Slibning", title: "Slibning for begyndere", intro: "Sådan giver du dit blad nyt liv med tålmodighed og en god sten.", readTime: "8 min", img: null },
  { slug: "pleje-af-traeskaefter", category: "Pleje", title: "Pleje af træskafter", intro: "Olie, varme og tid. De tre ting, dit skaft har brug for.", readTime: "4 min", img: null },
  { slug: "damascus-staal-historien", category: "Materialer", title: "Damascus stål — historien", intro: "Lag på lag af stål. En tradition ældre end vi aner.", readTime: "6 min", img: null },
  { slug: "den-perfekte-gave", category: "Gaver", title: "Den perfekte gave", intro: "Gaver der varer længere end én aften. Og huskes længere.", readTime: "3 min", img: null },
  { slug: "langsom-mad", category: "Langsom mad", title: "Langsom mad, bedre smag", intro: "Når du giver ingredienserne tid, giver de dig mere tilbage.", readTime: "7 min", img: null },
];

export const Route = createFileRoute("/guides/")({
  head: () => ({
    meta: [
      { title: "Guides — Langsomt Nok" },
      { name: "description", content: "Guides til roligere køkkenritualer. Knivvalg, slibning, pleje og mere." },
      { property: "og:title", content: "Guides — Langsomt Nok" },
      { property: "og:description", content: "Guides til roligere køkkenritualer." },
    ],
  }),
  component: GuidesPage,
});

function GuidesPage() {
  return (
    <div className="pt-24">
      <div className="container-calm">
        <div className="max-w-2xl mb-12">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Guides til roligere køkkenritualer</h1>
          <p className="text-editorial text-muted-foreground">
            Viden, teknikker og historier for dem, der vil forstå deres redskaber bedre.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to="/guides/$slug"
              params={{ slug: article.slug }}
              className="group block"
            >
              <div className="aspect-[3/2] rounded-lg bg-linen mb-4 flex items-center justify-center overflow-hidden">
                <span className="font-serif text-lg text-muted-foreground/30">Langsomt Nok</span>
              </div>
              <span className="text-xs font-medium text-copper uppercase tracking-wider">{article.category}</span>
              <h3 className="font-serif text-xl mt-1 mb-2 group-hover:text-walnut transition-colors">{article.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{article.intro}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
                <span>{article.readTime} læsetid</span>
                <span className="text-cta font-medium">Læs guiden →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <NewsletterSignup />
    </div>
  );
}
