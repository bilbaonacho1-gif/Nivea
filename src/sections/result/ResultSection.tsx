import { useRef, type JSX } from 'react'
import { ArrowRight } from 'lucide-react'
import { gsap, prefersReducedMotion, useGSAP } from '../../animations/gsap'
import { useReveal } from '../../animations/useReveal'
import { LETTERS } from '../../data/quiz'
import { personalities, type ResultLayout } from '../../data/personalities'
import { products } from '../../data/products'
import { useQuiz } from '../../hooks/QuizContext'
import type { QuizResult } from '../../lib/quizLogic'
import { Button } from '../../components/Button'
import { Photo } from '../../components/Photo'
import { CalmLayout, CollageLayout, PosterLayout, TiltLayout } from './ResultLayouts'

const layouts: Record<ResultLayout, (props: { result: QuizResult }) => JSX.Element> = {
  poster: PosterLayout,
  tilt: TiltLayout,
  collage: CollageLayout,
  calm: CalmLayout,
}

/** 04 — DISCOVER YOUR SUMMER PERSONALITY */
export function ResultSection() {
  const { result } = useQuiz()
  return (
    <section id="resultado" aria-label="Tu personalidad de verano" className="relative">
      {result ? <Result result={result} /> : <Teaser />}
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
        .from(q('[data-r="product"]'), { y: 80, autoAlpha: 0, duration: 1.2 }, 0.5)
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

/** Antes de jugar: adelanto de las cuatro personalidades. */
function Teaser() {
  const root = useRef<HTMLDivElement>(null)
  const { start } = useQuiz()
  useReveal(root)

  return (
    <div ref={root} className="bg-cream text-ink">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-reveal className="kicker text-nivea">
              04 — Discover your summer personality
            </p>
            <h2 data-reveal className="display mt-6 max-w-[14ch] text-[clamp(2.8rem,6vw,5.6rem)]">
              Tu verano tiene <em className="text-nivea">una personalidad.</em>
            </h2>
          </div>
          <div data-reveal>
            <Button variant="ink" onClick={start} icon={<ArrowRight className="h-4 w-4" />}>
              Hacer el test
            </Button>
          </div>
        </div>

        <ul className="mt-14 border-t border-ink/20 md:mt-20">
          {LETTERS.map((l, i) => {
            const p = personalities[l]
            return (
              <li key={l} data-reveal data-delay={i * 0.05} className="group relative border-b border-ink/20">
                <button
                  type="button"
                  onClick={start}
                  className="grid w-full grid-cols-[2.5rem_1fr] items-center gap-4 py-6 text-left md:grid-cols-[5rem_1fr_16rem_9rem] md:gap-8 md:py-8"
                  aria-label={`${p.name}. Hacé el test para descubrir si es tu personalidad.`}
                >
                  <span className="display text-4xl italic text-nivea md:text-6xl">{l}</span>
                  <span className="display text-[clamp(2.2rem,5vw,4.8rem)] leading-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3">
                    {p.article} <em>{p.word}</em>
                  </span>
                  <span className="col-start-2 text-sm leading-relaxed text-ink/70 md:col-start-auto">
                    {p.moods.join(' · ')}
                    <span className="mt-1 block text-ink/50">{products[l].shortName}</span>
                  </span>
                  <span className="relative hidden h-24 overflow-hidden md:block">
                    <Photo
                      src={p.image}
                      alt=""
                      className="absolute inset-0 h-full w-full scale-110 opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100"
                    />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
