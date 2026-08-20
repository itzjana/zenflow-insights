import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { WorkArt } from "@/components/WorkArt";
import brandingHero from "@/assets/img/work-branding-hero.webp";
import { WorkHero, WorkCTA, Eyebrow, CARD } from "@/components/work/WorkPageParts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const Route = createFileRoute("/work/branding")({
  head: () => ({
    meta: [
      { title: "Branding & Identity Design – Zencyp" },
      {
        name: "description",
        content:
          "Logo systems, colour, typography and complete brand books built to make Tamil Nadu businesses look credible and command authority.",
      },
    ],
  }),
  component: BrandingPage,
});

const cases = [
  {
    name: "Vault 01",
    sector: "Fintech",
    art: "layers" as const,
    note: "A restrained mark and a monospaced system built for a product that had to read as trustworthy first.",
  },
  {
    name: "Lumina",
    sector: "Wellness",
    art: "orbit" as const,
    note: "Soft geometry and a warm palette that let a clinical category feel human without losing precision.",
  },
  {
    name: "Aether",
    sector: "Hospitality",
    art: "waves" as const,
    note: "An editorial identity where the typography does the heavy lifting and the mark stays quiet.",
  },
  {
    name: "Meridian",
    sector: "Retail",
    art: "grid" as const,
    note: "A modular system that survives being stretched across packaging, storefront and social.",
  },
  {
    name: "Kiln",
    sector: "Manufacturing",
    art: "type" as const,
    note: "Heavy industrial letterforms paired with a disciplined grid for spec sheets and site signage.",
  },
];

const palette = [
  { name: "Ink", value: "var(--foreground)", hex: "#262626" },
  { name: "Brand", value: "var(--brand)", hex: "#00272C" },
  { name: "Surface", value: "var(--muted)", hex: "#F6F6F6" },
  { name: "Paper", value: "var(--background)", hex: "#FFFFFF" },
];

const deliverables = [
  "Logo suite — primary, secondary, monogram, favicon",
  "Colour system with accessible contrast pairings",
  "Typographic scale and usage rules",
  "Brand book covering voice, spacing and misuse",
  "Social, print and packaging templates",
  "Handover files in vector, raster and web formats",
];

function BrandingPage() {
  return (
    <div className="bg-background text-foreground selection:bg-brand selection:text-brand-foreground font-sans">
      <SiteNav />

      <WorkHero
        eyebrow="Branding"
        title={
          <>
            Identity systems that{" "}
            <span className="font-serif italic font-semibold normal-case tracking-tight text-brand">
              hold up
            </span>{" "}
            everywhere
          </>
        }
        copy="A logo is the smallest part of it. We build the whole system — colour, type, layout and voice — so your brand stays recognisable on a billboard, a business card and a 40px avatar."
        image={brandingHero}
        imageAlt="Brand identity system laid out flat"
      />

      {/* ─── Carousel of identity work ─── */}
      <section className="px-5 md:px-6 py-20 md:py-28">
        <div className="max-w-[1128px] mx-auto">
          <Reveal className="mb-10 md:mb-14 flex flex-col gap-4">
            <Eyebrow>Selected identities</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase leading-[1.05] max-w-2xl">
              Five systems, five very different rooms to live in
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4 md:-ml-6">
                {cases.map((c) => (
                  <CarouselItem
                    key={c.name}
                    className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <article
                      className={`group h-full flex flex-col gap-5 p-5 rounded-3xl ${CARD} transition-colors hover:border-brand/40`}
                    >
                      <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-muted">
                        <WorkArt
                          variant={c.art}
                          label={c.name}
                          className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-105"
                        />
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/75 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest">
                          {c.sector}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 px-1 pb-1">
                        <h3 className="text-xl font-extrabold tracking-tight">{c.name}</h3>
                        <p className="text-sm font-light leading-relaxed text-foreground/60">
                          {c.note}
                        </p>
                      </div>
                    </article>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex items-center justify-end gap-3 mt-8">
                <CarouselPrevious className="static translate-y-0 size-11 border-foreground/15 hover:bg-brand hover:text-brand-foreground hover:border-brand" />
                <CarouselNext className="static translate-y-0 size-11 border-foreground/15 hover:bg-brand hover:text-brand-foreground hover:border-brand" />
              </div>
            </Carousel>
          </Reveal>
        </div>
      </section>

      {/* ─── Specimen: colour + type ─── */}
      <section className="px-5 md:px-6 py-20 md:py-28 bg-muted/30 border-y border-foreground/[0.06]">
        <div className="max-w-[1128px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <Reveal>
            <div className="flex flex-col gap-6">
              <Eyebrow>Colour</Eyebrow>
              <div className="grid grid-cols-4 gap-3">
                {palette.map((p) => (
                  <div key={p.name} className="flex flex-col gap-2">
                    <div
                      className="aspect-square rounded-2xl border border-foreground/10"
                      style={{ background: p.value }}
                    />
                    <span className="text-[11px] font-bold uppercase tracking-widest">
                      {p.name}
                    </span>
                    <span className="text-[10px] font-medium text-foreground/40 tabular-nums">
                      {p.hex}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm font-light leading-relaxed text-foreground/60">
                Every palette ships with tested contrast pairings, so the brand stays legible before
                it stays pretty.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-6">
              <Eyebrow>Typography</Eyebrow>
              <div className={`flex flex-col gap-5 p-7 rounded-3xl ${CARD}`}>
                <div className="flex items-baseline justify-between gap-4 border-b border-foreground/[0.07] pb-4">
                  <span className="text-4xl font-extrabold tracking-tighter">Aa</span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">
                    Sora — 300/400/700/800
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-foreground/[0.07] pb-4">
                  <span className="text-4xl font-serif italic font-semibold">Aa</span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">
                    Cormorant — accent italic
                  </span>
                </div>
                <p className="text-sm font-light leading-relaxed text-foreground/60">
                  One workhorse sans for everything functional, one serif italic reserved for
                  emphasis. Two families, strictly enforced.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Deliverables ─── */}
      <section className="px-5 md:px-6 py-20 md:py-28">
        <div className="max-w-[1128px] mx-auto">
          <Reveal className="mb-10 md:mb-14 flex flex-col gap-4">
            <Eyebrow>What you get</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase leading-[1.05]">
              Everything, handed over properly
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 border-t border-foreground/10">
            {deliverables.map((d, i) => (
              <Reveal key={d} delay={(i % 2) * 0.06}>
                <div className="flex items-start gap-5 py-6 border-b border-foreground/10">
                  <span className="text-xs font-bold tabular-nums text-brand pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base font-light text-foreground/75 leading-relaxed">
                    {d}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WorkCTA
        heading="Need an identity that scales?"
        copy="Tell us where the brand is going and we'll build the system to get it there."
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
