/**
 * FounderNote — "Udvalgt af Jesper" personal quote block.
 * Builds trust by positioning brand as a curator.
 */

interface FounderNoteProps {
  quote: string;
  productType?: string;
}

export function FounderNote({ quote, productType }: FounderNoteProps) {
  return (
    <section className="mt-16 md:mt-20 max-w-3xl">
      <div className="p-8 md:p-10 rounded-[18px] bg-linen/50 border border-border/40">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-walnut/15 flex items-center justify-center flex-shrink-0">
            <span className="font-serif text-walnut text-lg">J</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-copper mb-0.5">Udvalgt af Jesper</p>
            <p className="text-xs text-muted-foreground">Grundlægger, Langsomt Nok</p>
          </div>
        </div>
        <blockquote className="font-serif text-lg md:text-xl leading-[1.5] text-foreground/90 italic">
          «{quote}»
        </blockquote>
        {productType && (
          <p className="mt-4 text-xs text-muted-foreground">Om denne {productType.toLowerCase()}</p>
        )}
      </div>
    </section>
  );
}
