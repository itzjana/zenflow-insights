import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
  /** Rendered above the track, inside the pinned viewport. */
  header?: ReactNode;
  /** Only pin at or below this width. Defaults to mobile-only. */
  maxWidth?: number;
  className?: string;
};

/**
 * Pins a full-height section and translates its track sideways as you scroll — the same
 * mechanism as the Selected Work strip, extracted so other sections can reuse it.
 *
 * Only active at or below `maxWidth`; above that the track is a plain flex row so a
 * desktop layout can take over. The pin is torn down and rebuilt on breakpoint changes,
 * because a stale pin-spacer is what strands scroll position between layouts.
 */
export function PinnedHorizontal({ children, header, maxWidth = 1023, className }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const distance = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    return Math.max(0, track.scrollWidth - window.innerWidth);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);
    let ctx: gsap.Context | null = null;
    let raf = 0;

    const build = () => {
      ctx?.revert();
      ctx = null;
      if (!mq.matches) return;

      // One frame of grace so images have laid out and scrollWidth is real.
      raf = requestAnimationFrame(() => {
        ctx = gsap.context(() => {
          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              pin: true,
              anticipatePin: 1,
              scrub: true,
              start: "top top",
              end: () => `+=${distance()}`,
              invalidateOnRefresh: true,
            },
          });
        }, sectionRef);
        ScrollTrigger.refresh();
      });
    };

    build();
    mq.addEventListener("change", build);

    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", build);
      ctx?.revert();
    };
  }, [distance, maxWidth]);

  return (
    // The wrapper keeps a background behind the pin-spacer GSAP injects.
    <div ref={wrapperRef} className={`bg-transparent ${className ?? ""}`}>
      <div
        ref={sectionRef}
        className="relative flex flex-col justify-center lg:block lg:h-auto lg:overflow-visible max-lg:h-dvh max-lg:overflow-hidden"
      >
        {header}
        <div className="min-h-0 flex-1 max-lg:flex max-lg:items-center">
          <div ref={trackRef} className="flex gap-4 will-change-transform max-lg:pl-5 lg:contents">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
