import { useCallback } from 'react'
import { useQuiz } from './QuizContext'
import { useToast } from '../components/Toast'
import { buildShareUrl, copyText, shareResult } from '../lib/share'

/** Compartir y copiar enlace. Compartir con éxito completa el desafío de recompensas. */
export function useShareActions() {
  const { result, completeChallenge, state } = useQuiz()
  const toast = useToast()
  const letter = result?.primary ?? null

  const markChallenge = useCallback(() => {
    if (letter && !state.rewards.challengeDone) completeChallenge()
  }, [letter, state.rewards.challengeDone, completeChallenge])

  const share = useCallback(async () => {
    const outcome = await shareResult(letter)
    if (outcome === 'shared') {
      toast('¡Gracias por compartir!')
      markChallenge()
    } else if (outcome === 'copied') {
      toast('Copiamos tu resultado y el enlace')
      markChallenge()
    } else if (outcome === 'failed') {
      toast('No pudimos compartir. Probá copiando el enlace')
    }
  }, [letter, toast, markChallenge])

  const copyLink = useCallback(async () => {
    const ok = await copyText(buildShareUrl(letter))
    toast(ok ? 'Enlace copiado' : 'No pudimos copiar el enlace')
    if (ok) markChallenge()
  }, [letter, toast, markChallenge])

  return { share, copyLink }
}
