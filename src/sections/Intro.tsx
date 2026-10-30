import { useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { gsap, prefersReducedMotion, useGSAP } from '../animations/gsap'
import { images } from '../data/assets'
import { Logo } from '../components/Logo'

/**
 * Portada + descripción de marca, en una sola escena fijada.
 *
 * La foto de portada (las dos latas) se parte en dos mitades que se abren
 * con el scroll, como una lata que se destapa, y dejan ver la descripción
 * de la marca con la lata abierta.
 */
export function Intro() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)

      if (prefersReducedMotion()) {
        gsap.set(q('[data-intro="half"], [data-intro="hint"], [data-intro="seam"]'), { autoAlpha: 0 })
        return
      }

      // Entrada al cargar la página.
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from(q('[data-intro="photo"]'), { scale: 1.12, duration: 2.2 })
        .from(q('[data-intro="load"]'), { y: 18, autoAlpha: 0, duration: 1.2, stagger: 0.12 }, 0.3)

      const mm = gsap.matchMedia()
      mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean }

        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: desktop ? '+=170%' : '+=140%',
              pin: true,
              scrub: 1.2,
              anticipatePin: 1,
            },
          })
          .to(q('[data-intro="hint"]'), { autoAlpha: 0, y: -16, duration: 0.12 }, 0)
          .to(q('[data-intro="photo"]'), { scale: 1.06, duration: 0.3 }, 0)
          .fromTo(q('[data-intro="seam"]'), { scaleX: 0 }, { scaleX: 1, duration: 0.14, ease: 'power2.inOut' }, 0.08)
          .to(q('[data-intro="seam"]'), { autoAlpha: 0, duration: 0.06 }, 0.24)
          .to(q('[data-intro="top"]'), { yPercent: -100, duration: 0.6, ease: 'power2.inOut' }, 0.2)
          .to(q('[data-intro="bottom"]'), { yPercent: 100, duration: 0.6, ease: 'power2.inOut' }, 0.2)
          .from(q('[data-intro="brand"]'), { scale: 0.92, autoAlpha: 0, duration: 0.45, ease: 'power2.out' }, 0.32)
          .from(q('[data-intro="tin"]'), { rotate: -8, yPercent: 12, duration: 0.5, ease: 'power2.out' }, 0.32)
          .from(q('[data-intro="line"]'), { yPercent: 110, duration: 0.3, stagger: 0.05, ease: 'power3.out' }, 0.45)
          .from(q('[data-intro="copy"]'), { y: 30, autoAlpha: 0, duration: 0.2, stagger: 0.05 }, 0.62)
          .to({}, { duration: 0.12 })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const half = (position: 'top' | 'bottom') => (
    <div
      data-intro={position}
      className={`absolute inset-x-0 h-1/2 overflow-hidden ${position === 'top' ? 'top-0' : 'bottom-0'}`}
    >
      <div
        data-intro="half"
        className={`absolute inset-x-0 h-[200%] bg-[linear-gradient(180deg,#0628a8_0%,#03209a_45%,#001670_100%)] ${position === 'top' ? 'top-0' : 'bottom-0'}`}
      >
        {/* Desktop: la foto completa a sangre */}
        <img
          data-intro="photo"
          src={images.hero}
          alt={position === 'top' ? 'Lata de NIVEA Creme abierta junto a su tapa, sobre fondo azul' : ''}
          className="hidden h-full w-full object-cover object-left md:block"
          draggable={false}
        />
        {/* Mobile: las latas centradas sobre el mismo azul del fondo */}
        <img
          data-intro="photo"
          src={images.hero}
          alt=""
          className="absolute top-[calc(40%-50.5vw)] left-[-14vw] w-[200vw] max-w-none [mask-image:linear-gradient(to_bottom,transparent,black_16%,black_84%,transparent)] md:hidden"
          draggable={false}
        />
      </div>
    </div>
  )

  return (
    <section ref={root} id="inicio" aria-label="NIVEA SUN — Find your summer" className="relative h-svh overflow-hidden bg-cream">
      {/* Descripción de marca: queda debajo y se revela al abrir la portada */}
      <div id="marca" data-intro="brand" className="absolute inset-0 flex items-center text-ink">
        <div className="mx-auto grid w-full max-w-[1300px] items-center gap-8 px-5 pt-16 md:grid-cols-12 md:gap-12 md:px-10 md:pt-0">
          <div className="md:col-span-6 md:order-2">
            <img
              data-intro="tin"
              src={images.brandOpenTin}
              alt="Lata de NIVEA Creme abierta"
              className="mx-auto h-[26svh] w-full object-cover shadow-[0_40px_60px_-30px_rgb(0_26_92/0.5)] md:h-auto md:aspect-[16/10]"
              draggable={false}
            />
          </div>
          <div className="md:col-span-6 md:order-1">
            <p data-intro="copy" className="kicker text-nivea">
              NIVEA SUN
            </p>
            <h2 className="display mt-4 text-[clamp(2.6rem,6vw,5.6rem)] md:mt-6">
              {['El verano se disfruta', 'mejor cuando'].map((l) => (
                <span key={l} className="block overflow-hidden pb-[0.06em]">
                  <span data-intro="line" className="block">
                    {l}
                  </span>
                </span>
              ))}
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-intro="line" className="block italic text-nivea">
                  te cuidás.
                </span>
              </span>
            </h2>
            <p data-intro="copy" className="mt-6 max-w-[42ch] text-[1.02rem] leading-relaxed text-ink/80 md:mt-8 md:text-lg">
              Cada día de sol es una oportunidad para disfrutar, explorar y vivir nuevas experiencias. Descubrí la línea
              NIVEA SUN y encontrá el cuidado solar que acompaña tu manera de vivir el verano.
            </p>
          </div>
        </div>
      </div>

      {/* Portada partida en dos mitades */}
      {half('top')}
      {half('bottom')}
      <div data-intro="seam" className="absolute inset-x-0 top-1/2 h-px origin-center bg-paper/80" />

      {/* Textos de portada */}
      <div data-intro="hint" className="pointer-events-none absolute inset-0 text-paper">
        <div data-intro="load" className="mx-auto flex max-w-[1400px] items-start px-5 pt-5 md:px-10 md:pt-8">
          <Logo tone="light" size="md" />
        </div>
        <div className="absolute inset-x-0 bottom-32 px-5 md:inset-y-0 md:right-[5%] md:left-auto md:flex md:items-center md:px-0">
          <div data-intro="load">
            <p className="kicker text-sun">NIVEA SUN · Campaña verano</p>
            <h1 className="display mt-4 text-[clamp(3.6rem,6.4vw,7.4rem)]">
              Find your
              <br />
              <em className="text-sun">summer.</em>
            </h1>
          </div>
        </div>
        <div
          data-intro="load"
          className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 pb-[max(1.75rem,env(safe-area-inset-bottom))] text-paper/75 md:pb-10"
        >
          <span className="text-[0.7rem] tracking-[0.18em] uppercase">Deslizá</span>
          <ArrowDown className="h-4 w-4 animate-bounce" strokeWidth={1.5} aria-hidden />
        </div>
      </div>
    </section>
  )
}
