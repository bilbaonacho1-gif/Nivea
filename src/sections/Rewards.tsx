import { useEffect, useRef } from 'react'
import type { Letter } from '../data/quiz'
import { ArrowRight, Copy, Hand, Lock, RotateCcw, Share2 } from 'lucide-react'
import { gsap, prefersReducedMotion, useGSAP } from '../animations/gsap'
import { useReveal } from '../animations/useReveal'
import { personalities } from '../data/personalities'
import { products } from '../data/products'
import { demoCodes, DEMO_DISCLAIMER } from '../data/rewards'
import { useQuiz } from '../hooks/QuizContext'
import { useShareActions } from '../hooks/useShareActions'
import { copyText } from '../lib/share'
import { useToast } from '../components/Toast'
import { Button } from '../components/Button'
import { Tin } from '../components/Tin'

/** Posición final de la tapa, relativa al tamaño de la lata (en celular se corre hacia abajo). */
const lidOpen = () =>
  window.matchMedia('(max-width: 767px)').matches ? { x: 0.66, y: 0.5, rotate: -18 } : { x: 0.58, y: -0.34, rotate: 24 }
/** Distancia (en proporción del tamaño de la lata) a partir de la cual la tapa se abre sola. */
const DRAG_THRESHOLD = 0.24

function CopyCode({ code }: { code: string }) {
  const toast = useToast()
  return (
    <button
      type="button"
      onClick={async () => toast((await copyText(code)) ? 'Código demo copiado' : 'No pudimos copiar el código')}
      className="group inline-flex items-center gap-2 border-b border-dashed border-current pb-0.5 font-mono text-[clamp(0.62rem,2.6vw,0.95rem)] tracking-wide"
      aria-label={`Copiar código demostrativo ${code}`}
    >
      {code}
      <Copy className="h-3.5 w-3.5 opacity-60 transition-opacity group-hover:opacity-100" aria-hidden />
    </button>
  )
}

