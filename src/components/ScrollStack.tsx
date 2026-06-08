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
  const stackCompletedRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef<Map<number, TransformData>>(new Map());
  const isUpdatingRef = useRef<boolean>(false);

  const cardTopsRef = useRef<number[]>([]);
  const endElementTopRef = useRef<number>(0);
  const titleHeightRef = useRef<number>(0);
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

    if (endElement) {
      if (useWindowScroll) {
        const rect = endElement.getBoundingClientRect();
        endElementTopRef.current = rect.top + window.scrollY;
      } else {
        endElementTopRef.current = endElement.offsetTop;
      }
    }

    // Measure title natural document position
    const titleEl = useWindowScroll
      ? (document.querySelector(".scroll-stack-title") as HTMLElement)
      : (scroller?.querySelector(".scroll-stack-title") as HTMLElement);

    if (titleEl) {
      hasTitleRef.current = true;
      // Clear transform temporarily to get true natural position
      const prevTransform = titleEl.style.transform;
      titleEl.style.transform = "none";
      titleHeightRef.current = titleEl.getBoundingClientRect().height;
      if (useWindowScroll) {
        const rect = titleEl.getBoundingClientRect();
        titleNaturalTopRef.current = rect.top + window.scrollY;
      } else {
        titleNaturalTopRef.current = (titleEl as HTMLElement).offsetTop;
      }
      titleEl.style.transform = prevTransform;
    } else {
      hasTitleRef.current = false;
    }

    // Restore transforms
    cards.forEach((c, idx) => {
      c.style.transform = originalTransforms[idx] || "";
    });
    if (endElement) {
      endElement.style.transform = originalEndTransform;
    }
  }, [useWindowScroll]);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    // Cards pin 24px below the title bottom when title is at its sticky viewport position (96px = top-24)
    const TITLE_STICKY_VIEWPORT_TOP = 96;
    let stackPositionPx = parsePercentage(stackPosition, containerHeight);
    if (hasTitleRef.current) {
      stackPositionPx = TITLE_STICKY_VIEWPORT_TOP + titleHeightRef.current + 24;
    }
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElementTop = endElementTopRef.current;
    const pinEnd = endElementTop - containerHeight / 2;

    // 3-phase JS-driven title positioning (no CSS sticky)
    const titleEl = titleRef.current;
    if (titleEl && hasTitleRef.current && cardsRef.current.length > 0) {
      const card0Top = cardTopsRef.current[0] ?? 0;
      // The scroll position at which card[0] starts pinning
      const pinStart0 = card0Top - stackPositionPx;
      const titleNaturalTop = titleNaturalTopRef.current;
      const titleHeight = titleHeightRef.current;

      let titleTranslateY: number;
      if (scrollTop < pinStart0) {
        // Phase 1: before stacking starts — title stays at natural document position
        titleTranslateY = 0;
      } else if (scrollTop <= pinEnd) {
        // Phase 2: cards are stacking — title sticks at TITLE_STICKY_VIEWPORT_TOP from viewport top
        // Viewport pos = docPos - scrollTop  =>  docPos + translateY - scrollTop = stickyTop
        titleTranslateY = scrollTop - titleNaturalTop + TITLE_STICKY_VIEWPORT_TOP;
      } else {
        // Phase 3: all cards piled — freeze title in document space so it scrolls off with the stack
        // Frozen doc pos = pinEnd + stackPositionPx - titleHeight - 24  (maintains 24px gap above card[0])
        titleTranslateY = pinEnd + stackPositionPx - titleHeight - 24 - titleNaturalTop;
      }

      titleEl.style.transform = `translate3d(0, ${Math.round(titleTranslateY * 100) / 100}px, 0)`;
    }

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
    stackPosition,
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
      } as any);
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
      (card.style as any).webkitTransform = "translateZ(0)";
      card.style.perspective = "1000px";
      (card.style as any).webkitPerspective = "1000px";
    });

    measureOffsets();
    if (useWindowScroll) {
      window.addEventListener("scroll", handleScroll);
    } else {
      setupLenis();
    }
    updateCardTransforms();

    window.addEventListener("resize", measureOffsets);

    return () => {
      window.removeEventListener("resize", measureOffsets);
      if (useWindowScroll) {
        window.removeEventListener("scroll", handleScroll);
      }
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
      <div className="scroll-stack-inner">
        {header && (
          <div
            ref={titleRef}
            className="scroll-stack-title relative z-30 bg-background/90 backdrop-blur-md py-6 mb-12 border-b border-foreground/5"
            style={{ willChange: "transform" }}
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
