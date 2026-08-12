/**
 * Generated cover art. No photography — each variant is a deterministic SVG
 * composition drawn from the brand token, so it themes automatically and there are no
 * image files to ship or lazy-load.
 */

export type ArtVariant = "grid" | "waves" | "layers" | "orbit" | "type" | "spectrum";

type Props = {
  variant: ArtVariant;
  /** Rendered large in the corner of the composition. */
  label?: string;
  className?: string;
};

/* Deterministic pseudo-random so a variant always draws identically. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function Grid() {
  const r = rng(7);
  return (
    <>
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => {
          const v = r();
          return (
            <rect
              key={`${row}-${col}`}
              x={40 + col * 62}
              y={40 + row * 62}
              width={54}
              height={54}
              rx={12}
              fill="var(--brand)"
              opacity={0.06 + v * 0.5}
            />
          );
        }),
      )}
    </>
  );
}

function Waves() {
  return (
    <>
      {Array.from({ length: 14 }).map((_, i) => {
        const y = 90 + i * 32;
        const amp = 26 + i * 3;
        return (
          <path
            key={i}
            d={`M0 ${y} C 110 ${y - amp}, 220 ${y + amp}, 330 ${y} S 550 ${y - amp}, 440 ${y}`}
            fill="none"
            stroke="var(--brand)"
            strokeWidth={1.5}
            opacity={0.12 + i * 0.05}
          />
        );
      })}
    </>
  );
}

function Layers() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <rect
          key={i}
          x={60 + i * 12}
          y={110 + i * 58}
          width={320 - i * 24}
          height={150}
          rx={18}
          fill="var(--brand)"
          opacity={0.08 + i * 0.11}
        />
      ))}
    </>
  );
}

function Orbit() {
  return (
    <>
      {Array.from({ length: 7 }).map((_, i) => (
        <circle
          key={i}
          cx={220}
          cy={280}
          r={38 + i * 34}
          fill="none"
          stroke="var(--brand)"
          strokeWidth={1.5}
          opacity={0.5 - i * 0.055}
        />
      ))}
      <circle cx={220} cy={280} r={26} fill="var(--brand)" opacity={0.85} />
      {[0.6, 1.9, 3.4, 5.1].map((a, i) => (
        <circle
          key={i}
          cx={220 + Math.cos(a) * (72 + i * 42)}
          cy={280 + Math.sin(a) * (72 + i * 42)}
          r={7 + i * 2}
          fill="var(--brand)"
          opacity={0.75}
        />
      ))}
    </>
  );
}

function TypeArt() {
  return (
    <>
      {Array.from({ length: 9 }).map((_, i) => (
        <rect
          key={i}
          x={56}
          y={120 + i * 46}
          width={i % 3 === 0 ? 300 : i % 3 === 1 ? 230 : 168}
          height={16}
          rx={8}
          fill="var(--brand)"
          opacity={0.1 + (i % 4) * 0.16}
        />
      ))}
      <rect x={56} y={56} width={124} height={40} rx={20} fill="var(--brand)" opacity={0.9} />
    </>
  );
}

function Spectrum() {
  const r = rng(23);
  return (
    <>
      {Array.from({ length: 22 }).map((_, i) => {
        const h = 60 + r() * 340;
        return (
          <rect
            key={i}
            x={34 + i * 17}
            y={520 - h}
            width={10}
            height={h}
            rx={5}
            fill="var(--brand)"
            opacity={0.18 + (i / 22) * 0.7}
          />
        );
      })}
    </>
  );
}

const SHAPES: Record<ArtVariant, () => React.JSX.Element> = {
  grid: Grid,
  waves: Waves,
  layers: Layers,
  orbit: Orbit,
  type: TypeArt,
  spectrum: Spectrum,
};

export function WorkArt({ variant, label, className }: Props) {
  const Shape = SHAPES[variant];
  return (
    <svg
      viewBox="0 0 440 560"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={label ? `${label} cover artwork` : "Cover artwork"}
    >
      <defs>
        <linearGradient id={`art-bg-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.14" />
          <stop offset="55%" stopColor="var(--brand)" stopOpacity="0.04" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <rect width="440" height="560" fill={`url(#art-bg-${variant})`} />
      <Shape />
    </svg>
  );
}