/** La lata del premio: se arrastra o se toca la tapa para abrirla. */
function PrizeTin() {
  const { result, state, openLid } = useQuiz()
  const root = useRef<HTMLDivElement>(null)
  const unlocked = Boolean(result)
  const opened = state.rewards.lidOpened && unlocked
  const animating = useRef(false)

  const lidEl = () => root.current?.querySelector<HTMLElement>('[data-tin="lid"]') ?? null
  const size = () => root.current?.offsetWidth ?? 400

  // Estado persistido (abierta / cerrada al reiniciar).
  useGSAP(
    () => {
      const lid = lidEl()
      const q = gsap.utils.selector(root)
      if (opened) {
        const o = lidOpen()
        gsap.set(lid, { x: o.x * size(), y: o.y * size(), rotate: o.rotate })
        gsap.set(q('[data-prize]'), { autoAlpha: 1, y: 0 })
      } else {
        gsap.set(lid, { x: 0, y: 0, rotate: 0 })
        gsap.set(q('[data-prize]'), { autoAlpha: 0 })
      }
    },
    { scope: root, dependencies: [opened] },
  )

  // Un leve balanceo invita a abrirla cuando ya está desbloqueada.
  useGSAP(
    () => {
      if (!unlocked || opened || prefersReducedMotion()) return
      gsap.to(lidEl(), {
        rotate: -4,
        duration: 0.16,
        repeat: 5,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5,
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      })
    },
    { scope: root, dependencies: [unlocked, opened] },
  )

  const { contextSafe } = useGSAP({ scope: root })

  const open = contextSafe(() => {
    if (!unlocked || opened || animating.current) return
    animating.current = true
    const q = gsap.utils.selector(root)
    if (prefersReducedMotion()) {
      openLid()
      return
    }
    gsap
      .timeline({
        onComplete: () => {
          animating.current = false
          openLid()
        },
      })
      .to(lidEl(), {
        x: lidOpen().x * size(),
        y: lidOpen().y * size(),
        rotate: lidOpen().rotate,
        duration: 1,
        ease: 'expo.out',
      })
      .fromTo(q('[data-prize]'), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08, ease: 'expo.out' }, 0.25)
  })

  // Arrastrar la tapa con mouse o dedo.
  useEffect(() => {
    const lid = lidEl()
    if (!lid || !unlocked || opened) return
    let start: { x: number; y: number } | null = null
    let moved = 0

    const down = (e: PointerEvent) => {
      if (animating.current) return
      start = { x: e.clientX, y: e.clientY }
      moved = 0
      lid.setPointerCapture(e.pointerId)
      gsap.killTweensOf(lid)
    }
    const move = (e: PointerEvent) => {
      if (!start) return
      const dx = e.clientX - start.x
      const dy = e.clientY - start.y
      moved = Math.hypot(dx, dy)
      gsap.set(lid, { x: dx, y: dy, rotate: dx * 0.06 })
    }
    const up = () => {
      if (!start) return
      start = null
      if (moved < 6 || moved > size() * DRAG_THRESHOLD) open()
      else gsap.to(lid, { x: 0, y: 0, rotate: 0, duration: 0.9, ease: 'elastic.out(1, 0.55)' })
    }
    lid.addEventListener('pointerdown', down)
    lid.addEventListener('pointermove', move)
    lid.addEventListener('pointerup', up)
    lid.addEventListener('pointercancel', up)
    return () => {
      lid.removeEventListener('pointerdown', down)
      lid.removeEventListener('pointermove', move)
      lid.removeEventListener('pointerup', up)
      lid.removeEventListener('pointercancel', up)
    }
  }, [unlocked, opened, open])

  return (
    <div className="relative">
      <div
        ref={root}
        className={`relative mx-auto w-[min(78vw,500px)] ${unlocked && !opened ? '[&_[data-tin=lid]]:cursor-grab [&_[data-tin=lid]]:touch-none [&_[data-tin=lid]:active]:cursor-grabbing' : ''}`}
      >
        <Tin>
          {result && (
            <div className="relative aspect-square w-full overflow-hidden rounded-full bg-paper shadow-[inset_0_0_0_1px_rgb(0_26_92/0.08)]">
              <div data-prize className="absolute inset-0">
                <img src={products[result.primary].image} alt="" aria-hidden className="h-full w-full scale-125 object-cover blur-xl" draggable={false} />
                <img
                  src={products[result.primary].image}
                  alt={`Envase de ${products[result.primary].name}`}
                  className="absolute inset-0 h-full w-full object-contain py-[7%] drop-shadow-[0_18px_22px_rgb(0_10_40/0.35)]"
                  draggable={false}
                />
              </div>
              <span
                data-prize
                className="absolute bottom-[14%] left-[11%] flex aspect-square w-[25%] flex-col items-center justify-center rounded-full bg-sun text-center text-ink shadow-[0_10px_24px_-8px_rgb(0_10_40/0.55)]"
              >
                <span className="display text-[clamp(1.2rem,4.6vw,2.1rem)] leading-none">15%</span>
                <span className="kicker text-[clamp(0.45rem,1.5vw,0.58rem)]">off</span>
              </span>
            </div>
          )}
        </Tin>
        {!unlocked && (
          <span className="kicker pointer-events-none absolute top-1/2 left-1/2 z-[5] mt-[18%] inline-flex -translate-x-1/2 items-center gap-2 bg-ink/80 px-3 py-2 text-[0.58rem] text-paper">
            <Lock className="h-3.5 w-3.5" aria-hidden /> Bloqueada
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={open}
        disabled={!unlocked || opened}
        className="sr-only"
      >
        Abrir la lata y descubrir el premio
      </button>
      <p className="kicker mt-8 flex items-center justify-center gap-2 text-[0.6rem] text-paper/75" aria-hidden>
        {opened ? (
          '¡Abierta!'
        ) : unlocked ? (
          <>
            <Hand className="h-4 w-4" /> Arrastrá la tapa o tocala
          </>
        ) : (
          'Se abre al terminar el quiz'
        )}
      </p>
    </div>
  )
}

/** Lo que ganaste, dicho con claridad: foto del producto, descuento y código. */
function PrizeCard({ letter }: { letter: Letter }) {
  const product = products[letter]
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from(root.current, { y: 20, autoAlpha: 0, duration: 0.8, ease: 'expo.out', delay: 0.2 })
    },
    { scope: root },
  )
  return (
    <div ref={root} className="mt-10 flex max-w-[30rem] items-stretch gap-5 bg-paper p-4 text-ink shadow-[0_30px_50px_-30px_rgb(0_5_30/0.8)] md:p-5">
      <img
        src={product.image}
        alt={`Envase de ${product.name}`}
        className="w-[5.5rem] shrink-0 object-cover md:w-[6.5rem]"
        style={{ aspectRatio: '15 / 28' }}
      />
      <div className="flex min-w-0 flex-col justify-center gap-2">
        <p className="kicker text-[0.58rem] text-nivea">Ganaste</p>
        <p className="display text-[clamp(2rem,4.2vw,2.8rem)] leading-none">
          15% <em className="text-nivea">off</em>
        </p>
        <p className="text-[0.95rem] leading-snug font-bold">en {product.name}</p>
        <span className="mt-1">
          <CopyCode code={demoCodes[letter]} />
        </span>
        <p className="text-[0.7rem] text-ink/55">Código ficticio. No válido para compras.</p>
      </div>
    </div>
  )
}

