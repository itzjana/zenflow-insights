import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * What we have learned works, sector by sector — across brand, content, paid and web.
 *
 * Deliberately not a card grid: the page already uses cards three times over. A tabbed
 * switcher lets one sector be read in depth without scrolling past four others, and puts
 * the four disciplines side by side so the point lands — these move together.
 */

type Discipline = { label: string; play: string };

type Playbook = {
  id: string;
  sector: string;
  /** The pattern we keep seeing in this sector. */
  finding: string;
  /** What that means for the work. */
  lede: string;
  disciplines: Discipline[];
  proof: { label: string; value: string };
};

const PLAYBOOKS: Playbook[] = [
  {
    id: "ecommerce",
    sector: "E-commerce & retail",
    finding: "Catalogue depth loses to catalogue clarity.",
    lede: "Stores rarely fail on product. They fail because a first-time visitor cannot tell the range apart, and because the content stops at the product page. Fix the browse path, then feed it.",
    disciplines: [
      {
        label: "Brand",
        play: "One label system applied ruthlessly, so a shelf of forty products still reads as one house.",
      },
      {
        label: "Content",
        play: "Product-led video and lifestyle stills shot in batches, priced per shoot rather than per asset.",
      },
      {
        label: "Paid",
        play: "Catalogue ads on the top sellers only. Broad prospecting waits until the retargeting pool is warm.",
      },
      {
        label: "Web",
        play: "Collection browsing tuned first; checkout stripped to the fewest fields that still bill correctly.",
      },
    ],
    proof: { label: "Where it shows up", value: "Varanchi, Paary Sweets" },
  },
  {
    id: "franchise",
    sector: "Franchise & F&B",
    finding: "The buyer is not the diner.",
    lede: "Food brands instinctively market the menu. But a franchise business is selling a unit economics story to an investor, and that needs an entirely separate funnel from the one selling coffee.",
    disciplines: [
      {
        label: "Brand",
        play: "Two registers under one identity — appetite for customers, credibility for franchisees.",
      },
      {
        label: "Content",
        play: "Owner testimonials and day-in-the-life reels. Nothing converts a prospective franchisee faster.",
      },
      {
        label: "Paid",
        play: "Interest and lookalike targeting on investment intent, not food interest. Cheaper and far better qualified.",
      },
      {
        label: "Web",
        play: "A dedicated enquiry funnel with investment figures up front, kept clear of the consumer site.",
      },
    ],
    proof: { label: "Where it shows up", value: "Nalan Coffee Bar" },
  },
  {
    id: "wellness",
    sector: "Wellness & personal care",
    finding: "Trust has to be earned before the price is shown.",
    lede: "Claim-led categories are crowded with identical promises. What separates the brands that grow is evidence — ingredients, process, provenance — placed before anyone is asked to buy.",
    disciplines: [
      {
        label: "Brand",
        play: "Soft geometry and warm palettes, so a chemical-free claim reads natural rather than clinical.",
      },
      {
        label: "Content",
        play: "Ingredient explainers and routine content. Educational first, promotional a distant second.",
      },
      {
        label: "Paid",
        play: "Search captures the already-convinced; social does the convincing. Never the other way round.",
      },
      {
        label: "Web",
        play: "Ingredient storytelling sits beside the product grid, not on a page nobody visits.",
      },
    ],
    proof: { label: "Where it shows up", value: "Florastra Herbal" },
  },
  {
    id: "services",
    sector: "Events & local services",
    finding: "Twenty years of work, none of it documented.",
    lede: "Local service businesses almost always have the portfolio and almost never have it recorded. The single highest-return job is capturing what already happened, then making it findable.",
    disciplines: [
      {
        label: "Brand",
        play: "A mark with occasion to it, restrained enough to sit behind the photography rather than fight it.",
      },
      {
        label: "Content",
        play: "Systematic event capture — stills and short-form from every booking, building a library over months.",
      },
      {
        label: "Paid",
        play: "Tight local radius, seasonal budgets that follow the actual booking calendar.",
      },
      {
        label: "Web",
        play: "Portfolio-led structure where past work sells and the enquiry form is never far.",
      },
    ],
    proof: { label: "Where it shows up", value: "Sai Anjali Events, PVP Inn" },
  },
  {
    id: "b2b",
    sector: "B2B & export",
    finding: "Buyers want specifications, not storytelling.",
    lede: "Export and trade buyers arrive with a checklist. Anything that delays the spec sheet, the certification or the bulk enquiry path is friction, however handsome it looks.",
    disciplines: [
      {
        label: "Brand",
        play: "Built for cartons and spec sheets as much as screens — heavy letterforms, disciplined grid.",
      },
      {
        label: "Content",
        play: "Process and facility footage. It answers the credibility question no brochure can.",
      },
      {
        label: "Paid",
        play: "Search on product and HS-code language, plus LinkedIn where the buying role is identifiable.",
      },
      {
        label: "Web",
        play: "Specifications, certifications and bulk enquiry above everything else.",
      },
    ],
    proof: { label: "Where it shows up", value: "Rathna Aromatics" },
  },
];

