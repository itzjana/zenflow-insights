import React, { useLayoutEffect, useRef, useCallback } from "react";
import Lenis from "lenis";
import "./ScrollStack.css";

export interface ScrollStackItemProps {
  children: React.ReactNode;
  itemClassName?: string;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = "",
}) => <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>;

export interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string | number;
  scaleEndPosition?: string | number;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
  header?: React.ReactNode;
}

interface TransformData {
  translateY: number;
  scale: number;
  rotation: number;
  blur: number;
}

/* Gap left between the bottom edge of the fixed nav and the pinned title */
const NAV_GAP = 16;
/* Used until the fixed nav can be measured (SSR / nav not mounted yet) */
const FALLBACK_NAV_BOTTOM = 80;
/* Clearance kept between the settled card pile and whatever follows the section */
const PILE_CLEARANCE = 32;

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
  header,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef<Map<number, TransformData>>(new Map());
  const isUpdatingRef = useRef<boolean>(false);

  const cardTopsRef = useRef<number[]>([]);
  const cardHeightsRef = useRef<number[]>([]);
  const endElementTopRef = useRef<number>(0);
  const anchorTopRef = useRef<number>(0);
  const stackPositionPxRef = useRef<number>(0);
  /* Viewport height frozen at measure time. Read live it changes continuously as the
     mobile URL bar slides, and it feeds the pin geometry — see updateCardTransforms. */
  const containerHeightRef = useRef<number>(0);
  const stickyTopRef = useRef<number>(FALLBACK_NAV_BOTTOM + NAV_GAP);
  const titleHeightRef = useRef<number>(0);
  const titleGapRef = useRef<number>(0);
  const titleNaturalTopRef = useRef<number>(0);
  const hasTitleRef = useRef<boolean>(false);
  const titleRef = useRef<HTMLDivElement>(null);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === "string" && value.includes("%")) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement,
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller ? scroller.scrollTop : 0,
        containerHeight: scroller ? scroller.clientHeight : 0,
        scrollContainer: scroller,
      };
    }
  }, [useWindowScroll]);

  /* Bottom edge of whatever is docked to the top of the viewport (the site nav),
     so the title parks just below it instead of sliding underneath. */
  const measureStickyTop = useCallback(() => {
    if (typeof document === "undefined") return FALLBACK_NAV_BOTTOM + NAV_GAP;
    let navBottom = 0;
    document.querySelectorAll("nav, header").forEach((node) => {
      const el = node as HTMLElement;
      if (!el.getClientRects().length) return;
      const position = window.getComputedStyle(el).position;
      if (position !== "fixed" && position !== "sticky") return;
      const rect = el.getBoundingClientRect();
      // Ignore anything that isn't docked near the top of the viewport
      if (rect.top > window.innerHeight * 0.3) return;
      navBottom = Math.max(navBottom, rect.bottom);
    });
    return (navBottom || FALLBACK_NAV_BOTTOM) + NAV_GAP;
  }, []);

  const measureOffsets = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller && !useWindowScroll) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll(".scroll-stack-card")
        : scroller!.querySelectorAll(".scroll-stack-card"),
    ) as HTMLElement[];

    cardsRef.current = cards;

    // Reset styles temporarily to get untransformed offsets
    const originalTransforms = cards.map((c) => c.style.transform);
    cards.forEach((c) => {
      c.style.transform = "none";
    });

    const endElement = useWindowScroll
      ? (document.querySelector(".scroll-stack-end") as HTMLElement)
      : (scroller?.querySelector(".scroll-stack-end") as HTMLElement);

    let originalEndTransform = "";
    if (endElement) {
      originalEndTransform = endElement.style.transform;
      endElement.style.transform = "none";
    }

    cardTopsRef.current = cards.map((card) => {
      if (useWindowScroll) {
        const rect = card.getBoundingClientRect();
        return rect.top + window.scrollY;
      } else {
        return card.offsetTop;
      }
    });
    cardHeightsRef.current = cards.map((card) => card.getBoundingClientRect().height);

    if (endElement) {
      if (useWindowScroll) {
        const rect = endElement.getBoundingClientRect();
        endElementTopRef.current = rect.top + window.scrollY;
      } else {
        endElementTopRef.current = endElement.offsetTop;
      }
    }

    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      anchorTopRef.current = useWindowScroll
        ? rect.top + window.scrollY
        : anchorRef.current.offsetTop;
    }

    stickyTopRef.current = measureStickyTop();

    // Measure title natural document position
    const titleEl = titleRef.current;

    if (titleEl) {
      hasTitleRef.current = true;
      // Suspend sticky so the rect reports the title's place in the flow rather than
      // wherever it is currently parked.
      const prevPosition = titleEl.style.position;
      titleEl.style.position = "static";
      const titleRect = titleEl.getBoundingClientRect();
      titleHeightRef.current = titleRect.height;
      if (useWindowScroll) {
        titleNaturalTopRef.current = titleRect.top + window.scrollY;
      } else {
        titleNaturalTopRef.current = titleEl.offsetTop;
      }
      // Keep the pinned title→card gap identical to the natural one, otherwise the
      // stack jumps by the difference the moment the title parks under the nav.
      titleGapRef.current = cards.length
        ? Math.max(
            0,
            cardTopsRef.current[0] - (titleNaturalTopRef.current + titleHeightRef.current),
          )
        : 0;
      titleEl.style.position = prevPosition;
    } else {
      hasTitleRef.current = false;
      titleHeightRef.current = 0;
      titleGapRef.current = 0;
    }

    // Restore transforms
    cards.forEach((c, idx) => {
      c.style.transform = originalTransforms[idx] || "";
    });
    if (endElement) {
      endElement.style.transform = originalEndTransform;
    }

    const containerHeight = useWindowScroll ? window.innerHeight : (scroller?.clientHeight ?? 0);
    containerHeightRef.current = containerHeight;

    // The title's park position is a CSS variable so the browser owns the pinning.
    innerRef.current?.style.setProperty("--stack-sticky-top", `${stickyTopRef.current}px`);

    stackPositionPxRef.current = hasTitleRef.current
      ? stickyTopRef.current + titleHeightRef.current + titleGapRef.current
      : parsePercentage(stackPosition, containerHeight);

    // The pile freezes at `pinEnd = endTop - containerHeight / 2` and from there it
    // scrolls away with the page, so its lowest card sits `pileReach` px below the end
    // marker. Pad the section by that much so the pile can never land on top of
    // whatever section follows.
    const inner = innerRef.current;
    if (inner && cards.length) {
      const pileReach = Math.max(
        ...cards.map(
          (_, i) =>
            stackPositionPxRef.current +
            itemStackDistance * i +
            (cardHeightsRef.current[i] ?? 0) -
            containerHeight / 2,
        ),
      );
      const requiredTail = Math.ceil(pileReach + PILE_CLEARANCE);
      const tail = Math.max(Math.round(containerHeight * 0.1), requiredTail);
      const tailPx = `${tail}px`;
      if (inner.style.paddingBottom !== tailPx) {
        inner.style.paddingBottom = tailPx;
      }
    }
  }, [useWindowScroll, measureStickyTop, parsePercentage, stackPosition, itemStackDistance]);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const { scrollTop } = getScrollData();
    /* Deliberately the measured height, not the live one. Android and iOS shrink and
       grow the viewport as the URL bar collapses during a scroll, and this value sets
       both `pinEnd` and the scale-end point — reading it live re-anchored the whole pile
       on almost every frame, which is the judder that survived the earlier resize gate. */
    const containerHeight = containerHeightRef.current || window.innerHeight;

    // Anything above this section (hero imagery, fonts, lazy content) can shift the
    // whole page after the offsets were taken. The anchor is never transformed, so any
    // drift in its position is exactly the drift of every cached offset.
    if (useWindowScroll && anchorRef.current) {
      const anchorTop = anchorRef.current.getBoundingClientRect().top + scrollTop;
      const drift = anchorTop - anchorTopRef.current;
      if (Math.abs(drift) > 0.5) {
        anchorTopRef.current = anchorTop;
        cardTopsRef.current = cardTopsRef.current.map((t) => t + drift);
        endElementTopRef.current += drift;
        titleNaturalTopRef.current += drift;
      }
    }

    const stackPositionPx = stackPositionPxRef.current;
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElementTop = endElementTopRef.current;
    const pinEnd = endElementTop - containerHeight / 2;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const cardTop = cardTopsRef.current[i] ?? 0;
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCard = cardsRef.current[j];
          if (jCard) {
            const jCardTop = cardTopsRef.current[j] ?? 0;
            const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
            if (scrollTop >= jTriggerStart) {
              topCardIndex = j;
            }
          }
        }
        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;
      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform: TransformData = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : "";
        card.style.transform = transform;
        card.style.filter = filter;
        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });
    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      return null;
    } else {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector(".scroll-stack-inner") as HTMLElement,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        normalizeWheel: true,
        wheelMultiplier: 1,
        touchInertiaMultiplier: 35,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
        touchInertia: 0.6,
        // Lenis' published types omit several runtime-supported touch options
      } as ConstructorParameters<typeof Lenis>[0]);
      lenis.on("scroll", handleScroll);
      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);
      lenisRef.current = lenis;
      return lenis;
    }
  }, [handleScroll, useWindowScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller && !useWindowScroll) return;
    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll(".scroll-stack-card")
        : scroller!.querySelectorAll(".scroll-stack-card"),
    ) as HTMLElement[];
    cardsRef.current = cards;
    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = "transform, filter";
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
      card.style.transform = "translateZ(0)";
      // Vendor-prefixed properties are not in CSSStyleDeclaration's type
      card.style.setProperty("-webkit-transform", "translateZ(0)");
      card.style.perspective = "1000px";
      card.style.setProperty("-webkit-perspective", "1000px");
    });

    /* Mobile browsers collapse the URL bar while scrolling, which fires `resize` and
       changes innerHeight. Remeasuring on that recomputes the stack padding, which
       changes body height, which trips the ResizeObserver, which remeasures again — the
       feedback loop that made this section vibrate on phones. Only a width change (or a
       height jump big enough to be a rotation) is a real layout change. */
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;
    const viewportChanged = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const real = w !== lastW || Math.abs(h - lastH) > 160;
      if (real) {
        lastW = w;
        lastH = h;
      }
      return real;
    };

    let remeasureFrame: number | null = null;
    const remeasure = () => {
      remeasureFrame = null;
      measureOffsets();
      lastTransformsRef.current.clear();
      updateCardTransforms();
    };
    const scheduleRemeasure = () => {
      if (remeasureFrame !== null) return;
      remeasureFrame = requestAnimationFrame(remeasure);
    };
    /** Only remeasure when the viewport genuinely changed shape. */
    const scheduleIfViewportChanged = () => {
      if (viewportChanged()) scheduleRemeasure();
    };

    measureOffsets();
    if (useWindowScroll) {
      /* Frame-synced rather than event-driven. Mobile browsers coalesce `scroll` during
         momentum and rubber-banding, so transforms computed from those events land in
         visible jumps while the page keeps moving underneath — the judder that reads as
         the section vibrating. A rAF loop updates in step with compositing instead, and
         costs a single number comparison on frames where nothing moved. */
      let lastY = -1;
      const loop = () => {
        const y = window.scrollY;
        if (y !== lastY) {
          lastY = y;
          updateCardTransforms();
        }
        animationFrameRef.current = requestAnimationFrame(loop);
      };
      animationFrameRef.current = requestAnimationFrame(loop);
    } else {
      setupLenis();
    }
    updateCardTransforms();

    window.addEventListener("resize", scheduleIfViewportChanged);
    window.addEventListener("load", scheduleRemeasure);
    // Late layout shifts (images above the section, webfonts, hydration) would
    // otherwise leave the cached offsets pointing at the wrong scroll positions.
    document.fonts?.ready.then(scheduleRemeasure).catch(() => {});

    /* Deliberately width-only, and deliberately no observer on the body.
       measureOffsets() writes paddingBottom onto .scroll-stack-inner, so an observer
       that reacts to this element's height is watching its own output: on a phone the
       URL bar changes innerHeight -> new tail padding -> observer fires -> remeasure ->
       repeat, which is the vibration. A width change is the only resize of this element
       that is genuinely someone else's doing, and late height changes from webfonts are
       already covered by the fonts.ready hook above. */
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && innerRef.current) {
      let lastInnerWidth = innerRef.current.getBoundingClientRect().width;
      observer = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width ?? lastInnerWidth;
        if (Math.abs(width - lastInnerWidth) < 1) return;
        lastInnerWidth = width;
        scheduleRemeasure();
      });
      observer.observe(innerRef.current);
    }

    return () => {
      if (remeasureFrame !== null) cancelAnimationFrame(remeasureFrame);
      observer?.disconnect();
      window.removeEventListener("resize", scheduleIfViewportChanged);
      window.removeEventListener("load", scheduleRemeasure);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      lastTransformsRef.current.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    updateCardTransforms,
    measureOffsets,
    handleScroll,
  ]);

  return (
    <div
      className={`scroll-stack-scroller ${useWindowScroll ? "window-scroll" : ""} ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner" ref={innerRef}>
        <div className="scroll-stack-anchor" ref={anchorRef} aria-hidden="true" />
        {header && (
          <div
            ref={titleRef}
            // Sticky positioning and the mobile blur override live in ScrollStack.css.
            // Opaque background below md; translucent + blurred where it is affordable.
            className="scroll-stack-title z-30 border-b border-foreground/5 bg-background py-6 mb-12 md:bg-background/90 md:backdrop-blur-md"
          >
            {header}
          </div>
        )}
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
