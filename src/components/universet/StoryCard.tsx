import { Link } from "@tanstack/react-router";
import { ImageSlot } from "@/components/ImageSlot";
import type { UniversetStory } from "@/lib/universet";

interface StoryCardProps {
  story: UniversetStory;
  size?: "default" | "compact";
}

export function StoryCard({ story, size = "default" }: StoryCardProps) {
  return (
    <Link
      to="/universet/$slug"
      params={{ slug: story.slug }}
      className="group block"
      data-story-card={story.slug}
    >
      <ImageSlot
        name={story.imageSlot}
        ratio="4/5"
        src={story.imageSrc}
        motif={story.imageMotif}
        alt={story.title}
        variant="warm"
        className="mb-5 transition-transform duration-700 group-hover:scale-[1.01]"
      />
      <span className="text-[10px] font-medium text-copper uppercase tracking-[0.18em]">
        {story.ritualCategory}
      </span>
      <h3
        className={
          size === "compact"
            ? "font-serif text-xl mt-2 mb-2 leading-snug text-foreground group-hover:text-walnut transition-colors"
            : "font-serif text-2xl mt-2 mb-3 leading-snug text-foreground group-hover:text-walnut transition-colors"
        }
      >
        {story.title}
      </h3>
      <p className="text-[15px] text-muted-foreground leading-relaxed line-clamp-3 mb-3">
        {story.excerpt}
      </p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
        <span>{story.readTime} læsetid</span>
        <span className="text-cta font-medium">Læs mere →</span>
      </div>
    </Link>
  );
}
