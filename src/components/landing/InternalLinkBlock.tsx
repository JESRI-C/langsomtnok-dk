import { Link } from "@tanstack/react-router";

interface InternalLink {
  label: string;
  to: string;
  description?: string;
}

interface InternalLinkBlockProps {
  title?: string;
  links: InternalLink[];
  variant?: "list" | "cards";
}

export function InternalLinkBlock({ title = "Udforsk videre", links, variant = "cards" }: InternalLinkBlockProps) {
  if (variant === "list") {
    return (
      <div className="max-w-3xl">
        {title && <h3 className="font-serif text-xl mb-4">{title}</h3>}
        <div className="space-y-2">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="flex items-center gap-2 text-sm text-cta hover:text-cta/80 transition-colors py-1">
              <span>→</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="section-padding">
      <div className="container-calm">
        {title && <h2 className="font-serif text-2xl md:text-3xl mb-8 text-center">{title}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group p-5 rounded-lg border border-border hover:border-walnut/30 hover:shadow-sm transition-all duration-300"
            >
              <h3 className="font-serif text-base mb-1 group-hover:text-walnut transition-colors">{link.label}</h3>
              {link.description && <p className="text-xs text-muted-foreground">{link.description}</p>}
              <span className="text-xs text-cta mt-2 inline-block">Læs mere →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
