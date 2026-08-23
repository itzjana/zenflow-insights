import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PinnedHorizontal } from "@/components/PinnedHorizontal";

export type ClientProject = {
  name: string;
  url: string;
  sector: string;
  /** Imported screenshot of the live site. */
  image: string;
  summary: string;
  /** Short capability tags. */
  stack: string[];
};

type Props = { projects: ClientProject[] };

/**
 * Live client builds.
 *
 * Desktop is a hover accordion: the panels sit as narrow spines until one is hovered or
 * focused, then it expands to full width and its copy staggers in. Growth is driven by
 * `flex-grow` rather than a fixed pixel width, so the row always fills the container at
 * any desktop size.
 *
 * The expansion and the stagger are CSS — a width transition plus tw-animate-css
 * keyframes — so this costs no animation library.
 */
export function LiveBuilds({ projects }: Props) {
  const [active, setActive] = useState(0);

  return (
    <>
      {/* ── Desktop: hover accordion ── */}
      <div className="hidden lg:flex lg:h-[440px] lg:gap-2">
        {projects.map((p, i) => {
          const isActive = active === i;
          return (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.name} — ${p.sector}. Opens the live site in a new tab.`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              data-state={isActive ? "active" : "idle"}
              style={{ flexGrow: isActive ? 7 : 1, flexBasis: 0 }}
              className="group relative min-w-[3.5rem] overflow-hidden rounded-2xl border border-foreground/10 bg-muted outline-none transition-[flex-grow] duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] focus-visible:ring-2 focus-visible:ring-brand active:scale-[0.99] motion-reduce:transition-none"
            >
              <img
                src={p.image}
                alt={`${p.name} website`}
                loading={i === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 h-full w-full object-cover transition-[opacity,filter] duration-500 ${
                  isActive ? "opacity-100" : "opacity-45 saturate-50"
                }`}
              />

              {/* Collapsed spine: the name runs vertically so a 56px strip is still readable */}
              <span
                aria-hidden
                className={`absolute inset-0 flex items-end justify-center pb-6 transition-opacity duration-300 ${
                  isActive ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
              >
                <span className="absolute inset-0 bg-brand-deep/55" />
                <span className="relative whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.25em] text-white [writing-mode:vertical-rl] [transform:rotate(180deg)]">
                  {p.name}
                </span>
              </span>

              {/* Expanded copy */}
              {isActive && (
                <span className="absolute inset-0 flex flex-col justify-end gap-2 bg-linear-to-t from-brand-deep via-brand-deep/70 to-transparent p-6 text-white">
                  <span className="animate-in fade-in slide-in-from-bottom-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/60 duration-500">
                    {p.sector}
                  </span>
                  <span className="animate-in fade-in slide-in-from-bottom-3 text-3xl font-extrabold uppercase leading-tight tracking-tighter delay-75 duration-500 fill-mode-both">
                    {p.name}
                  </span>
                  <span className="animate-in fade-in slide-in-from-bottom-3 max-w-md text-sm font-light leading-relaxed text-white/75 delay-150 duration-500 fill-mode-both">
                    {p.summary}
                  </span>
                  <span className="animate-in fade-in slide-in-from-bottom-3 mt-1 flex flex-wrap items-center gap-2 delay-200 duration-500 fill-mode-both">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-white/25 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white/70"
                      >
                        {s}
                      </span>
                    ))}
                  </span>
                  <span className="animate-in fade-in slide-in-from-bottom-3 mt-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-accent delay-300 duration-500 fill-mode-both">
                    Visit site
                    <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </span>
              )}
            </a>
          );
        })}
      </div>

      {/* ── Mobile: pinned scroll-driven track, same mechanism as Selected Work ── */}
      <div className="lg:hidden">
        <PinnedHorizontal>
          {projects.map((p, i) => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full w-[78vw] shrink-0 flex-col gap-3"
            >
              {/* Grows into whatever height the pinned panel has left, rather than
                  holding a fixed 4:3 box and leaving the rest of the screen empty. */}
              <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-2xl border border-foreground/10 bg-muted">
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
              <div className="flex shrink-0 flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/40">
                  {p.sector}
                </span>
                <h3 className="text-2xl font-extrabold uppercase leading-tight tracking-tighter">
                  {p.name}
                </h3>
                <p className="line-clamp-3 text-sm font-light leading-relaxed text-foreground/60">
                  {p.summary}
                </p>
                <span className="mt-0.5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
                  Visit site <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </a>
          ))}
          <span aria-hidden className="w-2 shrink-0" />
        </PinnedHorizontal>
      </div>
    </>
  );
}
