import { Link } from "@tanstack/react-router";
import { ImageSlot } from "@/components/ImageSlot";

interface RelatedArticle {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  image?: string;
}

interface RelatedArticlesProps {
  title?: string;
  articles: RelatedArticle[];
}

export function RelatedArticles({ title = "Relaterede guides", articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="section-padding bg-soft">
      <div className="container-calm">
        <h2 className="font-serif text-2xl md:text-3xl mb-8 text-center">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {articles.map((article) => (
            <Link key={article.slug} to="/guides/$slug" params={{ slug: article.slug }} className="group block">
              <ImageSlot
                name="article-related-guide"
                ratio="3/2"
                src={article.image}
                motif={article.title}
                alt={article.title}
                variant="warm"
                className="mb-4"
              />
              <span className="text-[10px] font-medium text-copper uppercase tracking-wider">{article.category}</span>
              <h3 className="font-serif text-lg mt-1 mb-1 group-hover:text-walnut transition-colors">{article.title}</h3>
              <span className="text-xs text-muted-foreground">{article.readTime} læsetid</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
