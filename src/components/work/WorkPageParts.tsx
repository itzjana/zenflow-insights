import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { WorkArt, type ArtVariant } from "@/components/WorkArt";

/** Shared surface treatment, matching the About page. */
export const CARD = "bg-muted/60 border border-foreground/[0.07]";

/** Section label with the brand dot — same treatment as every other page. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
      <span className="size-2 bg-brand rounded-full" />
      {children}
    </span>
  );
}

type HeroProps = {
  eyebrow: string;
  title: ReactNode;
  copy: string;
  art: ArtVariant;
};

/** Split hero shared by every work detail page. */
export function WorkHero({ eyebrow, title, copy, art }: HeroProps) {
  return (
    <section className="px-5 md:px-6 pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
      <div className="max-w-[1128px] mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">
        <div className="flex flex-col gap-6">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="text-[clamp(2.25rem,5.5vw,3.75rem)] font-extrabold tracking-tighter uppercase leading-[0.95] text-balance">
              {title}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="max-w-xl text-base md:text-lg font-light text-foreground/60 leading-relaxed">
              {copy}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 h-12 px-7 rounded-full bg-brand text-brand-foreground text-sm font-bold tracking-wide transition-transform duration-300 hover:-translate-y-0.5"
              >
                Start a project
                <span aria-hidden>→</span>
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center h-12 px-7 rounded-full border border-foreground/15 text-sm font-bold tracking-wide transition-colors hover:border-brand hover:text-brand"
              >
                All services
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand/10 blur-3xl" />
            <div className="relative aspect-[440/460] w-full rounded-[20px] overflow-hidden border border-foreground/10">
              <WorkArt variant={art} className="w-full h-full" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Closing call to action shared by every work detail page. */
export function WorkCTA({ heading, copy }: { heading: string; copy: string }) {
  return (
    <section className="px-5 md:px-6 py-20 md:py-28 bg-muted/30 border-y border-foreground/[0.06]">
      <Reveal className="max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase leading-[1.05] text-balance">
          {heading}
        </h2>
        <p className="text-base font-light text-foreground/60 leading-relaxed max-w-lg">{copy}</p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-3 bg-foreground text-background rounded-full px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand hover:text-brand-foreground transition-colors"
        >
          Book a call
        </Link>
      </Reveal>
    </section>
  );
}
