import { createFileRoute, Link } from "@tanstack/react-router";
import { seo, breadcrumbSchema } from "@/lib/seo";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import studioCard from "@/assets/img/studio-card.webp";

export const Route = createFileRoute("/about")({
  head: () => ({
    ...seo({
      title: "About Zencyp | Digital Marketing & Branding Agency in Tamil Nadu",
      description:
        "Zencyp is a full-service digital agency building growth systems for ambitious brands — branding, web development, performance ads and content marketing under one roof.",
      path: "/about",
      schema: [
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]),
      ],
    }),
  }),
  component: About,
});

/** TODO — confirm the live handle. */
const INSTAGRAM_URL = "https://www.instagram.com/zencyp/";

/** Studio facts shown on the agency card. */
const studio = {
  basedIn: "Tamil Nadu, India",
  disciplines: ["Branding", "Web Development", "Performance Ads", "Content & Video"],
};

const stats = [
  { value: 100, suffix: "+", label: "Happy Clients" },
  { value: 80, suffix: "+", label: "Projects Delivered" },
  { value: 5, suffix: "+", label: "Years of Experience" },
];

const whyPoints = [
  "We chase qualified enquiries, not vanity traffic",
  "Every strategy starts from your business goals",
  "We tell you what works, not what sounds good",
  "Design and performance treated as one system",
  "Built for compounding results, not short spikes",
];

const coreAreas = [
  { label: "Brand & Positioning", pct: 40 },
  { label: "Traffic Acquisition", pct: 35 },
  { label: "Conversion Optimisation", pct: 25 },
];

const deliveryStages = ["Discovery", "Strategy", "Design", "Launch"];

const processSteps = [
  {
    n: "01",
    title: "Strategic Thinking",
    copy: "Every project begins with understanding your business, your audience and your goals — before a single pixel or campaign goes live.",
  },
  {
    n: "02",
    title: "Systems That Work Together",
    copy: "Your brand, website, ads and content are built as one system, so each part reinforces the others and compounds over time.",
  },
  {
    n: "03",
    title: "Focused On Real Results",
    copy: "We measure what matters — enquiries, conversions and revenue — and keep refining until the numbers move in the right direction.",
  },
];

/* ─── Section label with the brand dot — same treatment as the other pages ─── */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
      <span className="size-2 bg-brand rounded-full" />
      {children}
    </span>
  );
}

/* ─── Shared surface treatment for every card on the page ─── */
const CARD = "bg-muted/60 border border-foreground/[0.07]";

