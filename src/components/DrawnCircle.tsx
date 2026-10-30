interface DrawnCircleProps {
  className?: string
}

/**
 * Trazo de círculo a mano alzada para marcar una palabra.
 * Se anima desde fuera con stroke-dashoffset (data-draw).
 */
export function DrawnCircle({ className = '' }: DrawnCircleProps) {
  return (
    <svg
      viewBox="0 0 300 120"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute ${className}`}
      aria-hidden
      fill="none"
    >
      <path
        data-draw
        pathLength={1}
        d="M160 14C96 8 26 22 12 56c-12 30 40 52 130 54 86 2 148-16 150-48 2-30-58-50-150-50-30 0-62 4-86 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
