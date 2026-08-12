import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { WorkHero, WorkCTA, Eyebrow, CARD } from "@/components/work/WorkPageParts";

export const Route = createFileRoute("/work/digital-marketing")({
  head: () => ({
    meta: [
      { title: "Digital Marketing & Performance Ads – Zencyp" },
      {
        name: "description",
        content:
          "Before-and-after results from Zencyp's Meta Ads, Google Ads and SEO campaigns — measured in enquiries and cost per lead, not impressions.",
      },
    ],
  }),
  component: DigitalMarketingPage,
});

/**
 * Illustrative engagement figures. TODO — replace with audited numbers from real
 * client reporting before this page goes live.
 */
const comparisons = [
  {
    client: "Retail brand",
    sector: "Fashion — Chennai",
    window: "6 months",
    rows: [
      { label: "Monthly enquiries", before: 18, after: 74, unit: "" },
      { label: "Cost per lead", before: 640, after: 210, unit: "₹", lowerIsBetter: true },
      { label: "Organic sessions", before: 2100, after: 9400, unit: "" },
    ],
  },
  {
    client: "Wellness clinic",
    sector: "Health — Bengaluru",
    window: "4 months",
    rows: [
      { label: "Monthly enquiries", before: 26, after: 91, unit: "" },
      { label: "Cost per lead", before: 480, after: 175, unit: "₹", lowerIsBetter: true },
      { label: "Organic sessions", before: 3400, after: 12800, unit: "" },
    ],
  },
  {
    client: "Café group",
    sector: "F&B — Arani",
    window: "3 months",
    rows: [
      { label: "Monthly footfall", before: 900, after: 2600, unit: "" },
      { label: "Cost per reach", before: 95, after: 34, unit: "₹", lowerIsBetter: true },
      { label: "Reel views", before: 12000, after: 380000, unit: "" },
    ],
  },
];

const channels = [
  { name: "Google Ads", share: 34, note: "High-intent search capture" },
  { name: "Meta Ads", share: 28, note: "Discovery and retargeting" },
  { name: "SEO & Content", share: 24, note: "Compounding organic traffic" },
  { name: "Email & Nurture", share: 14, note: "Turning interest into enquiries" },
];

const headline = [
  { value: 150, suffix: "%", label: "Avg. traffic lift" },
  { value: 62, suffix: "%", label: "Avg. cost-per-lead drop" },
  { value: 3, suffix: "×", label: "Avg. enquiry volume" },
];

function pct(before: number, after: number, lowerIsBetter?: boolean) {
  if (before === 0) return 0;
  const change = ((after - before) / before) * 100;
  return Math.round(lowerIsBetter ? -change : change);
}

function fmt(n: number, unit: string) {
  return `${unit}${n.toLocaleString("en-IN")}`;
}

