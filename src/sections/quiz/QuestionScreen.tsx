import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { gsap, prefersReducedMotion, useGSAP } from '../../animations/gsap'
import { LETTERS, type Letter, type Question } from '../../data/quiz'

interface QuestionScreenProps {
  question: Question
  index: number
  total: number
  /** Respuesta previa (al volver atrás). */
  previous: Letter | null
  /** Foto de la escena anterior: queda debajo mientras entra la nueva. */
  fromImage: string | null
  onSelect: (letter: Letter) => void
  onBack: () => void
}

function Title({ text, emphasis }: { text: string; emphasis?: string }) {
  if (!emphasis || !text.includes(emphasis)) return <>{text}</>
  const [before, after] = text.split(emphasis)
  return (
    <>
      {before}
      <em className="text-nivea">{emphasis}</em>
      {after}
    </>
  )
}

const KEYS: Record<string, Letter> = { A: 'A', B: 'B', C: 'C', D: 'D', '1': 'A', '2': 'B', '3': 'C', '4': 'D' }

/** Una escena del quiz: foto a pantalla dividida + pregunta y respuestas. */
export function QuestionScreen({ question, index, total, previous, fromImage, onSelect, onBack }: QuestionScreenProps) {
  const root = useRef<HTMLDivElement>(null)
  const [picked, setPicked] = useState<Letter | null>(null)
  const locked = picked !== null
  const reduced = prefersReducedMotion()
  const photoRight = question.side === 'right'
  const number = String(index + 1).padStart(2, '0')

  // Entrada: la foto nueva se descubre sobre la anterior y el texto sube.
  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(root)
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(q('[data-q="photo"]'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15 })
        .fromTo(q('[data-q="photo-img"]'), { scale: 1.18 }, { scale: 1, duration: 7, ease: 'sine.out' }, 0)
        .from(q('[data-q="scene"]'), { yPercent: 100, duration: 1 }, 0.35)
        .from(q('[data-q="text"]'), { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.06 }, 0.15)
        .from(q('[data-q="option"]'), { y: 22, autoAlpha: 0, duration: 0.8, stagger: 0.05 }, 0.3)
    },
    { scope: root },
  )

  const choose = useCallback(
    (letter: Letter) => {
      if (locked) return
      setPicked(letter)
      if (reduced) {
        onSelect(letter)
        return
      }
      const q = gsap.utils.selector(root)
      gsap
        .timeline({ onComplete: () => onSelect(letter) })
        .fromTo(q(`[data-letter="${letter}"] [data-q="fill"]`), { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'expo.out' })
        .fromTo(q(`[data-letter="${letter}"] [data-q="check"]`), { scale: 0, rotate: -40 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2.4)' }, 0.1)
        .to(q(`[data-q="option"]:not([data-letter="${letter}"])`), { autoAlpha: 0.28, duration: 0.3 }, 0)
        .to(q('[data-q="text"], [data-q="option"]'), { y: -18, autoAlpha: 0, duration: 0.32, stagger: 0.02, ease: 'power2.in' }, 0.72)
    },
    [locked, onSelect, reduced],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const letter = KEYS[e.key.toUpperCase()]
      if (letter) choose(letter)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [choose])

  return (
    <div ref={root} className="grid h-full min-h-0 grid-rows-[36svh_1fr] md:grid-cols-2 md:grid-rows-1">
      {/* Fotografía de la escena */}
      <div className={`relative overflow-hidden bg-ink ${photoRight ? 'md:order-2' : ''}`}>
        {fromImage && <img src={fromImage} alt="" className="absolute inset-0 h-full w-full object-cover" />}
        <div data-q="photo" className="grain absolute inset-0">
          <div data-q="photo-img" className="absolute inset-0">
            <img src={question.image} alt={question.imageAlt} className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night/60 to-transparent" />
        </div>
        <p className="kicker absolute top-4 left-5 z-[2] bg-paper px-2 py-1 text-[0.58rem] text-ink md:top-6 md:left-8">
          {question.caption}
        </p>
        <div className="absolute bottom-4 left-5 z-[2] overflow-hidden text-paper md:bottom-8 md:left-8">
          <p data-q="scene" className="flex items-baseline gap-3">
            <span className="kicker text-[0.6rem] text-sun">Escena {number}</span>
            <span className="display text-[clamp(2.6rem,6vw,5.6rem)] leading-none italic">{question.scene}</span>
          </p>
        </div>
      </div>

      {/* Pregunta y respuestas */}
      <div className="flex min-h-0 flex-col overflow-y-auto bg-cream px-5 pt-7 pb-8 md:justify-center md:px-[clamp(2.5rem,5.5vw,6.5rem)] md:py-12">
        <p data-q="text" className="kicker text-nivea">
          Pregunta {number} <span className="text-ink/40">/ {String(total).padStart(2, '0')}</span>
        </p>
        <h2
          data-q="text"
          id={`q-${question.id}`}
          className="display mt-4 max-w-[16ch] text-[clamp(2.3rem,4.4vw,4.4rem)] text-balance text-ink"
        >
          <Title text={question.title} emphasis={question.emphasis} />
        </h2>

        <ul role="list" aria-labelledby={`q-${question.id}`} className="mt-7 border-t border-ink/15 md:mt-10">
          {LETTERS.map((letter) => {
            const active = picked === letter || (!picked && previous === letter)
            return (
              <li key={letter} data-q="option" data-letter={letter}>
                <button
                  type="button"
                  disabled={locked}
                  aria-pressed={active}
                  onClick={() => choose(letter)}
                  className={`group relative grid w-full grid-cols-[2.75rem_1fr_auto] items-center gap-2 overflow-hidden border-b border-ink/15 py-4 pr-3 text-left transition-colors duration-300 md:grid-cols-[3.5rem_1fr_auto] md:py-5 ${active ? 'text-paper' : 'text-ink'}`}
                >
                  {/* hover: arena · selección: azul */}
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-left scale-x-0 bg-sand/60 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                  <span
                    data-q="fill"
                    aria-hidden
                    className="absolute inset-0 origin-left bg-nivea"
                    style={{ transform: `scaleX(${active ? 1 : 0})` }}
                  />
                  <span
                    className={`display relative pl-3 text-[2rem] leading-none italic transition-colors duration-300 md:text-[2.3rem] ${active ? 'text-sun' : 'text-nivea'}`}
                  >
                    {letter}
                  </span>
                  <span className="relative text-[1.02rem] leading-snug transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 md:text-[1.12rem]">
                    {question.options[letter]}
                  </span>
                  <span className="relative flex h-6 w-6 items-center justify-center">
                    {active ? (
                      <Check data-q="check" className="h-5 w-5 text-sun" strokeWidth={2.5} aria-hidden />
                    ) : (
                      <ArrowRight
                        aria-hidden
                        className="h-4 w-4 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                      />
                    )}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div data-q="text" className="mt-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={index === 0 || locked}
            className="kicker inline-flex items-center gap-2 py-2 text-[0.6rem] text-ink transition-opacity hover:text-nivea disabled:opacity-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Escena anterior
          </button>
          <p className="hidden text-xs text-ink/45 md:block">También podés responder con A, B, C o D.</p>
        </div>
      </div>
    </div>
  )
}
