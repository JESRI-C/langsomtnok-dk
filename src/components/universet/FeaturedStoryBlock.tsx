import { Link } from "@tanstack/react-router";
import { ImageSlot } from "@/components/ImageSlot";
import type { UniversetStory } from "@/lib/universet";

export function FeaturedStoryBlock({ story }: { story: UniversetStory }) {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container-calm">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-[10px] font-medium text-copper uppercase tracking-[0.22em]">
            Fremhævet fortælling
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center max-w-6xl mx-auto">
          <div className="order-1 md:order-1">
            <ImageSlot
              name={story.imageSlot}
              ratio="4/5"
              motif={story.imageMotif}
              alt={story.title}
              variant="warm"
            />
          </div>
          <div className="order-2 md:order-2">
            <span className="text-[10px] font-medium text-copper uppercase tracking-[0.18em]">
              {story.ritualCategory}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight mt-3 mb-5 text-foreground">
              {story.title}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {story.excerpt}
            </p>
            <div className="flex items-center gap-5 mb-8 text-xs text-muted-foreground/70">
              <span>{story.readTime} læsetid</span>
              <span aria-hidden>·</span>
              <span>{story.ritualCategory}</span>
            </div>
            <Link
              to="/universet/$slug"
              params={{ slug: story.slug }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-cta text-cta-foreground text-sm font-medium hover:bg-cta/90 transition-colors"
            >
              Læs fortællingen
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
