import type { Motif as MotifName } from '../../data/personalities'

/** Elemento gráfico propio de cada personalidad. Los trazos se dibujan al aparecer ([data-draw]). */
export function Motif({ name, color }: { name: MotifName; color: string }) {
  const common = { fill: 'none', stroke: color, strokeLinecap: 'round' as const, pathLength: 1 }
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
    >
      {name === 'rays' &&
        Array.from({ length: 9 }, (_, i) => {
          const a = (Math.PI / 2) * (i / 8) + Math.PI / 2
          return (
            <path
              key={i}
              data-draw
              {...common}
              strokeWidth={2}
              d={`M1000 0 L${1000 + Math.cos(a) * 1500} ${Math.sin(a) * 1500}`}
            />
          )
        })}
      {name === 'waves' &&
        Array.from({ length: 7 }, (_, i) => (
          <path
            key={i}
            data-draw
            {...common}
            strokeWidth={2}
            d={`M-20 ${620 + i * 46} C 120 ${580 + i * 46}, 230 ${660 + i * 46}, 370 ${620 + i * 46} S 640 ${580 + i * 46}, 780 ${620 + i * 46} S 960 ${660 + i * 46}, 1040 ${620 + i * 46}`}
          />
        ))}
      {name === 'scribble' && (
        <>
          <path
            data-draw
            {...common}
            strokeWidth={3}
            d="M60 860 C 160 700, 300 900, 380 760 S 520 560, 640 700 S 820 900, 900 640 C 930 540, 880 470, 820 520 C 760 570, 840 660, 940 600"
          />
          <path data-draw {...common} strokeWidth={3} d="M905 560 L944 600 L896 628" />
        </>
      )}
      {name === 'sparkle' &&
        [
          [120, 180, 60],
          [860, 140, 42],
          [780, 820, 70],
          [180, 760, 34],
          [520, 90, 26],
        ].map(([x, y, r], i) => (
          <path
            key={i}
            data-draw
            {...common}
            strokeWidth={2}
            d={`M${x} ${y - r} C ${x + r * 0.12} ${y - r * 0.12}, ${x + r * 0.12} ${y - r * 0.12}, ${x + r} ${y} C ${x + r * 0.12} ${y + r * 0.12}, ${x + r * 0.12} ${y + r * 0.12}, ${x} ${y + r} C ${x - r * 0.12} ${y + r * 0.12}, ${x - r * 0.12} ${y + r * 0.12}, ${x - r} ${y} C ${x - r * 0.12} ${y - r * 0.12}, ${x - r * 0.12} ${y - r * 0.12}, ${x} ${y - r} Z`}
          />
        ))}
    </svg>
  )
}
