import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles,
  Server,
  ArrowRightLeft,
  Users,
  Video,
  FileText,
  Check,
  ArrowRight,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services – SEO, Web Dev, Social Media & More | Zencyp" },
      {
        name: "description",
        content:
          "Discover Zencyp’s services: web development, branding, SEO, PPC, social media, video, and graphic design. We craft solutions that elevate brands.",
      },
      {
        property: "og:title",
        content: "Our Services – SEO, Web Dev, Social Media & More | Zencyp",
      },
      {
        property: "og:description",
        content:
          "Detailed services breakdown, interactive process roadmap, and marketing solutions from Zencyp.",
      },
    ],
  }),
  component: Services,
});

const servicesPillars = [
  {
    n: "01",
    title: "Branding & Logo Design",
    icon: Sparkles,
    tagline: "Crafting bold brand identities and design guidelines.",
    desc: "We formulate the visual and conceptual foundation of your business, ensuring brand consistency across all print and digital media assets.",
    bullets: [
      "Custom logo design with responsive vector variations",
      "Harmonious brand color palettes & corporate typography guide",
      "Sleek business cards, letterheads, and print collateral",
      "Comprehensive digital brand guidelines (brand book)",
      "Brand messaging strategy & core value definitions",
    ],
  },
  {
    n: "02",
    title: "Website Development",
    icon: Server,
    tagline: "High-performance, secure, and responsive web platforms.",
    desc: "We develop lightning-fast, mobile-first websites built for maximum speed, search indexing crawlability, and optimum visitor conversion rates.",
    bullets: [
      "Modern React, Next.js, and customizable CMS setups",
      "Responsive UX/UI custom designs optimized for mobile devices",
      "Edge caching, CDN distribution & asset optimization",
      "SEO-friendly semantic HTML structure & clean codebases",
      "SSL configuration, custom redirects, and web deployment support",
    ],
  },
  {
    n: "03",
    title: "SEO & Search Ads (SEM)",
    icon: ArrowRightLeft,
    tagline: "White-hat SEO techniques and high-ROI ad campaigns.",
    desc: "Get found by high-intent customers. We boost your Google rankings and run targeted paid ad campaigns to drive direct leads.",
    bullets: [
      "Localized SEO campaigns (Arani, Chennai, and Tamil Nadu)",
      "Technical site audits, crawl fix, and index verification",
      "Comprehensive keyword research & search intent mapping",
      "On-page meta tag optimization & local schema markups",
      "Targeted Google Search Ads & conversion-rate analytics setup",
    ],
  },
  {
    n: "04",
    title: "Social Media & Content",
    icon: Users,
    tagline: "Creative social campaigns, reels, and content schedules.",
    desc: "Engage your audience and build social equity. We produce creative graphic layouts, reels, and content copy to drive sales.",
    bullets: [
      "Targeted social media content calendar planning",
      "Creative Instagram reels & short-form video scripting",
      "Custom graphic templates for Instagram, Facebook, and LinkedIn",
      "Paid social media campaign setup & conversion audits",
      "Detailed monthly engagement, click-through & growth reports",
    ],
  },
  {
    n: "05",
    title: "Video Production",
    icon: Video,
    tagline: "Compelling video promos, explainers, and ads.",
    desc: "We produce professional, high-definition videos that captivate your target demographic and explain your product value in seconds.",
    bullets: [
      "High-impact video advertisements & promotional clips",
      "Explanatory videos, client testimonials, & product walkthroughs",
      "Creative storyboarding, script development, & voiceovers",
      "Advanced post-production, transitions, & motion graphics",
      "Multi-channel video aspect ratio optimizations",
    ],
  },
  {
    n: "06",
    title: "Graphic Design",
    icon: FileText,
    tagline: "Stunning marketing collateral and visual creatives.",
    desc: "Sleek graphic designs for digital display ads, brochures, catalog layouts, print packaging, and custom banners.",
    bullets: [
      "High-conversion digital ad banner layouts (display ads)",
      "Brochures, catalog designs, flyers, & print creatives",
      "Custom vectors & custom illustrations for web pages",
      "Social media post template sets & header banners",
      "Print-ready product packaging layouts & merchandise",
    ],
  },
];

