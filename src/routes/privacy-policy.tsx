import { createFileRoute } from "@tanstack/react-router";
import { seo, breadcrumbSchema } from "@/lib/seo";
import { LegalPage, type LegalBlock } from "@/components/LegalPage";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    ...seo({
      title: "Privacy Policy | Zencyp",
      description:
        "How Zencyp collects, uses, stores and protects your personal information when you use our website or engage our digital marketing, branding and web development services.",
      path: "/privacy-policy",
      schema: [
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ]),
      ],
    }),
  }),
  component: Page,
});

const blocks: LegalBlock[] = [
  {
    kind: "p",
    text: "Business name: Zencyp Digital Solutions. Website: zencyp.in. In this policy \u201cwe\u201d, \u201cus\u201d and \u201cour\u201d refer to Zencyp.",
  },
  { kind: "h", text: "1. Information we collect" },
  { kind: "p", text: "Personal information you give us when you submit a form or contact us:" },
  {
    kind: "list",
    items: [
      "Name",
      "Email address",
      "Phone number",
      "Company name",
      "Billing address",
      "Service preferences",
    ],
  },
  { kind: "p", text: "Non-personal information collected automatically when you visit:" },
  {
    kind: "list",
    items: [
      "IP address",
      "Browser type and version",
      "Device information",
      "Pages visited",
      "Referral source",
      "Time spent on site",
    ],
  },
  {
    kind: "note",
    text: "We use cookies and third-party tools such as Google Analytics and the Meta Pixel for measurement. See our Cookie Policy for detail.",
  },
  { kind: "h", text: "2. How we use your information" },
  {
    kind: "list",
    items: [
      "Provide and manage our services, such as web development and SEO",
      "Respond to your enquiries and service requests",
      "Send invoices, updates and proposals",
      "Analyse website usage and improve the experience",
      "Run advertising and remarketing campaigns",
      "Send newsletters or promotional email, which you can opt out of at any time",
      "Meet legal obligations and protect our services from misuse",
    ],
  },
  { kind: "h", text: "3. Cookies and tracking" },
  {
    kind: "p",
    text: "Cookies let us remember your preferences, understand behaviour through Google Analytics and the Meta Pixel, improve performance, and run remarketing. You can disable cookies in your browser, though parts of the site may not work as well.",
  },
  { kind: "h", text: "4. Sharing your data" },
  { kind: "p", text: "We do not sell or rent your data. We share it only with:" },
  {
    kind: "list",
    items: [
      "Trusted partners providing technical services such as hosting and email",
      "Advertising platforms including Google Ads and Meta for campaign targeting",
      "Legal authorities where we are required to by law",
    ],
  },
  { kind: "h", text: "5. Data security" },
  {
    kind: "list",
    items: [
      "SSL encryption in transit",
      "Secure servers",
      "Access control over internal data",
      "Regular audits and malware scanning",
    ],
  },
  {
    kind: "note",
    text: "We take data protection seriously, but no system can guarantee complete security.",
  },
  { kind: "h", text: "6. Your rights" },
  {
    kind: "list",
    items: [
      "Request access to the personal data we hold about you",
      "Ask for corrections or deletion",
      "Withdraw consent at any time",
      "Opt out of marketing email or SMS",
      "Complain to a supervisory authority if you believe your data has been misused",
    ],
  },
  { kind: "h", text: "7. Third-party links" },
  {
    kind: "p",
    text: "Our site links to third-party platforms such as Instagram, YouTube and LinkedIn. We are not responsible for their privacy practices, so please review their policies separately.",
  },
  { kind: "h", text: "8. Children\u2019s privacy" },
  {
    kind: "p",
    text: "Our services are not intended for anyone under 16. We do not knowingly collect data from children. If you believe we have, contact us and we will remove it.",
  },
  { kind: "h", text: "9. Updates to this policy" },
  {
    kind: "p",
    text: "We may revise this policy from time to time. Updated versions are posted on this page with a new effective date.",
  },
];

function Page() {
  return (
    <LegalPage
      eyebrow={"Privacy Policy"}
      title={"Privacy Policy"}
      intro={
        "Zencyp values your privacy. This policy sets out what we collect, why we collect it, and the control you have over your information."
      }
      updated={"August 2026"}
      blocks={blocks}
    />
  );
}
