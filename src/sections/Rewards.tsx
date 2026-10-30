import { useRef } from 'react'
import { ArrowRight, Copy, Lock, RotateCcw, Share2 } from 'lucide-react'
import { gsap, prefersReducedMotion, useGSAP } from '../animations/gsap'
import { useReveal } from '../animations/useReveal'
import { images } from '../data/assets'
import { personalities } from '../data/personalities'
import { demoCodes, DEMO_DISCLAIMER } from '../data/rewards'
import { useQuiz } from '../hooks/QuizContext'
import { useShareActions } from '../hooks/useShareActions'
import { copyText } from '../lib/share'
import { useToast } from '../components/Toast'
import { Button } from '../components/Button'

const LID_OPEN = { xPercent: 52, yPercent: -58, rotate: 22 }

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
 * La lata del premio: se desbloquea al terminar el quiz.
 * Al tocarla, la tapa azul se abre y aparece el premio, como al abrir una lata de NIVEA.
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
        gsap.set(q('[data-tin="lid"]'), LID_OPEN)
        gsap.set(q('[data-tin="ray"]'), { autoAlpha: 1, scaleY: 1 })
      } else {
        gsap.set(q('[data-tin="lid"]'), { clearProps: 'transform' })
        gsap.set(q('[data-tin="ray"]'), { autoAlpha: 0 })
      }
    },
    { scope: root, dependencies: [opened] },
  )

  // Un leve balanceo invita a tocar la lata cuando ya está desbloqueada.
  useGSAP(
    () => {
      if (!unlocked || opened || prefersReducedMotion()) return
      gsap.to(root.current!.querySelector('[data-tin="lid"]'), {
        rotate: -3,
        duration: 0.18,
        repeat: 5,
        yoyo: true,
        ease: 'sine.inOut',
        repeatDelay: 0.02,
        delay: 0.6,
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      })
    },
    { scope: root, dependencies: [unlocked, opened] },
  )

  const open = contextSafe(() => {
    if (!unlocked || opened) return
    if (prefersReducedMotion()) return openLid()
    const q = gsap.utils.selector(root)
    gsap
      .timeline({ onComplete: openLid })
      .to(q('[data-tin="lid"]'), { y: -10, rotate: -5, duration: 0.25, ease: 'power2.out' })
      .to(q('[data-tin="lid"]'), { ...LID_OPEN, y: 0, duration: 0.9, ease: 'expo.inOut' })
      .fromTo(q('[data-tin="ray"]'), { scaleY: 0, autoAlpha: 0 }, { scaleY: 1, autoAlpha: 1, duration: 0.6, stagger: 0.03 }, '-=0.4')
      .from(q('[data-tin="inside"] > *'), { y: 16, autoAlpha: 0, stagger: 0.08, duration: 0.6 }, '-=0.5')
  })

  return (
    <div ref={root} className="relative mx-auto aspect-square w-full max-w-[440px]">
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
      {/* Interior de la lata */}
      <div className="absolute inset-[9%] rounded-full bg-[radial-gradient(circle_at_50%_45%,#ffffff_0%,#f3efe6_62%,#d9d3c6_100%)] shadow-[inset_0_0_0_10px_#c9cdd6,inset_0_0_0_12px_#9ea6b6]">
        <div
          data-tin="inside"
          aria-hidden={!opened}
          className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center text-ink md:px-10"
        >
          {result && (
            <>
              <span className="kicker border border-current px-2 py-1 text-[0.55rem]">Premio demo</span>
              <p className="display text-[clamp(3rem,7vw,4.4rem)] leading-none">
                15% <em className="text-nivea">off</em>
              </p>
              <CopyCode code={demoCodes[result.primary]} />
              <p className="max-w-[24ch] text-[0.7rem] leading-snug text-ink/60">Ficticio. No válido para compras.</p>
            </>
          )}
        </div>
      </div>
      {/* Tapa */}
      <button
        type="button"
        data-tin="lid"
        onClick={open}
        disabled={!unlocked || opened}
        aria-label={unlocked ? 'Tocar la lata para abrir tu premio' : 'Jugá el quiz para desbloquear el premio'}
        className={`absolute inset-[6%] flex flex-col items-center justify-center gap-4 rounded-full bg-nivea text-paper shadow-[inset_0_0_0_6px_#2a55b8,inset_0_0_0_9px_#00268a,0_30px_50px_-20px_rgb(0_15_56/0.6)] enabled:cursor-pointer ${opened ? 'pointer-events-none' : ''}`}
      >
        <img src={images.wordmarkWhite} alt="" className="w-[46%]" draggable={false} />
        <span className="display text-3xl italic">Summer reward</span>
        <span className="kicker mt-2 inline-flex items-center gap-2 text-[0.6rem] text-sun">
          {opened ? (
            '¡Abierta!'
          ) : unlocked ? (
            'Tocá para abrir'
          ) : (
            <>
              <Lock className="h-3.5 w-3.5" aria-hidden /> Jugá para ganar
            </>
          )}
        </span>
      </button>
    </div>
  )
}

/** Premio: se gana jugando el quiz. */
export function Rewards() {
  const root = useRef<HTMLElement>(null)
  const { result, state, start, restart } = useQuiz()
  const { share } = useShareActions()
  useReveal(root)

  const opened = state.rewards.lidOpened && Boolean(result)

  return (
    <section ref={root} id="premio" className="relative overflow-hidden bg-paper text-ink">
      <div className="mx-auto grid max-w-[1300px] gap-16 px-5 py-24 md:grid-cols-12 md:items-center md:px-10 md:py-36">
        <div className="md:col-span-6">
          <p data-reveal className="kicker text-nivea">
            Tu premio
          </p>
          <h2 data-reveal className="display mt-6 text-[clamp(3rem,7vw,6.4rem)]">
            Tu personalidad <em className="text-nivea">tiene premio.</em>
          </h2>
          <p data-reveal className="mt-8 max-w-[38ch] text-lg leading-relaxed text-ink/80 md:text-xl">
            {!result
              ? 'Jugá el quiz, descubrí tu personalidad de verano y desbloqueá la lata.'
              : opened
                ? `¡Listo! Este es tu premio de ${personalities[result.primary].name}.`
                : 'Lo desbloqueaste. Tocá la lata para abrirla y descubrir tu premio.'}
          </p>

          <div data-reveal className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            {!result ? (
              <Button variant="ink" onClick={start} icon={<ArrowRight className="h-4 w-4" />}>
                Jugar para ganar
              </Button>
            ) : (
              opened && (
                <>
                  <Button variant="ink" onClick={share} icon={<Share2 className="h-4 w-4" />}>
                    Compartir resultado
                  </Button>
                  <Button variant="text" onClick={restart} icon={<RotateCcw className="h-4 w-4" />}>
                    Volver a jugar
                  </Button>
                </>
              )
            )}
          </div>

          <p data-reveal className="mt-10 max-w-[52ch] border-l-2 border-sun pl-4 text-[0.8rem] leading-relaxed text-ink/60">
            {DEMO_DISCLAIMER}
          </p>
        </div>
        <div data-reveal className="md:col-span-6">
          <Tin />
        </div>
      </div>
    </section>
  )
}
