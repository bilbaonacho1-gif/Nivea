import { useRef } from 'react'
import { Check, Copy, Lock, Share2, Ticket } from 'lucide-react'
import { gsap, prefersReducedMotion, useGSAP } from '../animations/gsap'
import { useReveal } from '../animations/useReveal'
import { images } from '../data/assets'
import { personalities } from '../data/personalities'
import { bonusCode, demoCodes, DEMO_DISCLAIMER } from '../data/rewards'
import { useQuiz } from '../hooks/QuizContext'
import { useShareActions } from '../hooks/useShareActions'
import { copyText } from '../lib/share'
import { useToast } from '../components/Toast'
import { Button } from '../components/Button'

function DemoBadge({ children = 'Demo' }: { children?: string }) {
  return <span className="kicker inline-block border border-current px-2 py-1 text-[0.55rem]">{children}</span>
}

function CopyCode({ code }: { code: string }) {
  const toast = useToast()
  return (
    <button
      type="button"
      onClick={async () => toast((await copyText(code)) ? 'Código demo copiado' : 'No pudimos copiar el código')}
      className="group inline-flex items-center gap-2 border-b border-dashed border-current pb-1 font-mono text-[0.8rem] tracking-wide sm:text-base md:text-lg"
      aria-label={`Copiar código demostrativo ${code}`}
    >
      {code}
      <Copy className="h-4 w-4 opacity-60 transition-opacity group-hover:opacity-100" aria-hidden />
    </button>
  )
}

/**
 * La "lata": recompensa principal. La tapa azul se abre y revela el código demo,
 * como al abrir una lata de NIVEA.
 */
