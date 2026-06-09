import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import { HorizontalPortfolio } from "@/components/HorizontalPortfolio";
import { FloatingObject } from "@/components/FloatingObject";
import { CountUp } from "@/components/CountUp";
import workVault from "@/assets/work-vault.jpg";
import workLumina from "@/assets/work-lumina.jpg";
import workAether from "@/assets/work-aether.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arani Digital Marketing & Branding Agency – Zencyp" },
      {
        name: "description",
        content:
          "Zencyp is a top Arani, Tamil Nadu digital marketing and branding agency. We help businesses grow with SEO, web design, social media, and creative video solutions.",
      },
      { property: "og:title", content: "Arani Digital Marketing & Branding Agency – Zencyp" },
      {
        property: "og:description",
        content:
          "Partner with Zencyp for full-service SEO, branding, SMM, video production, and web development in Tamil Nadu.",
      },
    ],
  }),
  component: Home,
});

const services = [
  {
    n: "01",
    title: "Branding",
    tags: ["Identity", "Visual Strategy"],
    copy: "Craft a bold brand identity with custom logos, color schemes, typography guidelines, and complete brand books. We tell your unique story through visuals that build trust and command authority.",
  },
  {
    n: "02",
    title: "Video Production",
    tags: ["Storytelling", "Video Ads"],
    copy: "Capture attention and increase conversions with professional promotional videos, brand explainers, social media reels, and high-impact commercial video production.",
  },
  {
    n: "03",
    title: "Digital Marketing & Ads",
    tags: ["Meta Ads", "Google Ads"],
    copy: "Boost your visibility with Meta Ads, Google Ads, search marketing, and conversion-driven digital campaigns that reach high-intent customers.",
  },
  {
    n: "04",
    title: "Website Development",
    tags: ["UX/UI", "High Performance"],
    copy: "Get high-performance, responsive, mobile-first websites optimized for search rankings and visitor conversion. We leverage modern web tech to build blazing fast, secure digital platforms.",
  },
  {
    n: "05",
    title: "Social Media Management",
    tags: ["Content Strategy", "Engagement"],
    copy: "Engage your audience with social media content, reels, and campaign management that grows your brand on Instagram, Facebook, and LinkedIn.",
  },
  {
    n: "06",
    title: "Graphic Design",
    tags: ["Creatives", "Print & Digital"],
    copy: "Sleek marketing collateral, ad banners, catalog layouts, and social media creatives tailored to align perfectly with your brand's digital visual language.",
  },
];

const portfolio = [
  { name: "Vault 01", tag: "Web Dev & Platform Design", img: workVault },
  { name: "Lumina", tag: "Search Marketing (SEM)", img: workLumina },
  { name: "Aether", tag: "Branding & Social Campaign", img: workAether },
  { name: "Vault 01", tag: "Web Dev & Platform Design", img: workVault },
];

const metrics = [
  { label: "Happy Clients", to: 100, suffix: "+" },
  { label: "Avg. Traffic Boost", to: 150, suffix: "%" },
  { label: "Video Views", to: 10, suffix: "M+" },
  { label: "Years Experience", to: 5, suffix: "+" },
] as const;

/* ─── Glass card arrow icon ─── */
function ArrowIcon() {
  return (
    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 13L13 1M13 1H3M13 1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ─── Stacked avatar trust badge ─── */
function TrustBadge() {
  const colors = ["#6D33E2", "#9B59B6", "#3498DB", "#2ECC71", "#E67E22"];
  const initials = ["J", "A", "K", "S", "R"];
  return (
    <Reveal delay={0.7}>
      <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xl rounded-full px-4 py-2.5 shadow-lg shadow-black/5 border border-white/80">
        <div className="flex -space-x-2.5">
          {initials.map((letter, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: colors[i], zIndex: 5 - i }}
            >
              {letter}
            </div>
          ))}
        </div>
        <div>
          <span className="text-foreground font-bold text-sm">Active Clients</span>
          <span className="text-brand font-extrabold text-sm ml-1.5">+323</span>
        </div>
      </div>
    </Reveal>
  );
}

