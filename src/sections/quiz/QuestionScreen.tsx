import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { gsap, prefersReducedMotion, useGSAP } from '../../animations/gsap'
import { LETTERS, type Letter, type Question } from '../../data/quiz'
import { Photo } from '../../components/Photo'

interface QuestionScreenProps {
  question: Question
  index: number
  total: number
  /** Respuesta previa (al volver atrás). */
  previous: Letter | null
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

export function QuestionScreen({ question, index, total, previous, onSelect, onBack }: QuestionScreenProps) {
  const root = useRef<HTMLDivElement>(null)
  const [picked, setPicked] = useState<Letter | null>(null)
  const locked = picked !== null
  const reduced = prefersReducedMotion()

  // Entrada de la pregunta
  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(root)
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(q('[data-q="photo"]'), { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1 })
        .fromTo(q('[data-q="photo-img"]'), { scale: 1.18 }, { scale: 1, duration: 1.6 }, 0)
        .from(q('[data-q="num"]'), { yPercent: 60, autoAlpha: 0, duration: 1 }, 0.25)
        .from(q('[data-q="text"]'), { y: 34, autoAlpha: 0, duration: 0.9, stagger: 0.07 }, 0.15)
        .from(q('[data-q="option"]'), { y: 26, autoAlpha: 0, duration: 0.8, stagger: 0.06 }, 0.35)
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
        .fromTo(
          q(`[data-letter="${letter}"] [data-draw]`),
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut' },
        )
        .to(q(`[data-letter="${letter}"] [data-q="burst"]`), { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2)' }, 0.1)
        .to(q(`[data-q="option"]:not([data-letter="${letter}"])`), { autoAlpha: 0.25, duration: 0.3 }, 0)
        .to(q('[data-q="text"], [data-q="option"], [data-q="num"]'), { y: -24, autoAlpha: 0, duration: 0.35, stagger: 0.02, ease: 'power2.in' }, 0.75)
        .to(q('[data-q="photo"]'), { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.5, ease: 'power3.in' }, 0.75)
    },
    [locked, onSelect, reduced],
  )

  // Atajos: A-D o 1-4
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const key = e.key.toUpperCase()
      const map: Record<string, Letter> = { A: 'A', B: 'B', C: 'C', D: 'D', '1': 'A', '2': 'B', '3': 'C', '4': 'D' }
      if (map[key]) choose(map[key])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [choose])

  const photoRight = question.side === 'right'

  return (
    <div ref={root} className="grid h-full min-h-0 grid-rows-[34svh_1fr] md:grid-cols-2 md:grid-rows-1">
      {/* Fotografía */}
      <div
        data-q="photo"
        className={`relative overflow-hidden bg-sand ${photoRight ? 'md:order-2' : ''}`}
      >
        <div data-q="photo-img" className="absolute inset-0">
          <Photo src={question.image} alt={question.imageAlt} className="h-full w-full" />
        </div>
        <p className="kicker absolute top-4 left-5 bg-paper/90 px-2 py-1 text-[0.6rem] text-ink md:top-6 md:left-8">
          {question.caption}
        </p>
        <span
          data-q="num"
          aria-hidden
          className={`display absolute -bottom-[0.12em] text-[clamp(7rem,22vw,20rem)] leading-none text-paper ${photoRight ? 'right-4 md:right-8' : 'left-4 md:left-8'}`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Pregunta y opciones */}
      <div className="flex min-h-0 flex-col overflow-y-auto bg-cream px-5 pt-7 pb-8 md:justify-center md:px-[clamp(2.5rem,5vw,6rem)] md:py-12">
        <p data-q="text" className="kicker text-nivea">
          Pregunta {index + 1} de {total}
        </p>
        <h2
          data-q="text"
          id={`q-${question.id}`}
          className="display mt-4 max-w-[17ch] text-[clamp(2.2rem,4.4vw,4.4rem)] text-balance text-ink"
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
                  className={`group relative grid w-full grid-cols-[3rem_1fr_auto] items-center gap-3 overflow-hidden border-b border-ink/15 py-4 pr-2 text-left transition-colors duration-300 md:grid-cols-[4rem_1fr_auto] md:py-5 ${active ? 'text-paper' : 'text-ink hover:text-paper focus-visible:text-paper'}`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-0 origin-left bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100'}`}
                  />
                  <span className="relative ml-2 flex h-11 w-11 items-center justify-center md:h-12 md:w-12">
                    <span
                      className={`display text-[2.1rem] italic transition-colors duration-300 md:text-[2.4rem] ${active ? 'text-sun' : 'text-nivea group-hover:text-sun group-focus-visible:text-sun'}`}
                    >
                      {letter}
                    </span>
                    <svg viewBox="0 0 60 60" className="absolute -inset-1 text-sun" fill="none" aria-hidden>
                      <path
                        data-draw
                        pathLength={1}
                        d="M34 4C16 2 4 14 5 31s14 26 29 25 23-13 22-28C55 14 44 5 28 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="1"
                        strokeDashoffset={previous === letter && !picked ? 0 : 1}
                      />
                    </svg>
                    <span
                      data-q="burst"
                      aria-hidden
                      className="invisible absolute -top-1 -right-1 h-3 w-3 scale-0 rounded-full bg-sun"
                    />
                  </span>
                  <span className="relative text-[1.02rem] leading-snug md:text-[1.15rem]">{question.options[letter]}</span>
                  <ArrowRight
                    aria-hidden
                    className={`relative mr-2 h-4 w-4 transition-all duration-300 ${active ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}
                  />
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
            className="kicker inline-flex items-center gap-2 py-2 text-[0.62rem] text-ink transition-opacity disabled:opacity-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Pregunta anterior
          </button>
          <p className="hidden text-xs text-ink/50 md:block">Tip: también podés responder con A, B, C o D.</p>
        </div>
      </div>
    </div>
  )
}
