import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/philosophy")({
  head: () => ({
    meta: [
      { title: "About Zencyp – Leading Digital Agency in Tamil Nadu" },
      {
        name: "description",
        content:
          "Zencyp is a Tamil Nadu-based digital solutions company. Our mission is to help startups and businesses thrive online through creative design, secure development, and effective marketing.",
      },
      { property: "og:title", content: "About Zencyp – Leading Digital Agency in Tamil Nadu" },
      {
        property: "og:description",
        content:
          "Discover Zencyp's origin, our results-oriented process, and how we help businesses grow in India.",
      },
    ],
  }),
  component: About,
});

const processSteps = [
  {
    n: "I.",
    title: "Listen & Plan.",
    copy: "First, we align on your unique business goals, dissect competitor positions, analyze user search behavior, and formulate a bulletproof digital marketing blueprint.",
  },
  {
    n: "II.",
    title: "Create & Execute.",
    copy: "Next, we develop lightning-fast web pages, design memorable brand styles, compile targeted keyword structures, and deploy optimized conversion-rate campaigns.",
  },
  {
    n: "III.",
    title: "Test & Optimize.",
    copy: "Finally, we analyze real-time GA4 metrics, tweak search bids, refine copy, clean sitemaps, and continuously improve organic conversion rates. We do not stop.",
  },
];

const testimonials = [
  {
    quote:
      "Working with Zencyp was a game-changer. They delivered a sleek website and boosted our organic traffic by over 150% in under three months.",
    author: "Retail Brand Manager",
    location: "Chennai",
  },
  {
    quote:
      "Their team combined clean development with highly targeted SEO. We now rank on page one for our most competitive local terms.",
    author: "E-Commerce Director",
    location: "Bengaluru",
  },
];

function About() {
  return (
    <div className="bg-background text-foreground selection:bg-brand selection:text-brand-foreground font-sans">
      <SiteNav />

      {/* Hero Section */}
      <section className="pt-40 md:pt-48 pb-24 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
            <span className="size-2 bg-brand rounded-full animate-pulse" /> The Agency
          </span>
          <h1 className="mt-8 text-[clamp(2.5rem,8vw,9rem)] font-extrabold leading-[0.85] tracking-tighter uppercase">
            We build online
            <br />
            presence that{" "}
            <span className="font-serif italic font-semibold normal-case border-b-[6px] md:border-b-[10px] border-brand leading-none px-2 text-brand-foreground bg-brand/10">
              converts.
            </span>
          </h1>
          <p className="mt-12 max-w-2xl text-lg md:text-xl font-light text-foreground/70 leading-snug">
            Founded in 2019 in Arani, Tamil Nadu, Zencyp operates at the intersection of creative
            marketing and high-performance development. Led by CEO Ajay—a veteran in cybersecurity
            and digital marketing—our mission is simple: help businesses thrive online.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="px-6 md:px-10 pb-20 bg-muted/20 border-y border-foreground/5 py-16 md:py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
              Our Heritage
            </h2>
            <h3 className="mt-4 text-3xl font-extrabold tracking-tight">
              Tamil Nadu born. Globally minded.
            </h3>
          </div>
          <div className="md:col-span-8 space-y-6 text-foreground/75 font-light leading-relaxed">
            <p>
              From custom logo designs and corporate stationery packaging to server setup, Google
              Ads deployment, and local SEO campaigns, we handle all your digital requirements under
              a single cohesive framework. Our core philosophy is built around transparency,
              velocity, and data-defensible campaigns.
            </p>
            <p>
              We believe marketing without telemetry is theater. That's why we instrument every
              campaign, tracking conversion actions, page load times, and keyword ranks from day
              one.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
              <span className="size-2 bg-brand rounded-full" /> Methodology
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight uppercase">
              Our 3-Step Process
            </h2>
          </Reveal>

          <div className="border-t border-foreground/10">
            {processSteps.map((t) => (
              <div
                key={t.n}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 py-12 md:py-16 border-b border-foreground/10 group hover:bg-muted/40 transition-colors px-2 md:px-6 rounded-xl"
              >
                <span className="md:col-span-2 font-serif italic text-2xl text-brand">{t.n}</span>
                <h3 className="md:col-span-5 text-3xl md:text-4xl font-extrabold tracking-tight group-hover:translate-x-2 transition-transform">
                  {t.title}
                </h3>
                <p className="md:col-span-5 text-foreground/60 font-light leading-relaxed">
                  {t.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-10 pb-24 md:pb-32 bg-muted/20 border-t border-foreground/5 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
              <span className="size-2 bg-brand rounded-full" /> Feedback
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight uppercase">
              Client Testimonials
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-background border border-foreground/10 p-6 md:p-10 rounded-3xl relative overflow-hidden shadow-sm hover:border-brand transition-colors"
              >
                <p className="text-lg font-light italic leading-relaxed text-foreground/80">
                  "{t.quote}"
                </p>
                <div className="mt-8 border-t border-foreground/5 pt-4 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-foreground/50">
                  <span>{t.author}</span>
                  <span className="text-brand">{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 text-center bg-background border-t border-foreground/5">
        <h2 className="text-3xl font-extrabold uppercase tracking-tight mb-8">
          Want to see our services?
        </h2>
        <Link
          to="/services"
          className="inline-flex items-center gap-3 bg-foreground text-background rounded-full px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand hover:text-brand-foreground transition-colors"
        >
          View Our Services <ArrowRight className="size-4" />
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    />
  </svg>
);
