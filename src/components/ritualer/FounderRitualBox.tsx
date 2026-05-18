/**
 * FounderRitualBox — premium "Udvalgt af Jesper" trust card for ritual pages.
 * Two-column on desktop: left = label/title/subtitle/signature/link.
 * Right = 3 stacked recommendation rows with moss green checkmarks.
 */
interface FounderRitualBoxProps {
  title?: string;
  subtitle: string;
  bullets: string[];
  link?: { label: string; href: string };
}

export function FounderRitualBox({
  title = "Jesper anbefaler dette ritual",
  subtitle,
  bullets,
  link,
}: FounderRitualBoxProps) {
  return (
    <section className="section-padding" style={{ backgroundColor: "#F8F6F3" }}>
      <div className="container-calm max-w-5xl">
        <div
          className="rounded-[16px] p-5 md:p-7"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(90,59,46,0.18)",
            borderLeftWidth: "4px",
            borderLeftColor: "#A67C52",
          }}
          data-block="founder-ritual"
        >
          <span
            className="inline-flex items-center text-[10px] md:text-[11px] font-medium tracking-[0.18em] uppercase px-2.5 py-1 rounded-full mb-4"
            style={{
              color: "#5A3B2E",
              backgroundColor: "rgba(166,124,82,0.12)",
            }}
          >
            Udvalgt af Jesper
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-5">
            <div>
              <h3
                className="font-serif text-2xl md:text-3xl leading-[1.15] mb-3"
                style={{ color: "#2D2D2D" }}
              >
                {title}
              </h3>
              <p
                className="text-[15px] leading-relaxed italic"
                style={{ color: "rgba(45,45,45,0.78)" }}
              >
                &ldquo;{subtitle}&rdquo;
              </p>
              <p
                className="mt-4 text-sm font-medium"
                style={{ color: "#5A3B2E" }}
              >
                — Jesper, Langsomt Nok
              </p>
              {link && (
                <a
                  href={link.href}
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium border-b pb-0.5 transition-all hover:gap-2.5"
                  style={{
                    color: "#4C574A",
                    borderColor: "rgba(76,87,74,0.35)",
                  }}
                >
                  {link.label} →
                </a>
              )}
            </div>
            <ul className="space-y-2.5 md:pt-2">
              {bullets.slice(0, 3).map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-[15px] leading-snug"
                  style={{ color: "#2D2D2D" }}
                >
                  <span
                    className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold leading-none"
                    style={{
                      backgroundColor: "rgba(76,87,74,0.14)",
                      color: "#4C574A",
                    }}
                  >
                    ✓
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
