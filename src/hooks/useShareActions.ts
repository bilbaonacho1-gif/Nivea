import { useCallback } from 'react'
import { useQuiz } from './QuizContext'
import { useToast } from '../components/Toast'
import { buildShareUrl, copyText, shareResult } from '../lib/share'

/** Compartir resultado (hoja nativa o copia) y copiar enlace. */
export function useShareActions() {
  const { result } = useQuiz()
  const toast = useToast()
  const letter = result?.primary ?? null

  const share = useCallback(async () => {
    const outcome = await shareResult(letter)
    if (outcome === 'shared') toast('¡Gracias por compartir!')
    else if (outcome === 'copied') toast('Copiamos tu resultado y el enlace')
    else if (outcome === 'failed') toast('No pudimos compartir. Probá copiando el enlace')
  }, [letter, toast])

  const copyLink = useCallback(async () => {
    const ok = await copyText(buildShareUrl(letter))
    toast(ok ? 'Enlace copiado' : 'No pudimos copiar el enlace')
  }, [letter, toast])

  return { share, copyLink }
}
