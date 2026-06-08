import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Zencyp – Digital Marketing Agency Tamil Nadu" },
      {
        name: "description",
        content:
          "Ready to grow? Contact Zencyp today for a free consultation. Call +91 8056496547 or email info@zencyp.in. We look forward to helping your business succeed online!",
      },
      { property: "og:title", content: "Contact Zencyp – Digital Marketing Agency Tamil Nadu" },
      {
        property: "og:description",
        content: "Start a project with Zencyp or schedule a free consultation.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  // Parse message query parameter if set from the calculator
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const msg = params.get("message");
      if (msg) {
        setMessage(msg);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending message
    toast.success("Message sent successfully! We will reply within one business day.");
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setMessage("");
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col font-sans">
      <SiteNav />

      <section className="flex-1 pt-40 md:pt-48 pb-24 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <span className="text-[30vw] font-black uppercase tracking-tighter leading-none select-none">
            ZEN
          </span>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
            <span className="size-2 bg-brand rounded-full animate-pulse" /> Open Inquiry
          </span>

          <h1 className="mt-8 text-[clamp(2.5rem,8vw,8rem)] font-extrabold leading-[0.85] tracking-tighter uppercase text-balance">
            Get in Touch
            <br />
            with{" "}
            <span className="font-serif italic font-semibold lowercase underline decoration-brand decoration-[8px] underline-offset-[12px] text-brand-foreground bg-brand/5 px-2">
              zencyp.
            </span>
          </h1>

          <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left side: Contact Info */}
            <div className="lg:col-span-5 space-y-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/40 block mb-2">
                  Address
                </span>
                <p className="text-lg font-light text-foreground/80 leading-relaxed max-w-md">
                  <strong>Zencyp Studio</strong>
                  <br />
                  First Floor, ADB Apartment Complex,
                  <br />
                  North Suriyakulam St, Arani, 632301,
                  <br />
                  Tamil Nadu, India
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/40 block mb-2">
                  Direct Line
                </span>
                <a
                  href="tel:+918056496547"
                  className="block text-2xl md:text-3xl font-extrabold tracking-tight hover:text-brand transition-colors"
                >
                  +91 8056496547
                </a>
                <p className="text-xs text-foreground/40 mt-1">Mon–Sat, 9am–6pm IST</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/40 block mb-2">
                  Email Us
                </span>
                <a
                  href="mailto:info@zencyp.in"
                  className="block text-2xl md:text-3xl font-extrabold tracking-tight underline decoration-brand decoration-2 underline-offset-4 hover:text-brand transition-colors break-all"
                >
                  info@zencyp.in
                </a>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/40 block mb-2">
                  Response SLA
                </span>
                <p className="text-sm font-light text-foreground/75 leading-relaxed">
                  We reply to every qualified project brief and consultation request within one
                  working day.
                </p>
              </div>
            </div>

            {/* Right side: Interactive Contact Form */}
            <div className="lg:col-span-7 bg-muted/20 border border-foreground/5 rounded-3xl p-6 md:p-10 shadow-sm">
              <h3 className="text-xl font-bold tracking-tight mb-8">Send a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-[10px] font-bold uppercase tracking-widest text-foreground/50"
                    >
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:border-brand focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-[10px] font-bold uppercase tracking-widest text-foreground/50"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:border-brand focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-[10px] font-bold uppercase tracking-widest text-foreground/50"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:border-brand focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="company"
                      className="text-[10px] font-bold uppercase tracking-widest text-foreground/50"
                    >
                      Company Name
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:border-brand focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-[10px] font-bold uppercase tracking-widest text-foreground/50"
                  >
                    Message or Brief Details *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your project or branding objectives..."
                    className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:border-brand focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-3 bg-foreground text-background rounded-full px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand hover:text-brand-foreground transition-all duration-500 cursor-pointer w-full justify-center sm:w-auto"
                  >
                    Send Message <span>→</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
