import { useState } from "react";
import { ArrowLeftRight, Check, X } from "lucide-react";
import { Reveal } from "@/components/Reveal";

type Side = "them" | "us";

type Props = {
  eyebrow?: string;
  /** Plain text before the italic accent word. */
  title: string;
  /** Rendered in the serif italic accent face. */
  accent: string;
  /** Plain text after the accent word. */
  titleEnd?: string;
  themLabel?: string;
  usLabel?: string;
  them: string[];
  us: string[];
};

/**
 * "What most agencies do" against "what we do".
 *
 * Below lg only one half is on screen and a centre control swaps between them, because
 * two columns of six lines each is more than a phone can show at once. From lg up both
 * sit side by side at equal width with no control — the original static comparison.
 *
 * Both halves stay in the DOM at every breakpoint, including the one hidden on phones: a
 * crawler has to be able to read the whole comparison, so this hides with CSS rather
 * than mounting conditionally.
 */
export function ComparisonSwap({
  eyebrow = "The difference",
  title,
  accent,
  titleEnd = "",
  themLabel = "What most agencies do",
  usLabel = "What we do",
  them,
  us,
}: Props) {
  const [focus, setFocus] = useState<Side>("us");
  const swap = () => setFocus((f) => (f === "us" ? "them" : "us"));

  return (
    <section className="relative overflow-hidden bg-brand px-5 py-12 text-white md:px-6 md:py-28">
      <div className="pointer-events-none absolute -right-32 -top-40 size-[34rem] rounded-full bg-accent/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-48 -left-40 size-[30rem] rounded-full bg-brand-soft/15 blur-[120px]" />

      <div className="relative mx-auto max-w-[1128px]">
        <Reveal className="mb-10 flex flex-col gap-4 md:mb-14">
          <span className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-white/60">
            <span className="size-2 rounded-full bg-accent" />
            {eyebrow}
          </span>
          <h2 className="max-w-3xl text-balance text-3xl font-extrabold leading-[1.05] tracking-tighter md:text-5xl">
            {title}{" "}
            <span className="font-serif font-semibold italic tracking-tight text-accent">
              {accent}
            </span>
            {titleEnd ? ` ${titleEnd}` : ""}
          </h2>
        </Reveal>

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6">
          <Panel side="them" label={themLabel} items={them} focused={focus === "them"} />
          <Panel side="us" label={usLabel} items={us} focused={focus === "us"} />

          {/* Swap control. Centred between the halves on desktop; on phones it straddles
              the bottom edge of the visible card so it never sits on top of the copy. */}
          <button
            type="button"
            onClick={swap}
            aria-label={focus === "us" ? `Show ${themLabel}` : `Show ${usLabel}`}
            className="absolute bottom-0 left-1/2 z-20 grid size-12 -translate-x-1/2 translate-y-1/2 place-items-center rounded-full border border-accent/40 bg-brand-deep text-accent shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
          >
            <ArrowLeftRight
              className={`size-5 transition-transform duration-500 ${
                focus === "us" ? "rotate-0" : "rotate-180"
              }`}
            />
          </button>
        </div>

        <p className="mt-12 text-center text-[11px] font-bold uppercase tracking-[0.25em] text-white/35 lg:mt-8">
          What We Provide
        </p>
      </div>
    </section>
  );
}

function Panel({
  side,
  label,
  items,
  focused,
}: {
  side: Side;
  label: string;
  items: string[];
  focused: boolean;
}) {
  const isUs = side === "us";
  return (
    <div
      // Only the focused half is on screen below lg; from lg up both show and the
      // focused one simply takes more of the row.
      // From lg up both halves are equal and always lit; the focus state only drives
      // the phone layout, where one of them is off screen.
      className={`relative min-w-0 lg:flex-1 lg:basis-1/2 lg:opacity-100 ${
        focused ? "" : "max-lg:hidden"
      }`}
    >
      <div
        // key restarts the slide-in so a swap reads as movement, not a swap of contents
        key={`${side}-${focused}`}
        className={`h-full overflow-hidden rounded-3xl border p-6 md:p-8 max-lg:animate-[swapIn_450ms_cubic-bezier(0.22,1,0.36,1)] ${
          isUs ? "border-accent/25 bg-brand-deep" : "border-white/10 bg-white/[0.04]"
        }`}
      >
        {isUs && (
          <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-accent/12 blur-3xl" />
        )}
        <h3
          className={`relative mb-6 text-base font-bold md:text-lg ${
            isUs ? "text-accent" : "text-white/55"
          }`}
        >
          {label}
        </h3>
        <ul className="relative flex flex-col gap-4">
          {items.map((t) => (
            <li key={t} className="flex items-start gap-3.5">
              {isUs ? (
                <Check className="mt-0.5 size-4 shrink-0 text-accent" />
              ) : (
                <X className="mt-0.5 size-4 shrink-0 text-white/35" />
              )}
              <span
                className={`text-sm font-light leading-snug md:text-base ${
                  isUs ? "text-white" : "text-white/70"
                }`}
              >
                {t}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
