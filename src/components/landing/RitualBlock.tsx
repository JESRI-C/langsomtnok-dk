import { Link } from "@tanstack/react-router";

interface RitualChoice {
  title: string;
  description: string;
  to: string;
  icon: string;
}

interface RitualBlockProps {
  title?: string;
  choices?: RitualChoice[];
}

const DEFAULT_CHOICES: RitualChoice[] = [
  { title: "Jeg vil starte rigtigt", description: "De vigtigste redskaber til et godt fundament.", to: "/pages/den-forste-rigtige-kokkekniv", icon: "🔪" },
  { title: "Jeg vil pleje det, jeg har", description: "Olie, sten og teknikker til vedligehold.", to: "/pages/sadan-holder-du-din-kniv-skarp", icon: "🫧" },
  { title: "Jeg leder efter en gave", description: "Gaver der varer længere end én aften.", to: "/pages/gave-til-madelskeren", icon: "🎁" },
  { title: "Jeg vil samle et helt ritual", description: "Det komplette sæt for den dedikerede.", to: "/shop", icon: "✨" },
];

export function RitualBlock({ title = "Find dit køkkenritual", choices = DEFAULT_CHOICES }: RitualBlockProps) {
  return (
    <section className="section-padding bg-linen">
      <div className="container-calm">
        <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {choices.map((choice) => (
            <Link
              key={choice.title}
              to={choice.to}
              className="group p-6 rounded-lg bg-background hover:shadow-md transition-all duration-300 border border-border/50"
            >
              <span className="text-2xl mb-4 block">{choice.icon}</span>
              <h3 className="font-serif text-lg mb-2 group-hover:text-walnut transition-colors">{choice.title}</h3>
              <p className="text-sm text-muted-foreground">{choice.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
