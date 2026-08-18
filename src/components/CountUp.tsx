import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  pad?: number;
  duration?: number;
  className?: string;
};

/** Distance past the bottom edge at which counting starts (fraction of viewport). */
const ENTER_MARGIN = 0.1;
/**
 * If rAF never gets to run — background tab, low-power mode, a throttled mobile
 * renderer — snap to the final value rather than leave a 0 on screen.
 */
const STALL_GUARD_MS = 1200;

const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

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

    const finalText = format(to);
    const zeroText = format(0);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(finalText);
      return;
    }

    let frame = 0;
    let stall: ReturnType<typeof setTimeout> | undefined;
    let running = false;

    /** Is any part of the element inside the viewport right now? */
    const onScreen = () => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return false;
      return r.top < window.innerHeight && r.bottom > 0;
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (stall) clearTimeout(stall);
      stall = undefined;
      running = false;
    };

    const play = () => {
      stop();
      running = true;
      const start = performance.now();
      setDisplayValue(zeroText);

      // Counting is driven by wall-clock time, so a dropped frame never stalls the
      // value — the next frame lands wherever the elapsed time says it should.
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / (duration * 1000));
        setDisplayValue(t >= 1 ? finalText : format(to * easeOutQuad(t)));
        if (t < 1) frame = requestAnimationFrame(step);
        else stop();
      };
      frame = requestAnimationFrame(step);

      // rAF is paused while the page is hidden and throttled on some mobile
      // renderers. If nothing has advanced by now, show the number outright.
      stall = setTimeout(
        () => {
          if (running) {
            stop();
            setDisplayValue(finalText);
          }
        },
        duration * 1000 + STALL_GUARD_MS,
      );
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          play();
          return;
        }
        // Only rewind once the element is genuinely gone. A transient miss during
        // fast scrolling or a layout shift must not leave a 0 on screen.
        if (!onScreen()) {
          stop();
          setDisplayValue(zeroText);
        }
      },
      { threshold: 0, rootMargin: `0px 0px -${ENTER_MARGIN * 100}% 0px` },
    );
    io.observe(el);

    // Coming back to the tab must never reveal a half-finished or zeroed counter.
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      if (onScreen()) play();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, decimals, prefix, suffix, pad, duration]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
