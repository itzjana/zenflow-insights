import { useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import { HorizontalPortfolio, type PortfolioItem } from "@/components/HorizontalPortfolio";
import { FloatingObject } from "@/components/FloatingObject";
import { CountUp } from "@/components/CountUp";
import bgImage from "@/assets/bg.png";

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

/* TODO — paste the real Google Drive folder URL for the graphic design archive. */
const GRAPHIC_DESIGN_DRIVE_URL = "#";
/* TODO — paste the real Instagram profile URL. */
const INSTAGRAM_URL = "#";

const portfolio: PortfolioItem[] = [
  { name: "Branding", tag: "Identity & Visual Systems", art: "layers", href: "/work/branding" },
  {
    name: "Digital Marketing",
    tag: "Performance & Growth",
    art: "spectrum",
    href: "/work/digital-marketing",
  },
  {
    name: "Web Production",
    tag: "Design & Engineering",
    art: "grid",
    href: "/work/web-production",
  },
  {
    name: "Graphic Design",
    tag: "Creative Archive",
    art: "type",
    href: GRAPHIC_DESIGN_DRIVE_URL,
    external: true,
  },
  { name: "Social", tag: "Follow the Journey", art: "orbit", href: INSTAGRAM_URL, external: true },
];

const metrics = [
  { label: "Happy Clients", to: 100, suffix: "+" },
  { label: "Avg. Traffic Boost", to: 150, suffix: "%" },
  { label: "Video Views", to: 10, suffix: "M+" },
  { label: "Years Experience", to: 5, suffix: "+" },
] as const;

/* ─── Glass card arrow icon ─── */
function ArrowIcon({ className }: { className?: string }) {
  return (
    <div
      className={`w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ${className ?? ""}`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 13L13 1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 1H3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 1V11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* TrustBadge removed — replaced by inline CTA in hero left column */

function Home() {
  // Shared trigger for the three hero glass cards. They are bottom-aligned and have
  // different heights, so watching each card individually would fire them at three
  // different scroll positions.
  const heroCardsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-background text-foreground font-sans">
      <SiteNav />

      {/* ═══════ DESKTOP HERO ═══════ */}
      <section className="hidden lg:flex relative flex-col justify-end px-10 pb-16 pt-32 overflow-hidden">
        <FloatingObject className="absolute top-0 right-0 w-full md:w-3/4 h-full z-0 opacity-60 md:opacity-70" />

        <div className="relative z-10 w-full mx-auto">
          <Reveal className="flex items-baseline gap-4 mb-6" y={20}>
            <span className="text-xs font-serif italic text-foreground/40">01. Digital Agency</span>
            <div className="h-px flex-1 bg-foreground/5" />
          </Reveal>

          <h1 className="text-[clamp(3rem,11vw,13rem)] font-extrabold leading-[0.85] tracking-tighter uppercase">
            <Reveal splitWords>Digital</Reveal>
            <div className="flex items-center gap-3 md:gap-10 flex-wrap">
              <Reveal
                as="span"
                className="font-serif italic font-semibold normal-case tracking-tight border-b-5 md:border-b-10 border-brand leading-none px-2"
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
          {/* Side by side needs 448 (copy) + 32 (gap) + 828 (cards) + 80 (gutters) = 1388px.
              Below that the copy and the card trio stack so the cards are never clipped. */}
          <div className="mt-12 flex flex-col min-[1400px]:flex-row gap-12 min-[1400px]:gap-8 items-start">
            {/* Left: description + tags */}
            <Reveal className="max-w-md shrink-0" delay={0.5}>
              <div className="flex flex-col">
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

                <div className="mt-6">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-3 h-12 px-6 rounded-full bg-brand text-white font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:translate-x-1.5"
                  >
                    Contact Agency
                    <span className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center text-xs transition-all duration-300 group-hover:rotate-45 group-hover:bg-white/40">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Right: Glass feature cards (inspired by reference image) */}
            <div
              ref={heroCardsRef}
              className="relative ml-auto flex flex-nowrap items-end justify-end gap-6 w-full max-w-210"
            >
              {/* Trust badge removed from desktop hero per request */}
              {/* Card 1: Perfect Security */}
              <Reveal delay={0.5} trigger={heroCardsRef} replay start="bottom 95%">
                <div className="group relative self-end w-65 h-42.5 rounded-3xl bg-white/10 backdrop-blur-3xl border border-white/15 p-5 shadow-[0_20px_60px_rgba(20,60,160,0.15)] hover:-translate-y-1 transition-transform duration-500 cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-brand/10 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 rounded-3xl border border-white/10" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-brand text-[10px] font-semibold uppercase tracking-[0.3em]">
                        Premium Production
                      </span>
                      <ArrowIcon className="h-10 w-10 text-transparent" />
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-3xl border border-white/20 bg-white/10 shadow-[inset_0_0_30px_rgba(255,255,255,0.2)] backdrop-blur-xl flex items-center justify-center text-brand/60">
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-brand/60"
                        >
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground/95 mb-1">
                          Video content that converts
                        </h4>
                        <p className="text-[11px] text-foreground/60 leading-relaxed">
                          Cinematic & high-performing video campaigns crafted to drive engagement.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Card 2: Integrated AI Agent */}
              <Reveal delay={0.5} trigger={heroCardsRef} replay start="bottom 95%">
                <div
                  className="group relative self-end w-65 h-72.5 bg-white/92 backdrop-blur-3xl border border-white/25 p-5 shadow-[0_20px_80px_rgba(14,74,206,0.08)] hover:-translate-y-1 transition-transform duration-500 cursor-pointer overflow-hidden"
                  style={{
                    clipPath:
                      "path('M 46 10 L 104 10 A 36 36 0 0 1 140 46 L 140 280 L 140 280 L 46 280 A 36 36 0 0 1 10 244 L 10 46 A 36 36 0 0 1 46 10 Z M 140 90 L 214 90 A 36 36 0 0 1 250 126 L 250 244 A 36 36 0 0 1 214 280 L 140 280 L 140 280 L 140 90 L 140 90 Z M 140 54 C 140 81 147.2 90 176 90 H 140 Z')",
                  }}
                >
                  <div className="absolute inset-0 bg-linear-to-br from-brand/10 via-transparent to-transparent pointer-events-none" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-full bg-linear-to-br from-brand/60 via-brand/40 to-white/70 border border-white/60 shadow-[0_0_40px_rgba(59,130,246,0.18)] backdrop-blur-2xl flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-white/70 via-brand/30 to-white/70 shadow-[inset_0_0_18px_rgba(255,255,255,0.65)]" />
                        </div>
                      </div>
                      <ArrowIcon className="h-10 w-10" />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-slate-900">
                          AI Marketing Engine
                        </h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          AI-powered audience targeting, campaign optimization, and content
                          personalization that turns traffic into qualified leads.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Card 3: Stat Card - 42% */}
              <Reveal delay={0.5} trigger={heroCardsRef} replay start="bottom 95%">
                <div className="group relative self-end w-65 h-45 rounded-3xl bg-white/6 backdrop-blur-3xl border border-white/10 p-5 shadow-[0_20px_60px_rgba(15,40,100,0.12)] hover:-translate-y-1 transition-transform duration-500 cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-brand/8 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 rounded-3xl border border-white/10" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-end"></div>
                    <div>
                      <span className="block text-[92px] font-extralight text-foreground leading-none">
                        150<span className="text-[32px] font-bold">%</span>
                      </span>
                      <p className="mt-3 text-[11px] uppercase ml-24 text-slate-600">
                        Avg. Traffic Boost
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ MOBILE HERO ═══════ */}
      {/* pt clears the fixed nav: 80px tall on mobile, 98px (floating pill) from md up */}
      <section className="lg:hidden relative min-h-[85vh] overflow-hidden bg-background px-5 pt-24 md:pt-32 pb-10">
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
              Zencyp is Arani's leading digital marketing and branding agency. We help brands grow
              with SEO, web design, social media, and creative video solutions.
            </p>
          </Reveal>

          {/* Service Tags */}
          <Reveal delay={0.3}>
            <div className="flex flex-wrap gap-2 mt-5">
              {["Branding", "SEO & PPC", "Web Dev", "Video"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-full border border-foreground/8 bg-foreground/3 text-[10px] font-bold uppercase tracking-widest text-foreground/50"
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
                className="flex-1 h-14 rounded-full border border-foreground/10 bg-foreground/2 text-foreground font-semibold text-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
              >
                Our Services
              </Link>
            </div>
          </Reveal>

          {/* Mobile Glass Cards (compact) */}
          <Reveal delay={0.5}>
            <div className="mt-10 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-foreground/3 backdrop-blur-md border border-foreground/5 p-4">
                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center mb-2">
                  <svg
                    className="text-brand"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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

              <div className="rounded-2xl bg-foreground/3 backdrop-blur-md border border-foreground/5 p-4">
                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center mb-2">
                  <svg
                    className="text-brand"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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

      <section id="capabilities" className="mb-16 md:mb-34 px-6 md:px-10 bg-background">
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
                <div className="absolute inset-0 -z-10 bg-linear-to-br from-brand/6 via-transparent to-transparent pointer-events-none" />

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

                  <div className="hidden lg:flex shrink-0 size-24 rounded-full bg-linear-to-br from-brand/20 to-brand/5 border border-brand/20 items-center justify-center opacity-60">
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
      <section
        className="relative py-24 md:py-32 px-6 md:px-10 text-foreground overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        {" "}
        <div className="absolute -top-32 -left-32 size-100 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 size-125 rounded-full bg-black/10 blur-3xl" />
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
