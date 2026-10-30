import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../animations/gsap'
import { useReveal } from '../animations/useReveal'
import { images } from '../data/assets'
import { personalities } from '../data/personalities'
import { productList } from '../data/products'
import { ProductImage } from '../components/ProductImage'
import { Photo } from '../components/Photo'
import { SunMark } from '../components/SunMark'
import { DrawnCircle } from '../components/DrawnCircle'

const shelfHeights = ['h-[260px] md:h-[340px]', 'h-[240px] md:h-[310px]', 'h-[220px] md:h-[280px]', 'h-[220px] md:h-[270px]']

/** 02 — CONOCÉ NIVEA SUN (continúa la escena revelada en la intro). */
export function Universe() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(root)
      gsap.fromTo(
        q('[data-draw]'),
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: q('[data-draw]')[0], start: 'top 80%', once: true },
        },
      )
      gsap.to(q('[data-spin]'), {
        rotate: 120,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.fromTo(
        q('[data-parallax]'),
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: q('[data-band]')[0], start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    },
    { scope: root },
  )

  return (
    <section ref={root} id="universo" className="relative bg-cream text-ink">
      {/* Manifiesto */}
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 pt-20 pb-24 md:grid-cols-12 md:px-10 md:pt-32 md:pb-36">
        <div className="md:col-span-4" data-reveal>
          <SunMark className="h-16 w-16 text-sun md:h-20 md:w-20" />
          <p className="kicker mt-6 text-nivea">Cada día de sol</p>
        </div>
        <div className="md:col-span-8">
          <p data-reveal className="text-pretty text-[clamp(1.45rem,2.6vw,2.35rem)] leading-[1.25] font-[380]">
            Cada día de sol es una oportunidad para disfrutar, explorar y vivir nuevas experiencias. Descubrí la línea{' '}
            <span className="relative inline-block font-semibold whitespace-nowrap">
              NIVEA SUN
              <DrawnCircle className="-inset-x-4 -inset-y-3 h-[calc(100%+1.5rem)] w-[calc(100%+2rem)] text-sun" />
            </span>{' '}
            y encontrá el cuidado solar que acompaña tu manera de vivir el verano.
          </p>
        </div>
      </div>

      {/* Los cuatro productos del test */}
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col gap-6 border-t border-ink/20 pt-8 md:flex-row md:items-end md:justify-between">
          <h3 data-reveal className="display max-w-[16ch] text-[clamp(2.4rem,5vw,4.6rem)]">
            Cuatro protectores, <em className="text-nivea">cuatro veranos.</em>
          </h3>
          <p data-reveal className="max-w-sm text-[0.95rem] leading-relaxed text-ink/75">
            Los productos que forman parte del test. Cada uno acompaña una personalidad distinta.
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-2 border-ink/20 md:mt-16 md:grid-cols-4 md:border-b">
          {productList.map((product, i) => (
            <li
              key={product.id}
              data-reveal
              data-delay={i * 0.08}
              className={`flex flex-col border-ink/20 pb-10 md:pb-12 ${i % 2 ? 'border-l pl-4' : 'pr-4'} md:px-6 ${i > 0 ? 'md:border-l' : 'md:pl-0'} ${i >= 2 ? 'border-t pt-8 md:border-t-0 md:pt-0' : ''}`}
            >
              <div className="flex items-baseline justify-between">
                <span className="display text-6xl italic text-nivea md:text-7xl">{product.letter}</span>
                <span className="kicker text-[0.6rem] text-ink/60">{personalities[product.letter].name}</span>
              </div>
              <div className="relative mt-4 flex h-[280px] items-end justify-center md:h-[360px]">
                <span className="absolute inset-x-0 bottom-0 h-1/2 bg-sand/70" aria-hidden />
                <ProductImage product={product} className={`relative ${shelfHeights[i]} max-w-full`} />
              </div>
              <p className="kicker mt-6 text-[0.62rem] text-nivea">{product.area}</p>
              <h4 className="mt-2 text-[1.05rem] leading-snug font-bold md:text-lg">{product.name}</h4>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-ink/75">{product.description}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-2xl pb-20 text-xs leading-relaxed text-ink/55 md:pb-28">
          Descripciones basadas en el nombre oficial de cada producto. Antes de usar, leé atentamente las instrucciones del
          envase y consultá la información completa en el sitio oficial de NIVEA.
        </p>
      </div>

      {/* Banda fotográfica de transición hacia el test */}
      <div data-band className="relative h-[70svh] overflow-hidden md:h-[88svh]">
        <div data-parallax className="absolute -inset-y-[12%] inset-x-0">
          <Photo src={images.summerStill} alt="Cámara de fotos, libro abierto y bolso de paja sobre la arena" className="h-full w-full" />
        </div>
        <div className="absolute inset-0 bg-night/25" />
        <div className="absolute inset-0 mx-auto flex max-w-[1400px] flex-col justify-end px-5 pb-12 text-paper md:px-10 md:pb-20">
          <span data-spin className="mb-6 inline-block w-14 self-start text-sun">
            <SunMark className="h-14 w-14" />
          </span>
          <p data-reveal className="display max-w-[14ch] text-[clamp(2.6rem,7vw,6.5rem)]">
            Hay un verano <em>para cada una.</em>
          </p>
        </div>
      </div>
    </section>
  )
}
