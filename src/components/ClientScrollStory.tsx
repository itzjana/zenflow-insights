import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useNavClearance } from "@/hooks/useNavClearance";

export type ClientProject = {
  name: string;
  url: string;
  sector: string;
  /** Imported image URL — a site screenshot, or a placeholder until one exists. */
  image: string;
  summary: string;
  /** Short capability tags shown under the summary. */
  stack: string[];
};

type Props = { projects: ClientProject[] };

/**
 * Scroll story: the media panel stays pinned while each project's copy scrolls past,
 * cross-fading to the matching screenshot. Falls back to a plain stacked list on small
 * screens, where a sticky split layout has nowhere to go.
 */
export function ClientScrollStory({ projects }: Props) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navClearance = useNavClearance();

  useEffect(() => {
    const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!steps.length) return;

    // Whichever step is nearest the vertical middle of the viewport wins, which keeps
    // the pinned image in step with what the reader is actually looking at.
    const io = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; ratio: number } | null = null;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const idx = steps.indexOf(e.target as HTMLDivElement);
          if (idx === -1) continue;
          if (!best || e.intersectionRatio > best.ratio) {
            best = { idx, ratio: e.intersectionRatio };
          }
        }
        if (best) setActive(best.idx);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [projects.length]);

  return (
    <>
      {/* ── Desktop / tablet: pinned media, scrolling copy ── */}
      <div className="hidden lg:grid grid-cols-[1fr_1.1fr] gap-16 items-start">
        <div className="flex flex-col">
          {projects.map((p, i) => (
            <div
              key={p.url}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className="flex min-h-[62vh] flex-col justify-center gap-5 py-10"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`text-[11px] font-bold tabular-nums transition-colors duration-300 ${
                    active === i ? "text-brand" : "text-foreground/30"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-foreground/10" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/40">
                  {p.sector}
                </span>
              </div>

              <h3
                className={`text-3xl md:text-4xl font-extrabold tracking-tighter uppercase leading-[1.05] transition-colors duration-300 ${
                  active === i ? "text-foreground" : "text-foreground/35"
                }`}
              >
                {p.name}
              </h3>

              <p className="max-w-md text-sm md:text-base font-light leading-relaxed text-foreground/60">
                {p.summary}
              </p>

              <div className="flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-foreground/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-foreground/50"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand transition-colors hover:text-accent-foreground"
              >
                Visit site <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          ))}
        </div>

        {/* Pinned media */}
        <div className="sticky" style={{ top: navClearance }}>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-foreground/10 bg-muted">
            {projects.map((p, i) => (
              <img
                key={p.url}
                src={p.image}
                alt={`${p.name} website`}
                loading={i === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  active === i ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>

          {/* Progress rail */}
          <div className="mt-6 flex items-center gap-2">
            {projects.map((p, i) => (
              <span
                key={p.url}
                className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                  active === i ? "bg-brand" : "bg-foreground/10"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile: one card per project ── */}
      <div className="flex flex-col gap-8 lg:hidden">
        {projects.map((p, i) => (
          <a
            key={p.url}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-4"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-foreground/10 bg-muted">
              <img
                src={p.image}
                alt={`${p.name} website`}
                loading={i === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-4 top-4 rounded-full bg-background/75 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/40">
                {p.sector}
              </span>
              <h3 className="text-2xl font-extrabold tracking-tighter uppercase leading-tight">
                {p.name}
              </h3>
              <p className="text-sm font-light leading-relaxed text-foreground/60">{p.summary}</p>
              <span className="mt-1 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
                Visit site <ArrowUpRight className="size-3.5" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
