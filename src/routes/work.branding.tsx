import { createFileRoute, Link } from "@tanstack/react-router";
import { seo, serviceSchema, breadcrumbSchema } from "@/lib/seo";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import brandingHero from "@/assets/img/work-branding-hero.webp";
import { WorkHero, WorkCTA, Eyebrow, CARD } from "@/components/work/WorkPageParts";
import { BrandSystemBeams } from "@/components/BrandSystemBeams";

export const Route = createFileRoute("/work/branding")({
  head: () => ({
    ...seo({
      title: "Branding Agency | Logo Design & Brand Identity Systems — Zencyp",
      description:
        "Branding agency building logo suites, colour systems, typography and complete brand books for businesses across Tamil Nadu and India.",
      path: "/work/branding",
      schema: [
        serviceSchema(
          "Branding and Identity Design",
          "Logo suites, colour systems, typography and brand books.",
          "/work/branding",
        ),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "Branding", path: "/work/branding" },
        ]),
      ],
    }),
  }),
  component: BrandingPage,
});

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

      <BrandSystemBeams />

      {/* ─── Specimen: colour + type ─── */}
      <section className="px-5 md:px-6 py-12 md:py-28 bg-muted/30 border-y border-foreground/[0.06]">
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
      <section className="px-5 md:px-6 py-12 md:py-28">
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