function Tin() {
  const { result, state, openLid } = useQuiz()
  const root = useRef<HTMLDivElement>(null)
  const unlocked = Boolean(result)
  const opened = state.rewards.lidOpened && unlocked

  const { contextSafe } = useGSAP(
    () => {
      // Estado persistido: la lata ya abierta (o cerrada otra vez al reiniciar).
      const q = gsap.utils.selector(root)
      if (opened) {
        gsap.set(q('[data-tin="lid"]'), { xPercent: 52, yPercent: -58, rotate: 22 })
        gsap.set(q('[data-tin="ray"]'), { autoAlpha: 1, scaleY: 1 })
      } else {
        gsap.set(q('[data-tin="lid"]'), { clearProps: 'transform' })
        gsap.set(q('[data-tin="ray"]'), { autoAlpha: 0 })
      }
    },
    { scope: root, dependencies: [opened] },
  )

  const open = contextSafe(() => {
    if (!unlocked || opened) return
    if (prefersReducedMotion()) return openLid()
    const q = gsap.utils.selector(root)
    gsap
      .timeline({ onComplete: openLid })
      .to(q('[data-tin="lid"]'), { y: -8, rotate: -4, duration: 0.25, ease: 'power2.out' })
      .to(q('[data-tin="lid"]'), { xPercent: 52, yPercent: -58, rotate: 22, duration: 0.9, ease: 'expo.inOut' })
      .fromTo(q('[data-tin="ray"]'), { scaleY: 0, autoAlpha: 0 }, { scaleY: 1, autoAlpha: 1, duration: 0.6, stagger: 0.03 }, '-=0.4')
      .from(q('[data-tin="inside"] > *'), { y: 16, autoAlpha: 0, stagger: 0.08, duration: 0.6 }, '-=0.5')
  })

  return (
    <div ref={root} className="relative mx-auto aspect-square w-full max-w-[420px]">
      {/* Rayos */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {Array.from({ length: 16 }, (_, i) => (
          <span
            key={i}
            className="absolute top-1/2 left-1/2 h-[58%] w-[2px]"
            style={{ transform: `translate(-50%, -100%) rotate(${i * 22.5}deg)`, transformOrigin: '50% 100%' }}
          >
            <span data-tin="ray" className="invisible block h-[30%] w-full origin-bottom bg-sun" />
          </span>
        ))}
      </div>
      {/* Base de la lata */}
      <div className="absolute inset-[9%] rounded-full bg-[radial-gradient(circle_at_50%_45%,#ffffff_0%,#f3efe6_62%,#d9d3c6_100%)] shadow-[inset_0_0_0_10px_#c9cdd6,inset_0_0_0_12px_#9ea6b6]">
        <div
          data-tin="inside"
          aria-hidden={!opened}
          className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center text-ink md:px-10"
        >
          {result ? (
            <>
              <DemoBadge>Código demo</DemoBadge>
              <p className="display text-[clamp(3rem,7vw,4.4rem)] leading-none">
                15% <em className="text-nivea">off</em>
              </p>
              <CopyCode code={demoCodes[result.primary]} />
              <p className="max-w-[24ch] text-[0.7rem] leading-snug text-ink/60">Ficticio. No válido para compras.</p>
            </>
          ) : null}
        </div>
      </div>
      {/* Tapa */}
      <button
        type="button"
        data-tin="lid"
        onClick={open}
        disabled={!unlocked || opened}
        aria-label={unlocked ? 'Abrir la lata y revelar la recompensa demo' : 'Completá el test para desbloquear'}
        className={`absolute inset-[6%] flex flex-col items-center justify-center gap-4 rounded-full bg-nivea text-paper shadow-[inset_0_0_0_6px_#2a55b8,inset_0_0_0_9px_#00268a,0_30px_50px_-20px_rgb(0_15_56/0.6)] ${opened ? 'pointer-events-none' : ''}`}
      >
        <img src={images.wordmarkWhite} alt="" className="w-[46%]" draggable={false} />
        <span className="display text-3xl italic">Summer reward</span>
        <span className="kicker mt-2 inline-flex items-center gap-2 text-[0.6rem] text-sun">
          {unlocked ? (
            'Tocá para abrir'
          ) : (
            <>
              <Lock className="h-3.5 w-3.5" aria-hidden /> Completá el test
            </>
          )}
        </span>
      </button>
    </div>
  )
}

/** 05 — SUMMER REWARDS (conceptual) */
export function Rewards() {
  const root = useRef<HTMLElement>(null)
  const { result, state, joinRaffle, start } = useQuiz()
  const { share } = useShareActions()
  useReveal(root)

  const unlocked = Boolean(result)
  const { raffleNumber, challengeDone } = state.rewards

  return (
    <section ref={root} id="premios" className="relative overflow-hidden bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-14 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <p data-reveal className="kicker text-nivea">
              05 — Summer rewards
            </p>
            <h2 data-reveal className="display mt-6 text-[clamp(3rem,7vw,6.6rem)]">
              Tu personalidad <em className="text-nivea">tiene premio.</em>
            </h2>
            <p data-reveal className="mt-8 max-w-[38ch] text-lg leading-relaxed text-ink/80 md:text-xl">
              El verano se disfruta más cuando hay sorpresas. Descubrí tu recompensa y seguí disfrutando de NIVEA SUN.
            </p>
            <p data-reveal className="mt-8 flex max-w-[52ch] items-start gap-3 border-l-2 border-sun pl-4 text-[0.82rem] leading-relaxed text-ink/70">
              {DEMO_DISCLAIMER}
            </p>
            {!unlocked && (
              <div data-reveal className="mt-10">
                <Button variant="ink" onClick={start} icon={<Lock className="h-4 w-4" />}>
                  Desbloquear con el test
                </Button>
              </div>
            )}
          </div>
          <div data-reveal className="mt-16 md:col-span-6 md:mt-0">
            <Tin />
          </div>
        </div>

        <ol className="mt-20 grid border-t border-ink/20 md:mt-28 md:grid-cols-3">
          <li data-reveal className="border-b border-ink/20 py-10 md:border-r md:border-b-0 md:pr-10">
            <div className="flex items-baseline justify-between">
              <span className="display text-5xl italic text-nivea">01</span>
              <DemoBadge />
            </div>
            <h3 className="mt-5 text-xl font-bold">Descuento demostrativo</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">
              {unlocked
                ? state.rewards.lidOpened
                  ? 'Ya abriste tu lata. El código es ficticio y sirve solo para mostrar la mecánica.'
                  : 'Abrí la lata de arriba para revelar tu código demo personalizado.'
                : 'Se desbloquea al terminar el test.'}
            </p>
          </li>

          <li data-reveal data-delay="0.08" className="border-b border-ink/20 py-10 md:border-r md:border-b-0 md:px-10">
            <div className="flex items-baseline justify-between">
              <span className="display text-5xl italic text-nivea">02</span>
              <DemoBadge>Simulación</DemoBadge>
            </div>
            <h3 className="mt-5 text-xl font-bold">Sorteo ficticio: Summer Kit</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">
              Una participación simulada, sin datos personales. No se realiza ningún sorteo real.
            </p>
            <div className="mt-6">
              {raffleNumber ? (
                <p className="flex items-center gap-3">
                  <Ticket className="h-5 w-5 text-nivea" aria-hidden />
                  <span className="text-sm text-ink/70">N.º simulado</span>
                  <span className="font-mono text-lg tracking-wider">{raffleNumber}</span>
                </p>
              ) : (
                <Button variant="outline" disabled={!unlocked} onClick={joinRaffle}>
                  Participar (ficticio)
                </Button>
              )}
            </div>
          </li>

          <li data-reveal data-delay="0.16" className="py-10 md:pl-10">
            <div className="flex items-baseline justify-between">
              <span className="display text-5xl italic text-nivea">03</span>
              <DemoBadge>Desafío</DemoBadge>
            </div>
            <h3 className="mt-5 text-xl font-bold">Etiquetá a tu amiga</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">
              Compartí tu resultado con esa amiga que tiene tu misma personalidad y desbloqueá una recompensa extra.
            </p>
            <div className="mt-6">
              {challengeDone && result ? (
                <div className="space-y-3">
                  <p className="kicker inline-flex items-center gap-2 text-[0.6rem] text-nivea">
                    <Check className="h-4 w-4" aria-hidden /> Desbloqueado · {personalities[result.primary].name}
                  </p>
                  <div>
                    <CopyCode code={bonusCode} />
                  </div>
                  <p className="text-xs text-ink/55">Código demo ficticio, sin validez comercial.</p>
                </div>
              ) : (
                <Button variant="outline" disabled={!unlocked} onClick={share} icon={<Share2 className="h-4 w-4" />}>
                  Compartir y desbloquear
                </Button>
              )}
            </div>
          </li>
        </ol>
      </div>
    </section>
  )
}