function DigitalMarketingPage() {
  return (
    <div className="bg-background text-foreground selection:bg-brand selection:text-brand-foreground font-sans">
      <SiteNav />

      <WorkHero
        eyebrow="Digital Marketing"
        title={
          <>
            The numbers{" "}
            <span className="font-serif italic font-semibold normal-case tracking-tight text-brand">
              before
            </span>{" "}
            and after
          </>
        }
        copy="We don't report impressions. Every campaign is judged on enquiries, cost per lead and revenue — measured against where the business actually started."
        art="spectrum"
      />

      {/* ─── Headline stats ─── */}
      <section className="px-5 md:px-6 pb-16 md:pb-20">
        <div className="max-w-[1128px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {headline.map((h, i) => (
            <Reveal key={h.label} delay={i * 0.08}>
              <div className={`flex flex-col gap-2 p-7 rounded-2xl h-full ${CARD}`}>
                <span className="text-4xl md:text-5xl font-extrabold tracking-tighter tabular-nums">
                  <CountUp to={h.value} suffix={h.suffix} duration={2} />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                  {h.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Before / after comparisons ─── */}
      <section className="px-5 md:px-6 py-16 md:py-24 bg-muted/30 border-y border-foreground/[0.06]">
        <div className="max-w-[1128px] mx-auto">
          <Reveal className="mb-10 md:mb-14 flex flex-col gap-4">
            <Eyebrow>Before / after</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase leading-[1.05] max-w-2xl">
              What changed once the system was in place
            </h2>
          </Reveal>

          <div className="flex flex-col gap-6">
            {comparisons.map((c, ci) => (
              <Reveal key={c.client} delay={ci * 0.06}>
                <article className={`rounded-3xl p-6 md:p-8 ${CARD}`}>
                  <header className="flex flex-wrap items-baseline justify-between gap-3 pb-6 mb-6 border-b border-foreground/[0.07]">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
                        {c.client}
                      </h3>
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                        ///{c.sector}
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-[0.2em]">
                      {c.window}
                    </span>
                  </header>

                  <div className="flex flex-col gap-7">
                    {c.rows.map((r) => {
                      const delta = pct(r.before, r.after, r.lowerIsBetter);
                      const max = Math.max(r.before, r.after);
                      return (
                        <div key={r.label} className="flex flex-col gap-3">
                          <div className="flex items-baseline justify-between gap-4">
                            <span className="text-sm font-medium text-foreground/70">
                              {r.label}
                            </span>
                            <span className="text-xs font-bold tabular-nums text-brand">
                              {delta > 0 ? "+" : ""}
                              {delta}%
                            </span>
                          </div>

                          {/* Before */}
                          <div className="flex items-center gap-3">
                            <span className="w-14 shrink-0 text-[10px] font-bold uppercase tracking-widest text-foreground/35">
                              Before
                            </span>
                            <div className="flex-1 h-2.5 rounded-full bg-foreground/[0.07] overflow-hidden">
                              <span
                                className="block h-full rounded-full bg-foreground/25"
                                style={{ width: `${(r.before / max) * 100}%` }}
                              />
                            </div>
                            <span className="w-20 shrink-0 text-right text-xs font-bold tabular-nums text-foreground/50">
                              {fmt(r.before, r.unit)}
                            </span>
                          </div>

                          {/* After */}
                          <div className="flex items-center gap-3">
                            <span className="w-14 shrink-0 text-[10px] font-bold uppercase tracking-widest text-brand">
                              After
                            </span>
                            <div className="flex-1 h-2.5 rounded-full bg-foreground/[0.07] overflow-hidden">
                              <span
                                className="block h-full rounded-full bg-brand"
                                style={{ width: `${(r.after / max) * 100}%` }}
                              />
                            </div>
                            <span className="w-20 shrink-0 text-right text-xs font-bold tabular-nums">
                              {fmt(r.after, r.unit)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="mt-8 text-[11px] font-medium text-foreground/35 leading-relaxed max-w-2xl">
              Figures are illustrative of typical engagements and are pending replacement with
              audited client reporting.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Channel mix ─── */}
      <section className="px-5 md:px-6 py-20 md:py-28">
        <div className="max-w-[1128px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start">
          <Reveal>
            <div className="flex flex-col gap-4">
              <Eyebrow>Channel mix</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase leading-[1.05]">
                Where the budget actually goes
              </h2>
              <p className="text-sm md:text-base font-light text-foreground/60 leading-relaxed">
                The split shifts per business, but the principle holds: capture the people already
                searching, stay visible to the ones who aren't yet, and keep both compounding
                through content.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-6">
              {channels.map((ch) => (
                <div key={ch.name} className="flex flex-col gap-2.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-base font-extrabold tracking-tight">{ch.name}</span>
                    <span className="text-sm font-bold tabular-nums">{ch.share}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-foreground/[0.07] overflow-hidden">
                    <span
                      className="block h-full rounded-full bg-brand"
                      style={{ width: `${ch.share}%` }}
                    />
                  </div>
                  <span className="text-xs font-light text-foreground/50">{ch.note}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <WorkCTA
        heading="Want to see your own before and after?"
        copy="We'll audit what you're running today and show you where the leads are leaking."
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
