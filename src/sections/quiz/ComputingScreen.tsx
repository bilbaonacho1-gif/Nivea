import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../../animations/gsap'
import { images } from '../../data/assets'

interface ComputingScreenProps {
  onDone: () => void
}

const WORDS = ['Tu', 'verano', 'tiene', 'una', 'personalidad.']

/** Transición al resultado: la tapa de la lata gira y termina cubriendo la pantalla. */
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
        .from(q('[data-c="lid"]'), { scale: 0.6, autoAlpha: 0, rotate: -120, duration: 1.4, ease: 'expo.out' })
        .to(q('[data-c="lid"]'), { rotate: 200, duration: 2.6, ease: 'sine.inOut' }, 0.2)
        .from(q('[data-c="word"]'), { yPercent: 110, duration: 0.8, stagger: 0.08, ease: 'expo.out' }, 0.35)
        .from(q('[data-c="kicker"]'), { autoAlpha: 0, duration: 0.6 }, 0.8)
        .to(q('[data-c="text"]'), { autoAlpha: 0, y: -16, duration: 0.4, ease: 'power2.in' }, 2.45)
        .to(q('[data-c="lid"]'), { scale: 9, duration: 0.85, ease: 'power3.in' }, 2.55)
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      className="bg-studio relative flex h-full flex-col items-center justify-center gap-[6vmin] overflow-hidden px-6 text-paper"
      role="status"
    >
      <img
        data-c="lid"
        src={images.tinLid}
        alt=""
        className="w-[min(42vmin,340px)] drop-shadow-[0_30px_40px_rgb(0_8_40/0.6)]"
        draggable={false}
      />
      <div data-c="text" className="relative text-center">
        <p data-c="kicker" className="kicker mb-5 text-sun">
          Calculando tu resultado
        </p>
        <p className="display mx-auto flex max-w-[13ch] flex-wrap justify-center gap-x-[0.22em] text-[clamp(2.6rem,7vw,6.5rem)]">
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
