import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Item = { name: string; tag: string; img: string };
type Props = { items: Item[]; heading?: string };

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export function HorizontalPortfolio({ items, heading = "Selected Work" }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const getScrollDistance = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    return Math.max(0, track.scrollWidth - window.innerWidth);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!wrapper || !section || !track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const raf = requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        const tween = gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            anticipatePin: 1,
            scrub: true,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            invalidateOnRefresh: true,
            onRefresh() {
              // Re-patch whenever ScrollTrigger recalculates (resize, etc.)
              const spacer = section.parentElement;
              if (spacer && spacer.classList.contains("pin-spacer")) {
                spacer.style.background = "oklch(1 0 0)";
              }
            },
          },
        });

        // Image parallax inside cards
        track.querySelectorAll<HTMLElement>("[data-port-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { scale: 1.15, x: 0 },
            {
              scale: 1,
              x: -40,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement!,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });

        // Stagger entrance using the unpinned wrapper as the trigger to avoid pin-spacer coordinate conflict
        gsap.fromTo(
          track.querySelectorAll("[data-port-card]"),
          {
            y: 80,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: wrapper,
              start: "top 80%",
              once: true,
            },
          },
        );
      }, sectionRef);

      // Patch immediately after ScrollTrigger creates the pin-spacer
      ScrollTrigger.refresh();
      const spacer = section.parentElement;
      if (spacer && spacer.classList.contains("pin-spacer")) {
        spacer.style.background = "oklch(1 0 0)";
      }

      (section as any)._gsapCtx = ctx;
    });

    return () => {
      cancelAnimationFrame(raf);
      const ctx = (sectionRef.current as any)?._gsapCtx;
      if (ctx) ctx.revert();
    };
  }, [items, getScrollDistance]);

  return (
    /*
     * Wrapper div is the primary fix:
     * GSAP replaces the section's parent with a .pin-spacer div.
     * Without this wrapper, the pin-spacer sits directly inside the page
     * and has no background. With it, bg-background always covers the gap.
     */
    <div ref={wrapperRef} className="bg-background">
      <section
        ref={sectionRef}
        className="relative h-screen overflow-hidden bg-background flex flex-col justify-between"
      >
        {/* Header */}
        <div className="w-full px-6 md:px-10 pt-10 md:pt-14 lg:pt-16 flex items-end justify-between z-10 shrink-0">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
              <span className="size-2 bg-brand rounded-full" /> {heading}
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter uppercase">
              Scroll <span className="font-serif italic font-semibold normal-case">across</span>
            </h2>
          </div>
          <span className="hidden lg:block text-[10px] font-bold uppercase tracking-widest text-foreground/40">
            Drag / scroll →
          </span>
        </div>

        {/* Scrollable track container */}
        <div className="flex-1 flex items-center min-h-0 pb-4 lg:pb-6">
          <div ref={trackRef} className="flex gap-6 md:gap-8 pl-6 md:pl-10 will-change-transform">
            {items.map((it, i) => (
              <article
                key={`${it.name}-${i}`}
                data-port-card
                className="shrink-0 flex flex-col gap-3 md:gap-4 group"
              >
                <div
                  className="
                    relative
                    w-[80vw] md:w-[42vw] lg:w-[36vw]
                    h-[52vh] sm:h-[55vh] md:h-[58vh] lg:h-[62vh]
                    min-w-60
                    bg-muted overflow-hidden rounded-2xl
                    outline outline-foreground/5
                  "
                >
                  <img
                    data-port-img
                    src={it.img}
                    alt={it.name}
                    loading={i === 0 ? "eager" : "lazy"}
                    onLoad={() => {
                      ScrollTrigger.refresh();
                    }}
                    className="w-full h-full object-cover transition-transform duration-800 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-110 will-change-transform"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/70 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest">
                    {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                      {it.name}
                    </h3>
                    <p className="text-foreground/40 uppercase text-[10px] font-bold tracking-[0.2em] mt-1 md:mt-2">
                      {it.tag}
                    </p>
                  </div>
                  <span className="size-11 md:size-13 rounded-full border border-foreground/10 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300 text-lg">
                    ↗
                  </span>
                </div>
              </article>
            ))}
            <div className="shrink-0 w-10 lg:w-24" />
          </div>
        </div>
      </section>
    </div>
  );
}
