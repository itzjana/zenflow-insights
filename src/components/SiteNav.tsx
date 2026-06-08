import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const links = [
  { to: "/services", label: "Services", n: "01" },
  { to: "/philosophy", label: "Philosophy", n: "02" },
  { to: "/contact", label: "Contact", n: "03" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);

  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Open / close animation
  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const items = itemsRef.current?.querySelectorAll("[data-mi]");
    if (!overlay || !panel || !items) return;

    if (open) {
      gsap.set(overlay, { autoAlpha: 1 });
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.6, ease: "power4.out" });
      gsap.fromTo(
        items,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.07, delay: 0.15 },
      );
    }
  }, [open]);

  const close = () => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) {
      setOpen(false);
      return;
    }
    gsap.to(panel, { xPercent: 100, duration: 0.45, ease: "power4.in" });
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      delay: 0.1,
      onComplete: () => setOpen(false),
    });
  };

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full px-5 py-5 md:px-10 md:py-8 flex justify-between items-center bg-background/70 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-4">
          <span className="text-xl md:text-2xl font-extrabold tracking-tighter">ZENCYP.</span>
          <span className="hidden lg:inline-block h-px w-10 bg-foreground/10" />
          <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-widest text-foreground/40 underline decoration-brand decoration-2 underline-offset-4">
            Available Q3 '26
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex gap-10 text-[11px] uppercase tracking-widest font-bold">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="hover:text-foreground/60 transition-colors"
              activeProps={{
                className: "underline decoration-brand decoration-2 underline-offset-4",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Hamburger */}
        <button
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="lg:hidden relative size-11 -mr-1 rounded-full border border-foreground/10 flex flex-col items-center justify-center gap-[5px] bg-background/60 backdrop-blur-md active:scale-95 transition-transform"
        >
          <span className="block h-[2px] w-4 bg-foreground" />
          <span className="block h-[2px] w-4 bg-foreground" />
        </button>
      </nav>

      {/* Mobile overlay menu */}
      {open && (
        <div className="fixed inset-0 z-[90] lg:hidden" role="dialog" aria-modal="true">
          <div
            ref={overlayRef}
            onClick={close}
            className="absolute inset-0 bg-background/40 backdrop-blur-xl"
          />
          <div
            ref={panelRef}
            className="absolute top-0 right-0 h-full w-[88%] max-w-md bg-foreground text-background flex flex-col will-change-transform"
          >
            <div className="flex justify-between items-center px-6 py-5 border-b border-background/10">
              <span className="text-lg font-extrabold tracking-tighter">ZENCYP.</span>
              <button
                aria-label="Close menu"
                onClick={close}
                className="size-11 rounded-full border border-background/15 flex items-center justify-center hover:bg-brand hover:text-brand-foreground hover:border-brand transition-colors"
              >
                <span className="text-lg leading-none">✕</span>
              </button>
            </div>

            <ul ref={itemsRef} className="flex-1 flex flex-col justify-center px-6 gap-2">
              {links.map((l) => (
                <li key={l.to} className="overflow-hidden">
                  <Link
                    to={l.to}
                    onClick={close}
                    data-mi
                    className="group flex items-baseline gap-4 py-3 text-5xl sm:text-6xl font-extrabold tracking-tighter uppercase hover:text-brand transition-colors"
                  >
                    <span className="text-[10px] font-bold tracking-widest opacity-40">{l.n}</span>
                    <span>{l.label}</span>
                    <span className="ml-auto text-2xl opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="px-6 py-8 border-t border-background/10 text-[10px] uppercase tracking-widest font-bold opacity-60">
              hello@zencyp.in · Available Q3 '26
            </div>
          </div>
        </div>
      )}
    </>
  );
}
