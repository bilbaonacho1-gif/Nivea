import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../../animations/gsap'

interface ComputingScreenProps {
  onDone: () => void
}

const WORDS = ['Tu', 'verano', 'tiene', 'una', 'personalidad.']

/** Transición entre la última respuesta y el resultado. */
export function ComputingScreen({ onDone }: ComputingScreenProps) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        const t = window.setTimeout(onDone, 1400)
        return () => window.clearTimeout(t)
      }
      const q = gsap.utils.selector(root)
      gsap
        .timeline({ onComplete: onDone })
        .from(q('[data-c="sun"]'), { scale: 0, duration: 1.2, ease: 'expo.out' })
        .from(q('[data-c="ring"]'), { scale: 0.6, autoAlpha: 0, duration: 1.4, stagger: 0.18, ease: 'expo.out' }, 0.1)
        .from(q('[data-c="word"]'), { yPercent: 110, duration: 0.8, stagger: 0.09, ease: 'expo.out' }, 0.3)
        .from(q('[data-c="kicker"]'), { autoAlpha: 0, duration: 0.6 }, 0.9)
        .to(q('[data-c="ring"]'), { scale: 1.25, autoAlpha: 0, duration: 1.2, stagger: 0.1, ease: 'sine.inOut' }, 1.4)
        .to(q('[data-c="text"]'), { autoAlpha: 0, y: -20, duration: 0.4, ease: 'power2.in' }, 2.6)
        .to(q('[data-c="sun"]'), { scale: 14, y: '18vmin', duration: 0.9, ease: 'power3.in' }, 2.65)
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      className="relative flex h-full flex-col items-center justify-center gap-[7vmin] overflow-hidden bg-ink px-6 text-paper"
      role="status"
    >
      <div className="relative">
        <span data-c="sun" className="block h-[22vmin] w-[22vmin] rounded-full bg-sun" />
        {[1.6, 2.3].map((s) => (
          <span
            key={s}
            data-c="ring"
            aria-hidden
            className="absolute top-1/2 left-1/2 rounded-full border border-sun/50"
            style={{ width: `${22 * s}vmin`, height: `${22 * s}vmin`, translate: '-50% -50%' }}
          />
        ))}
      </div>
      <div data-c="text" className="relative text-center">
        <p data-c="kicker" className="kicker mb-5 text-sun">
          Calculando tu resultado
        </p>
        <p className="display mx-auto flex max-w-[13ch] flex-wrap justify-center gap-x-[0.22em] text-[clamp(2.8rem,8vw,7.5rem)]">
          {WORDS.map((w) => (
            <span key={w} className="overflow-hidden pb-[0.08em]">
              <span data-c="word" className={`block ${w === 'personalidad.' ? 'italic text-sun' : ''}`}>
                {w}
              </span>
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
