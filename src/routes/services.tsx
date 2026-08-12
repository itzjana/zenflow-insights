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
    title: "Branding",
    icon: Sparkles,
    tagline: "Crafting bold brand identities and design guidelines.",
    desc: "We formulate the visual and conceptual foundation of your business, ensuring brand consistency across print and digital media.",
    bullets: [
      "Custom logo systems with responsive vector variations",
      "Harmonized brand color palettes & typography guidelines",
      "Branded marketing collateral, business cards, and stationery",
      "Complete digital brand guidelines and messaging frameworks",
      "Brand positioning for premium digital campaigns",
    ],
  },
  {
    n: "02",
    title: "Video Production",
    icon: Video,
    tagline: "Compelling video promos, explainers, and ads.",
    desc: "We produce professional video content that captures attention, tells your story, and converts audiences across social and search channels.",
    bullets: [
      "High-impact promotional & brand storytelling videos",
      "Social media reels, ads, and product explainers",
      "Full script, storyboard, and voiceover production",
      "Post-production, motion graphics, and color grading",
      "Multi-platform video deliverables for YouTube, Instagram, and ads",
    ],
  },
  {
    n: "03",
    title: "Digital Marketing & Ads",
    icon: ArrowRightLeft,
    tagline: "Meta Ads, Google Ads, and growth-focused digital campaigns.",
    desc: "We drive demand with paid ads and organic marketing. Our campaigns combine Meta Ads, Google Search Ads, SEO, and conversion-focused landing pages.",
    bullets: [
      "Google Ads search campaigns and landing page optimization",
      "Meta Ads creative strategy for Facebook and Instagram",
      "Keyword research, audience targeting, and bid optimization",
      "Technical SEO, local SEO, and schema implementation",
      "Performance reporting with GA4 and conversion tracking",
    ],
  },
  {
    n: "04",
    title: "Website Development",
    icon: Server,
    tagline: "High-performance, secure, and responsive web platforms.",
    desc: "We build websites designed for speed, search, and conversion, with modern UX and a technical foundation that supports marketing growth.",
    bullets: [
      "Responsive websites optimized for mobile and SEO",
      "Custom web development with fast load times",
      "Secure hosting, SSL setup, and deployment support",
      "Conversion-focused page layouts and analytics setup",
      "Clean code, accessibility, and future-ready architecture",
    ],
  },
  {
    n: "05",
    title: "Social Media Management",
    icon: Users,
    tagline: "Creative content, scheduling, and engagement for social growth.",
    desc: "We manage social channels with creative assets, placement strategy, and campaigns tailored to your audience.",
    bullets: [
      "Social media content calendars and campaign planning",
      "High-quality social creatives and carousel posts",
      "Community engagement and comment management",
      "Paid social promotions and performance reporting",
      "Monthly analytics and audience growth insights",
    ],
  },
  {
    n: "06",
    title: "Graphic Design",
    icon: FileText,
    tagline: "Stunning marketing collateral and visual creatives.",
    desc: "We create visual assets that support branding, ads, digital campaigns, and sales collateral.",
    bullets: [
      "Digital ad creatives, brochure designs, and print layouts",
      "Marketing visuals for social, email, and web campaigns",
      "Brand collateral, proposal decks, and packaging design",
      "Illustrations, icons, and product graphics",
      "Design assets built for both print and digital use",
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

const problems = [
  "You run ads but the leads never come",
  "You get visitors but very few enquiries",
  "You post content that never turns into sales",
  "Your website looks fine but builds no trust",
];

const systemFlow = [
  "Targeted ads",
  "Landing page",
  "Lead captured",
  "Content nurture",
  "Client closed",
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

      {/* ═══════ THE REAL PROBLEM ═══════ */}
      <section className="py-20 md:py-28 px-6 md:px-10 border-t border-foreground/5">
        <div className="max-w-[1128px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <Reveal>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
                <span className="size-2 bg-brand rounded-full" /> The real problem
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase leading-[1.05]">
                Why most businesses never get steady leads
              </h2>
              <p className="text-sm md:text-base font-light text-foreground/60 leading-relaxed max-w-lg">
                Getting traffic is the easy part. Turning that traffic into customers is where most
                budgets quietly disappear. When someone lands on your site, they decide in seconds
                whether to trust you.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col">
              {problems.map((p, i) => (
                <div
                  key={p}
                  className="flex items-start gap-4 py-5 border-b border-foreground/10 first:border-t"
                >
                  <span className="text-[10px] font-bold tabular-nums text-brand pt-1.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base font-light text-foreground/75 leading-relaxed">
                    {p}
                  </span>
                </div>
              ))}
              <p className="mt-8 text-lg md:text-xl font-serif italic text-foreground/80 leading-snug">
                Traffic was never the problem. Turning attention into customers is.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════ THE SYSTEM — flow chain ═══════ */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-muted/30 border-y border-foreground/[0.06]">
        <div className="max-w-[1128px] mx-auto">
          <Reveal className="mb-10 md:mb-14 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
              <span className="size-2 bg-brand rounded-full" /> The Zencyp system
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase leading-[1.05] max-w-2xl">
              How we turn traffic into real enquiries
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <ol className="flex flex-col md:flex-row md:items-stretch gap-3 md:gap-2">
              {systemFlow.map((s, i) => (
                <li key={s} className="flex md:flex-1 items-center gap-3 md:gap-2 min-w-0">
                  <div className="flex-1 flex flex-col gap-2 p-5 rounded-2xl bg-background border border-foreground/[0.07] h-full">
                    <span className="text-[10px] font-bold tabular-nums text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-extrabold tracking-tight leading-snug">{s}</span>
                  </div>
                  {i < systemFlow.length - 1 && (
                    <span
                      aria-hidden
                      className="shrink-0 text-foreground/25 rotate-90 md:rotate-0 text-lg"
                    >
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ═══════ CAPABILITIES — sticky left, scrolling right ═══════ */}
      <section className="py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-[1128px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 lg:gap-16 items-start">
          {/* Sticky column. top clears the fixed nav (98px) with breathing room. */}
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
                  <span className="size-2 bg-brand rounded-full" /> Capabilities
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter uppercase leading-[1.05]">
                  Core specialties
                </h2>
                <p className="text-sm md:text-base font-light text-foreground/60 leading-relaxed max-w-md">
                  Six disciplines that operate as one system. Most engagements start with two or
                  three and grow from there.
                </p>
                <Link
                  to="/contact"
                  className="mt-2 self-start inline-flex items-center gap-2.5 h-12 px-7 rounded-full bg-brand text-brand-foreground text-sm font-bold tracking-wide transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Book a free strategy call
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Scrolling column */}
          <div className="flex flex-col gap-6">
            {servicesPillars.map((p, i) => {
              const IconComponent = p.icon;
              return (
                <Reveal key={p.n} delay={0.05}>
                  <article className="group rounded-3xl border border-foreground/[0.07] bg-muted/60 p-6 md:p-8 transition-colors hover:border-brand/40">
                    <header className="flex items-start justify-between gap-4 pb-5 mb-5 border-b border-foreground/[0.07]">
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/35 tabular-nums">
                          {p.n} / {String(servicesPillars.length).padStart(2, "0")}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tighter uppercase leading-tight">
                          {p.title}
                        </h3>
                        <p className="text-xs font-medium text-foreground/50">{p.tagline}</p>
                      </div>
                      <span className="shrink-0 size-11 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/40 group-hover:bg-brand group-hover:text-brand-foreground group-hover:border-brand transition-colors">
                        <IconComponent className="size-4.5" />
                      </span>
                    </header>

                    <p className="text-sm font-light leading-relaxed text-foreground/65">
                      {p.desc}
                    </p>

                    <ul className="mt-5 flex flex-col gap-2.5">
                      {p.bullets.map((b, bi) => (
                        <li
                          key={bi}
                          className="flex items-start gap-3 text-sm text-foreground/70 leading-snug"
                        >
                          <Check className="size-4 text-brand shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              );
            })}
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
              to="/about"
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
