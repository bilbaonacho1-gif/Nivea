import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../animations/gsap'
import { useReveal } from '../animations/useReveal'
import { images } from '../data/assets'

const moments = [
  { n: '01', title: 'Bajo el sol', text: 'La lona, el mar y nada más.', image: images.summerBeach, alt: 'Sombrillas a rayas frente al mar' },
  { n: '02', title: 'En movimiento', text: 'El agua como punto de partida.', image: images.pool, alt: 'Agua turquesa de una pileta' },
  { n: '03', title: 'Sin planes', text: 'Salir y ver qué pasa.', image: images.summerTravel, alt: 'Bolso de paja en la arena' },
  { n: '04', title: 'Mi ritual', text: 'Un rato para cuidarme.', image: images.summerSkincare, alt: 'Sombrero, libro y anteojos sobre una toalla' },
]

/** Presentación de la campaña: continúa sobre el blanco que deja la intro. */
export function Campaign() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(root)

      // La foto protagonista se abre de un recorte central a sangre completa.
      gsap.fromTo(
        q('[data-c="hero"]'),
        { clipPath: 'inset(6% 5% 6% 5%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: q('[data-c="hero"]')[0], start: 'top 90%', end: 'top 15%', scrub: 0.6 },
        },
      )
      // Parallax sutil dentro de cada foto.
      gsap.utils.toArray<HTMLElement>(q('[data-parallax]')).forEach((el) => {
        const amount = Number(el.dataset.parallax || 8)
        gsap.fromTo(
          el,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
      // El envase sube apenas más rápido que la foto.
      gsap.fromTo(
        q('[data-c="product"]'),
        { yPercent: 22 },
        {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: { trigger: q('[data-c="hero"]')[0], start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    },
    { scope: root },
  )

  return (
    <section ref={root} id="campana" className="relative bg-cream text-ink">
      {/* Titular */}
      <div className="mx-auto max-w-[1300px] px-5 pt-24 md:px-10 md:pt-32">
        <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-10">
          <div className="md:col-span-8">
            <p data-reveal className="kicker text-nivea">
              La campaña
            </p>
            <h2 data-reveal className="display mt-6 text-[clamp(3rem,6.6vw,6.4rem)]">
              El verano se disfruta mejor cuando te <em className="text-nivea">cuidás.</em>
            </h2>
          </div>
          <div className="md:col-span-4 md:pb-3">
            <span data-reveal aria-hidden className="mb-6 block h-px w-12 bg-sun" />
            <p data-reveal className="max-w-[34ch] text-[1.05rem] leading-relaxed text-ink/80 md:text-lg">
              Cada día de sol es una oportunidad para disfrutar, explorar y vivir nuevas experiencias. Descubrí la línea
              NIVEA SUN y encontrá el cuidado solar que acompaña tu manera de vivir el verano.
            </p>
          </div>
        </div>
      </div>

      {/* Foto protagonista con el envase integrado */}
      <div className="relative mt-12 md:mt-16">
        <div data-c="hero" className="grain relative h-[72svh] overflow-hidden md:h-[92svh]">
          <div data-parallax="9" className="absolute -inset-y-[12%] inset-x-0">
            <img src={images.summerBeach} alt="Sombrillas a rayas azules y blancas frente al mar" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-night/45 to-transparent md:top-auto md:bottom-0 md:bg-gradient-to-t md:from-night/55" />
          <div className="absolute inset-x-0 top-0 mx-auto flex max-w-[1300px] px-5 pt-8 text-paper md:top-auto md:bottom-0 md:px-10 md:pt-0 md:pb-12">
            <p className="display max-w-[12ch] text-[clamp(2.2rem,5vw,4.6rem)] leading-[0.95]">
              Sol, agua <em>y arena.</em>
            </p>
          </div>
        </div>
        <figure
          data-c="product"
          className="absolute right-[6%] -bottom-16 z-10 flex flex-col items-center md:right-[12%] md:-bottom-24"
        >
          <img
            src={images.productProtectMoisture}
            alt="Envase de NIVEA SUN Protect & Moisture"
            className="h-[clamp(200px,34vw,420px)] w-auto drop-shadow-[0_30px_30px_rgb(0_10_40/0.45)]"
          />
          <figcaption className="kicker mt-4 text-[0.55rem] text-ink/70">NIVEA SUN Protect & Moisture</figcaption>
        </figure>
      </div>

      {/* Cuatro maneras de vivir el verano */}
      <div className="mx-auto max-w-[1300px] px-5 pt-36 pb-24 md:px-10 md:pt-52 md:pb-36">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <h3 data-reveal className="display text-[clamp(2.6rem,5.6vw,5.2rem)] md:col-span-7">
            ¿Cómo disfrutás <em className="text-nivea">vos</em> el verano?
          </h3>
          <p data-reveal className="max-w-[36ch] text-[1.02rem] leading-relaxed text-ink/75 md:col-span-4 md:col-start-9">
            Cada manera de vivir el sol tiene su personalidad. Y cada personalidad, su NIVEA SUN.
          </p>
        </div>

        <ol className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 md:mt-20 md:grid-cols-4 md:gap-x-6">
          {moments.map((m, i) => (
            <li key={m.n} data-reveal data-delay={i * 0.08} className={i % 2 ? 'md:pt-20' : ''}>
              <div className="grain relative aspect-[3/4] overflow-hidden">
                <div data-parallax="6" className="absolute -inset-y-[8%] inset-x-0">
                  <img src={m.image} alt={m.alt} className="h-full w-full object-cover" loading="lazy" />
                </div>
              </div>
              <p className="kicker mt-5 text-[0.6rem] text-nivea">{m.n}</p>
              <p className="display mt-2 text-[1.9rem] leading-none md:text-[2.2rem]">{m.title}</p>
              <p className="mt-2 text-[0.92rem] text-ink/70">{m.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