export function SectorPlaybooks() {
  return (
    // scroll-mt clears the fixed nav when the #case-studies anchor is used
    <section id="case-studies" className="scroll-mt-28 bg-background px-5 py-12 md:px-6 md:py-28">
      <div className="mx-auto max-w-[1128px]">
        <Reveal className="mb-10 flex flex-col gap-4 md:mb-14">
          <span className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em]">
            <span className="size-2 rounded-full bg-brand" /> Sector playbooks
          </span>
          <h2 className="max-w-3xl text-3xl font-extrabold uppercase leading-[1.05] tracking-tighter md:text-5xl">
            What we&apos;ve learned{" "}
            <span className="border-b-4 border-accent font-serif font-semibold normal-case italic tracking-tight text-brand md:border-b-6">
              sector by sector
            </span>
          </h2>
          <p className="max-w-2xl text-sm font-light leading-relaxed text-foreground/60 md:text-base">
            Five years of client work leaves patterns. These are the ones that repeat — and how
            brand, content, paid media and web have to move together in each case.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Tabs
            defaultValue={PLAYBOOKS[0].id}
            className="flex flex-col gap-8 lg:flex-row lg:gap-12"
          >
            {/* Sector rail — vertical on desktop, a scrollable strip on mobile */}
            <TabsList className="snap-scroll-x -mx-5 flex h-auto w-full shrink-0 justify-start gap-2 overflow-x-auto bg-transparent px-5 p-0 lg:mx-0 lg:w-64 lg:flex-col lg:overflow-visible lg:px-0">
              {PLAYBOOKS.map((p, i) => (
                <TabsTrigger
                  key={p.id}
                  value={p.id}
                  className="snap-item group shrink-0 rounded-xl border border-foreground/10 px-4 py-3 text-left transition-colors data-[state=active]:border-brand data-[state=active]:bg-brand data-[state=active]:text-brand-foreground lg:w-full lg:shrink"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[10px] font-bold tabular-nums opacity-50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="whitespace-nowrap text-sm font-bold tracking-tight lg:whitespace-normal">
                      {p.sector}
                    </span>
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Panel */}
            <div className="min-w-0 flex-1">
              {PLAYBOOKS.map((p) => (
                <TabsContent
                  key={p.id}
                  value={p.id}
                  forceMount
                  /* forceMount keeps every panel in the DOM so all five playbooks are
                     crawlable; Radix sets [hidden] on the inactive ones. */
                  className="mt-0 flex-col gap-7 data-[state=active]:flex data-[state=inactive]:hidden"
                >
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/40">
                      The pattern
                    </span>
                    <h3 className="text-2xl font-extrabold leading-tight tracking-tight md:text-3xl">
                      {p.finding}
                    </h3>
                    <p className="max-w-2xl text-sm font-light leading-relaxed text-foreground/65 md:text-[15px]">
                      {p.lede}
                    </p>
                  </div>

                  {/* Four disciplines as a ledger, not cards */}
                  <div className="border-t border-foreground/10">
                    {p.disciplines.map((d) => (
                      <div
                        key={d.label}
                        className="grid grid-cols-1 gap-1 border-b border-foreground/10 py-4 sm:grid-cols-[7rem_1fr] sm:gap-6 sm:py-5"
                      >
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                          {d.label}
                        </span>
                        <span className="text-sm font-light leading-relaxed text-foreground/70">
                          {d.play}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/40">
                        {p.proof.label}
                      </span>
                      <span className="text-sm font-bold tracking-tight">{p.proof.value}</span>
                    </span>
                    <Link
                      to="/contact"
                      className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand"
                    >
                      Talk through your sector
                      <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
}
