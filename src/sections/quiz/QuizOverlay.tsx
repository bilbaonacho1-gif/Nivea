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

  // Apertura: un círculo solar que se expande desde abajo.
  useGSAP(
    () => {
      if (!visible || prefersReducedMotion()) return
      gsap.fromTo(
        root.current,
        { clipPath: 'circle(0% at 50% 100%)' },
        { clipPath: 'circle(150% at 50% 100%)', duration: 1.1, ease: 'expo.inOut' },
      )
    },
    { dependencies: [visible] },
  )

  const animateOut = useCallback((then: () => void) => {
    if (prefersReducedMotion() || !root.current) return then()
    gsap.to(root.current, { clipPath: 'circle(0% at 50% 100%)', duration: 0.8, ease: 'expo.inOut', onComplete: then })
  }, [])

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
          <header className="relative z-10 flex items-center justify-between gap-4 border-b border-ink/15 bg-cream px-4 py-3 md:px-8">
            <Logo size="sm" />
            <div className="flex flex-1 items-center justify-center gap-3" aria-label={`Progreso: pregunta ${state.index + 1} de ${questions.length}`}>
              <ol className="flex w-full max-w-[280px] gap-1.5">
                {questions.map((q, i) => (
                  <li key={q.id} className="relative h-[3px] flex-1 overflow-hidden bg-ink/15">
                    <span
                      className="absolute inset-0 origin-left bg-nivea transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ transform: `scaleX(${i < state.index ? 1 : i === state.index ? 0.5 : 0})` }}
                    />
                  </li>
                ))}
              </ol>
              <span className="kicker hidden text-[0.6rem] tabular-nums sm:inline">
                {String(state.index + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}
              </span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex h-10 w-10 items-center justify-center text-ink transition-colors hover:bg-ink hover:text-paper"
              aria-label="Cerrar el test (tu progreso queda guardado)"
            >
              <X className="h-5 w-5" />
            </button>
          </header>
          <div className="min-h-0 flex-1">
            <QuestionScreen
              key={current.id}
              question={current}
              index={state.index}
              total={questions.length}
              previous={state.answers[state.index]}
              onSelect={answer}
              onBack={back}
            />
          </div>
        </>
      )}
    </div>
  )
}
