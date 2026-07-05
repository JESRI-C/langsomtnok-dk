/**
 * Rolig tretrins-forklaring — genbruges på alle tre landingssider.
 */
const STEPS = [
  { num: "01", title: "Grov", body: "Til knive, der trænger til en ny begyndelse." },
  { num: "02", title: "Fin", body: "Til den skarphed, du mærker i hverdagen." },
  { num: "03", title: "Polér", body: "Den rolige afslutning." },
] as const;

export function ThreeSteps({ eyebrow, heading }: { eyebrow?: string; heading?: string }) {
  return (
    <section className="bg-[#F8F6F3] py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.18em] text-[#4C574A] mb-3">
            {eyebrow}
          </p>
        )}
        {heading && (
          <h2 className="font-serif text-3xl md:text-4xl text-[#2D2D2D] mb-16 max-w-xl leading-tight">
            {heading}
          </h2>
        )}
        <div className="grid gap-10 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.num} className="border-t border-[#5A3B2E]/20 pt-6">
              <p className="font-serif text-4xl text-[#5A3B2E] mb-3">{s.num}</p>
              <h3 className="text-lg font-medium text-[#2D2D2D] mb-2">{s.title}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-xs text-foreground/50 italic">
          Følg altid produktets anvisninger ved brug.
        </p>
      </div>
    </section>
  );
}
