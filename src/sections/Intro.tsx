import { useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { gsap, prefersReducedMotion, useGSAP } from '../animations/gsap'
import { images } from '../data/assets'
import { Logo } from '../components/Logo'

/**
 * 01 — THE SUMMER BEGINS
 *
 * Escena fijada (pin) cuyo avance controla el scroll:
 *  1. Pantalla azul profundo con el envase como protagonista.
 *  2. El envase pasa al primer plano y una línea solar marca el corte.
 *  3. La mitad superior revela un sol detrás del producto; la inferior descubre la pileta.
 *  4. Las mitades se separan y dejan ver la escena siguiente (playa + titular).
 *  5. El envase se reubica dentro de esa escena y la experiencia continúa.
 */
export function Intro() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)

      const finalState = () => {
        gsap.set(q('[data-intro="top"]'), { yPercent: -100 })
        gsap.set(q('[data-intro="bottom"]'), { yPercent: 100 })
        gsap.set(q('[data-intro="hint"], [data-intro="seam"]'), { autoAlpha: 0 })
        const desktop = window.matchMedia('(min-width: 768px)').matches
        gsap.set(
          q('[data-intro="product"]'),
          desktop ? { scale: 0.74, xPercent: 175, yPercent: 8 } : { scale: 0.5, yPercent: -34, xPercent: 64 },
        )
      }

      if (prefersReducedMotion()) {
        finalState()
        return
      }

      const mm = gsap.matchMedia()
      mm.add(
        {
          desktop: '(min-width: 768px)',
          mobile: '(max-width: 767px)',
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean }

          // Intro de carga: el envase sube y el logo aparece (no depende del scroll).
          gsap
            .timeline({ defaults: { ease: 'expo.out' } })
            .from(q('[data-intro="product"]'), { yPercent: 18, autoAlpha: 0, duration: 1.6 })
            .from(q('[data-intro="load"]'), { y: 16, autoAlpha: 0, duration: 1, stagger: 0.12 }, '-=1.1')

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: desktop ? '+=260%' : '+=200%',
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
            },
          })

          tl
            // 1. el envase gana primer plano, los textos se retiran
            .to(q('[data-intro="hint"]'), { autoAlpha: 0, y: -20, duration: 0.12 }, 0)
            .to(q('[data-intro="product"]'), { scale: desktop ? 1.12 : 1.08, duration: 0.2 }, 0)
            // 2. la pantalla comienza a dividirse
            .fromTo(q('[data-intro="seam"]'), { scaleX: 0 }, { scaleX: 1, duration: 0.16, ease: 'power2.inOut' }, 0.1)
            // 3. arriba: sol detrás del producto · abajo: se descubre la pileta
            .fromTo(
              q('[data-intro="sun"]'),
              { xPercent: -50, yPercent: 10, scale: 0.6 },
              { xPercent: -50, yPercent: -50, scale: 1, duration: 0.3, ease: 'power2.out' },
              0.2,
            )
            .fromTo(q('[data-intro="cover"]'), { scaleY: 1 }, { scaleY: 0, duration: 0.3, ease: 'power2.inOut' }, 0.24)
            .fromTo(q('[data-intro="pool"]'), { scale: 1.25 }, { scale: 1, duration: 0.42 }, 0.24)
            .fromTo(q('[data-intro="tag"]'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.36)
            // 4. las mitades se separan y revelan la escena siguiente
            .to(q('[data-intro="seam"]'), { autoAlpha: 0, duration: 0.06 }, 0.54)
            .to(q('[data-intro="top"]'), { yPercent: -100, duration: 0.36, ease: 'power2.in' }, 0.56)
            .to(q('[data-intro="bottom"]'), { yPercent: 100, duration: 0.36, ease: 'power2.in' }, 0.56)
            .fromTo(q('[data-intro="scene-img"]'), { scale: 1.2 }, { scale: 1, duration: 0.44 }, 0.56)
            // 5. el envase se integra en la escena
            .to(
              q('[data-intro="product"]'),
              desktop
                ? { scale: 0.74, xPercent: 175, yPercent: 8, duration: 0.4, ease: 'power2.inOut' }
                : { scale: 0.5, yPercent: -34, xPercent: 64, duration: 0.4, ease: 'power2.inOut' },
              0.58,
            )
            .from(q('[data-intro="line"]'), { yPercent: 110, duration: 0.2, stagger: 0.04, ease: 'power3.out' }, 0.76)
            .from(q('[data-intro="scene-meta"]'), { autoAlpha: 0, duration: 0.1 }, 0.9)
            .to({}, { duration: 0.06 })
        },
      )
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="inicio" aria-label="Find your summer" className="relative h-svh overflow-hidden bg-ink text-paper">
      {/* Escena que queda detrás: apertura de la sección 02 */}
      <div className="absolute inset-0" aria-hidden={false}>
        <img
          data-intro="scene-img"
          src={images.summerBeach}
          alt="Sombrillas a rayas azules y blancas frente al mar"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* velo para legibilidad del titular */}
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-night/85 via-night/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:px-10 md:pb-16">
          <p data-intro="scene-meta" className="kicker mb-5 text-sun">
            02 — Conocé NIVEA SUN
          </p>
          <h2 className="display max-w-[11ch] text-[clamp(3.1rem,10.5vw,9.5rem)] md:max-w-[13ch]">
            {['El verano se', 'disfruta mejor', 'cuando te'].map((l) => (
              <span key={l} className="block overflow-hidden pb-[0.06em]">
                <span data-intro="line" className="block">
                  {l}
                </span>
              </span>
            ))}
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-intro="line" className="block italic text-sun">
                cuidás.
              </span>
            </span>
          </h2>
        </div>
      </div>

      {/* Mitad superior */}
      <div data-intro="top" className="absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-ink">
        <div
          data-intro="sun"
          className="absolute left-1/2 top-full aspect-square w-[min(78vw,62svh)] rounded-full bg-sun"
        />
        <div data-intro="load" className="relative mx-auto flex max-w-[1400px] items-start justify-between px-5 pt-5 md:px-10 md:pt-8">
          <span data-intro="hint">
            <Logo tone="light" size="md" />
          </span>
          <p data-intro="hint" className="kicker hidden pt-3 text-paper/70 md:block">
            Campaña verano · Argentina
          </p>
        </div>
      </div>

      {/* Mitad inferior: pileta que se descubre desde el corte */}
      <div data-intro="bottom" className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden bg-ink">
        <img
          data-intro="pool"
          src={images.pool}
          alt=""
          className="absolute inset-0 h-full w-full origin-top object-cover"
        />
        <div data-intro="cover" className="absolute inset-0 origin-bottom bg-ink" />
        <p
          data-intro="tag"
          className="kicker invisible absolute bottom-6 left-5 text-paper md:bottom-10 md:left-10"
        >
          Sol · Agua · Vos
        </p>
      </div>

      {/* Línea solar del corte */}
      <div data-intro="seam" className="absolute inset-x-0 top-1/2 h-[2px] origin-center -translate-y-1/2 bg-sun" />

      {/* Envase protagonista */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <img
          data-intro="product"
          src={images.heroProduct}
          alt="Envase de NIVEA SUN Protect & Moisture"
          className="h-[min(64svh,620px)] w-auto drop-shadow-[0_40px_40px_rgb(0_10_40/0.45)] will-change-transform"
        />
      </div>

      {/* Textos de apertura */}
      <div
        data-intro="load"
        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pb-10"
      >
        <p data-intro="hint" className="kicker text-[0.8rem] tracking-[0.5em] text-paper">
          Find your summer
        </p>
        <span data-intro="hint" className="flex flex-col items-center gap-2 text-paper/70">
          <span className="text-[0.7rem] tracking-[0.18em] uppercase">Deslizá</span>
          <ArrowDown className="h-4 w-4 animate-bounce" strokeWidth={1.5} aria-hidden />
        </span>
      </div>
    </section>
  )
}
