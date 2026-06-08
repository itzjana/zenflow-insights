import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Glassmorphism showcase — pinned section with a fixed-center glass orb that
 * slowly fades + scales as additional content scrolls over it.
 */
export function GlassShowcase() {
  const root = useRef<HTMLElement>(null);
  const orb = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = root.current;
    const o = orb.current;
    if (!section || !o) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Idle float + rotation
      gsap.to(o, {
        y: 30,
        rotate: 8,
        duration: 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Scroll-progress: orb shrinks + fades behind content
      gsap.to(o, {
        scale: 0.55,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // Cursor parallax
      const fine = window.matchMedia("(pointer: fine)").matches;
      if (fine) {
        const onMove = (e: MouseEvent) => {
          const r = section.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          const x = (e.clientX / window.innerWidth - 0.5) * 40;
          const y = (e.clientY / window.innerHeight - 0.5) * 40;
          gsap.to(o, { xPercent: x * 0.4, duration: 1.2, ease: "power3.out", overwrite: "auto" });
          gsap.to(o, { x, duration: 1.2, ease: "power3.out", overwrite: false });
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      }
    }, root);
    return () => ctx.revert();
  }, []);

  const blocks = [
    {
      kicker: "Systems",
      title: "Designed as software",
      copy: "Identities engineered as living interfaces — versioned, themable, instrumented.",
    },
    {
      kicker: "Velocity",
      title: "Ship in days, not quarters",
      copy: "Edge-native delivery pipeline. Prototype Monday, in production by Friday.",
    },
    {
      kicker: "Intelligence",
      title: "AI woven into the surface",
      copy: "From copy-aware UI to retrieval-grounded chat — intelligence as a primitive, not a feature.",
    },
  ];

  return (
    <section
      ref={root}
      className="relative bg-foreground text-background overflow-hidden"
      style={{ minHeight: "260vh" }}
    >
      {/* Pinned visual layer */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.25_0_0)_0%,oklch(0.1_0_0)_70%)]" />
        {/* Glow rings */}
        <div className="absolute size-[80vmin] rounded-full bg-brand/20 blur-[120px]" />
        <div className="absolute size-[55vmin] rounded-full bg-brand/30 blur-[80px]" />

        {/* The orb */}
        <div
          ref={orb}
          className="relative size-[55vmin] max-w-[600px] max-h-[600px] will-change-transform"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand via-brand/40 to-foreground/20 shadow-[0_0_120px_30px_rgba(192,255,0,0.25)]" />
          <div className="absolute inset-[8%] rounded-full bg-gradient-to-tr from-background/10 to-background/40 backdrop-blur-xl border border-background/20" />
          <div className="absolute inset-[18%] rounded-full bg-gradient-to-br from-background/5 to-background/20 backdrop-blur-2xl border border-background/10" />
          <div className="absolute top-[12%] left-[18%] size-[22%] rounded-full bg-background/60 blur-2xl" />
        </div>

        {/* Section label */}
        <div className="absolute top-8 md:top-12 left-6 md:left-10 right-6 md:right-10 flex items-center justify-between text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] opacity-60">
          <span className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-brand" /> Showcase / 03
          </span>
          <span className="font-serif italic normal-case opacity-70">A studio in motion</span>
        </div>
      </div>

      {/* Scrolling glass content over the orb */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-[110vh] pb-[40vh] grid gap-12 md:gap-20">
          {blocks.map((b, i) => (
            <div
              key={b.title}
              className={`pointer-events-auto rounded-3xl border border-background/15 bg-background/[0.06] backdrop-blur-2xl p-6 md:p-10 shadow-[0_30px_100px_-40px_rgba(0,0,0,0.6)] ${
                i % 2 === 0 ? "md:mr-auto md:max-w-xl" : "md:ml-auto md:max-w-xl"
              } transition-all duration-500 hover:-translate-y-1.5 hover:bg-background/[0.1] hover:border-brand/40`}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand">
                {b.kicker}
              </span>
              <h3 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tighter leading-[0.95]">
                {b.title}
              </h3>
              <p className="mt-4 text-sm md:text-base font-light text-background/70 max-w-md leading-relaxed">
                {b.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
