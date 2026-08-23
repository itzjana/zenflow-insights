import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { CircuitBackdrop } from "@/components/CircuitBackdrop";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export type ProcessStep = {
  n: string;
  phase: string;
  title: string;
  time: string;
  copy: string;
};

type Props = { steps: ProcessStep[]; eyebrow?: string; heading?: React.ReactNode };

/** Extra viewport-heights of scroll granted per step. Higher = slower advance. */
const SCROLL_PER_STEP = 0.9;

/**
 * Scroll-telling process stage.
 *
 * One full-viewport panel is pinned with `position: sticky` inside a tall wrapper, and
 * the step content advances through it as you scroll — so the section holds your place
 * while the process plays out, rather than scrolling four cards past you.
 *
 * Progress is written straight to element styles from a ScrollTrigger callback: no React
 * state per frame, so nothing re-renders while scrolling. Under prefers-reduced-motion
 * the whole thing degrades to a plain stacked list with no pinning at all.
 */
export function ProcessScrollStage({ steps, eyebrow = "Process", heading }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[];
    const rails = railRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!panels.length) return;

    const count = panels.length;

    /* Below md the stage un-pins into a plain stacked list, so there is nothing to
       cross-fade — running the same maths there faded every step but one down to
       transparent and left the list unreadable. */
    const pinned = window.matchMedia("(min-width: 768px)");

    const reset = () => {
      panels.forEach((panel) => {
        panel.style.opacity = "";
        panel.style.transform = "";
        panel.style.pointerEvents = "";
        panel.removeAttribute("aria-hidden");
      });
      rails.forEach((rail) => (rail.style.transform = "scaleX(1)"));
    };

    const apply = (progress: number) => {
      // Position along the whole sequence, e.g. 1.4 = 40% of the way from step 2 to 3
      const pos = Math.min(count - 1, Math.max(0, progress * count - 0.5));
      const active = Math.round(pos);

      panels.forEach((panel, i) => {
        const d = pos - i;
        const dist = Math.abs(d);
        // Only the nearest panel is legible; neighbours slide away and fade out
        const opacity = dist >= 1 ? 0 : 1 - dist;
        panel.style.opacity = `${opacity}`;
        panel.style.transform = `translate3d(0, ${d * -22}px, 0)`;
        panel.style.pointerEvents = dist < 0.5 ? "auto" : "none";
        panel.setAttribute("aria-hidden", dist < 0.5 ? "false" : "true");
      });

      rails.forEach((rail, i) => {
        rail.style.transform = `scaleX(${i <= active ? 1 : 0})`;
      });

      if (counterRef.current) {
        counterRef.current.textContent = String(active + 1).padStart(2, "0");
      }
    };

    let st: ScrollTrigger | null = null;

    const build = () => {
      st?.kill();
      st = null;
      if (!pinned.matches) {
        reset();
        return;
      }
      st = ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });
      apply(0);
    };

    build();
    pinned.addEventListener("change", build);
    return () => {
      pinned.removeEventListener("change", build);
      st?.kill();
    };
  }, [steps.length]);

  return (
    <section className="bg-muted/30 border-y border-foreground/[0.06]">
      {/* Wrapper height is what buys the scroll distance the pinned panel plays out over */}
      <div
        ref={wrapRef}
        style={{ height: `calc(${steps.length * SCROLL_PER_STEP + 1} * 100dvh)` }}
        className="relative max-md:!h-auto"
      >
        {/* The pinned stage. On small screens it un-pins and becomes a normal list. */}
        <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden px-5 py-20 md:px-6 max-md:static max-md:h-auto">
          {/* Scroll-driven circuit board behind the copy — decorative only */}
          <CircuitBackdrop targetRef={wrapRef} />

          <div className="relative mx-auto w-full max-w-[1128px]">
            <div className="mb-10 flex flex-col gap-4 md:mb-14">
              <span className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em]">
                <span className="size-2 rounded-full bg-brand" /> {eyebrow}
              </span>
              {heading}
            </div>

            {/* Stage: panels are stacked and cross-faded on desktop, listed on mobile */}
            <div className="relative md:h-[19rem]">
              {steps.map((s, i) => (
                <div
                  key={s.n}
                  ref={(el) => {
                    panelRefs.current[i] = el;
                  }}
                  className="grid grid-cols-1 gap-6 md:absolute md:inset-0 md:grid-cols-[auto_1fr] md:gap-14 max-md:mb-12 max-md:border-b max-md:border-foreground/10 max-md:pb-10"
                >
                  {/* Oversized index */}
                  <span className="text-6xl font-extrabold leading-none tracking-tighter text-foreground/12 md:text-[9rem]">
                    {s.n}
                  </span>

                  <div className="flex flex-col gap-4 md:max-w-2xl md:self-center">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-foreground">
                        {s.phase}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/40">
                        {s.time}
                      </span>
                    </div>
                    <h3 className="text-3xl font-extrabold uppercase leading-[1.05] tracking-tighter md:text-5xl">
                      {s.title}
                    </h3>
                    <p className="text-sm font-light leading-relaxed text-foreground/65 md:text-base">
                      {s.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress rail + counter, desktop only — on mobile the list is the progress */}
            <div className="mt-10 hidden items-center gap-6 md:flex">
              <span className="text-xs font-bold tabular-nums text-foreground/40">
                <span ref={counterRef}>01</span>
                <span className="text-foreground/25">
                  {" "}
                  / {String(steps.length).padStart(2, "0")}
                </span>
              </span>
              <div className="flex flex-1 gap-2">
                {steps.map((s, i) => (
                  <span
                    key={s.n}
                    className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/10"
                  >
                    <span
                      ref={(el) => {
                        railRefs.current[i] = el;
                      }}
                      className="block h-full origin-left rounded-full bg-brand transition-transform duration-500"
                      style={{ transform: "scaleX(0)" }}
                    />
                  </span>
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/35">
                Keep scrolling
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
