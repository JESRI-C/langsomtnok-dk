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
  poster,
  videoSrc = VIDEO_SRC,
  compact = false,
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
              <span className="text-[11px] tracking-[0.25em] uppercase text-copper">
                {eyebrow}
              </span>
            )}
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-3 mb-5 leading-[1.1] text-foreground">
              {title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md mb-8">
              {body}
            </p>
            {cta && (
              <a
                href={cta.to}
                data-event={cta.dataEvent}
                data-section={cta.dataSection}
                data-product={cta.dataProduct}
                className="inline-flex items-center gap-2 rounded-md bg-cta text-cta-foreground px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-500 hover:bg-[#3F4B3D]"
              >
                {cta.label} <ArrowRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
