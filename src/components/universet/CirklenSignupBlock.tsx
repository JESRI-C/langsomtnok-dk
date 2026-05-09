import { Link } from "@tanstack/react-router";

interface CirklenSignupBlockProps {
  variant?: "soft" | "deep";
}

export function CirklenSignupBlock({ variant = "soft" }: CirklenSignupBlockProps) {
  const isDeep = variant === "deep";
  return (
    <section
      className={
        "relative overflow-hidden py-20 md:py-28 " +
        (isDeep ? "bg-deep text-deep-foreground" : "bg-soft text-foreground")
      }
      data-block="cirklen-signup"
    >
      {/* Subtil cirkelgrafik */}
      <div
        aria-hidden
        className={
          "pointer-events-none absolute -right-32 -top-24 w-[420px] h-[420px] rounded-full border " +
          (isDeep ? "border-deep-foreground/10" : "border-foreground/10")
        }
      />
      <div
        aria-hidden
        className={
          "pointer-events-none absolute -left-40 -bottom-32 w-[520px] h-[520px] rounded-full border " +
          (isDeep ? "border-deep-foreground/8" : "border-foreground/8")
        }
      />

      <div className="container-calm relative">
        <div className="max-w-2xl mx-auto text-center">
          <span
            className={
              "text-[11px] font-medium uppercase tracking-[0.22em] " +
              (isDeep ? "text-copper" : "text-copper")
            }
          >
            Langsomt Cirklen
          </span>
          <h2
            className={
              "font-serif text-3xl md:text-4xl mt-4 mb-6 leading-tight " +
              (isDeep ? "text-deep-foreground" : "text-foreground")
            }
          >
            Bliv en del af Langsomt Cirklen
          </h2>
          <p
            className={
              "text-base md:text-lg leading-relaxed mb-9 " +
              (isDeep ? "text-deep-foreground/70" : "text-muted-foreground")
            }
          >
            Et stille fællesskab for dig, der værdsætter tid, håndværk og ritualer i hverdagen.
            Få guides, fortællinger og små øjeblikke af ro direkte i din indbakke.
          </p>
          <Link
            to="/cirklen"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-md bg-cta text-cta-foreground text-sm font-medium hover:bg-cta/90 transition-colors"
            data-cta="cirklen-from-universet"
          >
            Træd ind i Cirklen
            <span aria-hidden>→</span>
          </Link>
          <p
            className={
              "text-xs mt-4 " +
              (isDeep ? "text-deep-foreground/40" : "text-muted-foreground/60")
            }
          >
            Ingen støj. Kun ro.
          </p>
        </div>
      </div>
    </section>
  );
}
