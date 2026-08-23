import { Reveal } from "@/components/Reveal";
import { ConvergenceDiagram, type DiagramNode } from "@/components/ConvergenceDiagram";

/**
 * The case for a system rather than a logo, drawn as a convergence.
 *
 * Layout, sizing and node placement follow the reference composition; the palette is
 * ours — cyan-to-teal strands on white, a dark teal hub, and lime kept to the glow where
 * it can carry weight without failing contrast.
 *
 * Node x/y are percentages of the diagram stage, chosen to scatter the labels across the
 * strands rather than line them up in two tidy columns.
 */
const NODES: DiagramNode[] = [
  // Fragmentation, left
  {
    id: "logo",
    title: "A logo only",
    sub: "and no rules around it",
    x: 2.5,
    y: 30,
    mx: 1,
    my: 4,
    dot: "#4FB0D4",
    side: "left",
  },
  {
    id: "colour",
    title: "Colour drifts",
    sub: "with every designer",
    x: 14,
    y: 12,
    mx: 1,
    my: 21,
    dot: "var(--brand-soft)",
    side: "left",
  },
  {
    id: "surfaces",
    title: "Pack and web",
    sub: "look like two brands",
    x: 7.5,
    y: 66,
    mx: 1,
    my: 62,
    dot: "#1D7FA0",
    side: "left",
  },
  {
    id: "assets",
    title: "Every new asset",
    sub: "starts an argument",
    x: 24,
    y: 78,
    mx: 1,
    my: 79,
    dot: "#2F6F7C",
    side: "left",
  },
  // Outcomes, right
  {
    id: "pack",
    title: "Packaging",
    sub: "holds at shelf distance",
    x: 97.5,
    y: 12,
    mx: 99,
    my: 12,
    dot: "var(--brand-soft)",
    side: "right",
  },
  {
    id: "web",
    title: "Website",
    sub: "converts on trust",
    x: 86,
    y: 30,
    mx: 99,
    my: 29,
    dot: "#4FB0D4",
    side: "right",
  },
  {
    id: "social",
    title: "Social",
    sub: "recognisable mid-feed",
    x: 80,
    y: 66,
    mx: 99,
    my: 70,
    dot: "#2F6F7C",
    side: "right",
  },
  {
    id: "print",
    title: "Print & signage",
    sub: "reproduces in one colour",
    x: 97.5,
    y: 78,
    mx: 99,
    my: 87,
    dot: "#1D7FA0",
    side: "right",
  },
];

export function BrandSystemBeams() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28">
      <div className="mx-auto mb-12 max-w-[1128px] px-5 text-center md:mb-16 md:px-6">
        <Reveal className="flex flex-col items-center gap-4">
          <span className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em]">
            <span className="size-2 rounded-full bg-brand" /> Why a system
          </span>
          <h2 className="max-w-3xl text-3xl font-extrabold uppercase leading-[1.05] tracking-tighter md:text-5xl">
            A logo is not a brand.{" "}
            <span className="border-b-4 border-accent font-serif font-semibold normal-case italic tracking-tight text-brand md:border-b-6">
              A system is.
            </span>
          </h2>
          <p className="max-w-2xl text-sm font-light leading-relaxed text-foreground/60 md:text-base">
            Most brands do not break at the mark. They break at the fourth application, when nobody
            can say what is correct any more. One system, defined once, keeps every surface
            agreeing.
          </p>
        </Reveal>
      </div>

      {/* Full-bleed: the strands run off both edges of the screen, as in the reference */}
      <Reveal delay={0.1}>
        <div className="px-5 lg:px-0">
          <ConvergenceDiagram nodes={NODES} hub="One brand system, defined once" />
        </div>
      </Reveal>
    </section>
  );
}
