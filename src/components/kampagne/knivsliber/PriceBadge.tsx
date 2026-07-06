export function PriceBadge({ size = "md" }: { size?: "md" | "lg" }) {
  const dim = size === "lg" ? "h-24 w-24 text-base" : "h-20 w-20 text-sm";
  return (
    <div
      className={`${dim} flex flex-col items-center justify-center rounded-full bg-[#6E7B4F] text-[#F4F1EA] shadow-md leading-tight`}
      aria-label="Sommerrabat minus 24 procent"
    >
      <span className="font-serif italic text-lg">−24%</span>
      <span className="text-[10px] tracking-[0.14em] uppercase mt-0.5">Sommer</span>
    </div>
  );
}

export function PriceLine({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-baseline gap-3 ${className}`}>
      <span className="font-serif text-3xl md:text-4xl text-current">379 kr</span>
      <span className="text-current/70 line-through text-base">499 kr</span>
    </div>
  );
}
