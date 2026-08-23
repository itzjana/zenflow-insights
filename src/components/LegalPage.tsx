import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";

export type LegalBlock =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "note"; text: string };

/** Shared shell for the policy pages so they read as one document family. */
export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  blocks,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  blocks: LegalBlock[];
  children?: ReactNode;
}) {
  return (
    <div className="bg-background text-foreground selection:bg-brand selection:text-brand-foreground font-sans">
      <SiteNav />

      <section className="px-5 md:px-6 pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="max-w-[760px] mx-auto flex flex-col gap-5">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
              <span className="size-2 bg-brand rounded-full" />
              {eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-extrabold tracking-tighter uppercase leading-[1.02]">
              {title}
            </h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="text-base md:text-lg font-light leading-relaxed text-foreground/65">
              {intro}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/40">
              Last updated {updated}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-5 md:px-6 pb-20 md:pb-28">
        <div className="max-w-[760px] mx-auto flex flex-col gap-7">
          {blocks.map((b, i) => {
            if (b.kind === "h") {
              return (
                <h2
                  key={i}
                  className="mt-4 text-xl md:text-2xl font-extrabold tracking-tight border-t border-foreground/10 pt-7"
                >
                  {b.text}
                </h2>
              );
            }
            if (b.kind === "list") {
              return (
                <ul key={i} className="flex flex-col gap-2.5">
                  {b.items.map((it) => (
                    <li key={it} className="flex items-start gap-3 text-foreground/70">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                      <span className="text-[15px] font-light leading-relaxed">{it}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            if (b.kind === "note") {
              return (
                <p
                  key={i}
                  className="rounded-2xl border border-foreground/[0.07] bg-muted/60 p-5 text-sm font-light leading-relaxed text-foreground/70"
                >
                  {b.text}
                </p>
              );
            }
            return (
              <p key={i} className="text-[15px] font-light leading-relaxed text-foreground/70">
                {b.text}
              </p>
            );
          })}

          {children}

          <div className="mt-6 rounded-2xl border border-foreground/[0.07] bg-muted/60 p-6 flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/40">
              Questions about this policy
            </span>
            <a
              href="mailto:contact@zencyp.in"
              className="text-lg font-extrabold tracking-tight hover:text-brand transition-colors"
            >
              contact@zencyp.in
            </a>
            <a
              href="tel:+918056496547"
              className="text-sm font-medium text-foreground/60 hover:text-brand transition-colors"
            >
              +91 80564 96547
            </a>
          </div>

          <div className="pt-4 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">
            <Link to="/privacy-policy" className="hover:text-brand transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-brand transition-colors">
              Terms
            </Link>
            <Link to="/cookie-policy" className="hover:text-brand transition-colors">
              Cookies
            </Link>
            <Link to="/copyright" className="hover:text-brand transition-colors">
              Copyright
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
