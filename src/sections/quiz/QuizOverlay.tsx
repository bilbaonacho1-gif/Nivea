import { useCallback, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { gsap, prefersReducedMotion, useGSAP } from '../../animations/gsap'
import { lockScroll, scrollToId } from '../../animations/smoothScroll'
import { questions } from '../../data/quiz'
import { useQuiz } from '../../hooks/QuizContext'
import { Logo } from '../../components/Logo'
import { QuestionScreen } from './QuestionScreen'
import { ComputingScreen } from './ComputingScreen'

/** Experiencia del quiz a pantalla completa: una pregunta por pantalla. */
export function QuizOverlay() {
  const { state, answer, back, close, finish } = useQuiz()
  const root = useRef<HTMLDivElement>(null)
  const visible = state.open
  const computing = state.phase === 'computing'

  // Bloquea el scroll de la página mientras el quiz está abierto.
  useEffect(() => {
    if (!visible) return
    lockScroll(true)
    return () => lockScroll(false)
  }, [visible])

  // Apertura: un telón que sube desde abajo.
  useGSAP(
    () => {
      if (!visible || prefersReducedMotion()) return
      gsap.fromTo(
        root.current,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.inOut' },
      )
    },
    { dependencies: [visible] },
  )

  const animateOut = useCallback((then: () => void) => {
    if (prefersReducedMotion() || !root.current) return then()
    gsap.to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'expo.inOut', onComplete: then })
  }, [])

  // Foto de la escena anterior, para encadenar la transición entre preguntas.
  const lastImage = useRef<string | null>(null)
  const currentImage = questions[state.index]?.image ?? null
  useEffect(() => {
    if (visible) lastImage.current = currentImage
    else lastImage.current = null
  }, [visible, currentImage])

  const handleClose = useCallback(() => animateOut(close), [animateOut, close])

  const handleDone = useCallback(() => {
    // Detrás del overlay, la página ya se ubica en el resultado.
    finish()
    requestAnimationFrame(() => scrollToId('resultado', true))
  }, [finish])

  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !computing && handleClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, computing, handleClose])

  // Foco al primer elemento de cada pregunta.
  useEffect(() => {
    if (!visible) return
    const t = window.setTimeout(() => root.current?.querySelector<HTMLElement>('[aria-pressed]')?.focus({ preventScroll: true }), 650)
    return () => window.clearTimeout(t)
  }, [visible, state.index])

  if (!visible) return null

  const current = questions[state.index]

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Quiz: ¿Qué tipo de NIVEA SUN sos?"
      data-lenis-prevent
      className="fixed inset-0 z-[60] flex h-[100dvh] flex-col bg-cream text-ink"
    >
      {computing ? (
        <ComputingScreen onDone={handleDone} />
      ) : (
        <>
          <header className="relative z-10 bg-cream">
            <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-8">
              <Logo size="sm" />
              <p className="kicker hidden text-[0.6rem] text-ink/70 sm:block" aria-live="polite">
                Escena {String(state.index + 1).padStart(2, '0')} · {current.scene}
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="kicker group inline-flex h-10 items-center gap-2 px-2 text-[0.6rem] text-ink transition-colors hover:text-nivea"
                aria-label="Salir del quiz (tu progreso queda guardado)"
              >
                Salir <X className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
              </button>
            </div>
            {/* Progreso: una línea continua con las cinco escenas marcadas */}
            <div
              role="progressbar"
              aria-label="Progreso del quiz"
              aria-valuemin={1}
              aria-valuemax={questions.length}
              aria-valuenow={state.index + 1}
              className="relative h-[3px] bg-ink/10"
            >
              <span
                className="absolute inset-0 origin-left bg-nivea transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `scaleX(${(state.index + 1) / questions.length})` }}
              />
              {questions.slice(1).map((q, i) => (
                <span
                  key={q.id}
                  aria-hidden
                  className="absolute top-0 h-full w-[3px] bg-cream"
                  style={{ left: `${((i + 1) / questions.length) * 100}%` }}
                />
              ))}
            </div>
          </header>
          <div className="min-h-0 flex-1">
            <QuestionScreen
              key={current.id}
              question={current}
              index={state.index}
              total={questions.length}
              previous={state.answers[state.index]}
              fromImage={lastImage.current !== current.image ? lastImage.current : null}
              onSelect={answer}
              onBack={back}
            />
          </div>
        </>
      )}
    </div>
  )
}
