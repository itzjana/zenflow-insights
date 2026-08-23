/**
 * Single source of truth for page metadata.
 *
 * Every route calls `seo()` so titles, descriptions, canonicals, Open Graph, Twitter
 * cards and JSON-LD stay consistent and can be audited in one place. Positioning is
 * state-and-national ("Tamil Nadu", "India") rather than a single town, so the pages
 * compete for the broader terms the business actually sells against.
 */

export const SITE_NAME = "Zencyp";
export const SITE_URL = "https://zencyp.in";
export const SITE_TAGLINE = "Digital Marketing, Branding & Web Development Agency";

/** Fallback social image. Replace with a 1200x630 OG card when one exists. */
const OG_IMAGE = `${SITE_URL}/logo.svg`;

type SeoInput = {
  title: string;
  description: string;
  /** Route path, e.g. "/services". Used for the canonical URL. */
  path: string;
  /** Extra JSON-LD blocks for this page. */
  schema?: Record<string, unknown>[];
  image?: string;
};

type MetaTag = Record<string, string>;
type LinkTag = Record<string, string>;

export type SeoResult = {
  meta: MetaTag[];
  links: LinkTag[];
  scripts: { type: string; children: string }[];
};

export function seo({
  title,
  description,
  path,
  schema = [],
  image = OG_IMAGE,
}: SeoInput): SeoResult {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_IN" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: schema.map((block) => ({
      type: "application/ld+json",
      children: JSON.stringify(block),
    })),
  };
}

/* ─── Reusable JSON-LD blocks ─────────────────────────────────────────── */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  description:
    "Zencyp is a full-service digital marketing, branding and web development agency working with businesses across Tamil Nadu and India.",
  url: SITE_URL,
  email: "contact@zencyp.in",
  telephone: "+91-8056496547",
  address: {
    "@type": "PostalAddress",
    streetAddress: "First Floor, ADB Apartment Complex, North Suriyakulam Street",
    addressRegion: "Tamil Nadu",
    postalCode: "632301",
    addressCountry: "IN",
  },
  areaServed: [
    { "@type": "State", name: "Tamil Nadu" },
    { "@type": "Country", name: "India" },
  ],
  knowsAbout: [
    "Search engine optimisation",
    "Google Ads management",
    "Meta Ads management",
    "Branding and identity design",
    "Video production and editing",
    "Content marketing",
    "Website design and development",
    "Social media marketing",
    "Graphic design",
  ],
  priceRange: "₹₹",
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-IN",
};

/** Service schema for the individual capability pages. */
export function serviceSchema(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${SITE_URL}${path}`,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: [
      { "@type": "State", name: "Tamil Nadu" },
      { "@type": "Country", name: "India" },
    ],
  };
}

/** Breadcrumbs help Google render the hierarchy in results. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path === "/" ? "" : t.path}`,
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
