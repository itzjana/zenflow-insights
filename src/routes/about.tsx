import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Zencyp – Leading Digital Agency in Tamil Nadu" },
      {
        name: "description",
        content:
          "Zencyp is a Tamil Nadu-based digital agency specializing in branding, video production, digital marketing, web development, social media management, and graphic design.",
      },
      { property: "og:title", content: "About Zencyp – Leading Digital Agency in Tamil Nadu" },
      {
        property: "og:description",
        content:
          "Discover Zencyp's story, our results-driven process, and how we build high-performance digital experiences for brands in India.",
      },
    ],
  }),
  component: About,
});

const processSteps = [
  {
    n: "I.",
    title: "Listen & Plan.",
    copy: "First, we align on your business goals, analyze your competitors, and map search intent so every campaign supports measurable growth.",
  },
  {
    n: "II.",
    title: "Create & Execute.",
    copy: "Next, we develop branding, launch high-conversion digital marketing campaigns, build secure web experiences, and produce video content that speaks to your audience.",
  },
  {
    n: "III.",
    title: "Test & Optimize.",
    copy: "Finally, we monitor GA4 and search metrics, optimize campaign bids, improve conversion paths, and refine content to scale traffic and leads.",
  },
];

const testimonials = [
  {
    quote:
      "Working with Zencyp was a game-changer. They delivered a sleek website, branded our company, and scaled our lead flow with Google Ads.",
    author: "Retail Brand Manager",
    location: "Chennai",
  },
  {
    quote:
      "Their digital marketing expertise and video production were exactly what our launch needed. We now rank for local business keywords and get more qualified enquiries.",
    author: "E-Commerce Director",
    location: "Bengaluru",
  },
];

function About() {
  return (
    <div className="bg-background text-foreground selection:bg-brand selection:text-brand-foreground font-sans">
      <SiteNav />

      <section className="pt-40 md:pt-48 pb-24 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
            <span className="size-2 bg-brand rounded-full animate-pulse" /> About Zencyp
          </span>
          <h1 className="mt-8 text-[clamp(2.5rem,8vw,9rem)] font-extrabold leading-[0.85] tracking-tighter uppercase">
            We build digital brands,
            <br />
            platforms and campaigns that
            <span className="font-serif italic font-semibold normal-case border-b-[6px] md:border-b-[10px] border-brand leading-none px-2 text-brand-foreground bg-brand/10">
              perform.
            </span>
          </h1>
          <p className="mt-12 max-w-2xl text-lg md:text-xl font-light text-foreground/70 leading-snug">
            From branding and video production to digital marketing, web development, social media management, and graphic design, Zencyp helps Tamil Nadu brands grow online with a unified digital strategy.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20 bg-muted/20 border-y border-foreground/5 py-16 md:py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-brand">Our Story</h2>
            <h3 className="mt-4 text-3xl font-extrabold tracking-tight">Built for brands that want measurable growth.</h3>
          </div>
          <div className="md:col-span-8 space-y-6 text-foreground/75 font-light leading-relaxed">
            <p>
              Our mission is to help businesses thrive with digital marketing that starts with strong branding and grows through targeted ads, social engagement, video storytelling, and technical web execution.
            </p>
            <p>
              We blend creative direction and performance marketing so every campaign, page, and visual asset supports your business goals—from winning local search traffic to converting visitors into paying customers.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
              <span className="size-2 bg-brand rounded-full" /> Method
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight uppercase">Our performance process</h2>
          </Reveal>

          <div className="border-t border-foreground/10">
            {processSteps.map((t) => (
              <div
                key={t.n}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 py-12 md:py-16 border-b border-foreground/10 group hover:bg-muted/40 transition-colors px-2 md:px-6 rounded-xl"
              >
                <span className="md:col-span-2 font-serif italic text-2xl text-brand">{t.n}</span>
                <h3 className="md:col-span-5 text-3xl md:text-4xl font-extrabold tracking-tight group-hover:translate-x-2 transition-transform">{t.title}</h3>
                <p className="md:col-span-5 text-foreground/60 font-light leading-relaxed">{t.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24 md:pb-32 bg-muted/20 border-t border-foreground/5 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
              <span className="size-2 bg-brand rounded-full" /> Feedback
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight uppercase">Client testimonials</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-background border border-foreground/10 p-6 md:p-10 rounded-3xl relative overflow-hidden shadow-sm hover:border-brand transition-colors"
              >
                <p className="text-lg font-light italic leading-relaxed text-foreground/80">"{t.quote}"</p>
                <div className="mt-8 border-t border-foreground/5 pt-4 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-foreground/50">
                  <span>{t.author}</span>
                  <span className="text-brand">{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 text-center bg-background border-t border-foreground/5">
        <h2 className="text-3xl font-extrabold uppercase tracking-tight mb-8">Want to see our services?</h2>
        <Link
          to="/services"
          className="inline-flex items-center gap-3 bg-foreground text-background rounded-full px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand hover:text-brand-foreground transition-colors"
        >
          View Our Services
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
