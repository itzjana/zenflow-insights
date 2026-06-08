import { useEffect, useRef, type ReactNode, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  /** if true, splits children text into words for staggered reveal (mask clip) */
  splitWords?: boolean;
};

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  y = 40,
  splitWords = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      if (splitWords) {
        const text = el.textContent ?? "";
        el.innerHTML = text
          .split(/\s+/)
          .filter(Boolean)
          .map(
            (w) =>
              `<span class="inline-block overflow-hidden align-bottom leading-[0.95] pb-[0.05em]"><span class="inline-block will-change-transform" data-rv>${w}&nbsp;</span></span>`,
          )
          .join("");
        gsap.from(el.querySelectorAll("[data-rv]"), {
          yPercent: 110,
          duration: 1,
          ease: "power3.out",
          stagger: 0.06,
          delay,
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      } else {
        gsap.from(el, {
          y,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay,
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      }
    }, ref);

    return () => ctx.revert();
  }, [delay, y, splitWords]);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
