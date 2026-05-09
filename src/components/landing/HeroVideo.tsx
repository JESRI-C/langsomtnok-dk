import { useEffect, useRef } from "react";

interface HeroVideoProps {
  src?: string;
  poster: string;
  alt?: string;
}

/**
 * Cinematic hero video background.
 * - autoplay, muted, loop, playsinline
 * - falls back to poster image if video unavailable
 * - warm dark gradient overlay (left → right)
 */
export function HeroVideo({ src = "/hero.mp4", poster, alt = "" }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.play().catch(() => {
      /* autoplay blocked — poster remains */
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-deep">
      <video
        ref={ref}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={alt}
      >
        <source src={src} type="video/mp4" />
      </video>
      {/* Warm dark gradient overlay — left to right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(20,15,12,0.78) 0%, rgba(30,22,18,0.55) 45%, rgba(40,28,20,0.20) 100%)",
        }}
      />
      {/* Subtle bottom fade for text grounding on mobile */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-deep/70 to-transparent md:hidden" />
    </div>
  );
}
