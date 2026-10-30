import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../animations/gsap'
import { scrollToId } from '../animations/smoothScroll'
import { useQuiz } from '../hooks/QuizContext'
import { Logo } from './Logo'

/** Barra superior: aparece cuando termina la intro. */
export function Header() {
  const ref = useRef<HTMLElement>(null)
  const { state, result, start, resume } = useQuiz()

  useGSAP(() => {
    gsap.set(ref.current, { yPercent: -100 })
    ScrollTrigger.create({
      trigger: '#campana',
      start: 'top 64px',
      refreshPriority: -1,
      onEnter: () => gsap.to(ref.current, { yPercent: 0, duration: 0.6, ease: 'expo.out' }),
      onLeaveBack: () => gsap.to(ref.current, { yPercent: -100, duration: 0.4, ease: 'power2.in' }),
    })
  })

  const links = [
    { id: 'campana', label: 'La campaña' },
    { id: 'test', label: 'El quiz' },
    ...(result ? [{ id: 'resultado', label: 'Resultado' }] : []),
    { id: 'premio', label: 'Premio' },
  ]

  const cta = result
    ? { label: 'Mi premio', action: () => scrollToId('premio') }
    : state.phase === 'playing'
      ? { label: 'Seguir el quiz', action: resume }
      : { label: 'Jugar', action: start }

  return (
    <header ref={ref} className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-cream/85 text-ink backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1300px] items-center justify-between gap-6 px-5 md:px-10">
        <button type="button" onClick={() => scrollToId('inicio')} aria-label="NIVEA SUN — volver al inicio">
          <Logo size="sm" />
        </button>
        <nav aria-label="Secciones" className="hidden md:block">
          <ul className="flex gap-8">
            {links.map((l) => (
              <li key={l.id}>
                <button type="button" onClick={() => scrollToId(l.id)} className="kicker text-[0.62rem] transition-colors hover:text-nivea">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          onClick={cta.action}
          className="kicker bg-ink px-4 py-2.5 text-[0.6rem] text-paper transition-colors hover:bg-nivea"
        >
          {cta.label}
        </button>
      </div>
    </header>
  )
}
