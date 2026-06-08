import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  src: string;
  alt?: string;
};

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export function ImageReveal({ src, alt = "Reveal image" }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;

    if (!section || !container) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-reveal-card]");
      if (cards.length === 0) return;

      // Entrance reveal
      cards.forEach((card) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 85%" },
        });
      });

      if (reduce) return;

      // Stack cards over each other
      const cardHeight = cards[0].clientHeight;
      cards.forEach((card, i) => {
        if (i === 0) return;
        const prevCard = cards[i - 1];

        gsap.to(card, {
          y: -cardHeight * (i - 1),
          ease: "none",
          scrollTrigger: {
            trigger: prevCard,
            start: `bottom ${window.innerHeight * 0.4}px`,
            end: `bottom ${window.innerHeight * 0.15}px`,
            scrub: 0.5,
          },
        });
      });

      // Dim and scale previous cards as next stacks
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        const next = cards[i + 1];

        gsap.to(card, {
          scale: 0.98,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top 40%",
            end: "top 20%",
            scrub: 0.5,
          },
        });
      });

      // Animate image masks for reveal effect
      cards.forEach((card, i) => {
        const topMask = card.querySelector("[data-reveal-top-mask]") as HTMLElement;
        const bottomMask = card.querySelector("[data-reveal-bottom-mask]") as HTMLElement;

        if (topMask && bottomMask) {
          gsap.fromTo(
            topMask,
            { yPercent: 0 },
            {
              yPercent: -100,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 70%",
                end: "bottom 30%",
                scrub: 0.5,
              },
            },
          );

          gsap.fromTo(
            bottomMask,
            { yPercent: 0 },
            {
              yPercent: 100,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 70%",
                end: "bottom 30%",
                scrub: 0.5,
              },
            },
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const revealCards = [
    {
      id: 1,
      title: "Craftsmanship",
      subtitle: "Every pixel, purpose-built",
    },
    {
      id: 2,
      title: "Innovation",
      subtitle: "Design that moves forward",
    },
    {
      id: 3,
      title: "Experience",
      subtitle: "Built for impact and scale",
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 px-6 md:px-10 bg-background">
      <div ref={containerRef} className="relative max-w-6xl mx-auto">
        {revealCards.map((card, i) => (
          <div
            key={card.id}
            data-reveal-card
            className="sticky top-32 md:top-40 origin-top will-change-transform"
            style={{
              zIndex: revealCards.length - i,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="relative h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden bg-muted border border-foreground/10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]">
              {/* Fixed background image */}
              <img
                src={src}
                alt={alt}
                loading={i === 0 ? "eager" : "lazy"}
                className="absolute inset-0 w-full h-full object-cover will-change-transform"
              />

              {/* Top mask for reveal effect */}
              <div
                data-reveal-top-mask
                className="absolute top-0 left-0 right-0 h-1/2 bg-background will-change-transform"
              />

              {/* Bottom mask for reveal effect */}
              <div
                data-reveal-bottom-mask
                className="absolute bottom-0 left-0 right-0 h-1/2 bg-background will-change-transform"
              />

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 bg-gradient-to-t from-background/60 via-transparent to-transparent">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">
                    {String(card.id).padStart(2, "0")} /{" "}
                    {String(revealCards.length).padStart(2, "0")}
                  </span>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter">
                    {card.title}
                  </h3>
                  <p className="text-sm md:text-base text-foreground/60 max-w-md">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Spacer between cards */}
            {i < revealCards.length - 1 && <div aria-hidden className="h-[50vh] md:h-[55vh]" />}

            {/* Spacing after last card */}
            {i === revealCards.length - 1 && <div aria-hidden className="h-16 md:h-24" />}
          </div>
        ))}
      </div>
    </section>
  );
}
