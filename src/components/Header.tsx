import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../animations/gsap'
import { useQuiz } from '../hooks/QuizContext'
import { Logo } from './Logo'

const links = [
  { href: '#universo', label: 'NIVEA SUN' },
  { href: '#test', label: 'El test' },
  { href: '#resultado', label: 'Resultado' },
  { href: '#premios', label: 'Premios' },
]

/** Barra superior: aparece cuando termina la escena de apertura. */
export function Header() {
  const ref = useRef<HTMLElement>(null)
  const { state, result, start, resume } = useQuiz()

  useGSAP(() => {
    gsap.set(ref.current, { yPercent: -100 })
    ScrollTrigger.create({
      trigger: '#universo',
      start: 'top 64px',
      refreshPriority: -1,
      onEnter: () => gsap.to(ref.current, { yPercent: 0, duration: 0.6, ease: 'expo.out' }),
      onLeaveBack: () => gsap.to(ref.current, { yPercent: -100, duration: 0.4, ease: 'power2.in' }),
    })
  })

  const cta = result
    ? { label: 'Mi resultado', action: () => document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth' }) }
    : state.phase === 'playing'
      ? { label: 'Seguir el test', action: resume }
      : { label: 'Hacer el test', action: start }

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-cream/90 text-ink backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-5 md:px-10">
        <a href="#inicio" aria-label="NIVEA SUN — volver al inicio">
          <Logo size="sm" />
        </a>
        <nav aria-label="Secciones" className="hidden md:block">
          <ul className="flex gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="kicker text-[0.62rem] transition-colors hover:text-nivea">
                  {l.label}
                </a>
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
