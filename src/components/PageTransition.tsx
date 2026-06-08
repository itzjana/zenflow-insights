import { useEffect, useRef, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { gsap } from "gsap";

/**
 * Page transition: subtle fade + lift on route change. Non-blocking — the
 * outgoing content fades immediately and the new route is fully interactive
 * the moment it mounts (no overlay sticks around between routes).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isFirst = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Ensure top of page + crisp entrance
    window.scrollTo({ top: 0, behavior: "auto" });
    gsap.fromTo(
      el,
      { opacity: 0, y: 18, scale: 0.995 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "transform,opacity",
      },
    );
  }, [path]);

  return <div ref={ref}>{children}</div>;
}
