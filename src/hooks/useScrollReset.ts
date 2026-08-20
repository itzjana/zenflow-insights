import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/hooks/useSmoothScroll";

/** Extra offset above a hash target so it clears the fixed nav. */
const HASH_OFFSET = 96;
/** A hash target may mount a frame or two after navigation. */
const HASH_RETRIES = 14;
/**
 * How long to keep pinning the page to the top after a navigation.
 *
 * Pinned sections call ScrollTrigger.refresh() from their own rAF and ResizeObservers
 * *after* the route renders, and each refresh can restore a stale offset. Holding
 * position across that window is the only reliable way to win the race.
 */
const SETTLE_MS = 1400;

/**
 * Owns scroll position across navigations.
 *
 * Two things conspire against the browser's own behaviour here:
 *
 *  1. Leaving a GSAP-pinned section (the horizontal Selected Work strip, the capability
 *     stack) removes its pin-spacer, so the document collapses by thousands of pixels.
 *     The browser clamps the old scroll offset to the new, much smaller maximum — which
 *     lands you at the bottom of the page you just opened.
 *  2. Lenis drives the scroll, so a bare window.scrollTo is overwritten on its next tick
 *     unless Lenis' own position is reset too.
 *
 * So the reset is driven off the router's navigation events rather than a render effect
 * — it has to fire *before* the old route tears down — and is then held while pins
 * recalculate.
 */
export function useScrollReset() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    let raf = 0;
    let refreshHandler: (() => void) | null = null;

    const toTop = () => {
      const lenis = getLenis();
      lenis?.scrollTo(0, { immediate: true, force: true });
      // `behavior: "instant"` is load-bearing: the stylesheet sets
      // html { scroll-behavior: smooth }, which turns a bare scrollTo(0, 0) into an
      // animation. That never lands synchronously, so the collapsing document and the
      // pin refreshes below would race it and strand the page mid-scroll.
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };

    const clearPending = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (refreshHandler) {
        ScrollTrigger.removeEventListener("refresh", refreshHandler);
        refreshHandler = null;
      }
    };

    /* Fire before the outgoing route unmounts, so the document never collapses
       underneath a large scroll offset. */
    const unsubBefore = router.subscribe("onBeforeNavigate", () => {
      clearPending();
      toTop();
    });

    let lastPath = router.state.location.pathname;

    const unsubResolved = router.subscribe("onResolved", ({ toLocation }) => {
      clearPending();
      const wasSamePage = toLocation.pathname === lastPath;
      lastPath = toLocation.pathname;
      const hash = toLocation.hash?.replace(/^#/, "");

      if (hash) {
        /* Pinned sections insert spacers on mount, which moves everything below them.
           Refresh first, then measure, or the offset is computed against a stale layout.
           Cross-page anchor landings jump instantly — the same-page case animates. */
        const samePage = wasSamePage;
        let tries = 0;
        const seek = () => {
          const el = document.getElementById(hash);
          if (!el) {
            if (tries++ > HASH_RETRIES) return;
            raf = requestAnimationFrame(seek);
            return;
          }
          ScrollTrigger.refresh();
          const lenis = getLenis();
          const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - HASH_OFFSET);
          if (samePage && lenis) {
            lenis.scrollTo(top, { duration: 0.9, force: true });
          } else {
            lenis?.scrollTo(top, { immediate: true, force: true });
            window.scrollTo({ top, left: 0, behavior: "instant" });
          }
        };
        // Two frames of grace so the route has painted before we measure.
        raf = requestAnimationFrame(() => {
          raf = requestAnimationFrame(seek);
        });
        return;
      }

      toTop();

      const deadline = performance.now() + SETTLE_MS;
      const hold = () => {
        if (window.scrollY > 1) toTop();
        if (performance.now() < deadline) raf = requestAnimationFrame(hold);
        else clearPending();
      };
      raf = requestAnimationFrame(hold);

      refreshHandler = () => {
        if (performance.now() < deadline) toTop();
      };
      ScrollTrigger.addEventListener("refresh", refreshHandler);
    });

    return () => {
      clearPending();
      unsubBefore();
      unsubResolved();
    };
  }, [router]);
}