function About() {
  return (
    <div className="bg-background text-foreground selection:bg-brand selection:text-brand-foreground font-sans">
      <SiteNav />

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-5 md:px-6 pt-32 pb-24">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[42rem] rounded-full bg-brand/10 blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto w-full text-center">
          <Reveal>
            <h1 className="text-[clamp(2.25rem,6vw,4.25rem)] font-extrabold tracking-tighter leading-[0.95] uppercase text-balance">
              Building{" "}
              <span className="font-serif italic font-semibold normal-case tracking-tight text-brand">
                growth
              </span>{" "}
              systems for ambitious brands
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 mx-auto max-w-2xl text-base md:text-lg font-light text-foreground/60 leading-relaxed text-balance">
              Zencyp helps businesses attract the right audience, build trust faster and turn
              attention into qualified leads — through branding, web development, performance ads
              and content that actually converts.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 h-12 px-7 rounded-full bg-brand text-white text-sm font-bold tracking-wide transition-transform duration-300 hover:-translate-y-0.5"
              >
                Get started
                <span aria-hidden>→</span>
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center h-12 px-7 rounded-full border border-foreground/15 text-sm font-bold tracking-wide transition-colors hover:border-brand hover:text-brand"
              >
                Our services
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 text-foreground/35">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
            Scroll to explore
          </span>
          <span className="h-8 w-px bg-linear-to-b from-foreground/30 to-transparent" />
        </div>
      </section>

      {/* ═══════ ABOUT THE AGENCY ═══════ */}
      <section className="px-5 md:px-6 py-20 md:py-30">
        <div className="max-w-[1128px] mx-auto flex flex-col gap-14 md:gap-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: studio card + floating badges */}
            <Reveal>
              <div className="relative">
                <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand/10 blur-3xl" />
                <div className="relative aspect-[350/460] lg:aspect-[532/620] w-full rounded-[20px] overflow-hidden border border-foreground/10 bg-muted">
                  <img
                    src={studioCard}
                    alt="Inside the Zencyp studio"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {/* Scrim so the badges and chips stay readable over the photo */}
                  <div className="absolute inset-0 bg-linear-to-t from-brand-deep/85 via-brand-deep/25 to-brand-deep/40" />

                  <div className="absolute inset-x-6 bottom-24 flex flex-wrap justify-center gap-2">
                    {studio.disciplines.map((d) => (
                      <span
                        key={d}
                        className="px-3 py-1 rounded-full bg-white/12 backdrop-blur-md border border-white/25 text-[10px] font-bold uppercase tracking-widest text-white/85"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-deep/80 backdrop-blur-md border border-white/20 text-xs font-bold text-white">
                    <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                    The agency
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 px-4.5 py-3.5 rounded-2xl bg-brand-deep/80 backdrop-blur-md border border-white/20">
                    <span className="size-2 rounded-full bg-accent shrink-0" />
                    <span className="text-xs font-medium text-white/80 leading-snug">
                      Based in {studio.basedIn} — working with brands across India
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right: heading, copy, stats */}
            <div className="flex flex-col gap-9">
              <Reveal>
                <div className="flex flex-col gap-4">
                  <Eyebrow>About the agency</Eyebrow>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase leading-[1.05]">
                    A digital agency built around results
                  </h2>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="space-y-4 text-sm md:text-[15px] font-light leading-relaxed text-foreground/65">
                  <p>
                    Zencyp is a full-service digital agency helping businesses attract high-quality
                    enquiries and turn them into real clients. We work with brands that want more
                    than traffic, clicks and impressive-looking dashboards.
                  </p>
                  <p>
                    Most businesses we meet are already putting in the effort. The problem is rarely
                    effort — it's that their marketing reaches the wrong audience, or loses
                    interested people somewhere before they enquire. Our team finds those gaps and
                    fixes the whole journey, not just one piece of it.
                  </p>
                  <p>
                    Branding, web development, performance ads, social media and video sit under one
                    roof, so strategy and execution never get handed off and diluted between
                    vendors.
                  </p>
                  <p>
                    We also take on a limited number of clients at a time. That's what lets the team
                    give every business real attention and keep you genuinely informed about
                    progress.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="grid grid-cols-3 gap-4">
                  {stats.map((s) => (
                    <div key={s.label} className={`flex flex-col gap-1.5 p-5 rounded-2xl ${CARD}`}>
                      <span className="text-2xl md:text-3xl font-extrabold tracking-tight tabular-nums">
                        <CountUp to={s.value} suffix={s.suffix} duration={2} />
                      </span>
                      <span className="text-[11px] font-medium text-foreground/50 leading-snug">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>

          {/* Why clients choose us */}
          <Reveal>
            <div className={`flex flex-col gap-5 p-7 rounded-[20px] max-w-[532px] ${CARD}`}>
              <h3 className="text-lg font-extrabold tracking-tight">
                Why clients choose to work with us
              </h3>
              <ul className="flex flex-col gap-3.5">
                {whyPoints.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-foreground/65">
                    <span className="mt-1.5 size-1.5 rounded-full bg-brand shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Instagram card */}
          <Reveal>
            <div
              className={`flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12 px-10 py-5 rounded-3xl w-full ${CARD}`}
            >
              <div className="flex flex-col gap-5 py-6 lg:py-10 flex-1">
                <span className="self-start px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-[0.2em]">
                  Instagram
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tighter uppercase">
                  Follow along behind the scenes
                </h3>
                <p className="text-sm font-light text-foreground/60 leading-relaxed max-w-md">
                  Want to see what's actually driving real leads right now? We share the work, the
                  campaigns and the results as they happen.
                </p>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start inline-flex items-center gap-2 px-5 py-3 rounded-full bg-brand text-white text-xs font-bold tracking-wide transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Follow the journey
                  <span aria-hidden>↗</span>
                </a>
              </div>

              <div className="w-full lg:w-[524px] shrink-0 aspect-[524/359] rounded-2xl border border-foreground/10 bg-linear-to-br from-brand/15 via-muted to-background flex items-center justify-center">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-foreground/25">
                  @zencyp
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════ STORY ═══════ */}
      <section className="px-5 md:px-6 py-20 md:py-28 bg-muted/30 border-y border-foreground/[0.06]">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
          <Reveal>
            <Eyebrow>Our story</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter uppercase leading-[1.05] text-balance">
              From building websites to building growth systems
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="space-y-4 text-sm md:text-base font-light leading-relaxed text-foreground/65">
              <p>
                Zencyp started out designing websites for businesses across Tamil Nadu. Working
                client after client, the same problem kept surfacing — they weren't struggling
                because they lacked a website. They struggled because their website, their marketing
                and the way they won customers were never connected.
              </p>
              <p>
                A beautiful site with no traffic can't generate leads. Traffic without trust can't
                generate customers. Content without strategy can't generate growth.
              </p>
              <p>
                So Zencyp grew from a web studio into a growth partner. Today the mission is simple:
                help businesses build predictable systems that generate opportunities, customers and
                long-term revenue.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex">
                {["A", "R", "M", "S"].map((i, idx) => (
                  <span
                    key={i}
                    className="size-9 -ml-2 first:ml-0 rounded-full border-2 border-background bg-linear-to-br from-brand/40 to-brand/10 flex items-center justify-center text-[11px] font-bold text-foreground/60"
                    style={{ zIndex: 4 - idx }}
                  >
                    {i}
                  </span>
                ))}
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="flex gap-0.5 text-brand text-xs" aria-label="4.9 out of 5">
                  {"★★★★★"}
                </span>
                <span className="text-[11px] font-medium text-foreground/50">
                  100+ happy clients
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════ METRICS BENTO ═══════ */}
      <section className="px-5 md:px-6 py-20 md:py-28">
        <div className="max-w-[1177px] mx-auto">
          <Reveal className="mb-10 md:mb-14 flex flex-col gap-4">
            <Eyebrow>Growth metrics</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase max-w-2xl leading-[1.05]">
              Systems built with purpose, measured with numbers
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 — growth chart */}
            <Reveal>
              <div
                className={`flex flex-col justify-between gap-6 p-6 rounded-2xl h-full min-h-[380px] lg:min-h-[452px] ${CARD}`}
              >
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                    Growth metrics
                  </span>
                  <p className="text-sm text-foreground/60 font-light leading-relaxed">
                    Helping brands build a stronger online presence through websites, ads and
                    content.
                  </p>
                </div>

                <svg viewBox="0 0 300 120" className="w-full" role="img" aria-label="Growth trend">
                  <defs>
                    <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 108 L50 96 L100 82 L150 60 L200 44 L250 24 L300 8 L300 120 L0 120 Z"
                    fill="url(#growthFill)"
                  />
                  <path
                    d="M0 108 L50 96 L100 82 L150 60 L200 44 L250 24 L300 8"
                    fill="none"
                    stroke="var(--brand)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <div className="flex justify-between text-[11px] font-medium text-foreground/40">
                  <span>2020</span>
                  <span>2026</span>
                </div>
              </div>
            </Reveal>

            {/* Card 2 — custom built */}
            <Reveal delay={0.08}>
              <div
                className={`flex flex-col justify-between gap-6 p-6 rounded-2xl h-full min-h-[380px] lg:min-h-[452px] ${CARD}`}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-5xl md:text-6xl font-extrabold tracking-tighter tabular-nums">
                    <CountUp to={100} suffix="%" duration={2} />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                    Custom-built solutions
                  </span>
                </div>

                <div className="flex-1 flex items-center">
                  <div className="grid grid-cols-4 gap-2 w-full">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <span
                        key={i}
                        className="h-8 rounded-md"
                        style={{
                          backgroundColor: "var(--brand)",
                          opacity: 0.12 + (i % 4) * 0.18,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-extrabold tracking-tight">
                    Growth systems built with purpose
                  </h3>
                  <p className="text-sm text-foreground/60 font-light leading-relaxed">
                    Every project is designed to attract the right audience, build trust and
                    generate qualified leads.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Card 3 — three core areas */}
            <Reveal delay={0.16}>
              <div
                className={`flex flex-col justify-between gap-6 p-6 rounded-2xl h-full min-h-[380px] lg:min-h-[452px] ${CARD}`}
              >
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                    The mix
                  </span>
                  <h3 className="text-base font-extrabold tracking-tight leading-snug">
                    Every growth system is built around three core areas
                  </h3>
                </div>

                <div className="flex flex-col gap-5">
                  {coreAreas.map((a) => (
                    <div key={a.label} className="flex flex-col gap-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium text-foreground/70">{a.label}</span>
                        <span className="text-sm font-bold tabular-nums">{a.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-foreground/[0.07] overflow-hidden">
                        <span
                          className="block h-full rounded-full bg-brand"
                          style={{ width: `${a.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-foreground/60 font-light leading-relaxed">
                  The strongest results come when strategy, visibility and conversion work together.
                </p>
              </div>
            </Reveal>

            {/* Card 4 — client satisfaction */}
            <Reveal>
              <div
                className={`flex flex-col justify-between gap-6 p-6 rounded-2xl h-full min-h-[300px] lg:min-h-[330px] ${CARD}`}
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                  Client satisfaction
                </span>
                <div className="flex items-end gap-3">
                  <span className="text-6xl font-extrabold tracking-tighter tabular-nums leading-none">
                    <CountUp to={4.9} decimals={1} duration={2} />
                  </span>
                  <span className="text-sm text-foreground/40 mb-2">/ 5</span>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-foreground/[0.07]">
                  {[
                    { v: "4.9", l: "Rating" },
                    { v: "98%", l: "Success" },
                    { v: "100+", l: "Reviews" },
                  ].map((x) => (
                    <div key={x.l} className="flex flex-col gap-0.5">
                      <span className="text-base font-bold tabular-nums">{x.v}</span>
                      <span className="text-[10px] uppercase tracking-wider text-foreground/40">
                        {x.l}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Card 5 — delivery speed */}
            <Reveal delay={0.08}>
              <div
                className={`flex flex-col justify-between gap-6 p-6 rounded-2xl h-full min-h-[300px] lg:min-h-[330px] ${CARD}`}
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                  Project delivery speed
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-5xl font-extrabold tracking-tighter leading-none">
                    <CountUp to={14} duration={2} /> days
                  </span>
                  <span className="text-xs text-foreground/50">
                    Average website delivery timeline
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-1">
                    {deliveryStages.map((_, i) => (
                      <span
                        key={i}
                        className="h-1.5 flex-1 rounded-full bg-brand"
                        style={{ opacity: 1 - i * 0.2 }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] font-medium text-foreground/40">
                    {deliveryStages.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Card 6 — performance */}
            <Reveal delay={0.16}>
              <div
                className={`flex flex-col justify-between gap-6 p-6 rounded-2xl h-full min-h-[300px] lg:min-h-[330px] ${CARD}`}
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                  Site performance
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-5xl font-extrabold tracking-tighter leading-none tabular-nums">
                    <CountUp to={120} duration={2} />
                    ms
                  </span>
                  <span className="text-xs text-foreground/50">
                    Average interaction response time
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="h-2 rounded-full bg-foreground/[0.07] overflow-hidden">
                    <span className="block h-full w-[60%] rounded-full bg-brand" />
                  </div>
                  <div className="flex justify-between text-[10px] font-medium text-foreground/40">
                    <span>0ms</span>
                    <span>99.9% reliability</span>
                    <span>200ms</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════ WORK PROCESS ═══════ */}
      <section className="px-5 md:px-6 py-20 md:py-28 bg-muted/30 border-y border-foreground/[0.06]">
        <div className="max-w-[1177px] mx-auto">
          <Reveal className="mb-10 md:mb-14 flex flex-col gap-4">
            <Eyebrow>Work process</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase leading-[1.05]">
              Why businesses work with us
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {processSteps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div
                  className={`flex flex-col gap-4 p-7 rounded-2xl h-full group hover:border-brand/40 transition-colors ${CARD}`}
                >
                  <span className="text-4xl font-extrabold tracking-tighter text-foreground/15 group-hover:text-brand/40 transition-colors tabular-nums">
                    {s.n}
                  </span>
                  <h3 className="text-lg font-extrabold tracking-tight">{s.title}</h3>
                  <p className="text-sm font-light leading-relaxed text-foreground/60">{s.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20 md:py-28 text-center px-5 md:px-6">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight mb-8">
            Want to see our services?
          </h2>
          <Link
            to="/services"
            className="inline-flex items-center gap-3 bg-foreground text-background rounded-full px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand hover:text-white transition-colors"
          >
            View Our Services
          </Link>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
