interface Props {
  imageUrl: string;
  alt: string;
  quote: string;
  attribution?: string;
  eyebrow?: string;
}

const trustItems = [
  "Gratis fragt i DK",
  "Levering 1–3 hverdage",
  "Dansk kundeservice",
  "Tilfredshedsgaranti",
];

export function Trust({ imageUrl, alt, quote, attribution = "— Jesper, indehaver af Langsomt Nok", eyebrow = "En hilsen fra grundlæggeren" }: Props) {
  return (
    <section className="bg-[#EDE8DC]">
      <div className="w-full">
        <img
          src={imageUrl}
          alt={alt}
          className="h-[380px] md:h-[520px] w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="px-6 py-14 md:py-20">
        <ul className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[#2D2D2D]/80">
          {trustItems.map((t, i) => (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-[#6E7B4F]" aria-hidden>·</span>}
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-12 max-w-2xl text-center">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#6E7B4F]">{eyebrow}</p>
          <blockquote className="mt-5 font-serif italic text-xl md:text-2xl text-[#2D2D2D] leading-snug">
            "{quote}"
          </blockquote>
          <footer className="mt-5 text-xs not-italic text-[#2D2D2D]/60 tracking-wide">
            {attribution}
          </footer>
        </div>
      </div>
    </section>
  );
}
