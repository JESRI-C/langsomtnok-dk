import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NewsletterSignup({ variant = "default" }: { variant?: "default" | "dark" }) {
  const isDark = variant === "dark";

  return (
    <section className={`section-padding ${isDark ? "bg-deep text-deep-foreground" : "bg-soft"}`}>
      <div className="container-calm max-w-2xl text-center">
        <h2 className="font-serif text-3xl md:text-4xl mb-4">Langsomt Brev</h2>
        <p className={`text-editorial mx-auto mb-8 ${isDark ? "text-deep-foreground/60" : "text-muted-foreground"}`}>
          Et øjeblik af ro i din indbakke. Guides, ritualer og fortællinger om træ, stål og tid.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="Din e-mail"
            className={`flex-1 h-12 px-4 rounded-lg border text-sm ${
              isDark
                ? "bg-deep-foreground/5 border-deep-foreground/10 text-deep-foreground placeholder:text-deep-foreground/30"
                : "bg-background border-border text-foreground placeholder:text-muted-foreground"
            } focus:outline-none focus:ring-2 focus:ring-cta/30`}
          />
          <Button variant="cta" size="lg" type="submit">
            Modtag Langsomt Brev
          </Button>
        </form>
        <p className={`text-xs mt-4 ${isDark ? "text-deep-foreground/30" : "text-muted-foreground/60"}`}>
          Du får rolige breve om køkkenritualer, pleje og nye produkter. Ingen støj.
        </p>
      </div>
    </section>
  );
}
