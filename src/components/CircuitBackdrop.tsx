import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Props = {
  /** Element whose scroll span drives the animation. */
  targetRef: React.RefObject<HTMLElement | null>;
};

/** Traces laid out on a 1200x800 grid. Each is drawn, then a packet runs along it. */
const TRACES = [
  "M 60 120 H 300 V 300 H 520",
  "M 60 420 H 200 V 250 H 430 V 150 H 640",
  "M 1140 180 H 900 V 360 H 700",
  "M 1140 520 H 980 V 660 H 760 V 560 H 600",
  "M 60 700 H 340 V 540 H 560",
  "M 620 780 V 620 H 860 V 460 H 1080",
];

/** Pads sit at the end of a trace, where a packet arrives. */
const PADS = [
  { x: 520, y: 300 },
  { x: 640, y: 150 },
  { x: 700, y: 360 },
  { x: 600, y: 560 },
  { x: 560, y: 540 },
  { x: 1080, y: 460 },
];

/**
 * Circuit traces behind the process stage that draw themselves as the section scrolls,
 * with a packet travelling each trace once it is complete.
 *
 * Everything is scrubbed from one ScrollTrigger and written straight to SVG attributes,
 * so there is no timer running when the section is off screen and no React state per
 * frame. It is decorative: aria-hidden, non-interactive, and skipped under
 * prefers-reduced-motion (where the traces are simply shown finished).
 */
export function CircuitBackdrop({ targetRef }: Props) {
  const traceRefs = useRef<(SVGPathElement | null)[]>([]);
  const packetRefs = useRef<(SVGCircleElement | null)[]>([]);
  const padRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const target = targetRef.current;
    const traces = traceRefs.current.filter(Boolean) as SVGPathElement[];
    if (!target || !traces.length) return;

    const lengths = traces.map((t) => t.getTotalLength());
    traces.forEach((t, i) => {
      t.style.strokeDasharray = `${lengths[i]}`;
      t.style.strokeDashoffset = `${lengths[i]}`;
    });

    const settle = () => {
      traces.forEach((t) => (t.style.strokeDashoffset = "0"));
      padRefs.current.forEach((p) => p && (p.style.opacity = "0.9"));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      settle();
      return;
    }

    const apply = (progress: number) => {
      traces.forEach((trace, i) => {
        // Stagger the traces across the first 70% so they don't all draw together
        const start = (i / traces.length) * 0.7;
        const local = Math.min(1, Math.max(0, (progress - start) / 0.3));
        trace.style.strokeDashoffset = `${lengths[i] * (1 - local)}`;

        const packet = packetRefs.current[i];
        if (packet) {
          if (local <= 0 || local >= 1) {
            packet.style.opacity = "0";
          } else {
            const at = trace.getPointAtLength(lengths[i] * local);
            packet.setAttribute("cx", `${at.x}`);
            packet.setAttribute("cy", `${at.y}`);
            packet.style.opacity = "1";
          }
        }

        const pad = padRefs.current[i];
        if (pad) pad.style.opacity = local >= 1 ? "0.9" : "0";
      });
    };

    const st = ScrollTrigger.create({
      trigger: target,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => apply(self.progress),
    });
    apply(0);
    return () => st.kill();
  }, [targetRef]);

  return (
    <svg
      aria-hidden
      // Cropped hard on phones so the traces read as texture rather than clutter
      className="pointer-events-none absolute inset-0 size-full opacity-[0.5] md:opacity-100"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        <linearGradient id="cbTrace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--brand-soft)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Unlit substrate, so the board is legible before anything draws */}
      {TRACES.map((d, i) => (
        <path
          key={`rail-${i}`}
          d={d}
          stroke="currentColor"
          className="text-foreground/[0.055]"
          strokeWidth={1.5}
        />
      ))}

      {TRACES.map((d, i) => (
        <path
          key={`trace-${i}`}
          ref={(el) => {
            traceRefs.current[i] = el;
          }}
          d={d}
          stroke="url(#cbTrace)"
          strokeWidth={1.75}
          strokeLinecap="square"
        />
      ))}

      {PADS.map((p, i) => (
        <circle
          key={`pad-${i}`}
          ref={(el) => {
            padRefs.current[i] = el;
          }}
          cx={p.x}
          cy={p.y}
          r={4.5}
          fill="var(--brand-soft)"
          opacity={0}
          style={{ transition: "opacity 400ms ease-out" }}
        />
      ))}

      {TRACES.map((_, i) => (
        <circle
          key={`packet-${i}`}
          ref={(el) => {
            packetRefs.current[i] = el;
          }}
          r={3.5}
          fill="var(--accent)"
          opacity={0}
        />
      ))}
    </svg>
  );
}
