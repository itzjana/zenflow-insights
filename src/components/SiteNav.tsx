import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Menu, ChevronDown, ArrowUpRight } from "lucide-react";

import logoPath from "@/assets/logo.png";

/** Work pages listed under the Services dropdown. */
const serviceLinks = [
  { to: "/work/branding", label: "Branding", blurb: "Identity & visual systems" },
  { to: "/work/digital-marketing", label: "Digital Marketing", blurb: "Performance & growth" },
  { to: "/work/web-production", label: "Web Production", blurb: "Design & engineering" },
] as const;

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services", children: serviceLinks },
  { to: "/about", label: "Portfolio" },
  { to: "/", hash: "case-studies", label: "Case Studies" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const [scrolled, setScrolled] = useState(false);

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  /* Mobile only, and only on the home route: the mobile hero is a full-bleed dark
     image, so the bar can drop away over it. Every other hero is white — white links
     there would vanish — and the desktop pill stays solid by design. */
  const transparentBar = currentPath === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    setMobileServicesOpen(false);
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

  // Close the desktop dropdown on outside click or Escape
  useEffect(() => {
    if (!servicesOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setServicesOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

  const isActive = (to: string, hash?: string) =>
    hash ? false : to === "/" ? currentPath === "/" : currentPath.startsWith(to);

  const linkCls = (active: boolean) =>
    `text-base font-bold tracking-wide transition ${
      active ? "text-accent" : "text-white/75 hover:text-white"
    }`;

  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:block fixed top-4 left-1/2 z-50 w-[98vw] max-w-7xl -translate-x-1/2 rounded-full border border-white/20 bg-brand px-6 py-3 shadow-[0_28px_70px_rgba(10,46,51,0.35)]">
        <div className="relative flex items-center justify-between gap-6 min-h-14">
          <Link to="/" className="flex items-center shrink-0">
            <img src={logoPath} alt="Zencyp" className="h-8 w-auto object-contain" />
          </Link>

          <div className="flex items-center gap-7">
            {navLinks.map((link) =>
              "children" in link ? (
                <div
                  key={link.label}
                  ref={servicesRef}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  {/* The label navigates to /services; the chevron only opens the menu,
                      so keyboard users can reach the sub-items without leaving the page. */}
                  <span className="inline-flex items-center gap-1.5">
                    <Link
                      to={link.to}
                      onClick={() => setServicesOpen(false)}
                      className={linkCls(isActive(link.to))}
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      aria-expanded={servicesOpen}
                      aria-haspopup="true"
                      aria-label="Show services menu"
                      onClick={() => setServicesOpen((v) => !v)}
                      className={`cursor-pointer ${isActive(link.to) ? "text-accent" : "text-white/75 hover:text-white"}`}
                    >
                      <ChevronDown
                        className={`size-4 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </span>

                  {servicesOpen && (
                    <div className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-4">
                      <div className="rounded-2xl border border-white/15 bg-brand-deep p-2 shadow-[0_30px_80px_rgba(6,35,42,0.5)]">
                        {link.children.map((c) => (
                          <Link
                            key={c.to}
                            to={c.to}
                            onClick={() => setServicesOpen(false)}
                            className="group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/10"
                          >
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                            <span className="flex flex-col">
                              <span className="text-sm font-bold text-white">{c.label}</span>
                              <span className="text-xs text-white/55">{c.blurb}</span>
                            </span>
                          </Link>
                        ))}
                        <Link
                          to="/services"
                          onClick={() => setServicesOpen(false)}
                          className="mt-1 flex items-center justify-between rounded-xl border-t border-white/10 px-3 py-3 text-xs font-bold uppercase tracking-widest text-accent transition-colors hover:bg-white/10"
                        >
                          All services <ArrowUpRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  hash={"hash" in link ? link.hash : undefined}
                  className={linkCls(isActive(link.to, "hash" in link ? link.hash : undefined))}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          <Link
            to="/contact"
            className="hidden lg:inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-3 text-[11px] font-extrabold uppercase tracking-widest text-accent-foreground transition-transform duration-300 hover:-translate-y-0.5"
          >
            Get a free strategy call
            <span className="flex size-6 items-center justify-center rounded-full bg-accent-foreground/15">
              <ArrowUpRight className="size-3.5" />
            </span>
          </Link>
        </div>
      </nav>

      {/* Mobile bar */}
      <nav
        className={`md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-4 py-3 transition-colors duration-500 ${
          transparentBar
            ? "border-b border-transparent bg-transparent"
            : "border-b border-white/15 bg-brand shadow-sm"
        }`}
      >
        {/* Keeps the white mark and menu button readable over a bright photo */}
        {transparentBar && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-black/45 to-transparent"
          />
        )}
        <Link to="/" className="flex items-center gap-3">
          <img src={logoPath} alt="Zencyp" className="h-7 w-auto object-contain" />
        </Link>

        <button
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white"
        >
          <Menu size={20} />
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-90 md:hidden" role="dialog" aria-modal="true">
          <div
            ref={overlayRef}
            onClick={close}
            className="absolute inset-0 bg-background/40 backdrop-blur-xl"
          />
          <div
            ref={panelRef}
            className="absolute top-0 right-0 h-full w-[88%] max-w-md bg-brand-deep text-white flex flex-col will-change-transform"
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

            <ul
              ref={itemsRef}
              className="flex-1 flex flex-col justify-center px-6 gap-2 overflow-y-auto"
            >
              {navLinks.map((link) =>
                "children" in link ? (
                  <li key={link.label} className="overflow-hidden" data-mi>
                    <button
                      type="button"
                      aria-expanded={mobileServicesOpen}
                      onClick={() => setMobileServicesOpen((v) => !v)}
                      className="flex w-full items-center justify-between px-2 py-3 text-2xl font-semibold tracking-wide uppercase text-white transition hover:text-accent"
                    >
                      {link.label}
                      <ChevronDown
                        className={`size-5 transition-transform duration-300 ${mobileServicesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {mobileServicesOpen && (
                      <div className="flex flex-col gap-1 pb-2 pl-4">
                        {link.children.map((c) => (
                          <Link
                            key={c.to}
                            to={c.to}
                            onClick={close}
                            className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-base font-medium text-white/70 transition hover:text-accent"
                          >
                            <span className="size-1.5 rounded-full bg-accent" />
                            {c.label}
                          </Link>
                        ))}
                        <Link
                          to="/services"
                          onClick={close}
                          className="px-2 py-2.5 text-xs font-bold uppercase tracking-widest text-accent"
                        >
                          All services
                        </Link>
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={link.label} className="overflow-hidden">
                    <Link
                      to={link.to}
                      hash={"hash" in link ? link.hash : undefined}
                      onClick={close}
                      data-mi
                      className="block px-2 py-3 text-2xl font-semibold tracking-wide uppercase text-white transition hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>

            <div className="px-6 pb-6">
              <Link
                to="/contact"
                onClick={close}
                className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-xs font-extrabold uppercase tracking-widest text-accent-foreground"
              >
                Get a free strategy call <ArrowUpRight className="size-4" />
              </Link>
            </div>

            <div className="px-6 py-6 border-t border-white/10 text-xs uppercase tracking-widest font-semibold text-white/70">
              info@zencyp.in
            </div>
          </div>
        </div>
      )}
    </>
  );
}
