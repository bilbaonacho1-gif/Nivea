import type { Letter } from '../data/quiz'
import { personalities } from '../data/personalities'
import { products } from '../data/products'
import { isLetter } from './quizLogic'

const SHARE_PARAM = 'r'

export function buildShareUrl(letter?: Letter | null) {
  const url = new URL(window.location.href)
  url.hash = ''
  url.search = ''
  if (letter) url.searchParams.set(SHARE_PARAM, letter)
  return url.toString()
}

/** Resultado que llega en un enlace compartido (?r=A). */
export function readSharedLetter(): Letter | null {
  try {
    const value = new URLSearchParams(window.location.search).get(SHARE_PARAM)
    return isLetter(value) ? value : null
  } catch {
    return null
  }
}

export function shareText(letter?: Letter | null) {
  if (!letter) return '¿Qué tipo de NIVEA SUN sos? Hacé el test y descubrí tu personalidad de verano.'
  return `Me salió ${personalities[letter].name} ☀️ y mi NIVEA SUN es ${products[letter].shortName}. ¿Y vos qué NIVEA SUN sos?`
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* sigue con el fallback */
  }
  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  } catch {
    return false
  }
}

export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'failed'

/** Usa la hoja de compartir nativa y, si no existe, copia el enlace. */
export async function shareResult(letter?: Letter | null): Promise<ShareOutcome> {
  const url = buildShareUrl(letter)
  const text = shareText(letter)
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: 'NIVEA SUN — Find Your Summer', text, url })
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled'
    }
  }
  return (await copyText(`${text} ${url}`)) ? 'copied' : 'failed'
}
