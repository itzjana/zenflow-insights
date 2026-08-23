import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export type FlowStage = {
  label: string;
  detail: string;
};

type Props = {
  stages: FlowStage[];
  /** Rendered under the last node — the outcome the chain produces. */
  outcome?: string;
};

/**
 * The acquisition chain drawn as a beam that the reader pulls along.
 *
 * The connector is a real path through the measured centres of the nodes rather than a
 * decorative line behind them, so it stays correct when the nodes reflow from a row to a
 * column, or when a label wraps onto a second line. Scroll progress scrubs the beam's
 * stroke-dashoffset and carries a pulse along it via getPointAtLength; each node lights
 * up as the pulse reaches it.
 */
export function FlowBeamGraph({ stages, outcome }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRef = useRef<SVGPathElement>(null);
  const beamRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [path, setPath] = useState("");

  /** Re-derive the connector from where the nodes actually ended up. */
  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const nodes = nodeRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!wrap || nodes.length < 2) return;

    const base = wrap.getBoundingClientRect();
    const centres = nodes.map((n) => {
      const r = n.getBoundingClientRect();
      return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 };
    });

    // Smooth the corners so a row->column reflow reads as one continuous run.
    let d = `M ${centres[0].x} ${centres[0].y}`;
    for (let i = 1; i < centres.length; i++) {
      const a = centres[i - 1];
      const b = centres[i];
      const horizontal = Math.abs(b.x - a.x) > Math.abs(b.y - a.y);
      const c1 = horizontal ? { x: (a.x + b.x) / 2, y: a.y } : { x: a.x, y: (a.y + b.y) / 2 };
      const c2 = horizontal ? { x: (a.x + b.x) / 2, y: b.y } : { x: b.x, y: (a.y + b.y) / 2 };
      d += ` C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`;
    }

    setBox({ w: base.width, h: base.height });
    setPath(d);
  }, []);

  useEffect(() => {
    measure();
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    // Label wrapping changes node heights without changing the wrapper's width.
    nodeRefs.current.forEach((n) => n && ro.observe(n));
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [measure, stages.length]);

  /* Scrub the beam with the page. */
  useEffect(() => {
    const wrap = wrapRef.current;
    const beam = beamRef.current;
    if (!wrap || !beam || !path) return;

    const total = beam.getTotalLength();
    beam.style.strokeDasharray = `${total}`;
    beam.style.strokeDashoffset = `${total}`;

    const nodes = nodeRefs.current.filter(Boolean) as HTMLDivElement[];
    const pulse = pulseRef.current;

    const apply = (progress: number) => {
      const p = Math.min(1, Math.max(0, progress));
      beam.style.strokeDashoffset = `${total * (1 - p)}`;

      if (pulse) {
        const at = beam.getPointAtLength(total * p);
        pulse.setAttribute("cx", `${at.x}`);
        pulse.setAttribute("cy", `${at.y}`);
        pulse.style.opacity = p > 0.01 && p < 0.995 ? "1" : "0";
      }

      // A node is lit once the beam has reached its share of the run.
      nodes.forEach((node, i) => {
        const at = nodes.length > 1 ? i / (nodes.length - 1) : 0;
        node.dataset.lit = p >= at - 0.02 ? "true" : "false";
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(1);
      return;
    }

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top 80%",
      end: "bottom 55%",
      scrub: true,
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => apply(self.progress),
    });
    apply(0);
    return () => st.kill();
  }, [path]);

  return (
    <div ref={wrapRef} className="relative">
      {/* Connector sits behind the nodes and is purely decorative */}
      {path && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0"
          width={box.w}
          height={box.h}
          viewBox={`0 0 ${box.w} ${box.h}`}
          fill="none"
        >
          <defs>
            <linearGradient id="fbBeam" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--brand-soft)" />
              <stop offset="100%" stopColor="var(--brand)" />
            </linearGradient>
          </defs>
          <path
            ref={railRef}
            d={path}
            stroke="currentColor"
            className="text-foreground/12"
            strokeWidth={2}
            strokeDasharray="5 7"
          />
          <path
            ref={beamRef}
            d={path}
            stroke="url(#fbBeam)"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <circle ref={pulseRef} r={6} fill="var(--accent)" opacity={0}>
            <animate attributeName="r" values="5;8;5" dur="1.6s" repeatCount="indefinite" />
          </circle>
        </svg>
      )}

      <ol className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
        {stages.map((s, i) => (
          <li key={s.label} className="min-w-0">
            <div
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              data-lit="false"
              className="group/node h-full rounded-2xl border border-foreground/[0.08] bg-background p-5 transition-[border-color,box-shadow,transform] duration-500 data-[lit=true]:border-brand/45 data-[lit=true]:shadow-[0_14px_40px_-24px_rgba(10,46,51,0.55)]"
            >
              <span className="flex items-center gap-2.5">
                <span className="grid size-6 place-items-center rounded-full border border-foreground/15 text-[9px] font-bold tabular-nums text-foreground/40 transition-colors duration-500 group-data-[lit=true]/node:border-brand group-data-[lit=true]/node:bg-brand group-data-[lit=true]/node:text-brand-foreground">
                  {i + 1}
                </span>
                <span className="text-sm font-extrabold leading-snug tracking-tight">
                  {s.label}
                </span>
              </span>
              <p className="mt-2.5 text-xs font-light leading-relaxed text-foreground/55">
                {s.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {outcome && (
        <p className="mt-8 font-serif text-lg italic leading-snug text-foreground/80 md:text-xl">
          {outcome}
        </p>
      )}
    </div>
  );
}
