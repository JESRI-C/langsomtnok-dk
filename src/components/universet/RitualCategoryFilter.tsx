import { RITUAL_CATEGORIES, type RitualCategory } from "@/lib/universet";

interface Props {
  active: RitualCategory | "Alle";
  onChange: (cat: RitualCategory | "Alle") => void;
}

export function RitualCategoryFilter({ active, onChange }: Props) {
  const options: Array<RitualCategory | "Alle"> = ["Alle", ...RITUAL_CATEGORIES];
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3" role="tablist" aria-label="Ritualspor">
      {options.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat)}
            className={
              "px-4 py-2 rounded-full text-[13px] tracking-wide transition-all border " +
              (isActive
                ? "bg-cta text-cta-foreground border-cta"
                : "bg-transparent text-foreground/70 border-border/60 hover:border-cta/40 hover:text-foreground")
            }
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
