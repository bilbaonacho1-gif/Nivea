import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../../animations/gsap'
import { personalities } from '../../data/personalities'
import { useQuiz } from '../../hooks/QuizContext'
import type { QuizResult } from '../../lib/quizLogic'
import { ResultCard } from './ResultCard'
import { Motif } from './Motif'
import { Moods, ResultActions, ResultProduct, SecondaryNote, SplitChars } from './ResultParts'

/** Resultado: solo aparece cuando el quiz está completo. */
export function ResultSection() {
  const { result } = useQuiz()
  return (
    <section id="resultado" aria-label="Tu personalidad de verano" className="relative">
      {result && <Result key={result.primary} result={result} />}
    </section>
  )
}

function Result({ result }: { result: QuizResult }) {
  const root = useRef<HTMLDivElement>(null)
  const p = personalities[result.primary]
  const t = p.theme

  // Aparición especial: el azul de la lata se retira, la tarjeta cae en su lugar y el nombre se escribe.
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(root.current!.querySelector('[data-r="curtain"]'), { autoAlpha: 0 })
        return
      }
      const q = gsap.utils.selector(root)
      gsap
        .timeline({ defaults: { ease: 'expo.out' }, scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } })
        .to(q('[data-r="curtain"]'), { yPercent: -100, duration: 1.2, ease: 'expo.inOut' })
        .fromTo(
          q('[data-r="card-wrap"]'),
          { y: 160, rotate: 9, autoAlpha: 0 },
          { y: 0, rotate: -2.5, autoAlpha: 1, duration: 1.5 },
          0.55,
        )
        .fromTo(q('[data-r="card-photo"]'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3 }, 0.85)
        .fromTo(q('[data-r="stripe"]'), { scaleY: 0 }, { scaleY: 1, duration: 1.1 }, 1)
        .from(q('[data-r="char"]'), { yPercent: 110, duration: 0.9, stagger: 0.03 }, 0.75)
        .from(q('[data-r="fade"]'), { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.07 }, 1.05)
        .fromTo(
          q('[data-draw]'),
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 2.2, stagger: 0.05, ease: 'power2.inOut' },
          0.9,
        )
    },
    { scope: root },
  )

  return (
    <div ref={root} className="relative overflow-hidden" style={{ background: t.bg, color: t.ink }}>
      <Motif name={t.motif} color={t.accent} />
      <div className="relative mx-auto grid min-h-[100svh] max-w-[1300px] items-center gap-14 px-5 pt-28 pb-20 md:grid-cols-12 md:gap-10 md:px-10 md:py-28">
        <div className="md:col-span-5">
          <div data-r="card-wrap" className="mx-auto w-full max-w-[440px]">
            <ResultCard letter={p.letter} />
          </div>
        </div>
        <div className="space-y-8 md:col-span-6 md:col-start-7">
          <p data-r="fade" className="kicker" style={{ color: t.muted }}>
            Tu personalidad de verano
          </p>
          <h2 className="display text-[clamp(3.4rem,8vw,7.6rem)] leading-[0.92]">
            <span className="block text-[0.55em]">
              <SplitChars text={p.article} />
            </span>
            <span className="block italic" style={{ color: result.primary === 'C' ? t.accent : undefined }}>
              <SplitChars text={p.word} />
            </span>
          </h2>
          <p data-r="fade" className="max-w-[34ch] text-xl leading-relaxed md:text-[1.4rem]" style={{ color: t.muted }}>
            {p.description}
          </p>
          <Moods letter={p.letter} />
          <ResultProduct letter={p.letter} />
          <SecondaryNote letter={result.secondary} primary={p.letter} />
          <ResultActions letter={p.letter} />
        </div>
      </div>
      {/* Telón azul: continúa el azul de la lata de la transición */}
      <div data-r="curtain" aria-hidden className="bg-studio absolute inset-0 z-10" />
    </div>
  )
}
