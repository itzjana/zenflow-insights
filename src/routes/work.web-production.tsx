import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { WorkArt } from "@/components/WorkArt";
import { WorkHero, WorkCTA, Eyebrow, CARD } from "@/components/work/WorkPageParts";

export const Route = createFileRoute("/work/web-production")({
  head: () => ({
    meta: [
      { title: "Web Design & Development – Zencyp" },
      {
        name: "description",
        content:
          "High-performance, mobile-first websites built for search rankings and conversion — designed, engineered and shipped by Zencyp.",
      },
    ],
  }),
  component: WebProductionPage,
});

const specs = [
  { value: 98, suffix: "", label: "Lighthouse performance", note: "Median across shipped builds" },
  { value: 14, suffix: " days", label: "Average delivery", note: "Discovery to launch" },
  { value: 100, suffix: "%", label: "Responsive coverage", note: "320px to ultrawide" },
];

const builds = [
  {
    name: "Vault 01",
    sector: "Fintech platform",
    art: "grid" as const,
    stack: ["Next.js", "Design system", "CMS"],
    note: "A marketing site and product surface sharing one component library, so the brand never drifts between them.",
  },
  {
    name: "Meridian",
    sector: "Commerce",
    art: "layers" as const,
    stack: ["Storefront", "Payments", "Analytics"],
    note: "Built around the checkout path first — every other page exists to get people there with intent.",
  },
  {
    name: "Achieve",
    sector: "Education",
    art: "waves" as const,
    stack: ["Landing pages", "Lead capture", "SEO"],
    note: "A page-per-programme structure that ranks individually and funnels into one enquiry system.",
  },
];

const process = [
  {
    n: "01",
    title: "Discovery",
    copy: "We map who has to convert, what they need to believe first, and what the current site fails to say.",
  },
  {
    n: "02",
    title: "Design system",
    copy: "Type scale, spacing, colour and components get settled before any page is composed, so the build stays consistent.",
  },
  {
    n: "03",
    title: "Build",
    copy: "Semantic, accessible markup with performance budgets enforced as we go rather than audited at the end.",
  },
  {
    n: "04",
    title: "Launch & iterate",
    copy: "Analytics, search console and conversion tracking wired up on day one, then refined against real behaviour.",
  },
];

function WebProductionPage() {
  return (
    <div className="bg-background text-foreground selection:bg-brand selection:text-brand-foreground font-sans">
      <SiteNav />

      <WorkHero
        eyebrow="Web Production"
        title={
          <>
            Sites built to{" "}
            <span className="font-serif italic font-semibold normal-case tracking-tight text-brand">
              convert
            </span>
            , not just launch
          </>
        }
        copy="Fast, accessible, mobile-first builds where the engineering serves the business case. Performance budgets and conversion tracking are part of the build, not a retrofit."
        art="grid"
      />

      {/* ─── Build specs ─── */}
      <section className="px-5 md:px-6 pb-16 md:pb-20">
        <div className="max-w-[1128px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {specs.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className={`flex flex-col gap-2 p-7 rounded-2xl h-full ${CARD}`}>
                <span className="text-4xl md:text-5xl font-extrabold tracking-tighter tabular-nums">
                  <CountUp to={s.value} suffix={s.suffix} duration={2} />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                  {s.label}
                </span>
                <span className="text-xs font-light text-foreground/50">{s.note}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Recent builds ─── */}
      <section className="px-5 md:px-6 py-16 md:py-24 bg-muted/30 border-y border-foreground/[0.06]">
        <div className="max-w-[1128px] mx-auto">
          <Reveal className="mb-10 md:mb-14 flex flex-col gap-4">
            <Eyebrow>Recent builds</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase leading-[1.05] max-w-2xl">
              Three problems, three very different structures
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {builds.map((b, i) => (
              <Reveal key={b.name} delay={i * 0.08}>
                <article
                  className={`group h-full flex flex-col gap-5 p-5 rounded-3xl ${CARD} transition-colors hover:border-brand/40`}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-muted">
                    <WorkArt
                      variant={b.art}
                      label={b.name}
                      className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col gap-3 px-1 pb-1">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-extrabold tracking-tight">{b.name}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                        ///{b.sector}
                      </span>
                    </div>
                    <p className="text-sm font-light leading-relaxed text-foreground/60">
                      {b.note}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {b.stack.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-full border border-foreground/10 text-[9px] font-bold uppercase tracking-widest text-foreground/50"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Process ─── */}
      <section className="px-5 md:px-6 py-20 md:py-28">
        <div className="max-w-[1128px] mx-auto">
          <Reveal className="mb-10 md:mb-14 flex flex-col gap-4">
            <Eyebrow>How it ships</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase leading-[1.05]">
              Four stages, no surprises
            </h2>
          </Reveal>

          <div className="border-t border-foreground/10">
            {process.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.05}>
                <div className="grid grid-cols-[2.5rem_1fr] md:grid-cols-12 items-baseline md:items-start gap-x-3 gap-y-4 md:gap-6 py-8 md:py-10 border-b border-foreground/10 group hover:bg-muted/40 transition-colors px-2 md:px-6 rounded-xl">
                  <span className="md:col-span-2 text-sm font-bold tabular-nums text-brand">
                    {p.n}
                  </span>
                  <h3 className="md:col-span-4 text-2xl md:text-3xl font-extrabold tracking-tight group-hover:translate-x-2 transition-transform">
                    {p.title}
                  </h3>
                  <p className="col-span-2 md:col-span-6 text-sm md:text-base text-foreground/60 font-light leading-relaxed">
                    {p.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WorkCTA
        heading="Got a site that isn't pulling its weight?"
        copy="Send us the URL and we'll tell you exactly where it's losing people."
      />

      <div className="px-5 md:px-6 pb-16 text-center">
        <Link
          to="/"
          className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/40 hover:text-brand transition-colors"
        >
          ← Back to selected work
        </Link>
      </div>

      <SiteFooter />
    </div>
  );
}
