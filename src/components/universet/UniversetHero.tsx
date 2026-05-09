interface UniversetHeroProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function UniversetHero({
  eyebrow = "Et roligt univers",
  title,
  subtitle,
  ctaLabel = "Gå på opdagelse",
  ctaHref = "#fortaellinger",
}: UniversetHeroProps) {
  return (
    <header className="bg-soft">
      <div className="container-calm py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center fade-in-up">
          <span className="inline-block text-[11px] font-medium text-copper uppercase tracking-[0.22em] mb-6">
            {eyebrow}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] tracking-tight text-foreground mb-7">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
            {subtitle}
          </p>
          {ctaLabel && ctaHref && (
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 text-sm font-medium text-cta hover:text-cta/80 transition-colors"
            >
              {ctaLabel}
              <span aria-hidden>↓</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
