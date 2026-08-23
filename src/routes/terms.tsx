import { createFileRoute } from "@tanstack/react-router";
import { seo, breadcrumbSchema } from "@/lib/seo";
import { LegalPage, type LegalBlock } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    ...seo({
      title: "Terms & Conditions | Zencyp",
      description:
        "The terms governing Zencyp's website design, e-commerce, digital marketing, branding, graphic design and video services, including payment, revisions and intellectual property.",
      path: "/terms",
      schema: [
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Terms & Conditions", path: "/terms" },
        ]),
      ],
    }),
  }),
  component: Page,
});

const blocks: LegalBlock[] = [
  { kind: "h", text: "Company overview" },
  {
    kind: "p",
    text: "Zencyp is a registered digital solutions company offering website design and development, e-commerce, digital marketing, branding, graphic design and video editing. These terms govern all services delivered under the Zencyp brand and associated domains.",
  },
  { kind: "h", text: "Scope of services" },
  {
    kind: "list",
    items: [
      "Website and e-commerce development, including custom builds, Shopify and WordPress",
      "Search engine optimisation and digital marketing",
      "Social media marketing and paid advertising campaigns",
      "Branding, logo design and UI/UX design",
      "Graphic design for web and print",
      "Video editing for promotional and commercial use",
    ],
  },
  { kind: "p", text: "Custom services may be provided based on project requirements." },
  { kind: "h", text: "Client responsibilities" },
  {
    kind: "list",
    items: [
      "Provide required content \u2014 copy, images, access credentials \u2014 before the project starts",
      "Make payments on the agreed milestones",
      "Review and approve deliverables within the communicated timeline",
      "Maintain confidentiality of deliverables and sensitive company data",
    ],
  },
  { kind: "h", text: "Payment terms" },
  {
    kind: "list",
    items: [
      "A non-refundable advance, usually 30\u201350%, is required before work begins",
      "The balance is due on delivery or against agreed milestones",
      "Monthly services such as SEO or ads are invoiced in advance each month",
      "Payments delayed beyond 10 days may result in a service pause or a late fee",
    ],
  },
  { kind: "note", text: "GST and any other applicable taxes are included in invoices." },
  { kind: "h", text: "Refund policy" },
  {
    kind: "p",
    text: "We do not offer refunds once work has commenced or custom services have been delivered. Refunds apply only where:",
  },
  {
    kind: "list",
    items: [
      "A service was paid for but not started within 30 days",
      "A technical issue on our side prevented delivery, following investigation",
    ],
  },
  { kind: "p", text: "Refund requests must be made in writing within 7 days of payment." },
  { kind: "h", text: "Revisions and support" },
  {
    kind: "list",
    items: [
      "Website and design projects include up to 2 rounds of revisions unless stated otherwise",
      "Additional revisions or requests outside the agreed scope are chargeable",
      "Website projects include 30 days of post-launch support; extended support is chargeable",
    ],
  },
  { kind: "h", text: "Project timeline" },
  {
    kind: "p",
    text: "Timelines are estimates and depend on your response times and the complexity of scope. We communicate unforeseen delays. Delays in providing materials or approvals may lead to rescheduling or additional charges.",
  },
  { kind: "h", text: "Intellectual property" },
  {
    kind: "list",
    items: [
      "On full payment you receive full rights to the custom designs, websites and content delivered",
      "We reserve the right to showcase completed projects in our portfolio and promotional material",
      "Stock photography, fonts, plugins and third-party tools may carry their own licence terms",
    ],
  },
  { kind: "h", text: "Confidentiality" },
  {
    kind: "p",
    text: "Both parties agree to keep confidential any business, project or sensitive information shared during the engagement, including files, data and communication.",
  },
  { kind: "h", text: "Termination of services" },
  { kind: "p", text: "We reserve the right to terminate services in the event of:" },
  {
    kind: "list",
    items: [
      "Failure to meet payment or communication obligations",
      "Abusive, illegal or unethical activity",
      "Requests that fall outside reasonable business conduct",
    ],
  },
  { kind: "h", text: "Limitation of liability" },
  { kind: "p", text: "Zencyp is not liable for:" },
  {
    kind: "list",
    items: [
      "Direct or indirect loss of profit",
      "Technical downtime caused by hosting or other third-party providers",
      "Performance issues resulting from client-side modifications",
    ],
  },
  { kind: "h", text: "Governing law" },
  {
    kind: "p",
    text: "These terms are governed by the laws of India, and any dispute is subject to the jurisdiction of the courts of Tamil Nadu.",
  },
];

function Page() {
  return (
    <LegalPage
      eyebrow={"Terms & Conditions"}
      title={"Terms & Conditions"}
      intro={
        "By accessing our website or engaging our services you agree to these terms. Please read them before starting a project with us."
      }
      updated={"August 2026"}
      blocks={blocks}
    />
  );
}
