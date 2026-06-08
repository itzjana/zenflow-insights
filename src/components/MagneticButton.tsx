import {
  useEffect,
  useRef,
  type ReactNode,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import { gsap } from "gsap";

type CommonProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

type AnchorProps = CommonProps & {
  as: "a";
  href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;
type ButtonProps = CommonProps & { as?: "button" } & ButtonHTMLAttributes<HTMLButtonElement>;
type Props = AnchorProps | ButtonProps;

export function MagneticButton(props: Props) {
  const { children, className, strength = 0.4 } = props;
  const ref = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    // Only on devices with fine pointer (skip touch)
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const onMove = (e: Event) => {
      const me = e as MouseEvent;
      const rect = el.getBoundingClientRect();
      const x = (me.clientX - (rect.left + rect.width / 2)) * strength;
      const y = (me.clientY - (rect.top + rect.height / 2)) * strength;
      gsap.to(el, { x, y, duration: 0.5, ease: "power3.out" });
      gsap.to(inner, { x: x * 0.4, y: y * 0.4, duration: 0.5, ease: "power3.out" });
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
      gsap.to(inner, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  const classes = `inline-block will-change-transform btn-glow ${className ?? ""}`;
  const inner = (
    <span ref={innerRef} className="inline-flex items-center gap-4 will-change-transform">
      {children}
    </span>
  );

  if (props.as === "a") {
    const { as: _a, children: _c, className: _cn, strength: _s, ...rest } = props;
    return (
      <a ref={ref as React.RefObject<HTMLAnchorElement>} className={classes} {...rest}>
        {inner}
      </a>
    );
  }
  const { as: _a, children: _c, className: _cn, strength: _s, ...rest } = props;
  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} className={classes} {...rest}>
      {inner}
    </button>
  );
}
