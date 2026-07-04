import { useEffect, useRef, useState } from "react";

interface HeroVideoProps {
  src?: string;
  poster: string;
  alt?: string;
}

/**
 * Cinematic hero video background.
 * - Poster-billedet vises med det samme (statisk fallback for langsomme netværk).
 * - Video-elementet mountes først efter første paint (requestIdleCallback) og
 *   loader kun metadata ved behov — så første skærmbillede er brugbart uden
 *   at video blokerer for produktindhold.
 * - Fast aspect-ratio via absolute inset-0 forhindrer layout-shift.
 */
export function HeroVideo({ src = "/hero.mp4", poster, alt = "" }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [mountVideo, setMountVideo] = useState(false);

  useEffect(() => {
    // Mount video efter første paint så poster vises straks.
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    const schedule = w.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 400));
    const id = schedule(() => setMountVideo(true));
    return () => {
      if (typeof id === "number") clearTimeout(id);
    };
  }, []);

  useEffect(() => {
    if (!mountVideo) return;
    const v = ref.current;
    if (!v) return;
    v.play().catch(() => {
      /* autoplay blokeret — poster forbliver */
    });
  }, [mountVideo]);

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
      {/* Warm dark gradient overlay — anchors text on left, lets sunlit right breathe */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(95deg, rgba(20,14,10,0.72) 0%, rgba(28,20,14,0.55) 35%, rgba(40,28,18,0.18) 65%, rgba(60,42,24,0.05) 100%)",
        }}
      />
      {/* Subtle warm vignette for editorial depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 75% 55%, transparent 35%, rgba(20,14,10,0.25) 100%)",
        }}
      />
      {/* Bottom fade for mobile readability */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-deep/80 via-deep/30 to-transparent md:hidden" />
    </div>
  );
}
