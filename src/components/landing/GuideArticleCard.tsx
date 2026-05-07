import { Link } from "@tanstack/react-router";
import { ImageSlot } from "@/components/ImageSlot";

interface GuideArticleCardProps {
  slug: string;
  title: string;
  intro: string;
  category: string;
  readTime: string;
  image?: string;
}

export function GuideArticleCard({ slug, title, intro, category, readTime, image }: GuideArticleCardProps) {
  return (
    <Link to="/guides/$slug" params={{ slug }} className="group block">
      <ImageSlot
        name="article-related-guide"
        ratio="3/2"
        src={image}
        motif={title}
        alt={title}
        variant="warm"
        className="mb-4"
      />
      <span className="text-[10px] font-medium text-copper uppercase tracking-wider">{category}</span>
      <h3 className="font-serif text-xl mt-1 mb-2 group-hover:text-walnut transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{intro}</p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
        <span>{readTime} læsetid</span>
        <span className="text-cta font-medium">Læs guiden →</span>
      </div>
    </Link>
  );
}