function Home() {
  return (
    <div className="bg-background text-foreground font-sans">
      <SiteNav />

      {/* ═══════ DESKTOP HERO ═══════ */}
      <section className="hidden md:flex relative min-h-[100svh] flex-col justify-end px-10 pb-16 pt-32 overflow-hidden">
        <FloatingObject className="absolute top-0 right-0 w-full md:w-3/4 h-full z-0 opacity-60 md:opacity-70" />

        <div className="relative z-10 w-full max-w-[1600px] mx-auto">
          <Reveal className="flex items-baseline gap-4 mb-6" y={20}>
            <span className="text-xs font-serif italic text-foreground/40">01. Digital Agency</span>
            <div className="h-px flex-1 bg-foreground/5" />
          </Reveal>

          <h1 className="text-[clamp(3rem,11vw,13rem)] font-extrabold leading-[0.85] tracking-tighter uppercase">
            <Reveal splitWords>Digital</Reveal>
            <div className="flex items-center gap-3 md:gap-10 flex-wrap">
              <Reveal
                as="span"
                className="font-serif italic font-semibold normal-case tracking-tight border-b-[5px] md:border-b-[10px] border-brand leading-none px-2"
                delay={0.1}
              >
                growth
              </Reveal>
              <Reveal as="span" splitWords delay={0.2}>
                partner
              </Reveal>
            </div>
            <Reveal as="div" className="text-outline" delay={0.4} splitWords>
              in Tamil Nadu.
            </Reveal>
          </h1>

          {/* Bottom area: left copy + right glass cards */}
          <div className="mt-12 flex flex-col lg:flex-row gap-12 lg:gap-8 items-start lg:items-end">
            {/* Left: description + tags + trust badge */}
            <Reveal className="max-w-md flex-shrink-0" delay={0.5}>
              <p className="text-lg md:text-xl font-light text-foreground/70 leading-snug mb-6">
                Zencyp is Arani, Tamil Nadu's leading full-service digital marketing and branding
                agency. We help startups and established brands grow with SEO, web design, social
                media, and creative video solutions.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                {["Branding", "SEO & PPC", "Web Dev"].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full border border-foreground/10 bg-background/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <TrustBadge />
            </Reveal>

            {/* Right: Glass feature cards (inspired by reference image) */}
            <div className="lg:ml-auto flex gap-4 flex-wrap justify-end max-w-2xl">
              {/* Card 1: SEO-Driven Growth */}
              <Reveal delay={0.5}>
                <div className="group relative w-[220px] rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-transform duration-500 cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent pointer-events-none rounded-2xl" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand/10 text-brand text-[9px] font-bold uppercase tracking-wider">
                        SEO Strategy
                      </span>
                      <ArrowIcon />
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/15 flex items-center justify-center mb-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6D33E2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                        <path d="M11 8v6M8 11h6" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-bold text-foreground mb-1">SEO-driven growth engine</h4>
                    <p className="text-[11px] text-foreground/50 leading-relaxed">
                      White-hat SEO tactics for maximum organic visibility and lead gen.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Card 2: Integrated Branding */}
              <Reveal delay={0.6}>
                <div className="group relative w-[220px] rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-transform duration-500 cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none rounded-2xl" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <ArrowIcon />
                    </div>
                    <h4 className="text-base font-bold text-foreground mb-2">
                      Integrated Branding
                    </h4>
                    <p className="text-[11px] text-foreground/50 leading-relaxed">
                      End-to-end brand identity crafted for personalized client experiences across all touchpoints.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Card 3: Stat Card */}
              <Reveal delay={0.7}>
                <div className="group relative w-[160px] rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-transform duration-500 cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent pointer-events-none rounded-2xl" />
                  <div className="relative z-10">
                    <div className="flex justify-end mb-2">
                      <ArrowIcon />
                    </div>
                    <span className="block text-4xl font-extrabold tracking-tighter text-foreground">
                      <CountUp to={150} suffix="%" duration={2.5} />
                    </span>
                    <p className="text-[10px] text-foreground/50 leading-relaxed mt-2">
                      Average traffic boost with our SEO & branding solutions
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ MOBILE HERO ═══════ */}
      <section className="md:hidden relative min-h-screen overflow-hidden bg-background px-5 pt-24 pb-10">
        {/* Decorative gradient blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-brand/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-56 h-56 rounded-full bg-brand/15 blur-[80px] pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10">
          <Reveal className="flex items-center gap-3 mb-8" y={15}>
            <span className="size-2 bg-brand rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40">
              Digital Agency
            </span>
            <div className="h-px flex-1 bg-foreground/5" />
          </Reveal>

          <Reveal>
            <h1 className="text-[2.75rem] font-extrabold leading-[0.9] tracking-tighter uppercase text-foreground">
              Digital
              <br />
              <span className="font-serif italic font-semibold normal-case tracking-tight text-brand">
                growth
              </span>{" "}
              partner
              <br />
              <span className="text-[2.25rem] text-foreground/15">in Tamil Nadu.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 text-base font-light text-foreground/60 leading-relaxed max-w-sm">
              Zencyp is Arani's leading digital marketing and branding agency. We help brands grow with SEO, web design, social media, and creative video solutions.
            </p>
          </Reveal>

          {/* Service Tags */}
          <Reveal delay={0.3}>
            <div className="flex flex-wrap gap-2 mt-5">
              {["Branding", "SEO & PPC", "Web Dev", "Video"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-full border border-foreground/8 bg-foreground/[0.03] text-[10px] font-bold uppercase tracking-widest text-foreground/50"
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>

          {/* CTA Buttons */}
          <Reveal delay={0.4}>
            <div className="mt-10 flex flex-row gap-3">
              <Link
                to="/contact"
                className="flex-1 h-14 rounded-full bg-brand text-white font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
              >
                Get Started
                <span className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center text-xs">
                  →
                </span>
              </Link>

              <Link
                to="/services"
                className="flex-1 h-14 rounded-full border border-foreground/10 bg-foreground/[0.02] text-foreground font-semibold text-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
              >
                Our Services
              </Link>
            </div>
          </Reveal>

          {/* Mobile Glass Cards (compact) */}
          <Reveal delay={0.5}>
            <div className="mt-10 grid grid-cols-2 gap-3">

              <div className="rounded-2xl bg-foreground/[0.03] backdrop-blur-md border border-foreground/5 p-4">
                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6D33E2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </div>
                <span className="text-2xl font-extrabold tracking-tighter text-foreground">
                  <CountUp to={150} suffix="%" duration={2} />
                </span>
                <p className="text-[9px] font-medium uppercase tracking-wider text-foreground/40 mt-1">
                  Avg. Traffic Boost
                </p>
              </div>

              <div className="rounded-2xl bg-foreground/[0.03] backdrop-blur-md border border-foreground/5 p-4">
                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6D33E2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <span className="text-2xl font-extrabold tracking-tighter text-foreground">
                  <CountUp to={100} suffix="+" duration={2} />
                </span>
                <p className="text-[9px] font-medium uppercase tracking-wider text-foreground/40 mt-1">
                  Happy Clients
                </p>
              </div>
            </div>
          </Reveal>

          {/* Mobile trust badge */}
          <Reveal delay={0.6}>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["#6D33E2", "#9B59B6", "#3498DB", "#2ECC71"].map((c, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: c, zIndex: 4 - i }}
                  >
                    {["J", "A", "K", "S"][i]}
                  </div>
                ))}
              </div>
              <span className="text-xs text-foreground/50">
                <span className="font-bold text-foreground">323+</span> active clients trust us
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-foreground/5 py-6">
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-16 shrink-0">
              {[
                "Branding & Design",
                "Search Optimization",
                "Social Media Marketing",
                "Video Production",
                "Web Development",
                "Graphic Design",
              ].map((t) => (
                <span
                  key={t}
                  className="font-serif italic text-3xl md:text-5xl text-foreground/20 uppercase"
                >
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section id="capabilities" className="py-12 mb-50 md:mb-34 md:py-28 px-6 md:px-10 bg-background">
        <div className="max-w-5xl mx-auto">
          <ScrollStack
            itemDistance={120}
            itemScale={0.03}
            baseScale={0.85}
            useWindowScroll={true}
            className="w-full"
            header={
              <Reveal className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <span className="text-foreground text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
                  <span className="size-2 bg-brand rounded-full" /> Core Capabilities
                </span>
                <span className="text-[10px] font-medium text-foreground/30 uppercase tracking-[0.2em] font-serif italic">
                  Stack & scroll
                </span>
              </Reveal>
            }
          >
            {services.map((s) => (
              <ScrollStackItem
                key={s.n}
                itemClassName="relative overflow-hidden rounded-3xl border border-foreground/10 bg-background p-6 md:p-12 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] w-full min-h-[300px] flex flex-col justify-between"
              >
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/[0.06] via-transparent to-transparent pointer-events-none" />

                <div className="flex items-baseline justify-between mb-6 md:mb-8 gap-4">
                  <span className="text-xs font-bold text-foreground/30 tracking-widest">
                    {s.n}
                  </span>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-full border border-foreground/10 text-[9px] md:text-[10px] font-bold uppercase tracking-widest"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-8 md:gap-12 flex-1">
                  <div className="flex-1">
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-balance">
                      {s.title}
                    </h3>
                    <p className="mt-4 md:mt-6 max-w-xl text-sm md:text-base text-foreground/60 font-light leading-relaxed text-balance">
                      {s.copy}
                    </p>
                  </div>

                  <div className="hidden lg:flex flex-shrink-0 size-24 rounded-full bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/20 items-center justify-center opacity-60">
                    <div className="text-3xl font-bold text-brand/40">{s.n}</div>
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </section>

      {/* Horizontal portfolio with pinned scroll */}
      <HorizontalPortfolio items={portfolio} />

      {/* Metrics with glass cards */}
      <section className="relative py-24 md:py-32 px-6 md:px-10 bg-brand text-brand-foreground overflow-hidden">
        <div className="absolute -top-32 -left-32 size-[400px] rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 size-[500px] rounded-full bg-black/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          <Reveal className="mb-16">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-[0.95] max-w-3xl">
              We leverage data, design, and SEO to fuel your growth.
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.08}>
                <div className="rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 p-6 md:p-8 h-full transition-transform duration-500 hover:-translate-y-1.5">
                  <span className="block text-5xl md:text-6xl font-extrabold tracking-tighter tabular-nums">
                    <CountUp to={m.to} suffix={m.suffix} duration={2.5} />
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-3 opacity-60">
                    {m.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA with magnetic button */}
      <section className="py-32 md:py-48 px-6 md:px-10 text-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none flex items-center justify-center">
          <span className="text-[30vw] font-black uppercase tracking-tighter leading-none select-none">
            ZEN
          </span>
        </div>
        <div className="relative z-10">
          <Reveal
            as="h2"
            splitWords
            className="text-[clamp(2.75rem,10vw,10rem)] font-extrabold tracking-tighter leading-[0.9] mb-12"
          >
            Ready to grow your brand?
          </Reveal>
          <MagneticButton
            as="a"
            href="/contact"
            strength={0.5}
            className="bg-foreground text-background rounded-full px-10 md:px-14 py-5 md:py-6 text-base md:text-xl hover:bg-brand hover:text-brand-foreground transition-colors duration-500 font-bold uppercase tracking-widest"
          >
            Contact Agency <span className="text-2xl">→</span>
          </MagneticButton>
          <div className="mt-8">
            <Link
              to="/services"
              className="text-[11px] font-bold uppercase tracking-widest hover:text-foreground/60 underline decoration-brand decoration-2 underline-offset-4"
            >
              See our services &amp; rates →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
