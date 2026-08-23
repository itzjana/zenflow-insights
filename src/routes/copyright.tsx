import { createFileRoute } from "@tanstack/react-router";
import { seo, breadcrumbSchema } from "@/lib/seo";
import { LegalPage, type LegalBlock } from "@/components/LegalPage";

export const Route = createFileRoute("/copyright")({
  head: () => ({
    ...seo({
      title: "Copyright Notice | Zencyp",
      description:
        "Ownership of the content, design and code on zencyp.in, how client work is licensed, and how to report a copyright concern.",
      path: "/copyright",
      schema: [
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Copyright", path: "/copyright" },
        ]),
      ],
    }),
  }),
  component: Page,
});

const blocks: LegalBlock[] = [
  { kind: "h", text: "Ownership" },
  {
    kind: "p",
    text: "Unless stated otherwise, the content, layout, design, graphics, code and copy on zencyp.in are owned by Zencyp Digital Solutions and protected by Indian and international copyright law.",
  },
  { kind: "h", text: "What you may do" },
  {
    kind: "list",
    items: [
      "View and read the site for personal, non-commercial purposes",
      "Share links to our pages",
      "Quote short extracts with clear attribution and a link back",
    ],
  },
  { kind: "h", text: "What you may not do" },
  {
    kind: "list",
    items: [
      "Reproduce, republish or redistribute substantial parts of the site without written permission",
      "Copy our design, layout or code for another commercial site",
      "Use our name, logo or brand assets in a way that suggests partnership or endorsement",
      "Remove or alter any copyright or ownership notice",
    ],
  },
  { kind: "h", text: "Client work and portfolio" },
  {
    kind: "p",
    text: "On full payment, clients receive full rights to the custom designs, websites and content we deliver for them. We retain the right to display completed work in our portfolio and promotional material. Client logos and trademarks shown on this site remain the property of their respective owners and appear purely to identify work we have delivered.",
  },
  { kind: "h", text: "Third-party assets" },
  {
    kind: "p",
    text: "Some projects include stock photography, icons, typefaces, plugins or libraries licensed from third parties. Those assets stay under their original licences, which may restrict how they can be reused outside the delivered project.",
  },
  { kind: "h", text: "Reporting a concern" },
  {
    kind: "p",
    text: "If you believe material on this site infringes your copyright, email us with the URL, a description of the work and proof of ownership. We investigate every report and remove infringing material where a claim is substantiated.",
  },
];

function Page() {
  return (
    <LegalPage
      eyebrow={"Copyright"}
      title={"Copyright Notice"}
      intro={
        "This page sets out who owns what on this site, and how our work and our clients' work is licensed."
      }
      updated={"August 2026"}
      blocks={blocks}
    />
  );
}
