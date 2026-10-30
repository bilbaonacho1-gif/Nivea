import { useRef, type JSX } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../../animations/gsap'
import { personalities, type ResultLayout } from '../../data/personalities'
import { useQuiz } from '../../hooks/QuizContext'
import type { QuizResult } from '../../lib/quizLogic'
import { CalmLayout, CollageLayout, PosterLayout, TiltLayout } from './ResultLayouts'

const layouts: Record<ResultLayout, (props: { result: QuizResult }) => JSX.Element> = {
  poster: PosterLayout,
  tilt: TiltLayout,
  collage: CollageLayout,
  calm: CalmLayout,
}

/** Resultado: solo aparece cuando el test está completo. */
export function ResultSection() {
  const { result } = useQuiz()
  return (
    <section id="resultado" aria-label="Tu personalidad de verano" className="relative">
      {result && <Result result={result} />}
    </section>
  )
}

function Result({ result }: { result: QuizResult }) {
  const root = useRef<HTMLDivElement>(null)
  const Layout = layouts[personalities[result.primary].layout]

  // Revelación del resultado (se repite si cambia la personalidad).
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(root)
      gsap
        .timeline({ defaults: { ease: 'expo.out' }, scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } })
        .fromTo(q('[data-r="photo"]'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, stagger: 0.15 })
        .from(q('[data-r="line"]'), { yPercent: 110, duration: 1.2, stagger: 0.1 }, 0.2)
        .from(q('[data-r="fade"]'), { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.06 }, 0.6)
        .fromTo(q('[data-draw]'), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, 1)
    },
    { scope: root, dependencies: [result.primary, result.secondary], revertOnUpdate: true },
  )

  return (
    <div ref={root} key={result.primary}>
      <Layout result={result} />
    </div>
  )
}
