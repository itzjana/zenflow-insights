import { Link } from "@tanstack/react-router";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const socials = [
  { href: "https://twitter.com", label: "Twitter" },
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "https://clutch.co", label: "Clutch" },
  { href: "https://dribbble.com", label: "Dribbble" },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`group rounded-3xl border border-foreground/10 bg-background p-6 md:p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_40px_100px_-40px_rgba(0,0,0,0.35)] hover:border-foreground/20 ${className}`}
    >
      {children}
    </div>
  );
}

function ArrowLink({
  to,
  href,
  children,
}: {
  to?: string;
  href?: string;
  children: React.ReactNode;
}) {
  const inner = (
    <span className="group/link flex items-center justify-between gap-4 py-2 transition-transform duration-300 hover:translate-x-1.5">
      <span className="text-2xl md:text-3xl font-extrabold tracking-tight">{children}</span>
      <span className="inline-flex items-center justify-center size-9 rounded-full border border-foreground/10 text-sm transition-transform duration-300 group-hover/link:rotate-45 group-hover/link:bg-brand group-hover/link:border-brand group-hover/link:text-brand-foreground">
        ↗
      </span>
    </span>
  );
  if (to) return <Link to={to}>{inner}</Link>;
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {inner}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="px-4 md:px-6 pt-12 md:pt-16 pb-8 bg-muted/40">
      <div className="max-w-400 mx-auto">
        {/* Top monogram */}
        <div className="rounded-3xl bg-foreground text-background px-6 md:px-12 pt-10 md:pt-14 pb-6 md:pb-8 mb-4 md:mb-6 overflow-hidden relative">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 md:items-end justify-between relative z-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">
                Studio
              </span>
              <h2 className="mt-3 text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9]">
                Zencyp<span className="text-brand">.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm md:text-base font-light opacity-70 leading-relaxed">
              Precision digital engineering for ambitious brands. India ↔ everywhere.
            </p>
          </div>
          <div className="absolute -bottom-12 md:-bottom-20 -right-4 md:-right-10 text-[36vw] md:text-[18vw] font-black tracking-tighter leading-none opacity-[0.06] pointer-events-none">
            ZEN
          </div>
        </div>

        {/* Grid of cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Navigation card */}
          <Card className="md:col-span-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40">
              Navigate
            </span>
            <ul className="mt-6 divide-y divide-foreground/5">
              {nav.map((n) => (
                <li key={n.to}>
                  <ArrowLink to={n.to}>{n.label}</ArrowLink>
                </li>
              ))}
            </ul>
          </Card>

          {/* Contact stack */}
          <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
            <Card>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40">
                Contact
              </span>
              <a
                href="mailto:info@zencyp.in"
                className="mt-5 block text-xl md:text-2xl font-extrabold tracking-tight transition-transform duration-300 hover:translate-x-1.5"
              >
                info@zencyp.in
              </a>
              <p className="mt-3 text-sm font-light text-foreground/60">Arani, Tamil Nadu, India</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/40">
                Available Q3 '26
              </p>
            </Card>

            {/* Primary action, in place of the old newsletter signup */}
            <Card className="relative overflow-hidden bg-brand! text-white">
              <div className="pointer-events-none absolute -right-16 -bottom-16 size-48 rounded-full bg-accent/15 blur-3xl" />
              <span className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                Start a project
              </span>
              <p className="relative mt-4 text-lg font-extrabold leading-snug tracking-tight">
                Tell us where you want to grow.
              </p>
              <p className="relative mt-2 text-sm font-light leading-relaxed text-white/60">
                We reply to every brief within one working day.
              </p>
              <Link
                to="/contact"
                className="relative mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-xs font-extrabold uppercase tracking-widest text-accent-foreground transition-transform duration-300 hover:-translate-y-0.5"
              >
                Book a call
                <span aria-hidden>→</span>
              </Link>
            </Card>
          </div>

          {/* Social card */}
          <Card className="md:col-span-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40">
              Social
            </span>
            <ul className="mt-6 flex flex-col gap-1.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group/s flex items-center justify-between py-2 text-base font-bold transition-transform duration-300 hover:translate-x-1.5"
                  >
                    <span>{s.label}</span>
                    <span className="inline-flex items-center justify-center size-7 rounded-full border border-foreground/10 text-xs transition-transform duration-300 group-hover/s:rotate-45 group-hover/s:bg-brand group-hover/s:border-brand">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Bottom legal */}
        <div className="mt-6 md:mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.25em] font-bold text-foreground/40">
          <span>© 2026 Zencyp India — Precision Digital</span>
          <span>
            Crafted with intent. <span className="text-brand">●</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
