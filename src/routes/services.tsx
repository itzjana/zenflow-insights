import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { seo, serviceSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { ComparisonSwap } from "@/components/ComparisonSwap";
import { FlowBeamGraph } from "@/components/FlowBeamGraph";
import { CapabilityShowcase } from "@/components/CapabilityShowcase";
import { ProcessScrollStage } from "@/components/ProcessScrollStage";
import { MagneticButton } from "@/components/MagneticButton";
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

export const Route = createFileRoute("/services")({
  head: () => ({
    ...seo({
      title: "Digital Marketing Services | SEO, Google Ads, Meta Ads & Branding — Zencyp",
      description:
        "Explore Zencyp's services: search engine optimisation, Google Ads management, Meta Ads, branding, video production, content marketing, social media and web development for brands across India.",
      path: "/services",
      schema: [
        serviceSchema(
          "Digital Marketing Services",
          "SEO, Google Ads, Meta Ads, branding, video production, content marketing and web development.",
          "/services",
        ),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]),
        faqSchema(faqs),
      ],
    }),
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
  {
    label: "Targeted ads",
    detail:
      "Intent-led targeting on Google and Meta, built around the searches that actually convert.",
  },
  {
    label: "Landing page",
    detail:
      "A page written for one decision, with the proof and the call to action above the fold.",
  },
  {
    label: "Lead captured",
    detail: "Forms, calls and WhatsApp all tracked, so no enquiry is lost between channels.",
  },
  {
    label: "Content nurture",
    detail: "Social and email keep you present through the weeks a considered purchase takes.",
  },
  {
    label: "Client closed",
    detail: "Attribution back to the campaign, so budget follows what earned the revenue.",
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
      <section className="py-12 md:py-28 px-6 md:px-10 border-t border-foreground/5">
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

      {/* ═══════ THE SYSTEM — scroll-drawn beam graph ═══════ */}
      <section className="border-y border-foreground/[0.06] bg-muted/30 px-6 py-12 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1128px]">
          <Reveal className="mb-10 flex flex-col gap-4 md:mb-16">
            <span className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em]">
              <span className="size-2 rounded-full bg-brand" /> The Zencyp system
            </span>
            <h2 className="max-w-2xl text-3xl font-extrabold uppercase leading-[1.05] tracking-tighter md:text-4xl">
              How we turn traffic into{" "}
              <span className="font-serif font-semibold normal-case italic tracking-tight text-brand-soft">
                real enquiries
              </span>
            </h2>
          </Reveal>

          {/* Phones get the scroll-drawn beam; from md up this is the original chain. */}
          <div className="md:hidden">
            <FlowBeamGraph
              stages={systemFlow}
              outcome="Five stages, one loop. Every stage is measured, so we can tell which one is costing you money."
            />
          </div>

          <Reveal delay={0.08} className="hidden md:block">
            <ol className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-2">
              {systemFlow.map((s, i) => (
                <li key={s.label} className="flex min-w-0 items-center gap-3 md:flex-1 md:gap-2">
                  <div className="flex h-full flex-1 flex-col gap-2 rounded-2xl border border-foreground/[0.07] bg-background p-5">
                    <span className="text-[10px] font-bold tabular-nums text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-extrabold leading-snug tracking-tight">
                      {s.label}
                    </span>
                  </div>
                  {i < systemFlow.length - 1 && (
                    <span
                      aria-hidden
                      className="shrink-0 rotate-90 text-lg text-foreground/25 md:rotate-0"
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

      {/* ═══════ CAPABILITIES — sticky heading, cards beside it ═══════ */}
      <section className="px-6 py-12 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1128px] grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          {/* Sticky column. top clears the fixed nav (98px) with breathing room. */}
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <div className="flex flex-col gap-4">
                <span className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em]">
                  <span className="size-2 rounded-full bg-brand" /> Capabilities
                </span>
                <h2 className="text-3xl font-extrabold uppercase leading-[1.05] tracking-tighter md:text-5xl">
                  Core specialties
                </h2>
                <p className="max-w-md text-sm font-light leading-relaxed text-foreground/60 md:text-base">
                  Six disciplines that operate as one system. Most engagements start with two or
                  three and grow from there.
                </p>
                <Link
                  to="/contact"
                  className="mt-2 inline-flex h-12 items-center gap-2.5 self-start rounded-full bg-brand px-7 text-sm font-bold tracking-wide text-brand-foreground transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Book a free strategy call
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Carousel below lg, full scrolling column from lg up */}
          <CapabilityShowcase items={servicesPillars} />
        </div>
      </section>

      <ComparisonSwap
        eyebrow="Why us"
        title="Marketing that compounds, not"
        accent="marketing that churns"
        them={[
          "Quote per deliverable and move on",
          "Optimise a channel in isolation",
          "Report impressions and reach",
          "Hand over a site with no tracking wired up",
          "Rebuild from scratch every campaign",
          "Leave you guessing what happens next",
        ]}
        us={[
          "Scope around the outcome you need",
          "Tune the whole journey end to end",
          "Report enquiries, cost per lead and revenue",
          "Ship analytics and conversion tracking on day one",
          "Compound what already works",
          "Tell you exactly what we are doing and why",
        ]}
      />

      {/* ─── Process: pinned stage, steps advance with scroll ─── */}
      <ProcessScrollStage
        steps={steps}
        eyebrow="Work process"
        heading={
          <h2 className="max-w-2xl text-3xl font-extrabold uppercase leading-[1.05] tracking-tighter md:text-5xl">
            How an engagement{" "}
            <span className="border-b-4 border-accent font-serif font-semibold normal-case italic tracking-tight text-brand md:border-b-6">
              actually runs
            </span>
          </h2>
        }
      />

      {/* FAQ Section */}
      <section className="py-14 md:py-32 px-6 md:px-10 bg-muted/20 border-t border-foreground/5">
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
      <section className="py-20 md:py-48 px-6 md:px-10 text-center bg-background relative overflow-hidden border-t border-foreground/5">
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
