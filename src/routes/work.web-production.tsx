import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import webHero from "@/assets/img/work-web-hero.webp";
import { ClientScrollStory, type ClientProject } from "@/components/ClientScrollStory";
/* Screenshots live in src/assets/clients-raw as full-size PNGs; these are the
   web-optimised WebP versions. Drop a new capture in clients-raw with the same name
   and ask for a re-optimise to refresh these. */
import shotNalan from "@/assets/img/clients/shot-nalan.webp";
import shotPvpinn from "@/assets/img/clients/shot-pvpinn.webp";
import shotPaary from "@/assets/img/clients/shot-parry.webp";
import shotFlorastra from "@/assets/img/clients/shot-florastra.webp";
import shotSaianjali from "@/assets/img/clients/shot-saianjali.webp";
import shotRathna from "@/assets/img/clients/shot-rathna.webp";
import shotVaranchi from "@/assets/img/clients/shot-varanchi.webp";
import { WorkHero, WorkCTA, Eyebrow, CARD } from "@/components/work/WorkPageParts";

export const Route = createFileRoute("/work/web-production")({
  head: () => ({
    meta: [
      { title: "Web Design & Development – Zencyp" },
      {
        name: "description",
        content:
          "High-performance, mobile-first websites built for search rankings and conversion — designed, engineered and shipped by Zencyp.",
      },
    ],
  }),
  component: WebProductionPage,
});

const specs = [
  { value: 98, suffix: "", label: "Lighthouse performance", note: "Median across shipped builds" },
  { value: 14, suffix: " days", label: "Average delivery", note: "Discovery to launch" },
  { value: 100, suffix: "%", label: "Responsive coverage", note: "320px to ultrawide" },
];

const projects: ClientProject[] = [
  {
    name: "Varanchi",
    url: "https://varanchi.com/",
    sector: "Silk sarees — E-commerce",
    image: shotVaranchi,
    summary:
      "A premium silk saree storefront where the catalogue has to carry the craft. Built around large imagery, fast collection browsing and a checkout that stays out of the way.",
    stack: ["Storefront", "Catalogue", "Payments"],
  },
  {
    name: "Nalan Coffee Bar",
    url: "https://nalancoffeebar.com/",
    sector: "Franchise — Food & beverage",
    image: shotNalan,
    summary:
      "A franchise-enquiry site rather than a menu site. The whole structure funnels toward one action: getting prospective franchisees to submit their details.",
    stack: ["Lead capture", "Landing pages", "SEO"],
  },
  {
    name: "PVP Inn",
    url: "https://pvpinn.com/",
    sector: "Hospitality — Arani",
    image: shotPvpinn,
    summary:
      "A hotel and events venue that needed to look credible before anyone would call. Rooms, hall and amenities laid out so a booking decision takes one scroll.",
    stack: ["Local SEO", "Enquiry flow", "Gallery"],
  },
  {
    name: "Florastra Herbal",
    url: "https://florastraherbal.com/",
    sector: "Organic skincare — Retail",
    image: shotFlorastra,
    summary:
      "Chemical-free skincare sold on trust. Ingredient storytelling sits alongside the product grid so the claims land before the price does.",
    stack: ["WooCommerce", "Content", "Product SEO"],
  },
  {
    name: "Paary Sweets",
    url: "https://paarysweets.com/",
    sector: "Sweets & bakery — E-commerce",
    image: shotPaary,
    summary:
      "A traditional sweets and bakery range brought online with appetite-first photography and categories that mirror how people actually shop in store.",
    stack: ["Storefront", "Categories", "Checkout"],
  },
  {
    name: "Sai Anjali Events",
    url: "https://saianjalievents.in/",
    sector: "Event management — Arani",
    image: shotSaianjali,
    summary:
      "Two decades of weddings and celebrations, finally documented. A portfolio-led site where past work does the selling and the enquiry form is never far away.",
    stack: ["Portfolio", "Enquiry flow", "Local SEO"],
  },
  {
    name: "Rathna Aromatics",
    url: "https://rathnaaromaticsexporters.com/",
    sector: "Incense & exports — B2B",
    image: shotRathna,
    summary:
      "An exporter site built for buyers, not browsers. Product specifications, certifications and bulk enquiry paths are the priority throughout.",
    stack: ["B2B catalogue", "Export enquiry", "Specs"],
  },
];

