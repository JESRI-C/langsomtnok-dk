interface Point {
  problem: string;
  solution: string;
}

interface Props {
  heading: React.ReactNode;
  points: Point[];
  footnote?: string;
}

export function ProblemSolution({ heading, points, footnote }: Props) {
  return (
    <section className="bg-[#F4F1EA] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-serif text-3xl md:text-4xl text-[#2D2D2D] text-center leading-tight">
          {heading}
        </h2>
        <ul className="mt-14 space-y-8">
          {points.map((p, i) => (
            <li key={i} className="flex gap-5 md:gap-7">
              <span className="font-serif italic text-2xl text-[#6E7B4F] w-8 shrink-0 leading-none pt-1">
                0{i + 1}
              </span>
              <div>
                <p className="text-[#2D2D2D]/60 text-sm md:text-base">{p.problem}</p>
                <p className="mt-1 font-serif text-lg md:text-xl text-[#2D2D2D] leading-snug">
                  {p.solution}
                </p>
              </div>
            </li>
          ))}
        </ul>
        {footnote && (
          <p className="mt-14 text-center text-xs text-[#2D2D2D]/60 italic">{footnote}</p>
        )}
      </div>
    </section>
  );
}
