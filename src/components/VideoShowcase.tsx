import { ArrowRight } from "lucide-react";

interface VideoShowcaseProps {
  eyebrow?: string;
  title: string;
  body: string;
  cta?: {
    label: string;
    to: string;
    dataEvent?: string;
    dataSection?: string;
    dataProduct?: string;
  };
  /** background variant of the surrounding section */
  background?: "background" | "soft" | "linen";
  /** layout: video left or right (desktop). On mobile video is always on top. */
  videoSide?: "left" | "right";
  /** poster image url (optional) */
  poster?: string;
  /** override video src */
  videoSrc?: string;
  /** compact = smaller padding (collection trust block) */
  compact?: boolean;
  /** numbered steps shown under body (copper) */
  steps?: string[];
  /** small trust pill under steps (e.g. "Tape følger med · Ingen boremaskine") */
  trustNote?: string;
}

const VIDEO_SRC = "/videos/knivholder-montering.mp4";
const VIDEO_POSTER = "/videos/knivholder-montering-poster.jpg";

export function VideoShowcase({
  eyebrow,
  title,
  body,
  cta,
  background = "background",
  videoSide = "right",
  poster = VIDEO_POSTER,
  videoSrc = VIDEO_SRC,
  compact = false,
  steps,
  trustNote,
}: VideoShowcaseProps) {
  const bgClass =
    background === "soft"
      ? "bg-soft/60"
      : background === "linen"
        ? "bg-linen/60"
        : "bg-background";

  const videoOrder =
    videoSide === "left" ? "md:order-1" : "md:order-2";
  const textOrder =
    videoSide === "left" ? "md:order-2" : "md:order-1";

  return (
    <section className={`${compact ? "py-14 md:py-20" : "section-padding"} ${bgClass}`}>
      <div className="container-calm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Video — first on mobile */}
          <div className={`order-1 ${videoOrder}`}>
            <div
              className="relative overflow-hidden bg-soft shadow-[0_10px_40px_-20px_rgba(30,30,30,0.25)] fade-in-up"
              style={{ borderRadius: "16px" }}
            >
              <video
                className="w-full h-auto block aspect-[4/5] md:aspect-[4/5] object-cover"
                src={videoSrc}
                poster={poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                disablePictureInPicture
                aria-label={title}
              />
            </div>
          </div>

          {/* Text */}
          <div className={`order-2 ${textOrder}`}>
            {eyebrow && (
              <span
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase font-medium px-2.5 py-1 rounded-full"
                style={{
                  color: "#A67C52",
                  backgroundColor: "rgba(166,124,82,0.10)",
                  border: "1px solid rgba(166,124,82,0.25)",
                }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "#A67C52" }}
                />
                {eyebrow}
              </span>
            )}
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-4 mb-5 leading-[1.1] text-foreground">
              {title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md mb-6">
              {body}
            </p>

            {steps && steps.length > 0 && (
              <ol className="space-y-3 mb-6 max-w-md">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full font-serif text-sm flex items-center justify-center leading-none"
                      style={{
                        backgroundColor: "#F8F6F3",
                        color: "#A67C52",
                        border: "1px solid rgba(166,124,82,0.35)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm md:text-[15px] text-foreground/85 leading-relaxed pt-0.5">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            )}

            {trustNote && (
              <div
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md mb-6"
                style={{
                  backgroundColor: "#F8F6F3",
                  color: "rgba(45,45,45,0.75)",
                  border: "1px solid rgba(90,59,46,0.15)",
                }}
              >
                <span style={{ color: "#4C574A" }} className="font-semibold">✓</span>
                {trustNote}
              </div>
            )}

            {cta && (
              <div>
                <a
                  href={cta.to}
                  data-event={cta.dataEvent}
                  data-section={cta.dataSection}
                  data-product={cta.dataProduct}
                  className="inline-flex items-center gap-2 rounded-md bg-cta text-cta-foreground px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-500 hover:bg-[#3F4B3D]"
                >
                  {cta.label} <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
