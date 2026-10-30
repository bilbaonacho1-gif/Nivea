import { ArrowDown, Download, RotateCcw, Share2 } from 'lucide-react'
import { useState } from 'react'
import type { Letter } from '../../data/quiz'
import { personalities } from '../../data/personalities'
import { products } from '../../data/products'
import { useQuiz } from '../../hooks/QuizContext'
import { useShareActions } from '../../hooks/useShareActions'
import { useToast } from '../../components/Toast'
import { Button } from '../../components/Button'
import { scrollToId } from '../../animations/smoothScroll'
import { shareCardImage } from '../../lib/shareCard'
import { shareText } from '../../lib/share'

/** Fondos oscuros (B, D) usan botones claros; fondos claros (A, C), botones oscuros. */
export const isDark = (letter: Letter) => letter === 'B' || letter === 'D'

export function ResultActions({ letter }: { letter: Letter }) {
  const { restart } = useQuiz()
  const { share } = useShareActions()
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const dark = isDark(letter)

  const card = async () => {
    setBusy(true)
    const outcome = await shareCardImage(letter, shareText(letter))
    setBusy(false)
    if (outcome === 'downloaded') toast('Descargamos tu tarjeta')
    else if (outcome === 'shared') toast('¡Gracias por compartir!')
    else if (outcome === 'failed') toast('No pudimos generar la tarjeta')
  }

  return (
    <div className="flex flex-col gap-5">
      <div data-r="fade" className="flex flex-wrap items-center gap-3">
        <Button
          variant={letter === 'A' ? 'ink' : 'sun'}
          onClick={() => scrollToId('premio')}
          icon={<ArrowDown className="h-4 w-4" />}
        >
          Abrir mi premio
        </Button>
        <Button variant={dark ? 'outline-light' : 'outline'} onClick={card} disabled={busy} icon={<Download className="h-4 w-4" />}>
          {busy ? 'Generando…' : 'Guardar tarjeta'}
        </Button>
      </div>
      <div data-r="fade" className="flex flex-wrap items-center gap-x-7">
        <Button variant="text" onClick={share} icon={<Share2 className="h-4 w-4" />}>
          Compartir resultado
        </Button>
        <Button variant="text" onClick={restart} icon={<RotateCcw className="h-4 w-4" />}>
          Volver a jugar
        </Button>
      </div>
    </div>
  )
}

export function Moods({ letter }: { letter: Letter }) {
  const t = personalities[letter].theme
  return (
    <ul data-r="fade" className="flex flex-wrap gap-x-5 gap-y-1" style={{ color: t.muted }}>
      {personalities[letter].moods.map((m, i) => (
        <li key={m} className="kicker text-[0.62rem]">
          {i > 0 && (
            <span className="mr-5" style={{ color: t.accent }}>
              ✶
            </span>
          )}
          {m}
        </li>
      ))}
    </ul>
  )
}

/** Producto asociado al resultado (solo el nombre). */
export function ResultProduct({ letter }: { letter: Letter }) {
  const t = personalities[letter].theme
  return (
    <div data-r="fade" className="border-t pt-5" style={{ borderColor: t.muted }}>
      <p className="kicker text-[0.6rem]" style={{ color: t.muted }}>
        Tu NIVEA SUN
      </p>
      <p className="mt-2 max-w-[24ch] text-xl leading-tight font-bold md:text-2xl">{products[letter].name}</p>
    </div>
  )
}

export function SecondaryNote({ letter, primary }: { letter: Letter | null; primary: Letter }) {
  if (!letter) return null
  const t = personalities[primary].theme
  return (
    <p data-r="fade" className="border-l-2 pl-4 text-[0.95rem] leading-relaxed" style={{ borderColor: t.accent, color: t.muted }}>
      Empate de verano: también tenés mucho de <strong style={{ color: t.ink }}>{personalities[letter].name}</strong>. Tu
      personalidad complementaria va con {products[letter].name}.
    </p>
  )
}

/** Texto partido en letras para la animación de entrada del nombre. */
export function SplitChars({ text }: { text: string }) {
  return (
    <span aria-label={text} className="inline-block">
      {text.split(' ').map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom whitespace-nowrap">
          {word.split('').map((ch, ci) => (
            <span key={ci} data-r="char" className="inline-block">
              {ch}
            </span>
          ))}
          {wi < text.split(' ').length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  )
}
