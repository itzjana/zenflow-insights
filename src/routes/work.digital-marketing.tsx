import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { WorkHero, WorkCTA, Eyebrow, CARD } from "@/components/work/WorkPageParts";
import marketingHero from "@/assets/img/work-marketing-hero.webp";
import proof34 from "@/assets/img/proof/proof-34-campaigns.webp";
import proofWebsiteLeads from "@/assets/img/proof/proof-website-leads.webp";
import proofFbLeads from "@/assets/img/proof/proof-fb-leads.webp";
import proofFbDashboard from "@/assets/img/proof/proof-fb-dashboard.webp";
import proofPerfChart from "@/assets/img/proof/proof-performance-chart.webp";
import proofCampaignTable from "@/assets/img/proof/proof-campaign-table.webp";

export const Route = createFileRoute("/work/digital-marketing")({
  head: () => ({
    meta: [
      { title: "Digital Marketing & Performance Ads – Zencyp" },
      {
        name: "description",
        content:
          "Before-and-after results from Zencyp's Meta Ads, Google Ads and SEO campaigns — measured in enquiries and cost per lead, not impressions.",
      },
    ],
  }),
  component: DigitalMarketingPage,
});

/**
 * Illustrative engagement figures. TODO — replace with audited numbers from real
 * client reporting before this page goes live.
 */
/**
 * Real campaign reporting, exported from Meta Ads Manager. Client names are redacted in
 * the source screenshots. The figures below are transcribed from those same screenshots
 * so the copy and the evidence can never drift apart.
 */
const proof = [
  {
    image: proof34,
    alt: "Meta Ads Manager showing results across 34 campaigns",
    headline: "1,939,999 results",
    detail: "Across 34 campaigns — 6,987,423 impressions at a ₹35 CPM.",
  },
  {
    image: proofWebsiteLeads,
    alt: "Meta Ads Manager performance overview for a website-leads campaign",
    headline: "₹14.97 per lead",
    detail: "168 website leads from ₹2,514 of spend on a traffic-to-leads campaign.",
  },
  {
    image: proofFbLeads,
    alt: "Meta Ads Manager performance overview for an on-Facebook leads campaign",
    headline: "₹38.36 per lead",
    detail: "170 on-Facebook leads delivered from ₹6,521 of spend.",
  },
  {
    image: proofFbDashboard,
    alt: "Facebook Ads reporting dashboard with impression and click trends",
    headline: "258.7K impressions",
    detail: "Up 72.3% period-on-period, with link clicks up 42.4% and a 1.42% CTR.",
  },
  {
    image: proofPerfChart,
    alt: "Campaign performance chart showing conversions, CPC and link clicks",
    headline: "5,235 conversions",
    detail: "Up 23% over 45 days at a ₹12.45 CPC and 45,235 link clicks.",
  },
  {
    image: proofCampaignTable,
    alt: "Campaign-level breakdown of results, reach, frequency and cost per result",
    headline: "Cost per result, by campaign",
    detail: "Purchases and landing-page views tracked per campaign against daily budgets.",
  },
];

const channels = [
  { name: "Google Ads", share: 34, note: "High-intent search capture" },
  { name: "Meta Ads", share: 28, note: "Discovery and retargeting" },
  { name: "SEO & Content", share: 24, note: "Compounding organic traffic" },
  { name: "Email & Nurture", share: 14, note: "Turning interest into enquiries" },
];

const headline = [
  { value: 34, prefix: "", suffix: "", decimals: 0, label: "Campaigns managed" },
  { value: 6.9, prefix: "", suffix: "M+", decimals: 1, label: "Impressions delivered" },
  { value: 14.97, prefix: "₹", suffix: "", decimals: 2, label: "Lowest cost per lead" },
];

function DigitalMarketingPage() {
  return (
    <div className="bg-background text-foreground selection:bg-brand selection:text-brand-foreground font-sans">
      <SiteNav />

      <WorkHero
        eyebrow="Digital Marketing"
        title={
          <>
            The numbers{" "}
            <span className="font-serif italic font-semibold normal-case tracking-tight text-brand">
              before
            </span>{" "}
            and after
          </>
        }
        copy="We don't report impressions. Every campaign is judged on enquiries, cost per lead and revenue — measured against where the business actually started."
        image={marketingHero}
        imageAlt="Layered panels representing campaign performance"
      />

      {/* ─── Headline stats ─── */}
      <section className="px-5 md:px-6 pb-16 md:pb-20">
        <div className="max-w-[1128px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {headline.map((h, i) => (
            <Reveal key={h.label} delay={i * 0.08}>
              <div className={`flex flex-col gap-2 p-7 rounded-2xl h-full ${CARD}`}>
                <span className="text-4xl md:text-5xl font-extrabold tracking-tighter tabular-nums">
                  <CountUp
                    to={h.value}
                    prefix={h.prefix}
                    suffix={h.suffix}
                    decimals={h.decimals}
                    duration={2}
                  />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                  {h.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Campaign proof: real reporting screenshots ─── */}
      <section className="px-5 md:px-6 py-16 md:py-24 bg-muted/30 border-y border-foreground/[0.06]">
        <div className="max-w-[1128px] mx-auto">
          <Reveal className="mb-10 md:mb-14 flex flex-col gap-4">
            <Eyebrow>Campaign proof</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase leading-[1.05] max-w-2xl">
              Straight from the ads manager
            </h2>
            <p className="max-w-xl text-sm md:text-base font-light text-foreground/60 leading-relaxed">
              Exports from live client accounts rather than numbers we typed ourselves. Client names
              are redacted; every figure quoted below is visible in the screenshot beside it.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proof.map((item, i) => (
              <Reveal key={item.headline} delay={(i % 2) * 0.06}>
                <figure className={`group h-full flex flex-col rounded-3xl p-3 ${CARD}`}>
                  <div className="overflow-hidden rounded-2xl border border-foreground/[0.07] bg-white">
                    <img
                      src={item.image}
                      alt={item.alt}
                      loading={i < 2 ? "eager" : "lazy"}
                      className="w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="flex flex-col gap-1.5 px-3 pt-5 pb-3">
                    <span className="text-lg font-extrabold tracking-tight tabular-nums">
                      {item.headline}
                    </span>
                    <span className="text-sm font-light leading-relaxed text-foreground/60">
                      {item.detail}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Channel mix ─── */}
      <section className="px-5 md:px-6 py-20 md:py-28">
        <div className="max-w-[1128px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start">
          <Reveal>
            <div className="flex flex-col gap-4">
              <Eyebrow>Channel mix</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase leading-[1.05]">
                Where the budget actually goes
              </h2>
              <p className="text-sm md:text-base font-light text-foreground/60 leading-relaxed">
                The split shifts per business, but the principle holds: capture the people already
                searching, stay visible to the ones who aren't yet, and keep both compounding
                through content.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-6">
              {channels.map((ch) => (
                <div key={ch.name} className="flex flex-col gap-2.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-base font-extrabold tracking-tight">{ch.name}</span>
                    <span className="text-sm font-bold tabular-nums">{ch.share}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-foreground/[0.07] overflow-hidden">
                    <span
                      className="block h-full rounded-full bg-brand"
                      style={{ width: `${ch.share}%` }}
                    />
                  </div>
                  <span className="text-xs font-light text-foreground/50">{ch.note}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <WorkCTA
        heading="Want to see your own before and after?"
        copy="We'll audit what you're running today and show you where the leads are leaking."
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
