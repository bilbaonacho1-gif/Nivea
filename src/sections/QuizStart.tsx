import { useRef } from 'react'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { gsap, prefersReducedMotion, useGSAP } from '../animations/gsap'
import { scrollToId } from '../animations/smoothScroll'
import { useReveal } from '../animations/useReveal'
import { images } from '../data/assets'
import { personalities } from '../data/personalities'
import { questions } from '../data/quiz'
import { useQuiz } from '../hooks/QuizContext'
import { readSharedLetter } from '../lib/share'
import { Button } from '../components/Button'

/** Entrada al quiz: la foto del agua se abre hasta ocupar la pantalla. */
export function QuizStart() {
  const root = useRef<HTMLElement>(null)
  const { state, answeredCount, start, resume, restart } = useQuiz()
  const shared = readSharedLetter()
  useReveal(root)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(root)
      gsap.fromTo(
        q('[data-s="frame"]'),
        { clipPath: 'inset(8% 7% 8% 7%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top top', scrub: 0.6 },
        },
      )
      gsap.fromTo(
        q('[data-s="photo"]'),
        { scale: 1.25, yPercent: -6 },
        {
          scale: 1.05,
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    },
    { scope: root },
  )

  const inProgress = state.phase === 'playing' && answeredCount > 0
  const done = state.phase === 'done'

  return (
    <section ref={root} id="test" className="relative bg-cream">
      <div data-s="frame" className="grain relative min-h-[100svh] overflow-hidden bg-ink text-paper">
        <div data-s="photo" className="absolute inset-0">
          <img src={images.pool} alt="" className="h-full w-full object-cover blur-[2px]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(0_15_56/0.82)_0%,rgb(0_15_56/0.55)_55%,rgb(0_15_56/0.2)_100%)]" />

        <div className="relative z-[2] mx-auto flex min-h-[100svh] max-w-[1300px] flex-col justify-center px-5 py-28 md:px-10">
          <p data-reveal className="kicker text-sun">
            El quiz · {questions.length} escenas
          </p>

          {shared && !done && (
            <p data-reveal className="mt-6 max-w-md border-l-2 border-sun pl-4 text-[0.95rem] leading-relaxed text-paper/90">
              Te compartieron un resultado: <strong>{personalities[shared].name}</strong>. ¿Y vos qué NIVEA SUN sos?
            </p>
          )}

          <h2 data-reveal className="mt-8 text-[clamp(3.2rem,9vw,8.4rem)] leading-[0.9]">
            <span className="display block">¿Qué tipo de</span>
            <span className="block py-[0.05em] text-[0.8em] font-extrabold tracking-[-0.03em]">NIVEA SUN</span>
            <span className="display block italic text-sun">sos?</span>
          </h2>

          <p data-reveal className="mt-8 max-w-[38ch] text-lg leading-relaxed text-paper/85 md:text-xl">
            Tu personalidad dice mucho de cómo disfrutás el verano. Respondé {questions.length} preguntas, descubrí tu NIVEA
            SUN ideal y abrí tu premio.
          </p>

          <div data-reveal className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
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
                  Seguir · escena {state.index + 1}/{questions.length}
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
