interface SunMarkProps {
  className?: string
  rays?: boolean
}

/** Sol lineal: círculo con rayos cortos, usado como acento gráfico. */
export function SunMark({ className = '', rays = true }: SunMarkProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden fill="none" stroke="currentColor">
      <circle cx="50" cy="50" r="20" strokeWidth="2.5" />
      {rays &&
        Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6
          return (
            <line
              key={i}
              x1={50 + Math.cos(a) * 30}
              y1={50 + Math.sin(a) * 30}
              x2={50 + Math.cos(a) * (i % 2 ? 38 : 44)}
              y2={50 + Math.sin(a) * (i % 2 ? 38 : 44)}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )
        })}
    </svg>
  )
}