const process = [
  {
    n: "01",
    title: "Discovery",
    copy: "We map who has to convert, what they need to believe first, and what the current site fails to say.",
  },
  {
    n: "02",
    title: "Design system",
    copy: "Type scale, spacing, colour and components get settled before any page is composed, so the build stays consistent.",
  },
  {
    n: "03",
    title: "Build",
    copy: "Semantic, accessible markup with performance budgets enforced as we go rather than audited at the end.",
  },
  {
    n: "04",
    title: "Launch & iterate",
    copy: "Analytics, search console and conversion tracking wired up on day one, then refined against real behaviour.",
  },
];

function WebProductionPage() {
  return (
    <div className="bg-background text-foreground selection:bg-brand selection:text-brand-foreground font-sans">
      <SiteNav />

      <WorkHero
        eyebrow="Web Production"
        title={
          <>
            Sites built to{" "}
            <span className="font-serif italic font-semibold normal-case tracking-tight text-brand">
              convert
            </span>
            , not just launch
          </>
        }
        copy="Fast, accessible, mobile-first builds where the engineering serves the business case. Performance budgets and conversion tracking are part of the build, not a retrofit."
        image={webHero}
        imageAlt="Devices displaying a responsive website build"
      />

      {/* ─── Build specs ─── */}
      <section className="px-5 md:px-6 pb-16 md:pb-20">
        <div className="max-w-[1128px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {specs.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className={`flex flex-col gap-2 p-7 rounded-2xl h-full ${CARD}`}>
                <span className="text-4xl md:text-5xl font-extrabold tracking-tighter tabular-nums">
                  <CountUp to={s.value} suffix={s.suffix} duration={2} />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                  {s.label}
                </span>
                <span className="text-xs font-light text-foreground/50">{s.note}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Live client builds: pinned media, scrolling copy ─── */}
      <section className="px-5 md:px-6 py-16 md:py-24 bg-muted/30 border-y border-foreground/[0.06]">
        <div className="max-w-[1128px] mx-auto">
          <Reveal className="mb-10 md:mb-16 flex flex-col gap-4">
            <Eyebrow>Live builds</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase leading-[1.05] max-w-2xl">
              Seven sites, seven different jobs to do
            </h2>
            <p className="max-w-xl text-sm md:text-base font-light text-foreground/60 leading-relaxed">
              Storefronts, franchise funnels, B2B catalogues and venue sites — every one live today.
              Scroll to walk through them.
            </p>
          </Reveal>

          <ClientScrollStory projects={projects} />
        </div>
      </section>

      {/* ─── Process ─── */}
      <section className="px-5 md:px-6 py-20 md:py-28">
        <div className="max-w-[1128px] mx-auto">
          <Reveal className="mb-10 md:mb-14 flex flex-col gap-4">
            <Eyebrow>How it ships</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase leading-[1.05]">
              Four stages, no surprises
            </h2>
          </Reveal>

          <div className="border-t border-foreground/10">
            {process.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.05}>
                <div className="grid grid-cols-[2.5rem_1fr] md:grid-cols-12 items-baseline md:items-start gap-x-3 gap-y-4 md:gap-6 py-8 md:py-10 border-b border-foreground/10 group hover:bg-muted/40 transition-colors px-2 md:px-6 rounded-xl">
                  <span className="md:col-span-2 text-sm font-bold tabular-nums text-brand">
                    {p.n}
                  </span>
                  <h3 className="md:col-span-4 text-2xl md:text-3xl font-extrabold tracking-tight group-hover:translate-x-2 transition-transform">
                    {p.title}
                  </h3>
                  <p className="col-span-2 md:col-span-6 text-sm md:text-base text-foreground/60 font-light leading-relaxed">
                    {p.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WorkCTA
        heading="Got a site that isn't pulling its weight?"
        copy="Send us the URL and we'll tell you exactly where it's losing people."
      />

      <div className="px-5 md:px-6 pb-16 text-center">
        <Link
          to="/"
          className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/40 hover:text-brand transition-colors"
        >
          ← Back to selected work
        </Link>
      </div>

      <SiteFooter />
    </div>
  );
}
