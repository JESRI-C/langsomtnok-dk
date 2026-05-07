interface ProductSpecificationTableProps {
  title?: string;
  specs: Array<{ label: string; value: string }>;
}

export function ProductSpecificationTable({ title = "Specifikationer", specs }: ProductSpecificationTableProps) {
  return (
    <div className="max-w-3xl">
      <h2 className="font-serif text-2xl mb-6">{title}</h2>
      <div className="border border-border rounded-lg overflow-hidden">
        {specs.map((spec, i) => (
          <div
            key={spec.label}
            className={`flex justify-between py-3.5 px-5 text-sm ${
              i % 2 === 0 ? "bg-soft/30" : "bg-transparent"
            } ${i > 0 ? "border-t border-border/50" : ""}`}
          >
            <span className="text-muted-foreground font-medium">{spec.label}</span>
            <span className="text-foreground text-right">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
