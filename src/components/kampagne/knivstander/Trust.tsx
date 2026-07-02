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
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#6E7B4F]">
            En hilsen fra grundlæggeren
          </p>
          <blockquote className="mt-5 font-serif italic text-xl md:text-2xl text-[#2D2D2D] leading-snug">
            "Jeg har den her, fordi jeg var træt af at ankomme til sommerhuset
            og skulle skære tomater med en sløv brødkniv. Nu står min egen
            magnetiske stander på terrassebordet — og knivene følger med, hvor
            end sommeren fører hen."
          </blockquote>
          <footer className="mt-5 text-xs not-italic text-[#2D2D2D]/60 tracking-wide">
            — Jesper, indehaver af Langsomt Nok
          </footer>
        </div>

      </div>
    </section>
  );
}