const steps = [
  {
    n: "01",
    phase: "Audit",
    title: "SEO & Content Audit",
    time: "First 48 Hours",
    copy: "We run deep technical audits on your site to locate indexing issues, meta tag gaps, loading speed blocks, and assess competitor keywords.",
  },
  {
    n: "02",
    phase: "Blueprint",
    title: "Strategy & Keyword Map",
    time: "Week 1",
    copy: "We construct a localized keyword strategy, outline custom page layouts, design a content calendar, and set up conversion goals in GA4.",
  },
  {
    n: "03",
    phase: "Execute",
    title: "Creative & Coding Rollout",
    time: "Month 1",
    copy: "Our copywriters and developers launch SEO metadata rewrites, build customized web pages, create branding guides, and launch target campaigns.",
  },
  {
    n: "04",
    phase: "Optimize",
    title: "Growth Tuning & Analytics",
    time: "Ongoing",
    copy: "We analyze performance dashboards weekly, refine bids on ads, deploy new blog content, and build authoritative local citations.",
  },
];

const faqs = [
  {
    q: "How does Zencyp help improve our organic search visibility?",
    a: "We run a complete technical, on-page, and off-page SEO cycle. We resolve underlying crawl errors (like server blocks or 404 links), rewrite meta titles and descriptions using high-value keywords, structure content headers cleanly, and construct local schema data. We also build high-quality links and local directory listings to expand authority.",
  },
  {
    q: "Can we start with a few specific services and scale up later?",
    a: "Absolutely. You can start with a single module, like a Web Development upgrade or local SEO, and add services like Social Media Management or Video Production as your marketing goals grow. Our subscription model is fully flexible.",
  },
  {
    q: "Do you manage our advertising budget directly?",
    a: "We set up and manage your campaigns inside your own Google Ads or Meta Ads accounts, ensuring you retain full ownership of billing. We handle target research, ad creative, bidding optimization, and analytics reporting, while your card is charged directly by the platforms.",
  },
  {
    q: "What is the timeline to see tangible organic traffic results?",
    a: "Paid advertising campaigns generate leads almost instantly upon launch. Organic SEO, however, is a compounding investment. While technical updates and index errors are fixed in Month 1, notable ranking lifts for competitive keywords typically manifest in 60 to 90 days.",
  },
  {
    q: "How do we collaborate and monitor progress?",
    a: "We set up clear tracking loops. We link your site to GA4 and Search Console, sending you customized monthly reports on organic traffic, conversion clicks, and ad performance. We are also available for check-ins to align on the next content sprint.",
  },
];

