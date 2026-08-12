import { useCallback, useEffect, useState } from "react";

/** Gap left between the bottom edge of the fixed nav and whatever parks under it. */
const NAV_GAP = 16;
/** Used before the nav can be measured (SSR / first paint). */
const FALLBACK_NAV_BOTTOM = 80;

/**
 * Bottom edge of the fixed site nav, in px, plus a small gap.
 *
 * The nav is a floating pill on desktop (top-4, ~82px tall) and a full-width bar on
 * mobile, so its bottom edge differs per breakpoint. Anything that pins to the top of
 * the viewport has to clear it or it renders underneath.
 */
export function useNavClearance() {
  const measure = useCallback(() => {
    if (typeof document === "undefined") return FALLBACK_NAV_BOTTOM + NAV_GAP;
    let navBottom = 0;
    document.querySelectorAll("nav, header").forEach((node) => {
      const el = node as HTMLElement;
      if (!el.getClientRects().length) return;
      const position = window.getComputedStyle(el).position;
      if (position !== "fixed" && position !== "sticky") return;
      const rect = el.getBoundingClientRect();
      // Ignore anything not docked near the top of the viewport
      if (rect.top > window.innerHeight * 0.3) return;
      navBottom = Math.max(navBottom, rect.bottom);
    });
    return (navBottom || FALLBACK_NAV_BOTTOM) + NAV_GAP;
  }, []);

  const [clearance, setClearance] = useState(FALLBACK_NAV_BOTTOM + NAV_GAP);

  useEffect(() => {
    const update = () => setClearance(measure());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [measure]);

  return clearance;
}
