import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { Check } from "lucide-react";

export type CarouselSlide = {
  n: string;
  title: string;
  tagline: string;
  desc: string;
  bullets: string[];
  icon: ComponentType<{ className?: string }>;
};

type Props = {
  slides: CarouselSlide[];
  /** How long each slide holds before advancing, in ms. */
  duration?: number;
};

/**
 * Auto-advancing slider where the tab list doubles as the progress indicator: the active
 * tab fills a bar over the slide's dwell time, so the reader can see how long they have
 * before it moves on, and can take over by tapping.
 *
 * The fill is a CSS transition driven by a class change rather than a per-frame write, so
 * an idle carousel costs nothing. Advancing pauses while the pointer is inside or focus
 * is within, and is disabled outright under prefers-reduced-motion — there the slider
 * becomes a plain manual tab set.
 */
export function ProgressiveCarousel({ slides, duration = 5200 }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [auto, setAuto] = useState(false);
  const timer = useRef<number | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Only opt into auto-advance when motion is welcome, and only after mount so the
  // server and client agree on the first render.
  useEffect(() => {
    setAuto(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const clear = useCallback(() => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => {
    clear();
    if (!auto || paused) return;
    timer.current = window.setTimeout(() => setActive((i) => (i + 1) % slides.length), duration);
    return clear;
  }, [active, auto, paused, duration, slides.length, clear]);

  const select = (i: number) => {
    clear();
    setActive(i);
  };

  /* role="tab" promises arrow-key navigation, so honour it: move focus with the
     selection the way a tab set is expected to behave. */
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const delta =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    let next: number | null = null;
    if (delta) next = (active + delta + slides.length) % slides.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = slides.length - 1;
    if (next === null) return;
    e.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  const current = slides[active];
  const Icon = current.icon;

  return (
    <div
      className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Tab rail — horizontal scroller on phones, stacked list from lg up */}
      <div
        role="tablist"
        aria-label="Core specialties"
        onKeyDown={onKeyDown}
        className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.n}
              role="tab"
              type="button"
              id={`pc-tab-${s.n}`}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              aria-selected={isActive}
              aria-controls={`pc-panel-${s.n}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(i)}
              className={`relative shrink-0 overflow-hidden rounded-xl border px-4 py-3 text-left transition-colors duration-300 lg:w-full lg:shrink ${
                isActive
                  ? "border-brand/40 bg-background"
                  : "border-foreground/[0.07] bg-transparent hover:border-foreground/20"
              }`}
            >
              {/* Dwell-time fill. Keyed on `active` so re-selecting the same tab restarts it. */}
              <span
                aria-hidden
                key={`${s.n}-${active}-${paused}`}
                className="absolute inset-y-0 left-0 -z-10 bg-brand/8"
                style={{
                  width: isActive ? "100%" : "0%",
                  transitionProperty: "width",
                  transitionTimingFunction: "linear",
                  transitionDuration: isActive && auto && !paused ? `${duration}ms` : "0ms",
                  ...(isActive ? { transform: "translateZ(0)" } : null),
                }}
              />
              <span className="flex items-center gap-2.5">
                <span
                  className={`text-[10px] font-bold tabular-nums transition-colors ${
                    isActive ? "text-brand" : "text-foreground/30"
                  }`}
                >
                  {s.n}
                </span>
                <span className="whitespace-nowrap text-sm font-extrabold uppercase tracking-tight lg:whitespace-normal">
                  {s.title}
                </span>
              </span>
              <span className="mt-1 hidden text-xs font-light leading-snug text-foreground/50 lg:line-clamp-2 lg:block">
                {s.tagline}
              </span>
              {/* Active marker: a rule on mobile, a bar down the edge on desktop */}
              <span
                aria-hidden
                className={`absolute origin-left bg-brand transition-transform duration-500 max-lg:inset-x-0 max-lg:bottom-0 max-lg:h-0.5 lg:inset-y-0 lg:left-0 lg:w-0.5 ${
                  isActive ? "scale-100" : "scale-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div
        role="tabpanel"
        id={`pc-panel-${current.n}`}
        aria-labelledby={`pc-tab-${current.n}`}
        className="relative overflow-hidden rounded-3xl border border-foreground/[0.07] bg-muted/50 p-6 md:p-8"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-brand/8 blur-3xl"
        />
        {/* key restarts the entry transition on every change */}
        <div key={current.n} className="animate-[pcIn_500ms_ease-out]">
          <header className="mb-5 flex items-start justify-between gap-4 border-b border-foreground/[0.07] pb-5">
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] tabular-nums text-foreground/35">
                {current.n} / {String(slides.length).padStart(2, "0")}
              </span>
              <h3 className="text-2xl font-extrabold uppercase leading-tight tracking-tighter md:text-3xl">
                {current.title}
              </h3>
              <p className="text-xs font-medium text-foreground/50">{current.tagline}</p>
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
              <Icon className="size-4.5" />
            </span>
          </header>

          <p className="text-sm font-light leading-relaxed text-foreground/65">{current.desc}</p>

          <ul className="mt-5 flex flex-col gap-2.5">
            {current.bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 text-sm leading-snug text-foreground/70"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
