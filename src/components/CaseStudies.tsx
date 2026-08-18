import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { WorkArt, type ArtVariant } from "@/components/WorkArt";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type CaseStudy = {
  client: string;
  sector: string;
  summary: string;
  art: ArtVariant;
  to: string;
  results: { value: number; suffix: string; label: string }[];
};

/**
 * Illustrative outcomes. TODO — replace with audited client figures before launch.
 */
const CASE_STUDIES: CaseStudy[] = [
  {
    client: "Retail brand",
    sector: "Fashion — Chennai",
    summary:
      "Rebuilt the storefront around the checkout path and rewired ad spend to high-intent search. Enquiries quadrupled inside two quarters.",
    art: "spectrum",
    to: "/work/digital-marketing",
    results: [
      { value: 311, suffix: "%", label: "More enquiries" },
      { value: 67, suffix: "%", label: "Lower cost per lead" },
    ],
  },
  {
    client: "Wellness clinic",
    sector: "Health — Bengaluru",
    summary:
      "A trust-first identity and a page-per-treatment structure that each rank on their own and funnel into one booking system.",
    art: "orbit",
    to: "/work/branding",
    results: [
      { value: 250, suffix: "%", label: "More bookings" },
      { value: 12, suffix: "K", label: "Organic sessions" },
    ],
  },
  {
    client: "Café group",
    sector: "F&B — Arani",
    summary:
      "Short-form video and a local-first content engine that turned a single location into a queue out the door.",
    art: "waves",
    to: "/work/web-production",
    results: [
      { value: 380, suffix: "K", label: "Reel views" },
      { value: 189, suffix: "%", label: "More footfall" },
    ],
  },
];

/** One card. Shared by the mobile carousel and the desktop grid so they cannot drift. */
function CaseCard({ c, index }: { c: CaseStudy; index: number }) {
  return (
    <Link
      to={c.to}
      className="group flex h-full flex-col gap-5 rounded-3xl border border-foreground/[0.07] bg-muted/60 p-5 transition-colors hover:border-brand/40"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
        <WorkArt
          variant={c.art}
          label={c.client}
          className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 rounded-full bg-background/75 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-1">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-extrabold tracking-tight">{c.client}</h3>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
            ///{c.sector}
          </span>
        </div>
        <p className="text-sm font-light leading-relaxed text-foreground/60">{c.summary}</p>

        <div className="mt-auto grid grid-cols-2 gap-3 border-t border-foreground/[0.07] pt-4">
          {c.results.map((r) => (
            <div key={r.label} className="flex flex-col gap-0.5">
              <span className="text-2xl font-extrabold tracking-tighter tabular-nums text-brand">
                <CountUp to={r.value} suffix={r.suffix} duration={2} />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">
                {r.label}
              </span>
            </div>
          ))}
        </div>

        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-brand">
          Read the breakdown
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function CaseStudies() {
  return (
    // scroll-mt clears the fixed nav when the #case-studies anchor is used
    <section id="case-studies" className="scroll-mt-28 px-5 md:px-6 py-20 md:py-28 bg-background">
      <div className="max-w-[1128px] mx-auto">
        <Reveal className="mb-10 md:mb-14 flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
            <span className="size-2 bg-brand rounded-full" /> Case studies
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter uppercase leading-[1.05] max-w-3xl">
            Real businesses,{" "}
            <span className="font-serif italic font-semibold normal-case tracking-tight text-brand border-b-4 md:border-b-6 border-accent">
              real numbers
            </span>
          </h2>
        </Reveal>

        {/* Mobile: swipeable carousel. From md up the three cards fit side by side. */}
        <div className="md:hidden">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {CASE_STUDIES.map((c, i) => (
                <CarouselItem key={c.client} className="pl-4 basis-[88%]">
                  <CaseCard c={c} index={i} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-6 flex items-center justify-center gap-3">
              <CarouselPrevious className="static translate-y-0 size-11 border-foreground/15 hover:bg-brand hover:text-brand-foreground hover:border-brand" />
              <CarouselNext className="static translate-y-0 size-11 border-foreground/15 hover:bg-brand hover:text-brand-foreground hover:border-brand" />
            </div>
          </Carousel>
        </div>

        <div className="hidden gap-6 md:grid md:grid-cols-3">
          {CASE_STUDIES.map((c, i) => (
            <Reveal key={c.client} delay={i * 0.08}>
              <CaseCard c={c} index={i} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-8 text-[11px] font-medium leading-relaxed text-foreground/35">
            Figures are illustrative of typical engagements and are pending replacement with audited
            client reporting.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
