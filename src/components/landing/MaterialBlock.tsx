import { ImageSlot } from "@/components/ImageSlot";

interface MaterialBlockProps {
  title?: string;
  subtitle?: string;
  materials: Array<{
    name: string;
    description: string;
    imageSlotName: string;
    motif: string;
    src?: string;
    alt?: string;
  }>;
  variant?: "light" | "dark";
}

export function MaterialBlock({ title = "Materialerne bag ritualet", subtitle, materials, variant = "dark" }: MaterialBlockProps) {
  const isDark = variant === "dark";

  return (
    <section className={`section-padding ${isDark ? "bg-deep text-deep-foreground" : ""}`}>
      <div className="container-calm">
        <h2 className={`font-serif text-3xl md:text-4xl mb-4 text-center ${isDark ? "" : ""}`}>{title}</h2>
        {subtitle && (
          <p className={`text-center mb-12 max-w-lg mx-auto ${isDark ? "text-deep-foreground/50" : "text-muted-foreground"}`}>{subtitle}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {materials.map((mat) => (
            <div key={mat.name} className="group">
              <ImageSlot
                name={mat.imageSlotName}
                ratio="1/1"
                src={mat.src}
                motif={mat.motif}
                alt={mat.alt || mat.name}
                variant={isDark ? "dark" : "warm"}
                className="mb-4"
              />
              <h3 className="font-serif text-lg mb-1">{mat.name}</h3>
              <p className={`text-sm ${isDark ? "text-deep-foreground/50" : "text-muted-foreground"}`}>{mat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
