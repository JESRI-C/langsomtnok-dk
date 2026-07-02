import sectionImg from "@/assets/knivstander/IMG_1310.jpg.asset.json";

const trustItems = [
  "Gratis fragt i DK",
  "Levering 1–3 hverdage",
  "Dansk kundeservice",
  "Tilfredshedsgaranti",
];

export function Trust() {
  return (
    <section className="bg-[#EDE8DC]">
      <div className="w-full">
        <img
          src={sectionImg.url}
          alt="Enkelt olivenknivsblad hviler i den magnetiske knivstander"
          className="h-[380px] md:h-[520px] w-full object-cover"
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
          <div className="flex justify-center gap-1 text-[#6E7B4F]" aria-label="5 stjerner">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <div className="mt-6 space-y-6">
            {/* PLACEHOLDER — indsæt rigtige anmeldelser her */}
            <blockquote className="font-serif italic text-lg md:text-xl text-[#2D2D2D] leading-snug">
              "[Placeholder — indsæt rigtig kundeanmeldelse her]"
              <footer className="mt-2 text-xs not-italic text-[#2D2D2D]/50 tracking-wide">
                — Navn, By (placeholder)
              </footer>
            </blockquote>
            <blockquote className="font-serif italic text-lg md:text-xl text-[#2D2D2D] leading-snug">
              "[Placeholder — indsæt rigtig kundeanmeldelse her]"
              <footer className="mt-2 text-xs not-italic text-[#2D2D2D]/50 tracking-wide">
                — Navn, By (placeholder)
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