/** Premio: se gana jugando el quiz. Cierre de la experiencia. */
export function Rewards() {
  const root = useRef<HTMLElement>(null)
  const { result, state, start, restart } = useQuiz()
  const { share } = useShareActions()
  useReveal(root)

  const opened = state.rewards.lidOpened && Boolean(result)

  return (
    <section ref={root} id="premio" className="bg-studio relative overflow-hidden text-paper">
      <div className="mx-auto grid min-h-[100svh] max-w-[1300px] items-center gap-14 px-5 py-28 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <p data-reveal className="kicker text-sun">
            Tu premio
          </p>
          <h2 data-reveal className="display mt-6 text-[clamp(3rem,6.6vw,6.2rem)]">
            Tu personalidad <em className="text-sun">tiene premio.</em>
          </h2>
          <p data-reveal className="mt-8 max-w-[34ch] text-lg leading-relaxed text-paper/85 md:text-xl">
            {!result
              ? 'Jugá el quiz, descubrí tu personalidad de verano y abrí la lata.'
              : opened
                ? `Como ${personalities[result.primary].name}, te llevás un descuento en tu NIVEA SUN.`
                : 'Lo desbloqueaste. Abrí la lata para descubrir tu premio.'}
          </p>

          {result && opened && <PrizeCard letter={result.primary} />}

          <div data-reveal className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            {!result ? (
              <Button onClick={start} icon={<ArrowRight className="h-4 w-4" />}>
                Jugar para ganar
              </Button>
            ) : (
              opened && (
                <>
                  <Button onClick={share} icon={<Share2 className="h-4 w-4" />}>
                    Compartir resultado
                  </Button>
                  <Button variant="text" onClick={restart} icon={<RotateCcw className="h-4 w-4" />}>
                    Volver a jugar
                  </Button>
                </>
              )
            )}
          </div>

          <p data-reveal className="mt-12 max-w-[50ch] border-l-2 border-sun pl-4 text-[0.78rem] leading-relaxed text-paper/60">
            {DEMO_DISCLAIMER}
          </p>
        </div>
        <div data-reveal className="md:col-span-7">
          <PrizeTin />
        </div>
      </div>
    </section>
  )
}
