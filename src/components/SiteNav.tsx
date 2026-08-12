import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Menu } from "lucide-react";

import logoPath from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <nav className="hidden md:block fixed top-4 left-1/2 z-50 w-[98vw] max-w-7xl -translate-x-1/2 rounded-full border border-white/15 bg-white/15 px-6 py-3 shadow-[0_28px_70px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
        <div className="relative flex items-center justify-center min-h-14">
          <Link to="/" className="absolute left-5 flex items-center gap-3">
            <img src={logoPath} alt="Zencyp logo" className="h-36 w-auto object-contain" />
          </Link>

          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-lg font-semibold tracking-wide transition ${
                  currentPath === link.to
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* py-3 keeps the bar at ~80px tall now that the mark is 56px, so the fixed-nav
          clearance the hero and pinned sections rely on is unchanged */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 border-b border-white/10 bg-background/80 px-4 py-3 backdrop-blur-md shadow-sm">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoPath} alt="Zencyp logo" className="h-14 w-auto object-contain" />
        </Link>

        <button
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-foreground"
        >
          <Menu size={20} />
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-90 md:hidden" role="dialog" aria-modal="true">
          <div
            ref={overlayRef}
            onClick={close}
            className="absolute inset-0 bg-background/40 backdrop-blur-xl"
          />
          <div
            ref={panelRef}
            className="absolute top-0 right-0 h-full w-[88%] max-w-md bg-slate-950 text-white flex flex-col will-change-transform"
          >
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
              <span className="text-lg font-extrabold tracking-tighter text-white">ZENCYP.</span>
              <button
                aria-label="Close menu"
                onClick={close}
                className="size-11 rounded-full border border-white/15 flex items-center justify-center text-white transition hover:bg-white/10"
              >
                <span className="text-lg leading-none">✕</span>
              </button>
            </div>

            <ul ref={itemsRef} className="flex-1 flex flex-col justify-center px-6 gap-4">
              {navLinks.map((link) => (
                <li key={link.to} className="overflow-hidden">
                  <Link
                    to={link.to}
                    onClick={close}
                    data-mi
                    className="block px-2 py-3 text-2xl font-semibold tracking-wide uppercase text-white transition hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="px-6 py-8 border-t border-white/10 text-xs uppercase tracking-widest font-semibold text-white/70">
              info@zencyp.in · Available Q3 '26
            </div>
          </div>
        </div>
      )}
    </>
  );
}
