import { useEffect, useRef } from "react";

/**
 * Dot cursor matching the reference site: a small circle pinned to the pointer with
 * `mix-blend-mode: difference`, so it inverts against whatever is behind it and stays
 * visible on both light and dark surfaces. The native cursor is hidden while it is on.
 *
 * Skipped entirely on touch/coarse pointers and under prefers-reduced-motion, where the
 * native cursor is left alone.
 */

/** Resting diameter, in px — the reference uses a 10px dot. */
const DOT_SIZE = 10;
/** Multiplier applied while hovering something interactive. */
const HOVER_SCALE = 3.2;
/** Follow easing per frame: 1 = locked to the pointer, lower = more lag. */
const LERP = 0.22;

const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="hover"]';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const dot = dotRef.current;
    if (!dot) return;

    document.documentElement.classList.add("cursor-none");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let scale = 1;
    let targetScale = 1;
    let visible = false;
    let frame = 0;

    const render = () => {
      pos.x += (target.x - pos.x) * LERP;
      pos.y += (target.y - pos.y) * LERP;
      scale += (targetScale - scale) * LERP;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      frame = requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        // Jump to the first known position instead of gliding in from the centre
        pos.x = e.clientX;
        pos.y = e.clientY;
        visible = true;
        dot.style.opacity = "1";
      }
      targetScale = (e.target as Element | null)?.closest?.(INTERACTIVE) ? HOVER_SCALE : 1;
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
    };

    const onDown = () => {
      targetScale *= 0.7;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.classList.remove("cursor-none");
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: 200,
        backgroundColor: "#fff",
        mixBlendMode: "difference",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0,
        transition: "opacity 200ms ease",
        willChange: "transform",
      }}
    />
  );
}
