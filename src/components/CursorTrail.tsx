import { useEffect, useRef } from "react";

/**
 * Soft ribbon trails that follow the pointer, drawn on a full-viewport canvas that sits
 * behind the dot cursor.
 *
 * Adapted from the classic spring-chain canvas effect, with the palette and a few
 * behaviours changed for this site:
 *  - `source-over` rather than `lighter`. Additive blending only shows up on a dark page;
 *    on white it saturates to nothing. Low-alpha teal ink reads correctly instead.
 *  - No `preventDefault` on pointer/touch move, which in the original kills page
 *    scrolling on touch devices.
 *  - The render loop actually stops on blur and on tab hide, and every listener is
 *    removed with the same reference it was added with.
 *  - Sized to devicePixelRatio so the curves are not soft on high-density screens.
 *  - Skipped entirely on coarse pointers and under prefers-reduced-motion.
 */

/** Chain physics. Tuned for a slightly heavier, slower ribbon than the original. */
const CONFIG = {
  trails: 16,
  nodesPerTrail: 42,
  friction: 0.5,
  dampening: 0.25,
  tension: 0.98,
  baseSpring: 0.42,
};

type Node = { x: number; y: number; vx: number; vy: number };
type Trail = { spring: number; friction: number; nodes: Node[] };

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let trails: Trail[] = [];
    let running = true;
    let frame = 0;
    let started = false;
    /** Drives a gentle lightness oscillation so the ribbon breathes. */
    let phase = Math.random() * Math.PI * 2;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const buildTrails = () => {
      trails = Array.from({ length: CONFIG.trails }, (_, i) => ({
        spring: CONFIG.baseSpring + (i / CONFIG.trails) * 0.025 + Math.random() * 0.1 - 0.02,
        friction: CONFIG.friction + Math.random() * 0.01 - 0.002,
        nodes: Array.from({ length: CONFIG.nodesPerTrail }, () => ({
          x: pointer.x,
          y: pointer.y,
          vx: 0,
          vy: 0,
        })),
      }));
    };

    const updateTrail = (trail: Trail) => {
      let spring = trail.spring;
      const head = trail.nodes[0];
      head.vx += (pointer.x - head.x) * spring;
      head.vy += (pointer.y - head.y) * spring;

      for (let i = 0; i < trail.nodes.length; i++) {
        const node = trail.nodes[i];
        if (i > 0) {
          const prev = trail.nodes[i - 1];
          node.vx += (prev.x - node.x) * spring;
          node.vy += (prev.y - node.y) * spring;
          node.vx += prev.vx * CONFIG.dampening;
          node.vy += prev.vy * CONFIG.dampening;
        }
        node.vx *= trail.friction;
        node.vy *= trail.friction;
        node.x += node.vx;
        node.y += node.vy;
        spring *= CONFIG.tension;
      }
    };

    const drawTrail = (trail: Trail) => {
      const nodes = trail.nodes;
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);

      let i = 1;
      for (; i < nodes.length - 2; i++) {
        const a = nodes[i];
        const b = nodes[i + 1];
        ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) * 0.5, (a.y + b.y) * 0.5);
      }
      const a = nodes[i];
      const b = nodes[i + 1];
      ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
      ctx.stroke();
    };

    const render = () => {
      if (!running) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Teal-cyan ink at low alpha, lightness drifting so the ribbon has some life.
      phase += 0.0015;
      const lightness = 34 + Math.sin(phase) * 12;
      ctx.strokeStyle = `hsla(193, 62%, ${lightness}%, 0.13)`;
      ctx.lineWidth = 1;

      for (const trail of trails) {
        updateTrail(trail);
        drawTrail(trail);
      }

      frame++;
      requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!started) {
        started = true;
        buildTrails();
        render();
      }
    };

    const stop = () => {
      running = false;
    };
    const start = () => {
      if (running || !started) return;
      running = true;
      render();
    };
    const onVisibility = () => (document.visibilityState === "visible" ? start() : stop());

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", stop);
    window.addEventListener("focus", start);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", stop);
      window.removeEventListener("focus", start);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // Sits under the dot cursor (z-9999) and never intercepts input
      className="pointer-events-none fixed inset-0 z-[9998]"
    />
  );
}
