import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { Check } from "lucide-react";

import { Reveal } from "@/components/Reveal";

export type Capability = {
  n: string;
  title: string;
  tagline: string;
  desc: string;
  bullets: string[];
  icon: ComponentType<{ className?: string }>;
};

type Props = {
  items: Capability[];
  /** How long each item holds before advancing on phones, in ms. */
  duration?: number;
};

/** The layout switches at lg — above it every card is on screen at once. */
const WIDE = "(min-width: 1024px)";

/**
 * The capability cards, presented two different ways from one copy of the content.
 *
 * Below lg it is a progressive carousel: a rail of tabs where the active one fills over
 * its dwell time, and a single card on screen. From lg up every card is shown in a plain
 * scrolling column — the original layout — and the rail is dropped entirely.
 *
 * The cards are rendered once and hidden with CSS rather than conditionally mounted, so
 * the page ships one copy of the text and a crawler sees all six regardless of viewport.
 * Auto-advance is disabled wherever the cards are all visible anyway, and under
 * prefers-reduced-motion.
 */
export function CapabilityShowcase({ items, duration = 5200 }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const timer = useRef<number | null>(null);

  // Advancing is pointless when every card is already on screen, so it is bound to the
  // narrow layout only. Resolved after mount so SSR and the client agree.
  useEffect(() => {
    const wide = window.matchMedia(WIDE);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAdvancing(!wide.matches && !reduce.matches);
    sync();
    wide.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  const clear = useCallback(() => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => {
    clear();
    if (!advancing || paused) return;
    timer.current = window.setTimeout(() => setActive((i) => (i + 1) % items.length), duration);
    return clear;
  }, [active, advancing, paused, duration, items.length, clear]);

  return (
    <div
      className="flex flex-col gap-6"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Tab rail — phones and tablets only */}
      <div
        role="tablist"
        aria-label="Core specialties"
        className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
      >
        {items.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.n}
              role="tab"
              type="button"
              id={`cap-tab-${s.n}`}
              aria-selected={isActive}
              aria-controls={`cap-card-${s.n}`}
              onClick={() => {
                clear();
                setActive(i);
              }}
              className={`relative shrink-0 overflow-hidden rounded-xl border px-4 py-2.5 text-left transition-colors duration-300 ${
                isActive
                  ? "border-brand/40 bg-background"
                  : "border-foreground/[0.07] hover:border-foreground/20"
              }`}
            >
              {/* Dwell-time fill. Keyed so re-selecting the same tab restarts it. */}
              <span
                aria-hidden
                key={`${s.n}-${active}-${paused}-${advancing}`}
                className="absolute inset-y-0 left-0 -z-10 bg-brand/10"
                style={{
                  width: isActive ? "100%" : "0%",
                  transitionProperty: "width",
                  transitionTimingFunction: "linear",
                  transitionDuration: isActive && advancing && !paused ? `${duration}ms` : "0ms",
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
                <span className="whitespace-nowrap text-sm font-extrabold uppercase tracking-tight">
                  {s.title}
                </span>
              </span>
              <span
                aria-hidden
                className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-brand transition-transform duration-500 ${
                  isActive ? "scale-100" : "scale-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      {items.map((p, i) => {
        const Icon = p.icon;
        const isActive = i === active;
        return (
          /* The scroll reveal is confined to the wide layout. Below lg only one card is
             displayed at a time, and a hidden card never trips a scroll trigger — so a
             revealed card stayed at opacity 0 after a tab switch and looked like it was
             still loading. There the card just appears, with a short entry of its own. */
          <Reveal
            key={p.n}
            delay={0.05}
            media={WIDE}
            className={isActive ? undefined : "max-lg:hidden"}
          >
            <article
              id={`cap-card-${p.n}`}
              className="group rounded-3xl border border-foreground/[0.07] bg-muted/60 p-6 transition-colors hover:border-brand/40 md:p-8 max-lg:animate-[pcIn_320ms_ease-out]"
            >
              <header className="mb-5 flex items-start justify-between gap-4 border-b border-foreground/[0.07] pb-5">
                <div className="flex min-w-0 flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] tabular-nums text-foreground/35">
                    {p.n} / {String(items.length).padStart(2, "0")}
                  </span>
                  <h3 className="text-2xl font-extrabold uppercase leading-tight tracking-tighter md:text-3xl">
                    {p.title}
                  </h3>
                  <p className="text-xs font-medium text-foreground/50">{p.tagline}</p>
                </div>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-foreground/10 text-foreground/40 transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                  <Icon className="size-4.5" />
                </span>
              </header>

              <p className="text-sm font-light leading-relaxed text-foreground/65">{p.desc}</p>

              <ul className="mt-5 flex flex-col gap-2.5">
                {p.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-sm leading-snug text-foreground/70"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
