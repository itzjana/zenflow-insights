import { Check, X } from "lucide-react";
import { Reveal } from "@/components/Reveal";

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
 * Two-column "what most agencies do vs what we do" contrast panel.
 * Dark surface on purpose — it is the one place lime reads at full strength.
 */
export function ComparisonSection({
  eyebrow = "The difference",
  title,
  accent,
  titleEnd = "",
  themLabel = "What most agencies do",
  usLabel = "What we do",
  them,
  us,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-brand px-5 md:px-6 py-20 md:py-28 text-white">
      <div className="pointer-events-none absolute -top-40 -right-32 size-[34rem] rounded-full bg-accent/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-48 -left-40 size-[30rem] rounded-full bg-brand-soft/15 blur-[120px]" />

      <div className="relative max-w-[1128px] mx-auto">
        <Reveal className="mb-10 md:mb-14 flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4 text-white/60">
            <span className="size-2 rounded-full bg-accent" />
            {eyebrow}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter leading-[1.05] max-w-3xl text-balance">
            {title}{" "}
            <span className="font-serif italic font-semibold tracking-tight text-accent">
              {accent}
            </span>
            {titleEnd ? ` ${titleEnd}` : ""}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {/* Them */}
          <Reveal>
            <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
              <h3 className="text-base md:text-lg font-bold text-white/55 mb-6">{themLabel}</h3>
              <ul className="flex flex-col gap-4">
                {them.map((t) => (
                  <li key={t} className="flex items-start gap-3.5">
                    <X className="mt-0.5 size-4 shrink-0 text-white/35" />
                    <span className="text-sm md:text-base font-light leading-snug text-white/70">
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Us */}
          <Reveal delay={0.1}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-accent/25 bg-brand-deep p-6 md:p-8">
              <div className="pointer-events-none absolute -right-24 -bottom-24 size-72 rounded-full bg-accent/12 blur-3xl" />
              <h3 className="relative text-base md:text-lg font-bold text-accent mb-6">
                {usLabel}
              </h3>
              <ul className="relative flex flex-col gap-4">
                {us.map((t) => (
                  <li key={t} className="flex items-start gap-3.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span className="text-sm md:text-base font-light leading-snug text-white">
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
