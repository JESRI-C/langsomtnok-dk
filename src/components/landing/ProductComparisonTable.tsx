interface ProductComparisonTableProps {
  title?: string;
  subtitle?: string;
  headers: string[];
  rows: Array<{ label: string; values: string[] }>;
}

export function ProductComparisonTable({ title, subtitle, headers, rows }: ProductComparisonTableProps) {
  return (
    <section className="section-padding">
      <div className="container-calm max-w-4xl mx-auto">
        {title && <h2 className="font-serif text-2xl md:text-3xl mb-3 text-center">{title}</h2>}
        {subtitle && <p className="text-muted-foreground text-center mb-8 text-editorial mx-auto">{subtitle}</p>}
        <div className="overflow-x-auto">
          <table className="w-full border border-border rounded-lg overflow-hidden text-sm">
            <thead>
              <tr className="bg-soft">
                <th className="text-left p-4 font-medium text-muted-foreground border-b border-border" />
                {headers.map((h) => (
                  <th key={h} className="text-left p-4 font-serif font-medium border-b border-border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-transparent" : "bg-soft/30"}>
                  <td className="p-4 font-medium text-muted-foreground border-b border-border/50">{row.label}</td>
                  {row.values.map((val, j) => (
                    <td key={j} className="p-4 border-b border-border/50">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