function Services() {
  const [activePillar, setActivePillar] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Snake scroll timeline animations
  useEffect(() => {
    const el = containerRef.current;
    const path = pathRef.current;
    if (!el || !path) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // 1. Snake stroke drawing setup
      const pathLength = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      // Animate path drawing on scroll
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 35%",
          end: "bottom 70%",
          scrub: 0.5,
        },
      });

      // 2. Individual card scroll highlights
      const cards = el.querySelectorAll(".process-card");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-background text-foreground selection:bg-brand selection:text-brand-foreground font-sans">
      <SiteNav />

      {/* Hero Section */}
      <section className="pt-40 md:pt-48 pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
            <span className="size-2 bg-brand rounded-full animate-pulse" /> Digital Solutions
          </span>
          <h1 className="mt-8 text-[clamp(2.5rem,10vw,9.5rem)] font-extrabold leading-[0.85] tracking-tighter uppercase text-balance">
            Our Digital
            <br />
            Marketing
            <br />
            <span className="text-outline">Services.</span>
          </h1>
          <p className="mt-12 max-w-2xl text-lg md:text-xl font-light text-foreground/70 leading-snug">
            We deliver result-oriented branding, web development, SEO auditing, and visual marketing
            assets. Elevate your presence without recruitment delay.
          </p>

          {/* Quick Metrics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="rounded-2xl border border-foreground/10 bg-muted/30 p-5 md:p-6 hover:border-brand/40 transition-colors">
              <span className="text-xs text-foreground/40 font-bold uppercase tracking-widest">
                Client Retainers
              </span>
              <span className="block mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                100+
              </span>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-muted/30 p-5 md:p-6 hover:border-brand/40 transition-colors">
              <span className="text-xs text-foreground/40 font-bold uppercase tracking-widest">
                Avg Traffic Lift
              </span>
              <span className="block mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                150%+
              </span>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-muted/30 p-5 md:p-6 hover:border-brand/40 transition-colors">
              <span className="text-xs text-foreground/40 font-bold uppercase tracking-widest">
                Video Reach
              </span>
              <span className="block mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                10M+
              </span>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-muted/30 p-5 md:p-6 hover:border-brand/40 transition-colors">
              <span className="text-xs text-foreground/40 font-bold uppercase tracking-widest">
                Audit Timeframe
              </span>
              <span className="block mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                48 Hours
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Service Pillars Section */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-muted/20 border-y border-foreground/5">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
              <span className="size-2 bg-brand rounded-full" /> Capabilities
            </span>
            <h2 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tighter uppercase">
              Core Specialties
            </h2>
            <p className="mt-4 max-w-xl text-foreground/60 font-light">
              Explore our comprehensive toolkit designed to improve search rankings, craft identity,
              and drive growth.
            </p>
          </Reveal>

          {/* Interactive tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mt-12">
            {/* Left list controls */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {servicesPillars.map((p, i) => {
                const IconComponent = p.icon;
                const active = activePillar === i;
                return (
                  <button
                    key={p.n}
                    onClick={() => setActivePillar(i)}
                    className={`text-left p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                      active
                        ? "bg-foreground text-background border-foreground shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]"
                        : "bg-background text-foreground border-foreground/10 hover:border-brand"
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <span
                        className={`text-[10px] font-bold tracking-widest ${active ? "text-brand" : "text-foreground/40"}`}
                      >
                        {p.n}
                      </span>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold tracking-tight">{p.title}</h3>
                        <p
                          className={`text-xs mt-1 ${active ? "text-background/60" : "text-foreground/50"} line-clamp-1`}
                        >
                          {p.tagline}
                        </p>
                      </div>
                    </div>
                    <IconComponent
                      className={`size-5 transition-transform duration-300 ${active ? "text-brand" : "text-foreground/30 group-hover:scale-110"}`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right details content card */}
            <div className="lg:col-span-7">
              <div className="h-full bg-background border border-foreground/10 rounded-3xl p-6 md:p-10 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.05)] flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 bg-gradient-to-br from-brand/[0.08] to-transparent size-64 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between border-b border-foreground/5 pb-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand bg-foreground px-3 py-1 rounded-full">
                      Capability {servicesPillars[activePillar].n}
                    </span>
                    <span className="text-xs text-foreground/40 font-serif italic">
                      Zencyp Marketing
                    </span>
                  </div>

                  <h3 className="mt-8 text-2xl md:text-3xl font-extrabold tracking-tight">
                    {servicesPillars[activePillar].title}
                  </h3>
                  <p className="mt-4 text-foreground/70 font-light leading-relaxed text-balance">
                    {servicesPillars[activePillar].desc}
                  </p>

                  <div className="mt-8">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-4">
                      Deliverables:
                    </h4>
                    <ul className="space-y-3">
                      {servicesPillars[activePillar].bullets.map((b, bi) => (
                        <li
                          key={bi}
                          className="flex items-start gap-3 text-sm text-foreground/80 leading-snug"
                        >
                          <Check className="size-4 text-brand shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-foreground/5 flex items-center justify-between">
                  <span className="text-xs text-foreground/40">Custom-tailored campaigns</span>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground hover:text-brand transition-colors"
                  >
                    Inquire about this module <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Workflow ("How it Works") with Snake Scroll Line */}
      <section
        ref={containerRef}
        className="py-16 md:py-20 px-6 md:px-10 relative overflow-hidden border-b border-foreground/5"
      >
        {/* Animated Snake Path SVG (desktop only) */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-32 bottom-16 w-32 z-0 pointer-events-none">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 1000"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* Background path track */}
            <path
              d="M 50,0 C 20,150 20,150 50,280 C 80,410 80,410 50,540 C 20,670 20,670 50,800 C 80,930 80,930 50,1000"
              className="stroke-foreground/10 stroke-[2.5]"
            />
            {/* Animated drawing line (snake) */}
            <path
              ref={pathRef}
              d="M 50,0 C 20,150 20,150 50,280 C 80,410 80,410 50,540 C 20,670 20,670 50,800 C 80,930 80,930 50,1000"
              className="stroke-brand stroke-[4.5]"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal className="mb-16 text-left">
            <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center justify-start gap-4">
              <span className="size-2 bg-brand rounded-full" /> Operational Workflow
            </span>
            <h2 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tighter uppercase">
              Our Process
            </h2>
            <p className="mt-4 max-w-xl text-foreground/60 font-light">
              How we onboard, execute, and deliver continuous digital growth.
            </p>
          </Reveal>

          {/* Timeline Zigzag steps */}
          <div className="space-y-12 md:space-y-16">
            {steps.map((s, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={s.n} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  {/* Left Column (shows card if even, empty on odd) */}
                  <div className={`md:col-span-5 ${isEven ? "" : "md:order-2 md:col-start-8"}`}>
                    <div
                      className={`process-card bg-background border border-foreground/10 p-6 md:p-8 rounded-3xl hover:border-brand transition-all duration-500 flex flex-col justify-between min-h-[190px] group shadow-[0_20px_50px_-30px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_-20px_rgba(192,255,0,0.1)]`}
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-foreground/5 pb-4 mb-5">
                          <span className="text-xs font-serif italic text-foreground/30">
                            {s.phase}
                          </span>
                          <span className="text-sm font-extrabold text-brand group-hover:scale-110 transition-transform">
                            {s.n}
                          </span>
                        </div>
                        <h3 className="font-bold tracking-tight text-xl mb-3">{s.title}</h3>
                        <p className="text-sm text-foreground/60 font-light leading-relaxed">
                          {s.copy}
                        </p>
                      </div>
                      <div className="mt-6 pt-3 border-t border-foreground/5 text-[10px] font-bold uppercase tracking-widest text-brand">
                        {s.time}
                      </div>
                    </div>
                  </div>

                  {/* Empty Spacer Column matching the timeline line */}
                  <div className="hidden md:block md:col-span-2 md:order-1" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-muted/20 border-t border-foreground/5">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4">
              <span className="size-2 bg-brand rounded-full" /> FAQs
            </span>
            <h2 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tighter uppercase">
              Common Queries
            </h2>
          </Reveal>

          <div className="border-t border-foreground/10 divide-y divide-foreground/10">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="py-6 transition-all duration-300">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-none"
                  >
                    <span className="text-lg md:text-xl font-bold tracking-tight pr-4 group-hover:text-brand transition-colors">
                      {faq.q}
                    </span>
                    <span
                      className={`inline-flex items-center justify-center size-9 rounded-full border border-foreground/10 transition-all duration-300 ${isOpen ? "rotate-180 bg-brand border-brand text-brand-foreground" : "group-hover:border-foreground/30"}`}
                    >
                      ↓
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isOpen ? "max-h-[300px] mt-4 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-sm md:text-base text-foreground/75 font-light leading-relaxed max-w-3xl">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 md:py-48 px-6 md:px-10 text-center bg-background relative overflow-hidden border-t border-foreground/5">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <span className="text-[30vw] font-black uppercase tracking-tighter leading-none select-none">
            ZENCYP
          </span>
        </div>
        <div className="relative z-10">
          <Reveal
            as="h2"
            className="text-[clamp(2.5rem,8vw,8rem)] font-extrabold tracking-tighter leading-[0.9] mb-12 uppercase"
          >
            Fuel your online
            <br />
            growth.
          </Reveal>
          <MagneticButton
            as="a"
            href="/contact"
            strength={0.5}
            className="bg-foreground text-background rounded-full px-10 md:px-14 py-5 md:py-6 text-base md:text-xl hover:bg-brand hover:text-brand-foreground transition-colors duration-500 font-bold uppercase tracking-widest"
          >
            Claim Free Consultation <span className="text-2xl">→</span>
          </MagneticButton>
          <div className="mt-8">
            <Link
              to="/philosophy"
              className="text-[11px] font-bold uppercase tracking-widest hover:text-foreground/60 underline decoration-brand decoration-2 underline-offset-4"
            >
              Learn more about us →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
