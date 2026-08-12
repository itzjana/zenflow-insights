import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactSteps } from "@/components/ContactSteps";

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
            <span className="font-serif italic font-semibold lowercase underline decoration-brand decoration-[8px] underline-offset-[12px] text-foreground bg-brand/5 px-2">
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

            {/* Right side: two-step enquiry form */}
            <div className="lg:col-span-7">
              <ContactSteps />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
