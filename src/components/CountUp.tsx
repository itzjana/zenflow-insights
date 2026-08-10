import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

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

    const reset = () => {
      tween.pause(0);
      obj.v = 0;
      setDisplayValue(format(0));
    };

    // IntersectionObserver rather than ScrollTrigger: it re-fires on every entry in
    // either scroll direction, and it can't go stale when the pinned sections above
    // this one change the page height.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else reset();
      },
      // Mirrors ScrollTrigger's "top 90%" — starts once the number is a tenth of a
      // viewport inside the bottom edge.
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      tween.kill();
    };
  }, [to, decimals, prefix, suffix, pad, duration]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
