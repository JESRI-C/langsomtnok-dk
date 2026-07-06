export function TopHook({ label = "Sommerrabat" }: { label?: string }) {
  return (
    <div className="bg-[#2D3B26] text-[#F4F1EA]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-1 px-4 py-2.5 text-center sm:flex-row sm:gap-3 sm:py-2">
        <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-[#C9D4B5]">
          {label}
        </span>
        <span className="hidden sm:inline text-[#C9D4B5]/50" aria-hidden>•</span>
        <p className="text-sm sm:text-[15px] leading-snug">
          Spar <span className="font-semibold">120 kr</span> på knivsliberen —{" "}
          <span className="font-serif italic">379 kr</span>{" "}
          <span className="text-[#C9D4B5]/70 line-through">499 kr</span>
        </p>
        <span className="hidden sm:inline text-[#C9D4B5]/50" aria-hidden>•</span>
        <span className="text-xs text-[#C9D4B5]">Fri fragt · Sendes i dag</span>
      </div>
    </div>
  );
}
