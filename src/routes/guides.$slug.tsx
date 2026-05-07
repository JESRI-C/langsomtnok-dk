import { createFileRoute, Link } from "@tanstack/react-router";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export const Route = createFileRoute("/guides/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, ' ')} — Langsomt Nok Guides` },
    ],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

  return (
    <div className="pt-24 pb-16">
      <article className="container-calm max-w-3xl mx-auto">
        <Link to="/guides" className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block">
          ← Alle guides
        </Link>

        <div className="mb-12">
          <span className="text-xs font-medium text-copper uppercase tracking-wider">Guide</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-2 mb-4 leading-tight">{title}</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            En dybdegående guide til at forstå og forbedre dit køkkenritual.
          </p>
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground/60">
            <span>5 min læsetid</span>
            <span>·</span>
            <span>Langsomt Nok</span>
          </div>
        </div>

        <div className="aspect-video rounded-lg bg-linen mb-12 flex items-center justify-center">
          <span className="font-serif text-xl text-muted-foreground/30">Billede</span>
        </div>

        <div className="prose prose-lg max-w-none text-foreground">
          <p className="text-lg leading-relaxed text-muted-foreground mb-6">
            Et godt snit begynder før kniven rammer brættet. Det begynder med forståelsen af, hvad der gør et redskab godt. Materialet. Balancen. Den følelse, der opstår, når stål møder ingrediens med præcision.
          </p>
          <h2 className="font-serif text-2xl mt-10 mb-4">At vælge rigtigt</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Der er ingen genveje til et godt valg. Men der er viden. Og viden begynder med at stille de rigtige spørgsmål: Hvad laver du oftest? Hvad føles godt i din hånd? Hvilke materialer taler til dig?
          </p>
          <h2 className="font-serif text-2xl mt-10 mb-4">Materialet fortæller</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Damascus stål er ikke bare smukt. Det er funktionelt. Lagene af stål giver bladet en hårdhed og en fleksibilitet, der arbejder sammen. Ligesom træ og tid arbejder sammen for at give skaftet sin karakter.
          </p>
          <h2 className="font-serif text-2xl mt-10 mb-4">Pleje er en del af ritualet</h2>
          <p className="text-muted-foreground leading-relaxed">
            Pleje er ikke en pligt. Det er en måde at forlænge glæden på. En skarp kniv er en tryg kniv. Et velplejet skaft er et smukt skaft. Og begge dele kræver blot lidt tålmodighed.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <h3 className="font-serif text-xl mb-4">Relaterede guides</h3>
          <div className="flex gap-4">
            <Link to="/guides" className="text-sm text-cta hover:text-cta/80">
              Se alle guides →
            </Link>
          </div>
        </div>
      </article>
      <div className="mt-16">
        <NewsletterSignup variant="dark" />
      </div>
    </div>
  );
}
