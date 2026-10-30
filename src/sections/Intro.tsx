import { useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { gsap, prefersReducedMotion, useGSAP } from '../animations/gsap'
import { Logo } from '../components/Logo'
import { Tin } from '../components/Tin'

/**
 * Introducción cinematográfica.
 *
 * 1. Fondo azul de estudio y la lata NIVEA Creme en primer plano.
 * 2. Con el scroll, la tapa se desplaza y deja ver la crema.
 * 3. La cámara se acerca hasta que la crema llena la pantalla.
 * 4. El blanco de la crema se convierte en el fondo de la campaña y aparece el titular.
 */
export function Intro() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)

      if (prefersReducedMotion()) {
        gsap.set(q('[data-i="wash"]'), { autoAlpha: 1 })
        gsap.set(q('[data-i="hint"], [data-i="stage"]'), { autoAlpha: 0 })
        return
      }

      // Entrada al cargar: la lata aparece y un brillo recorre la tapa.
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from(q('[data-tin="root"]'), { scale: 0.82, y: 60, autoAlpha: 0, duration: 1.8 })
        .from(q('[data-tin="lid"] img'), { rotate: -14, duration: 2.2 }, 0)
        .fromTo(q('[data-tin="shine"]'), { xPercent: 0 }, { xPercent: 320, duration: 1.6, ease: 'power2.inOut' }, 0.7)
        .from(q('[data-i="load"]'), { y: 16, autoAlpha: 0, duration: 1.2, stagger: 0.1 }, 0.5)

      const mm = gsap.matchMedia()
      mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean }

        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: desktop ? '+=210%' : '+=170%',
              pin: true,
              scrub: 1,
              anticipatePin: 1,
            },
          })
          // los textos de portada se retiran
          .to(q('[data-i="hint"]'), { autoAlpha: 0, y: -14, duration: 0.1 }, 0)
          // la tapa se desplaza y la cámara empieza a acercarse
          .to(
            q('[data-tin="lid"]'),
            { xPercent: desktop ? 68 : 52, yPercent: -44, rotate: 26, duration: 0.36, ease: 'power2.inOut' },
            0.02,
          )
          .to(q('[data-i="stage"]'), { scale: 1.22, duration: 0.36, ease: 'power1.inOut' }, 0.02)
          // la cámara entra a la crema
          .to(q('[data-tin="lid"]'), { xPercent: 190, yPercent: -150, rotate: 40, duration: 0.3, ease: 'power2.in' }, 0.4)
          .to(q('[data-i="stage"]'), { scale: desktop ? 7.5 : 9, duration: 0.42, ease: 'power2.in' }, 0.38)
          .to(q('[data-i="cream"]'), { autoAlpha: 1, duration: 0.14 }, 0.62)
          .to(q('[data-i="wash"]'), { autoAlpha: 1, duration: 0.1 }, 0.72)
          // el blanco de la crema se vuelve la página
          .from(q('[data-i="line"]'), { yPercent: 115, duration: 0.18, stagger: 0.04, ease: 'power3.out' }, 0.78)
          .from(q('[data-i="sub"]'), { y: 24, autoAlpha: 0, duration: 0.12, stagger: 0.04 }, 0.86)
          .to({}, { duration: 0.06 })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="inicio" aria-label="NIVEA SUN — Find your summer" className="bg-studio relative h-svh overflow-hidden">
      {/* Cámara: la lata */}
      <div data-i="stage" className="absolute inset-0 flex items-center justify-center will-change-transform">
        <Tin shine className="w-[min(74vw,46svh)] md:w-[min(44vmin,440px)]">
          <span data-i="cream" aria-hidden className="invisible absolute -inset-[18%] rounded-full bg-cream" />
        </Tin>
      </div>

      {/* Textos de portada */}
      <div data-i="hint" className="pointer-events-none absolute inset-0 text-paper">
        <div data-i="load" className="mx-auto flex max-w-[1400px] items-center justify-between px-5 pt-6 md:px-10 md:pt-8">
          <Logo tone="light" size="md" />
          <p className="kicker hidden text-paper/80 md:block">Campaña de verano</p>
        </div>
        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1400px] items-end justify-between px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] md:px-10 md:pb-10">
          <p data-i="load" className="display text-[clamp(2rem,4vw,3.4rem)] leading-none">
            Find your <em className="text-sun">summer.</em>
          </p>
          <span data-i="load" className="flex flex-col items-center gap-2 text-paper/75">
            <span className="text-[0.66rem] tracking-[0.2em] uppercase">Deslizá</span>
            <ArrowDown className="h-4 w-4 animate-bounce" strokeWidth={1.5} aria-hidden />
          </span>
        </div>
      </div>

      {/* Final: la crema se vuelve la página. Placa de título centrada, como en un film. */}
      <div data-i="wash" className="invisible absolute inset-0 bg-cream text-ink">
        <div className="mx-auto flex h-full max-w-[1100px] flex-col items-center justify-center px-5 text-center md:px-10">
          <p data-i="sub" className="kicker text-nivea">
            NIVEA SUN · Campaña de verano
          </p>
          <h1 className="display mt-5 text-[clamp(3.4rem,min(10vw,17svh),10rem)] md:mt-7">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-i="line" className="block">
                Find your <em className="text-nivea">summer.</em>
              </span>
            </span>
          </h1>
          <span data-i="sub" aria-hidden className="mt-6 block h-px w-16 bg-sun md:mt-8" />
          <p data-i="sub" className="mt-6 max-w-[40ch] text-[1.02rem] leading-relaxed text-balance text-ink/75 md:mt-8 md:text-lg">
            Una experiencia NIVEA SUN para descubrir cómo disfrutás el verano y qué personalidad tenés bajo el sol.
          </p>
        </div>
      </div>
    </section>
  )
}
