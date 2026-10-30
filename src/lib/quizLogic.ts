import { LETTERS, type Letter } from '../data/quiz'

export interface QuizResult {
  primary: Letter
  /** Personalidad complementaria: solo existe cuando hubo empate en el primer puesto. */
  secondary: Letter | null
  counts: Record<Letter, number>
}

export function countAnswers(answers: readonly (Letter | null)[]): Record<Letter, number> {
  const counts: Record<Letter, number> = { A: 0, B: 0, C: 0, D: 0 }
  for (const a of answers) if (a) counts[a] += 1
  return counts
}

/**
 * Calcula la letra elegida más veces.
 *
 * Empates: entre las letras empatadas gana la que se eligió más recientemente
 * (las últimas respuestas describen mejor cómo cierra el día de la persona).
 * La otra letra empatada se muestra como personalidad complementaria.
 */
export function computeResult(answers: readonly (Letter | null)[]): QuizResult | null {
  if (answers.length === 0 || answers.some((a) => a === null)) return null
  const counts = countAnswers(answers)
  const max = Math.max(...LETTERS.map((l) => counts[l]))
  const tied = LETTERS.filter((l) => counts[l] === max)

  const lastIndex = (l: Letter) => answers.lastIndexOf(l)
  const byRecency = [...tied].sort((a, b) => lastIndex(b) - lastIndex(a))

  return {
    primary: byRecency[0],
    secondary: byRecency[1] ?? null,
    counts,
  }
}

export function isLetter(value: unknown): value is Letter {
  return typeof value === 'string' && (LETTERS as string[]).includes(value)
}
