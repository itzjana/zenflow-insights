import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ElementType,
  type RefObject,
} from "react";
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
  /**
   * Element to watch instead of this one. Point several Reveals at a shared
   * wrapper so they fire together even when their own tops sit at different
   * heights (e.g. bottom-aligned cards of different sizes).
   */
  trigger?: RefObject<HTMLElement | null>;
  /** replay the reveal each time the trigger comes back into view, in either direction */
  replay?: boolean;
  /** ScrollTrigger start position — override when the default fires too early */
  start?: string;
  /**
   * Only animate while this media query matches; otherwise render the children plainly.
   *
   * Needed wherever the same markup is hidden at some breakpoints: the reveal starts the
   * element at opacity 0 and waits for a scroll trigger, and a `display: none` element
   * never generates one — so it stays invisible until something else forces a refresh.
   */
  media?: string;
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
  trigger,
  replay = false,
  start,
  media,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // No query means always on. Resolved after mount so SSR and the client agree.
  const [enabled, setEnabled] = useState(!media);

  useEffect(() => {
    if (!media) return;
    const mq = window.matchMedia(media);
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [media]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const triggerEl = trigger?.current ?? el;
    const toggleActions = replay ? "restart none restart none" : "play none none none";

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
          scrollTrigger: { trigger: triggerEl, start: start ?? "top 88%", toggleActions },
        });
      } else {
        gsap.from(el, {
          y,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay,
          scrollTrigger: { trigger: triggerEl, start: start ?? "top 90%", toggleActions },
        });
      }
    }, ref);

    return () => ctx.revert();
  }, [delay, y, splitWords, trigger, replay, start, enabled]);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
