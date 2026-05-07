import { ImageSlot } from "@/components/ImageSlot";

interface SEOArticleHeroProps {
  title: string;
  intro: string;
  category: string;
  readingTime: string;
  imageSlotName?: string;
  imageMotif?: string;
  imageSrc?: string;
}

export function SEOArticleHero({ title, intro, category, readingTime, imageSlotName, imageMotif, imageSrc }: SEOArticleHeroProps) {
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
        <ImageSlot
          name={imageSlotName || "article-hero"}
          ratio="21/9"
          src={imageSrc}
          motif={imageMotif || title}
          alt={title}
          variant="warm"
        />
      </div>
    </header>
  );
}
