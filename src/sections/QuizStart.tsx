import { useRef } from 'react'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { gsap, prefersReducedMotion, useGSAP } from '../animations/gsap'
import { useReveal } from '../animations/useReveal'
import { images } from '../data/assets'
import { personalities } from '../data/personalities'
import { questions } from '../data/quiz'
import { useQuiz } from '../hooks/QuizContext'
import { readSharedLetter } from '../lib/share'
import { Button } from '../components/Button'
import { Photo } from '../components/Photo'

/** 03 — START THE QUIZ */
export function QuizStart() {
  const root = useRef<HTMLElement>(null)
  const { state, answeredCount, start, resume, restart } = useQuiz()
  const shared = readSharedLetter()
  useReveal(root)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(root)
      // El sol asoma sobre el borde de la sección a medida que se acerca.
      gsap.fromTo(
        q('[data-rise]'),
        { yPercent: 40 },
        {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 20%', scrub: true },
        },
      )
      gsap.fromTo(
        q('[data-tilt]'),
        { rotate: 0, yPercent: 10 },
        {
          rotate: 3,
          yPercent: -6,
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
    <section ref={root} id="test" className="relative overflow-hidden bg-ink text-paper">
      <div
        data-rise
        aria-hidden
        className="pointer-events-none absolute top-0 left-[92%] aspect-square w-[min(70vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun md:left-[58%]"
      />

      <div className="relative mx-auto grid max-w-[1400px] gap-14 px-5 pt-32 pb-24 md:grid-cols-12 md:px-10 md:pt-48 md:pb-36">
        <div className="md:col-span-7">
          <p data-reveal className="kicker text-sun">
            03 — Start the quiz
          </p>

          {shared && !done && (
            <p data-reveal className="mt-6 max-w-md border-l-2 border-sun pl-4 text-[0.95rem] leading-relaxed text-paper/85">
              Te compartieron un resultado: <strong className="text-paper">{personalities[shared].name}</strong>. ¿Y vos qué
              NIVEA SUN sos?
            </p>
          )}

          <h2 data-reveal className="mt-8 text-[clamp(3.2rem,9vw,8.6rem)] leading-[0.9]">
            <span className="display block">¿Qué tipo de</span>
            <span className="block py-[0.06em] text-[0.74em] font-extrabold tracking-[-0.02em] wide text-paper">
              NIVEA SUN
            </span>
            <span className="display block italic text-sun">sos?</span>
          </h2>

          <p data-reveal className="mt-8 max-w-[34ch] text-lg leading-relaxed text-paper/85 md:text-xl">
            Tu personalidad dice mucho de cómo disfrutás el verano. Respondé unas preguntas y descubrí cuál es tu NIVEA SUN
            ideal.
          </p>

          <div data-reveal className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            {done ? (
              <>
                <Button
                  onClick={() => document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth' })}
                  icon={<ArrowRight className="h-4 w-4" />}
                >
                  Ver mi resultado
                </Button>
                <Button variant="outline-light" onClick={restart} icon={<RotateCcw className="h-4 w-4" />}>
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

          <dl data-reveal className="mt-14 flex max-w-md gap-x-10 border-t border-paper/25 pt-5 md:justify-between md:gap-x-0">
            {[
              ['5', 'preguntas'],
              ['1', 'minuto'],
              ['4', 'personalidades'],
            ].map(([n, label]) => (
              <div key={label}>
                <dt className="display text-4xl text-sun">{n}</dt>
                <dd className="kicker mt-1 text-[0.6rem] text-paper/70">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="relative md:col-span-5 md:pt-24">
          <div data-tilt className="relative origin-bottom-left">
            <Photo
              src={images.summerSkincare}
              alt="Sombrero de paja, libro y anteojos de sol sobre una toalla amarilla en la arena"
              className="aspect-[4/5] w-full shadow-[0_30px_60px_-20px_rgb(0_0_0/0.5)]"
            />
          </div>
          <figcaption className="mt-6 flex items-start gap-3 text-paper/80">
            <svg viewBox="0 0 60 30" className="mt-1 h-6 w-12 shrink-0 text-sun" fill="none" aria-hidden>
              <path d="M2 26C14 8 34 4 56 6M48 1l8 5-7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="display text-2xl italic">Tu toalla, tus reglas.</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
