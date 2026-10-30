import { useRef } from 'react'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { gsap, prefersReducedMotion, useGSAP } from '../animations/gsap'
import { scrollToId } from '../animations/smoothScroll'
import { useReveal } from '../animations/useReveal'
import { personalities } from '../data/personalities'
import { questions } from '../data/quiz'
import { useQuiz } from '../hooks/QuizContext'
import { readSharedLetter } from '../lib/share'
import { Button } from '../components/Button'

/** Entrada al quiz. */
export function QuizStart() {
  const root = useRef<HTMLElement>(null)
  const { state, answeredCount, start, resume, restart } = useQuiz()
  const shared = readSharedLetter()
  useReveal(root)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      // El sol asoma sobre el borde de la sección a medida que se acerca.
      gsap.fromTo(
        root.current!.querySelector('[data-rise]'),
        { yPercent: 40 },
        {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 20%', scrub: true },
        },
      )
    },
    { scope: root },
  )

  const inProgress = state.phase === 'playing' && answeredCount > 0
  const done = state.phase === 'done'

  return (
    <section ref={root} id="test" className="relative overflow-hidden bg-ink text-paper">
      <div
        data-rise
        aria-hidden
        className="pointer-events-none absolute top-0 left-[88%] aspect-square w-[min(70vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun md:left-[78%]"
      />

      <div className="relative mx-auto max-w-[1300px] px-5 pt-36 pb-28 md:px-10 md:pt-52 md:pb-40">
        <p data-reveal className="kicker text-sun">
          El quiz
        </p>

        {shared && !done && (
          <p data-reveal className="mt-6 max-w-md border-l-2 border-sun pl-4 text-[0.95rem] leading-relaxed text-paper/85">
            Te compartieron un resultado: <strong className="text-paper">{personalities[shared].name}</strong>. ¿Y vos qué
            NIVEA SUN sos?
          </p>
        )}

        <h2 data-reveal className="mt-8 text-[clamp(3.2rem,10vw,9rem)] leading-[0.9]">
          <span className="display block">¿Qué tipo de</span>
          <span className="block py-[0.06em] text-[0.74em] font-extrabold tracking-[-0.02em] wide">NIVEA SUN</span>
          <span className="display block italic text-sun">sos?</span>
        </h2>

        <div className="mt-10 flex flex-col gap-10 md:mt-14 md:flex-row md:items-end md:justify-between">
          <p data-reveal className="max-w-[36ch] text-lg leading-relaxed text-paper/85 md:text-xl">
            Tu personalidad dice mucho de cómo disfrutás el verano. Respondé {questions.length} preguntas, descubrí cuál es
            tu NIVEA SUN ideal y ganate un premio.
          </p>

          <div data-reveal className="flex flex-wrap items-center gap-x-6 gap-y-4">
            {done ? (
              <>
                <Button onClick={() => scrollToId('resultado')} icon={<ArrowRight className="h-4 w-4" />}>
                  Ver mi resultado
                </Button>
                <Button variant="text" onClick={restart} icon={<RotateCcw className="h-4 w-4" />}>
                  Volver a jugar
                </Button>
              </>
            ) : inProgress ? (
              <>
                <Button onClick={resume} icon={<ArrowRight className="h-4 w-4" />}>
                  Seguir · pregunta {state.index + 1}/{questions.length}
                </Button>
                <Button variant="text" onClick={start}>
                  Empezar de nuevo
                </Button>
              </>
            ) : (
              <Button onClick={start} icon={<ArrowRight className="h-4 w-4" />}>
                Descubrir mi personalidad
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
