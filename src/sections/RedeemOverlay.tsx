import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowRight, Check, Tag, X } from 'lucide-react'
import { gsap, prefersReducedMotion, useGSAP } from '../animations/gsap'
import { lockScroll } from '../animations/smoothScroll'
import { Button } from '../components/Button'
import { Logo } from '../components/Logo'
import { products } from '../data/products'
import { demoCodes } from '../data/rewards'
import type { Letter } from '../data/quiz'

const DISCOUNT = 0.15
const money = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

type Step = 'code' | 'applied' | 'done'

interface RedeemOverlayProps {
  letter: Letter
  onClose: () => void
}

/**
 * Simulación de canje: cualquier código aplica el 15% sobre el producto ganado.
 * Es una demo académica: no hay compra real ni pago.
 */
export function RedeemOverlay({ letter, onClose }: RedeemOverlayProps) {
  const product = products[letter]
  const root = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const totalRef = useRef<HTMLSpanElement>(null)
  const [step, setStep] = useState<Step>('code')
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const discount = product.price * DISCOUNT
  const total = product.price - discount

  useEffect(() => {
    lockScroll(true)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => input.current?.focus({ preventScroll: true }), 700)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Entrada: telón desde abajo, como el quiz.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(root.current, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' })
      gsap.from('[data-rd="in"]', { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.07, ease: 'expo.out', delay: 0.45 })
    },
    { scope: root },
  )

  // Al aplicar: el precio baja contando y aparecen las líneas del descuento.
  useGSAP(
    () => {
      if (step !== 'applied') return
      if (prefersReducedMotion()) return
      const counter = { v: product.price }
      gsap
        .timeline()
        .from('[data-rd="line"]', { x: -16, autoAlpha: 0, duration: 0.5, stagger: 0.12, ease: 'expo.out' })
        .to(
          counter,
          {
            v: total,
            duration: 1.1,
            ease: 'power3.out',
            onUpdate: () => {
              if (totalRef.current) totalRef.current.textContent = money(counter.v)
            },
          },
          0.2,
        )
        .from('[data-rd="badge"]', { scale: 0.4, autoAlpha: 0, rotate: -30, duration: 0.7, ease: 'back.out(2.2)' }, 0.5)
    },
    { scope: root, dependencies: [step] },
  )

  useGSAP(
    () => {
      if (step !== 'done' || prefersReducedMotion()) return
      gsap.from('[data-rd="done"]', { y: 26, autoAlpha: 0, duration: 0.8, stagger: 0.08, ease: 'expo.out' })
    },
    { scope: root, dependencies: [step] },
  )

  function close() {
    if (prefersReducedMotion() || !root.current) return onClose()
    gsap.to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7, ease: 'expo.inOut', onComplete: onClose })
  }

  function apply(e: FormEvent) {
    e.preventDefault()
    if (!code.trim()) {
      setError(true)
      input.current?.focus()
      return
    }
    setError(false)
    setStep('applied')
  }

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Canjear cupón"
      data-lenis-prevent
      className="fixed inset-0 z-[70] flex h-[100dvh] flex-col overflow-y-auto bg-cream text-ink md:overflow-hidden"
    >
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-ink/10 px-4 py-3 md:px-8">
        <Logo size="sm" />
        <p className="kicker hidden text-[0.6rem] text-ink/70 sm:block">Canje de cupón · Simulación</p>
        <button
          type="button"
          onClick={close}
          className="kicker group inline-flex h-10 items-center gap-2 px-2 text-[0.6rem] transition-colors hover:text-nivea"
          aria-label="Cerrar el canje"
        >
          Cerrar <X className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
        </button>
      </header>

      <div className="grid min-h-0 flex-1 md:grid-cols-2">
        {/* Producto */}
        <div className="relative h-[38svh] shrink-0 overflow-hidden md:h-auto">
          <img src={product.image} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-125 object-cover blur-2xl" />
          <img
            src={product.image}
            alt={`Envase de ${product.name}`}
            className="absolute inset-0 h-full w-full object-contain py-[5%] drop-shadow-[0_30px_30px_rgb(0_10_40/0.35)]"
          />
          {step !== 'code' && (
            <span
              data-rd="badge"
              className="absolute top-[8%] right-[8%] flex aspect-square w-[clamp(5.5rem,11vw,9rem)] flex-col items-center justify-center rounded-full bg-sun text-center shadow-[0_14px_30px_-10px_rgb(0_10_40/0.55)]"
            >
              <span className="display text-[clamp(1.8rem,3.6vw,3rem)] leading-none">-15%</span>
              <span className="kicker text-[0.5rem]">aplicado</span>
            </span>
          )}
        </div>

        {/* Formulario / resumen */}
        <div className="flex flex-col justify-center px-5 py-8 md:px-14 md:py-10 lg:px-20">
          {step === 'done' ? (
            <div className="max-w-[30rem]">
              <span data-rd="done" className="flex h-14 w-14 items-center justify-center rounded-full bg-nivea text-paper">
                <Check className="h-7 w-7" strokeWidth={2.5} />
              </span>
              <h2 data-rd="done" className="display mt-7 text-[clamp(2.6rem,5vw,4.4rem)]">
                ¡Listo, <em className="text-nivea">compra simulada!</em>
              </h2>
              <p data-rd="done" className="mt-5 text-lg leading-relaxed text-ink/75">
                Te llevaste tu {product.name} con 15% off. Pagaste {money(total)} en vez de {money(product.price)}.
              </p>
              <p data-rd="done" className="mt-8 border-l-2 border-sun pl-4 text-[0.8rem] leading-relaxed text-ink/60">
                Esto es una simulación de la propuesta académica: no se hizo ninguna compra ni se cobró nada.
              </p>
              <div data-rd="done" className="mt-9">
                <Button variant="ink" onClick={close} icon={<ArrowRight className="h-4 w-4" />}>
                  Volver a la página
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-[30rem]">
              <p data-rd="in" className="kicker text-nivea">
                Tu premio
              </p>
              <h2 data-rd="in" className="display mt-4 text-[clamp(2.4rem,4.6vw,4rem)]">
                Canjeá tu <em className="text-nivea">cupón.</em>
              </h2>
              <p data-rd="in" className="mt-4 text-[1.05rem] leading-snug font-bold">
                {product.name}
              </p>

              {step === 'code' ? (
                <form data-rd="in" onSubmit={apply} className="mt-8" noValidate>
                  <label htmlFor="coupon" className="kicker text-[0.6rem] text-ink/70">
                    Código de descuento
                  </label>
                  <div className="mt-3 flex items-stretch gap-2">
                    <div className="relative flex-1">
                      <Tag className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink/45" aria-hidden />
                      <input
                        ref={input}
                        id="coupon"
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value.toUpperCase())
                          setError(false)
                        }}
                        placeholder={demoCodes[letter]}
                        autoComplete="off"
                        spellCheck={false}
                        aria-invalid={error}
                        aria-describedby="coupon-help"
                        className={`h-14 w-full border bg-paper pr-3 pl-10 font-mono text-[0.82rem] tracking-wide md:text-[0.95rem] outline-none transition-colors placeholder:text-ink/30 focus:border-nivea ${error ? 'border-red-600' : 'border-ink/25'}`}
                      />
                    </div>
                    <Button type="submit" variant="ink" className="shrink-0">
                      Aplicar
                    </Button>
                  </div>
                  <p id="coupon-help" className={`mt-3 text-[0.8rem] ${error ? 'text-red-700' : 'text-ink/55'}`} aria-live="polite">
                    {error ? 'Escribí un código para aplicar el descuento.' : 'Escribí el código de tu premio (en la demo funciona cualquiera).'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCode(demoCodes[letter])
                      setError(false)
                    }}
                    className="mt-2 text-[0.8rem] font-semibold text-nivea underline-offset-4 hover:underline"
                  >
                    Usar mi código {demoCodes[letter]}
                  </button>
                </form>
              ) : null}

              {/* Resumen de precios */}
              <dl className="mt-8 border-t border-ink/15 pt-5 text-[0.98rem]">
                <div className="flex items-baseline justify-between py-1.5">
                  <dt className="text-ink/65">Precio</dt>
                  <dd
                    data-rd="old"
                    className={`tabular-nums ${step !== 'code' ? 'text-ink/50 line-through decoration-ink/60' : ''}`}
                  >
                    {money(product.price)}
                  </dd>
                </div>
                {step !== 'code' && (
                  <div data-rd="line" className="flex items-baseline justify-between py-1.5 text-nivea">
                    <dt className="flex items-center gap-2">
                      Cupón <span className="font-mono text-[0.8rem]">{code}</span>
                    </dt>
                    <dd className="tabular-nums">−{money(discount)}</dd>
                  </div>
                )}
                <div className="mt-2 flex items-baseline justify-between border-t border-ink/15 pt-4">
                  <dt className="kicker text-[0.62rem]">Total</dt>
                  <dd className="display text-[2.4rem] leading-none tabular-nums">
                    <span ref={totalRef}>{money(step === 'code' ? product.price : total)}</span>
                  </dd>
                </div>
              </dl>

              {step === 'applied' && (
                <div data-rd="line" className="mt-7">
                  <p className="mb-5 flex items-center gap-2 text-[0.9rem] font-semibold text-nivea">
                    <Check className="h-4 w-4" strokeWidth={3} /> ¡Cupón aplicado! Ahorrás {money(discount)}.
                  </p>
                  <Button onClick={() => setStep('done')} icon={<ArrowRight className="h-4 w-4" />}>
                    Finalizar compra
                  </Button>
                </div>
              )}

              <p className="mt-8 text-[0.72rem] text-ink/50">Precios ilustrativos. Simulación sin compra real.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
