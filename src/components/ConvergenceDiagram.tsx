import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export type DiagramNode = {
  id: string;
  title: string;
  sub: string;
  /** Desktop position, as a percentage of the stage. */
  x: number;
  y: number;
  /** Mobile position. The stage is taller and narrower there, so the scatter differs. */
  mx: number;
  my: number;
  dot: string;
  /** Right-hand nodes anchor from their right edge so they hug the stage edge. */
  side: "left" | "right";
};

/* Stage coordinate space. Card positions are percentages of this, so the composition
   holds at any width. */
const VW = 1990;
const VH = 700;
const WAIST_X = VW / 2;
const WAIST_Y = VH / 2;

/** Strand palette — cyan through teal. Lime is reserved for the hub glow: a lime line on
    white sits at ~1.2:1 and would simply vanish. */
const STRANDS = [
  { y0: 40, y1: 96, colour: "var(--brand-soft)", w: 1.6, o: 0.85 },
  { y0: 104, y1: 40, colour: "#4FB0D4", w: 1.2, o: 0.6 },
  { y0: 168, y1: 210, colour: "var(--brand-soft)", w: 1.8, o: 0.9 },
  { y0: 232, y1: 150, colour: "#1D7FA0", w: 1.3, o: 0.7 },
  { y0: 296, y1: 330, colour: "#2F6F7C", w: 1.5, o: 0.75 },
  { y0: 350, y1: 268, colour: "var(--brand-soft)", w: 1.1, o: 0.5 },
  { y0: 404, y1: 452, colour: "#1D7FA0", w: 1.7, o: 0.8 },
  { y0: 468, y1: 386, colour: "#2F6F7C", w: 1.2, o: 0.6 },
  { y0: 532, y1: 574, colour: "var(--brand-soft)", w: 1.5, o: 0.7 },
  { y0: 596, y1: 512, colour: "#4FB0D4", w: 1.2, o: 0.55 },
  { y0: 648, y1: 636, colour: "#2F6F7C", w: 1.4, o: 0.65 },
  { y0: 12, y1: 664, colour: "#1D7FA0", w: 1, o: 0.4 },
];

/** Left edge → waist → right edge, with a little vertical weave at the crossing. */
function strandPath(y0: number, y1: number, i: number) {
  const weave = ((i % 5) - 2) * 7; // spread the crossings so they braid
  const wy = WAIST_Y + weave;
  return [
    `M 0 ${y0}`,
    `C ${VW * 0.24} ${y0}, ${WAIST_X - 220} ${wy}, ${WAIST_X} ${wy}`,
    `C ${WAIST_X + 220} ${wy}, ${VW * 0.76} ${y1}, ${VW} ${y1}`,
  ].join(" ");
}

/** Desktop and mobile use the same diagram, only re-scattered. */
function useIsCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return compact;
}

type Props = { nodes: DiagramNode[]; hub: string };

export function ConvergenceDiagram({ nodes, hub }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const compact = useIsCompact();

  /* Draw the strands left-to-right as the section scrolls — the beam follows the
     reader rather than looping on a timer. */
  useEffect(() => {
    const stage = stageRef.current;
    const paths = pathRefs.current.filter(Boolean) as SVGPathElement[];
    if (!stage || !paths.length) return;

    const lengths = paths.map((p) => p.getTotalLength());
    paths.forEach((p, i) => {
      p.style.strokeDasharray = `${lengths[i]}`;
      p.style.strokeDashoffset = `${lengths[i]}`;
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paths.forEach((p) => (p.style.strokeDashoffset = "0"));
      return;
    }

    const apply = (progress: number) => {
      paths.forEach((p, i) => {
        const start = (i / paths.length) * 0.4;
        const local = Math.min(1, Math.max(0, (progress - start) / (1 - start)));
        p.style.strokeDashoffset = `${lengths[i] * (1 - local)}`;
      });
    };

    const st = ScrollTrigger.create({
      trigger: stage,
      start: "top 85%",
      end: "bottom 45%",
      scrub: true,
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => apply(self.progress),
    });
    return () => st.kill();
  }, []);

  return (
    <div
      ref={stageRef}
      // Taller and squarer on small screens so eight labels still have somewhere to sit
      className="relative w-full aspect-[390/620] sm:aspect-[900/560] lg:aspect-[1990/700]"
    >
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          {/* Fades each strand out at the edges so nothing terminates abruptly */}
          <linearGradient id="cdFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="12%" stopColor="white" stopOpacity="1" />
            <stop offset="88%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="cdMask">
            <rect width={VW} height={VH} fill="url(#cdFade)" />
          </mask>
          {/* Warm highlight where the strands pinch together */}
          <radialGradient id="cdWaist">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
            <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx={WAIST_X} cy={WAIST_Y} rx={300} ry={120} fill="url(#cdWaist)" />

        <g mask="url(#cdMask)">
          {/* Faint rail so the structure reads before the strands draw */}
          {STRANDS.map((s, i) => (
            <path
              key={`rail-${i}`}
              d={strandPath(s.y0, s.y1, i)}
              stroke="var(--brand)"
              strokeOpacity={0.07}
              strokeWidth={s.w}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {STRANDS.map((s, i) => (
            <path
              key={`strand-${i}`}
              ref={(el) => {
                pathRefs.current[i] = el;
              }}
              d={strandPath(s.y0, s.y1, i)}
              stroke={s.colour}
              strokeOpacity={s.o}
              strokeWidth={s.w}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      </svg>

      {/* Floating labels, scattered over the strands like the reference */}
      {nodes.map((n) => {
        const x = compact ? n.mx : n.x;
        const y = compact ? n.my : n.y;
        return (
          <div
            key={n.id}
            className="absolute"
            style={{
              left: n.side === "left" ? `${x}%` : undefined,
              right: n.side === "right" ? `${100 - x}%` : undefined,
              top: `${y}%`,
            }}
          >
            <NodeCard node={n} />
          </div>
        );
      })}

      {/* Hub — dark on white, the inverse of the reference's white-on-black */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative rounded-full bg-brand px-4 py-2.5 text-center shadow-[0_18px_60px_rgba(10,46,51,0.28)] sm:px-6 sm:py-3.5 lg:px-8 lg:py-4">
          <span
            aria-hidden
            className="absolute -inset-4 -z-10 rounded-full bg-accent/30 blur-2xl"
          />
          <p className="max-w-[7.5rem] text-[10px] font-extrabold leading-snug tracking-tight text-white sm:max-w-[10rem] sm:text-xs lg:max-w-[13rem] lg:text-sm">
            {hub}
          </p>
        </div>
      </div>
    </div>
  );
}

function NodeCard({ node }: { node: DiagramNode }) {
  return (
    <div className="relative w-max max-w-[9.5rem] rounded-xl border border-foreground/10 bg-background/85 px-2.5 py-2 shadow-[0_10px_30px_-14px_rgba(10,46,51,0.35)] backdrop-blur-md sm:max-w-[11rem] sm:rounded-2xl sm:px-3.5 sm:py-2.5 lg:max-w-[13rem] lg:px-4 lg:py-3">
      <span
        aria-hidden
        className="absolute -top-1 left-3 size-2 rounded-full sm:left-4 sm:size-2.5"
        style={{ background: node.dot }}
      />
      <p className="text-[10px] font-extrabold leading-tight tracking-tight text-foreground sm:text-xs lg:whitespace-nowrap lg:text-sm">
        {node.title}
      </p>
      <p className="text-[9px] font-light leading-tight text-foreground/55 sm:text-[10px] lg:whitespace-nowrap lg:text-xs">
        {node.sub}
      </p>
    </div>
  );
}
