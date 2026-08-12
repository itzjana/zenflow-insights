import { useEffect, useState, type FormEvent } from "react";
import {
  Sparkles,
  Video,
  ArrowRightLeft,
  Server,
  Users,
  FileText,
  MessageCircle,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  sendContactMessage,
  SERVICE_OPTIONS,
  type ServiceOption,
} from "@/lib/api/contact.functions";

type ServiceCard = {
  value: ServiceOption;
  icon: typeof Sparkles;
  blurb: string;
};

/* Cards mirror SERVICE_OPTIONS exactly so the value posted is always a valid enum member. */
const SERVICE_CARDS: ServiceCard[] = [
  { value: "Branding", icon: Sparkles, blurb: "Identity, logo systems and brand books" },
  { value: "Video Production", icon: Video, blurb: "Promos, reels and brand storytelling" },
  {
    value: "Digital Marketing & Ads",
    icon: ArrowRightLeft,
    blurb: "Google Ads, Meta Ads and SEO",
  },
  { value: "Website Development", icon: Server, blurb: "Fast, responsive, conversion-first sites" },
  { value: "Social Media Management", icon: Users, blurb: "Content calendars and community" },
  { value: "Graphic Design", icon: FileText, blurb: "Creatives for print and digital" },
  { value: "General Inquiry", icon: MessageCircle, blurb: "Not sure yet — let's talk it through" },
];

const MIN_MESSAGE = 10;

export function ContactSteps() {
  const [step, setStep] = useState<1 | 2>(1);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Prefill the brief when arriving from the calculator
  useEffect(() => {
    if (typeof window === "undefined") return;
    const msg = new URLSearchParams(window.location.search).get("message");
    if (msg) setMessage(msg);
  }, []);

  const toggle = (value: ServiceOption) =>
    setServices((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );

  const goToDetails = () => {
    if (!services.length) {
      toast.error("Pick at least one service to continue.");
      return;
    }
    setStep(2);
    // Bring the form into view after the step swap
    requestAnimationFrame(() =>
      document.getElementById("contact-steps")?.scrollIntoView({ block: "start" }),
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim().length < MIN_MESSAGE) {
      toast.error(`Please add a little more detail (${MIN_MESSAGE} characters minimum).`);
      return;
    }

    setSending(true);
    try {
      await sendContactMessage({
        data: { name, email, phone, company, services, message },
      });
      toast.success("Message sent. We'll reply within one business day.");
      setSent(true);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Unable to send message. Please try again later.",
      );
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setServices([]);
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setMessage("");
    setSent(false);
    setStep(1);
  };

  const field =
    "w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:border-brand focus:outline-none transition-colors";
  const labelCls = "text-[10px] font-bold uppercase tracking-widest text-foreground/50";

  if (sent) {
    return (
      <div
        id="contact-steps"
        className="bg-muted/20 border border-foreground/5 rounded-3xl p-8 md:p-12 text-center flex flex-col items-center gap-5"
      >
        <span className="size-14 rounded-full bg-brand text-brand-foreground flex items-center justify-center">
          <Check className="size-6" />
        </span>
        <h3 className="text-2xl font-extrabold tracking-tighter uppercase">Brief received</h3>
        <p className="text-sm font-light text-foreground/60 max-w-sm leading-relaxed">
          Thanks {name.split(" ")[0] || "—"}. We've got your enquiry about{" "}
          <span className="text-foreground/80">{services.join(", ")}</span> and will reply within
          one business day.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-2 text-xs font-bold uppercase tracking-widest text-foreground/40 hover:text-brand transition-colors"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <div
      id="contact-steps"
      className="bg-muted/20 border border-foreground/5 rounded-3xl p-6 md:p-10 shadow-sm scroll-mt-32"
    >
      {/* Step indicator */}
      <div className="flex items-center gap-4 mb-8">
        {([1, 2] as const).map((s) => {
          const active = step === s;
          const done = step > s;
          return (
            <div key={s} className="flex items-center gap-3 flex-1">
              <span
                className={`size-8 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                  active || done
                    ? "bg-brand text-brand-foreground"
                    : "bg-foreground/[0.07] text-foreground/40"
                }`}
              >
                {done ? <Check className="size-3.5" /> : s}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  active ? "text-foreground" : "text-foreground/35"
                }`}
              >
                {s === 1 ? "Services" : "Your details"}
              </span>
              {s === 1 && <span className="flex-1 h-px bg-foreground/10" />}
            </div>
          );
        })}
      </div>

      {step === 1 ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tighter uppercase">
              What do you need help with?
            </h3>
            <p className="text-sm font-light text-foreground/55">
              Pick as many as apply — most projects combine two or three.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SERVICE_CARDS.map((c) => {
              const Icon = c.icon;
              const selected = services.includes(c.value);
              return (
                <button
                  key={c.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggle(c.value)}
                  className={`group text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 cursor-pointer ${
                    selected
                      ? "bg-brand/[0.06] border-brand"
                      : "bg-background border-foreground/10 hover:border-foreground/25"
                  }`}
                >
                  <span
                    className={`shrink-0 size-9 rounded-xl flex items-center justify-center transition-colors ${
                      selected
                        ? "bg-brand text-brand-foreground"
                        : "bg-foreground/[0.06] text-foreground/45"
                    }`}
                  >
                    {selected ? <Check className="size-4" /> : <Icon className="size-4" />}
                  </span>
                  <span className="min-w-0 flex flex-col gap-0.5">
                    <span className="text-sm font-extrabold tracking-tight leading-snug">
                      {c.value}
                    </span>
                    <span className="text-xs font-light text-foreground/50 leading-snug">
                      {c.blurb}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <span className="text-xs font-medium text-foreground/45 tabular-nums">
              {services.length} selected
            </span>
            <button
              type="button"
              onClick={goToDetails}
              disabled={!services.length}
              className="inline-flex items-center gap-3 bg-foreground text-background rounded-full px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer enabled:hover:bg-brand enabled:hover:text-brand-foreground disabled:opacity-35 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tighter uppercase">
              Tell us about you
            </h3>
            {/* Recap of step one, editable without going back */}
            <div className="flex flex-wrap gap-2">
              {services.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-[11px] font-bold"
                >
                  {s}
                  <button
                    type="button"
                    aria-label={`Remove ${s}`}
                    onClick={() => toggle(s)}
                    className="hover:opacity-60 transition-opacity cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="name" className={labelCls}>
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={field}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className={labelCls}>
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className={field}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="phone" className={labelCls}>
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className={field}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="company" className={labelCls}>
                Company Name
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Corp"
                className={field}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className={labelCls}>
              Project Brief *
            </label>
            <textarea
              id="message"
              required
              minLength={MIN_MESSAGE}
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your goals, timeline and budget range..."
              className={`${field} resize-none`}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/50 hover:text-brand transition-colors px-4 py-3 cursor-pointer"
            >
              <ArrowLeft className="size-3.5" /> Back to services
            </button>
            <button
              type="submit"
              disabled={sending || !services.length}
              className="inline-flex items-center justify-center gap-3 bg-foreground text-background rounded-full px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer enabled:hover:bg-brand enabled:hover:text-brand-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Sending…" : "Send Message"} <ArrowRight className="size-3.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
