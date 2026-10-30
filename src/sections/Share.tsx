import { useRef } from 'react'
import { Link2, RotateCcw, Share2 } from 'lucide-react'
import { gsap, prefersReducedMotion, useGSAP } from '../animations/gsap'
import { useReveal } from '../animations/useReveal'
import { images } from '../data/assets'
import { personalities } from '../data/personalities'
import { products } from '../data/products'
import { useQuiz } from '../hooks/QuizContext'
import { useShareActions } from '../hooks/useShareActions'
import { Button } from '../components/Button'
import { Photo } from '../components/Photo'
import { ProductImage } from '../components/ProductImage'
import { Logo } from '../components/Logo'

/** 06 — SHARE YOUR SUMMER + cierre */
export function Share() {
  const root = useRef<HTMLElement>(null)
  const { result, restart, start } = useQuiz()
  const { share, copyLink } = useShareActions()
  useReveal(root)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(root)
      gsap.fromTo(
        q('[data-float]'),
        { yPercent: 18 },
        { yPercent: -6, ease: 'none', scrollTrigger: { trigger: q('[data-float]')[0], start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      gsap.from(q('[data-signoff] > span'), {
        yPercent: 100,
        duration: 1.2,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: q('[data-signoff]')[0], start: 'top 90%', once: true },
      })
    },
    { scope: root },
  )

  const product = result ? products[result.primary] : products.A

  return (
    <section ref={root} id="compartir" className="relative overflow-hidden bg-ink text-paper">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 pt-24 pb-20 md:grid-cols-12 md:px-10 md:pt-36 md:pb-28">
        <div className="md:col-span-7">
          <p data-reveal className="kicker text-sun">
            06 — Share your summer
          </p>
          <h2 data-reveal className="display mt-6 text-[clamp(3.2rem,8vw,7.8rem)]">
            Cada personalidad tiene su <em className="text-sun">brillo.</em>{' '}
            <span aria-hidden className="not-italic">
              ☀️
            </span>
          </h2>
          <p data-reveal className="mt-10 text-2xl font-bold md:text-3xl">¿Qué NIVEA SUN te tocó?</p>
          <p data-reveal className="mt-4 max-w-[40ch] text-lg leading-relaxed text-paper/80">
            Compartí tu resultado, etiquetá a tus amigos y descubrí qué personalidad tienen ellos.
          </p>
          {result && (
            <p data-reveal className="mt-6 text-[0.95rem] text-paper/70">
              Tu resultado: <strong className="text-paper">{personalities[result.primary].name}</strong> ·{' '}
              {products[result.primary].name}
            </p>
          )}
          <div data-reveal className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-4">
            <Button onClick={share} icon={<Share2 className="h-4 w-4" />}>
              {result ? 'Compartir resultado' : 'Compartir el test'}
            </Button>
            <Button variant="outline-light" onClick={copyLink} icon={<Link2 className="h-4 w-4" />}>
              Copiar enlace
            </Button>
            <Button variant="text" onClick={result ? restart : start} icon={<RotateCcw className="h-4 w-4" />}>
              {result ? 'Volver a jugar' : 'Hacer el test'}
            </Button>
          </div>
        </div>

        <figure className="relative md:col-span-5">
          <div data-reveal="mask" className="relative ml-auto w-[82%] md:w-full">
            <Photo src={images.sky} alt="Cielo de verano con nubes altas sobre el mar" className="aspect-[3/4] w-full" />
            <span aria-hidden className="absolute top-6 right-6 h-16 w-16 rounded-full bg-sun md:h-20 md:w-20" />
          </div>
          <div data-float className="absolute -bottom-6 left-0 md:-left-16">
            <ProductImage
              product={product}
              tone="light"
              className="h-[300px] w-auto drop-shadow-[0_30px_30px_rgb(0_0_0/0.45)] md:h-[400px]"
            />
          </div>
        </figure>
      </div>

      <footer className="border-t border-paper/15">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center px-5 pt-20 pb-10 text-center md:px-10 md:pt-28">
          <Logo tone="light" size="lg" />
          <p
            data-signoff
            className="mt-10 flex flex-col items-center text-[clamp(1.6rem,5.4vw,5rem)] leading-[0.95] font-extrabold tracking-[-0.01em] uppercase wide"
          >
            <span className="block">Enjoy the sun.</span>
            <span className="block text-sun">Enjoy your summer.</span>
          </p>
          <p className="mt-16 max-w-3xl text-[0.72rem] leading-relaxed text-paper/50">
            Propuesta conceptual de campaña con fines académicos. NIVEA y NIVEA SUN son marcas registradas de Beiersdorf
            AG. Las recompensas, códigos y sorteos son ficticios. Este sitio no solicita ni guarda datos personales: el
            progreso del test se conserva solo en esta pestaña del navegador.
          </p>
        </div>
      </footer>
    </section>
  )
}
