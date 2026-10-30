import { RotateCcw, Share2 } from 'lucide-react'
import type { Letter } from '../../data/quiz'
import { personalities } from '../../data/personalities'
import { products } from '../../data/products'
import { useQuiz } from '../../hooks/QuizContext'
import { useShareActions } from '../../hooks/useShareActions'
import { Button } from '../../components/Button'
import { ProductImage } from '../../components/ProductImage'

type Tone = 'light' | 'dark'

export function ResultKicker({ tone = 'dark' }: { tone?: Tone }) {
  return (
    <p data-r="fade" className={`kicker ${tone === 'light' ? 'text-sun' : 'text-nivea'}`}>
      04 — Tu personalidad de verano
    </p>
  )
}

export function ResultActions({ tone = 'dark' }: { tone?: Tone }) {
  const { restart } = useQuiz()
  const { share } = useShareActions()
  return (
    <div data-r="fade" className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <Button variant={tone === 'light' ? 'sun' : 'ink'} onClick={share} icon={<Share2 className="h-4 w-4" />}>
        Compartir resultado
      </Button>
      <Button
        variant={tone === 'light' ? 'outline-light' : 'outline'}
        onClick={restart}
        icon={<RotateCcw className="h-4 w-4" />}
      >
        Volver a jugar
      </Button>
    </div>
  )
}

export function Moods({ letter, tone = 'dark' }: { letter: Letter; tone?: Tone }) {
  return (
    <ul data-r="fade" className={`flex flex-wrap gap-x-5 gap-y-1 ${tone === 'light' ? 'text-paper/80' : 'text-ink/70'}`}>
      {personalities[letter].moods.map((m, i) => (
        <li key={m} className="kicker text-[0.62rem]">
          {i > 0 && <span className={`mr-5 ${tone === 'light' ? 'text-sun' : 'text-sun'}`}>✶</span>}
          {m}
        </li>
      ))}
    </ul>
  )
}

/** Producto asociado al resultado. */
export function ResultProduct({ letter, tone = 'dark', imageClass = 'h-56 md:h-72' }: { letter: Letter; tone?: Tone; imageClass?: string }) {
  const product = products[letter]
  return (
    <div className="flex items-end gap-5">
      <div data-r="product" className="shrink-0">
        <ProductImage product={product} tone={tone} className={`${imageClass} w-auto drop-shadow-[0_24px_24px_rgb(0_10_40/0.28)]`} />
      </div>
      <div data-r="fade" className="pb-2">
        <p className={`kicker text-[0.6rem] ${tone === 'light' ? 'text-sun' : 'text-nivea'}`}>Tu NIVEA SUN</p>
        <p className="mt-2 max-w-[16ch] text-lg leading-tight font-bold md:text-xl">{product.name}</p>
        <p className={`mt-2 max-w-[28ch] text-sm leading-relaxed ${tone === 'light' ? 'text-paper/75' : 'text-ink/70'}`}>
          {product.description}
        </p>
      </div>
    </div>
  )
}

export function SecondaryNote({ letter, tone = 'dark' }: { letter: Letter | null; tone?: Tone }) {
  if (!letter) return null
  const p = personalities[letter]
  return (
    <p data-r="fade" className={`border-l-2 border-sun pl-4 text-[0.95rem] leading-relaxed ${tone === 'light' ? 'text-paper/85' : 'text-ink/80'}`}>
      Empate de verano: también tenés mucho de <strong>{p.name}</strong>. Tu personalidad complementaria va con{' '}
      {products[letter].name}.
    </p>
  )
}

/** Nombre partido en líneas con máscara para la animación de entrada. */
export function NameLines({ lines, className = '' }: { lines: { text: string; className?: string }[]; className?: string }) {
  return (
    <h2 className={`display ${className}`}>
      {lines.map((l) => (
        <span key={l.text} className="block overflow-hidden pb-[0.1em]">
          <span data-r="line" className={`block ${l.className ?? ''}`}>
            {l.text}
          </span>
        </span>
      ))}
    </h2>
  )
}
