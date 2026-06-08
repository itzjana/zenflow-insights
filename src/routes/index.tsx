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
    title: "Branding & Logo Design",
    tags: ["Identity", "Visual Strategy"],
    copy: "Craft a bold brand identity with custom logos, color schemes, typography guidelines, and complete brand books. We tell your unique story through visuals that build trust and command authority.",
  },
  {
    n: "02",
    title: "Website Development",
    tags: ["UX/UI", "High Performance"],
    copy: "Get high-performance, responsive, mobile-first websites optimized for search rankings and visitor conversion. We leverage modern web tech to build blazing fast, secure digital platforms.",
  },
  {
    n: "03",
    title: "SEO & Search Ads (SEM)",
    tags: ["Organic Traffic", "PPC Campaigns"],
    copy: "Boost your organic reach and lead generation. We execute structured white-hat SEO tactics and high-yield Google Ads campaigns to capture high-intent buyers exactly when they search.",
  },
  {
    n: "04",
    title: "Social Media Marketing",
    tags: ["Content Strategy", "Engagement"],
    copy: "Engage your audience where they spend their time. We produce thumb-stopping graphics, custom reels, and content schedules to drive direct sales on Instagram, Facebook, and LinkedIn.",
  },
  {
    n: "05",
    title: "Video Production",
    tags: ["Storytelling", "Video Ads"],
    copy: "Capture attention and increase conversions with professional promotional videos, brand explainers, social media reels, and high-impact commercial video production.",
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

function Home() {
  return (
    <div className="bg-background text-foreground font-sans">
      <SiteNav />

      {/* Hero with parallax 3D object */}
      <section className="relative min-h-[100svh] flex flex-col justify-end px-5 md:px-10 pb-12 md:pb-16 pt-28 md:pt-32 overflow-hidden">
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

          <div className="mt-12 flex flex-col md:flex-row gap-12 md:gap-16 items-start md:items-end">
            <Reveal className="max-w-md" delay={0.5}>
              <p className="text-lg md:text-xl font-light text-foreground/70 leading-snug mb-6">
                Zencyp is Arani, Tamil Nadu's leading full-service digital marketing and branding
                agency. We help startups and established brands grow with SEO, web design, social
                media, and creative video solutions.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Branding", "SEO & PPC", "Web Dev"].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full border border-foreground/10 bg-background/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>

            <a href="#capabilities" className="md:ml-auto group cursor-pointer relative shrink-0">
              <div className="size-28 md:size-32 rounded-full border border-foreground/10 bg-background/40 backdrop-blur-md flex items-center justify-center group-hover:bg-brand group-hover:border-brand transition-all duration-700">
                <div className="text-center">
                  <span className="block text-[10px] font-bold uppercase tracking-widest mb-1">
                    Scroll
                  </span>
                  <span className="block text-xs">↓</span>
                </div>
              </div>
              <div className="absolute -inset-2 rounded-full border border-dashed border-foreground/10 animate-spin-slow group-hover:opacity-0 transition-opacity" />
            </a>
          </div>
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

      <section id="capabilities" className="py-24 md:py-32 px-6 md:px-10 bg-background">
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
