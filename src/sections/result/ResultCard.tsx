import { images } from '../../data/assets'
import { personalities } from '../../data/personalities'
import { products } from '../../data/products'
import type { Letter } from '../../data/quiz'

/**
 * Tarjeta 4:5 del resultado, pensada para compartir en redes.
 * Las medidas están en unidades del contenedor (cqw) para que escale igual que la imagen descargable.
 */
export function ResultCard({ letter }: { letter: Letter }) {
  const p = personalities[letter]
  const t = p.theme
  const dark = letter === 'B' || letter === 'D'
  return (
    <figure
      data-r="card"
      className="@container relative aspect-[4/5] w-full overflow-hidden shadow-[0_50px_80px_-40px_rgb(0_10_40/0.65)]"
      style={{ background: t.bg, color: t.ink }}
      aria-label={`Tarjeta de resultado: ${p.name}, ${products[letter].name}`}
    >
      {/* Franja vertical de acento */}
      <span
        data-r="stripe"
        aria-hidden
        className="absolute top-[12cqw] left-[79%] z-[3] h-[80cqw] w-[5cqw] origin-top"
        style={{ background: t.accent }}
      />
      <div className="absolute inset-0 flex flex-col p-[5.5cqw]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-[1.6cqw]">
            <img src={dark ? images.wordmarkWhite : images.logo} alt="" className={dark ? 'h-[2.8cqw]' : 'h-[6.8cqw]'} />
            <span className="text-[2.3cqw] font-bold tracking-[0.3em] wide" style={{ color: dark ? t.accent : '#0033a1' }}>
              SUN
            </span>
          </span>
          <span className="text-[2cqw] font-semibold tracking-[0.3em] uppercase wide" style={{ color: t.muted }}>
            Find your summer
          </span>
        </div>
        <div data-r="card-photo" className="grain relative mt-[4.6cqw] h-[66cqw] overflow-hidden">
          <img src={p.image} alt={p.imageAlt} className="h-full w-full object-cover" />
          <span className="display absolute bottom-[3cqw] left-[3cqw] z-[2] text-[22cqw] leading-none text-paper italic">
            {p.letter}
          </span>
        </div>
        <p className="mt-[5.6cqw] text-[2cqw] font-semibold tracking-[0.3em] uppercase wide" style={{ color: t.muted }}>
          Mi personalidad de verano
        </p>
        <p className="display mt-[1.4cqw] text-[11cqw] leading-[0.95] whitespace-nowrap italic">
          {p.article} {p.word}
        </p>
        <div className="mt-auto flex items-end justify-between gap-[3cqw]">
          <span>
            <span className="block text-[1.9cqw] font-semibold tracking-[0.3em] uppercase wide" style={{ color: t.muted }}>
              Mi NIVEA SUN
            </span>
            <span className="mt-[0.8cqw] block text-[3.1cqw] leading-tight font-bold">{products[letter].name}</span>
          </span>
          <span className="shrink-0 text-[2cqw] font-semibold" style={{ color: t.muted }}>
            #FindYourSummer
          </span>
        </div>
      </div>
    </figure>
  )
}
