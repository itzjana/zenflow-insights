import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Props = {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  pad?: number;
  duration?: number;
  className?: string;
};

export function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  pad = 0,
  duration = 1,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  const format = (n: number) => {
    const s = n.toFixed(decimals);
    const [int, frac] = s.split(".");
    const padded = pad > 0 ? int.padStart(pad, "0") : int;
    return prefix + (frac ? `${padded}.${frac}` : padded) + suffix;
  };

  const [displayValue, setDisplayValue] = useState(() => format(0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplayValue(format(to));
      return;
    }

    const obj = { v: 0 };

    const tween = gsap.to(obj, {
      v: to,
      duration,
      ease: "power2.out",
      paused: true,
      onUpdate: () => setDisplayValue(format(obj.v)),
      onComplete: () => setDisplayValue(format(to)),
    });

    const play = () => {
      obj.v = 0;
      tween.invalidate().restart(true);
    };

    // Use the span itself as the trigger — not the section.
    // This way the trigger position is exactly where the number lives.
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      onEnter: play,
      onEnterBack: play,
    });

    // Fallback: if the element is already visible when the component mounts,
    // ScrollTrigger won't fire onEnter. Check manually after two frames
    // (one for layout, one for ScrollTrigger.refresh internals).
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
        if (inView) play();
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      st.kill();
      tween.kill();
    };
  }, [to, decimals, prefix, suffix, pad, duration]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
