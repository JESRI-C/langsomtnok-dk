import { Link } from "@tanstack/react-router";

interface SEOArticleHeroProps {
  title: string;
  intro: string;
  category: string;
  readingTime: string;
  image?: string;
}

export function SEOArticleHero({ title, intro, category, readingTime, image }: SEOArticleHeroProps) {
  return (
    <header className="section-padding bg-soft">
      <div className="container-calm max-w-3xl fade-in-up">
        <div className="flex items-center gap-3 mb-6 text-xs font-medium uppercase tracking-wider">
          <span className="text-copper">{category}</span>
          <span className="text-muted-foreground/30">·</span>
          <span className="text-muted-foreground">{readingTime} læsetid</span>
        </div>
        <h1 className="font-serif text-3xl md:text-5xl leading-[1.15] tracking-tight mb-6 text-foreground">
          {title}
        </h1>
        <p className="text-editorial text-lg text-muted-foreground mb-8">
          {intro}
        </p>
        {image && (
          <div className="aspect-[21/9] rounded-lg overflow-hidden bg-linen">
            <img src={image} alt={title} className="w-full h-full object-cover" loading="eager" />
          </div>
        )}
      </div>
    </header>
  );
}
