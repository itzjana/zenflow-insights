import { createFileRoute } from "@tanstack/react-router";
import { seo, breadcrumbSchema } from "@/lib/seo";
import { LegalPage, type LegalBlock } from "@/components/LegalPage";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    ...seo({
      title: "Cookie Policy | Zencyp",
      description:
        "What cookies Zencyp uses, why we use them, the third-party tools involved, and how to control or disable cookies in your browser.",
      path: "/cookie-policy",
      schema: [
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Cookie Policy", path: "/cookie-policy" },
        ]),
      ],
    }),
  }),
  component: Page,
});

const blocks: LegalBlock[] = [
  { kind: "h", text: "What cookies are" },
  {
    kind: "p",
    text: "Cookies are small text files a site stores on your device. They let a site remember your actions and preferences between visits, and help us understand how the site is used.",
  },
  { kind: "h", text: "Why we use them" },
  {
    kind: "list",
    items: [
      "Remember your preferences between visits",
      "Understand how visitors move through the site",
      "Measure and improve page performance",
      "Attribute enquiries to the campaign that produced them",
      "Run remarketing and targeted advertising",
    ],
  },
  { kind: "h", text: "Categories we set" },
  {
    kind: "list",
    items: [
      "Essential \u2014 required for the site to function; these cannot be switched off",
      "Analytics \u2014 aggregate usage reporting through Google Analytics",
      "Advertising \u2014 campaign measurement and remarketing through Google Ads and the Meta Pixel",
    ],
  },
  { kind: "h", text: "Third-party cookies" },
  {
    kind: "p",
    text: "Some cookies are set by services we use rather than by us directly, including Google Analytics, Google Ads and Meta. Those providers process data under their own policies, which we recommend reviewing.",
  },
  { kind: "h", text: "Managing cookies" },
  {
    kind: "p",
    text: "Every major browser lets you view, block or delete cookies from its settings. Blocking cookies is fine for browsing, but some parts of the site may behave differently. You can also opt out of Google Analytics measurement using Google\u2019s browser add-on.",
  },
  { kind: "h", text: "Changes to this policy" },
  {
    kind: "p",
    text: "As we add or remove tools, this page is updated to match. The date at the top reflects the most recent revision.",
  },
];

function Page() {
  return (
    <LegalPage
      eyebrow={"Cookie Policy"}
      title={"Cookie Policy"}
      intro={"This policy explains the cookies we set, what they do, and how to turn them off."}
      updated={"August 2026"}
      blocks={blocks}
    />
  );
}
