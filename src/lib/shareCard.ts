import { images } from '../data/assets'
import { personalities } from '../data/personalities'
import { products } from '../data/products'
import type { Letter } from '../data/quiz'

/**
 * Tarjeta del resultado en formato post de Instagram (1080 × 1350).
 * Replica la composición de <ResultCard /> dibujándola en un canvas.
 */
const W = 1080
const H = 1350
const PAD = 60

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.max(w / img.width, h / img.height)
  const sw = w / scale
  const sh = h / scale
  ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h)
}

function fitFont(ctx: CanvasRenderingContext2D, text: string, family: string, max: number, maxWidth: number) {
  let size = max
  do {
    ctx.font = `${family.includes('italic') ? 'italic ' : ''}${size}px ${family.replace('italic ', '')}`
    size -= 4
  } while (ctx.measureText(text).width > maxWidth && size > 40)
}

export async function renderShareCard(letter: Letter): Promise<Blob> {
  const p = personalities[letter]
  const t = p.theme
  const dark = letter === 'B' || letter === 'D'

  await Promise.all([
    document.fonts.load('120px "Instrument Serif"'),
    document.fonts.load('italic 120px "Instrument Serif"'),
    document.fonts.load('700 40px "Archivo Variable"'),
  ]).catch(() => undefined)

  const [photo, logo] = await Promise.all([loadImage(p.image), loadImage(dark ? images.wordmarkWhite : images.logo)])

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = t.bg
  ctx.fillRect(0, 0, W, H)

  // Encabezado
  const logoH = dark ? 30 : 74
  const logoW = (logo.width / logo.height) * logoH
  ctx.drawImage(logo, PAD, PAD + (74 - logoH) / 2, logoW, logoH)
  ctx.fillStyle = dark ? t.accent : '#0033a1'
  ctx.font = '700 26px "Archivo Variable", sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillText('S U N', PAD + logoW + 18, PAD + 38)
  ctx.textAlign = 'right'
  ctx.fillStyle = t.muted
  ctx.font = '600 22px "Archivo Variable", sans-serif'
  ctx.fillText('F I N D   Y O U R   S U M M E R', W - PAD, PAD + 38)
  ctx.textAlign = 'left'

  // Foto
  const py = 176
  const ph = 716
  drawCover(ctx, photo, PAD, py, W - PAD * 2, ph)

  // Franja vertical de acento
  ctx.fillStyle = t.accent
  ctx.fillRect(W * 0.79, 130, 54, 864)

  // Letra sobre la foto
  ctx.fillStyle = '#fdfbf6'
  ctx.font = 'italic 240px "Instrument Serif", serif'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(p.letter, PAD + 34, py + ph - 40)

  // Nombre
  ctx.fillStyle = t.muted
  ctx.font = '600 22px "Archivo Variable", sans-serif'
  ctx.fillText('M I   P E R S O N A L I D A D   D E   V E R A N O', PAD, py + ph + 70)
  ctx.fillStyle = t.ink
  const nameLine = `${p.article} ${p.word}`
  fitFont(ctx, nameLine, 'italic "Instrument Serif", serif', 132, W - PAD * 2)
  ctx.fillText(nameLine, PAD, py + ph + 200)

  // Producto
  ctx.fillStyle = t.muted
  ctx.font = '600 20px "Archivo Variable", sans-serif'
  ctx.fillText('M I   N I V E A   S U N', PAD, H - PAD - 52)
  ctx.fillStyle = t.ink
  ctx.font = '700 34px "Archivo Variable", sans-serif'
  ctx.fillText(products[letter].name, PAD, H - PAD - 8)
  ctx.textAlign = 'right'
  ctx.fillStyle = t.muted
  ctx.font = '600 22px "Archivo Variable", sans-serif'
  ctx.fillText('#FindYourSummer', W - PAD, H - PAD - 8)

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('No se pudo generar la imagen'))), 'image/png'),
  )
}

export type CardOutcome = 'shared' | 'downloaded' | 'cancelled' | 'failed'

/** Comparte la tarjeta como archivo (celular) o la descarga (escritorio). */
export async function shareCardImage(letter: Letter, text: string): Promise<CardOutcome> {
  try {
    const blob = await renderShareCard(letter)
    const file = new File([blob], `nivea-sun-${personalities[letter].word.toLowerCase().replace(/\s+/g, '-')}.png`, {
      type: 'image/png',
    })
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text })
        return 'shared'
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled'
      }
    }
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 2000)
    return 'downloaded'
  } catch {
    return 'failed'
  }
}
