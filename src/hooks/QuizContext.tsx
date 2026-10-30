import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { questions, type Letter } from '../data/quiz'
import { computeResult, isLetter, type QuizResult } from '../lib/quizLogic'
import { clearSession, loadSession, saveSession } from '../lib/session'

export type Phase = 'idle' | 'playing' | 'computing' | 'done'

export interface RewardsState {
  /** La lata del premio ya se abrió. */
  lidOpened: boolean
}

interface QuizState {
  phase: Phase
  /** Pregunta visible (0-based). */
  index: number
  answers: (Letter | null)[]
  /** El overlay del quiz está abierto. */
  open: boolean
  rewards: RewardsState
}

type Action =
  | { type: 'start' }
  | { type: 'resume' }
  | { type: 'close' }
  | { type: 'answer'; letter: Letter }
  | { type: 'back' }
  | { type: 'finish' }
  | { type: 'restart' }
  | { type: 'openLid' }

const emptyRewards: RewardsState = { lidOpened: false }

const initialState: QuizState = {
  phase: 'idle',
  index: 0,
  answers: questions.map(() => null),
  open: false,
  rewards: emptyRewards,
}

function reducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case 'start':
      return { ...initialState, phase: 'playing', open: true }
    case 'resume':
      return { ...state, open: true, phase: state.phase === 'idle' ? 'playing' : state.phase }
    case 'close':
      // Si se cierra durante el cálculo, el resultado ya está completo.
      return { ...state, open: false, phase: state.phase === 'computing' ? 'done' : state.phase }
    case 'answer': {
      const answers = state.answers.slice()
      answers[state.index] = action.letter
      const isLast = state.index >= questions.length - 1
      return isLast
        ? { ...state, answers, phase: 'computing' }
        : { ...state, answers, index: state.index + 1 }
    }
    case 'back':
      return { ...state, index: Math.max(0, state.index - 1) }
    case 'finish':
      return { ...state, phase: 'done', open: false }
    case 'restart':
      return { ...initialState, phase: 'playing', open: true }
    case 'openLid':
      return { ...state, rewards: { ...state.rewards, lidOpened: true } }
  }
}

function hydrate(): QuizState {
  const saved = loadSession<Partial<QuizState>>()
  if (!saved || !Array.isArray(saved.answers) || saved.answers.length !== questions.length) return initialState
  const answers = saved.answers.map((a) => (isLetter(a) ? a : null))
  const complete = answers.every(Boolean)
  const phase: Phase = complete ? 'done' : answers.some(Boolean) ? 'playing' : 'idle'
  return {
    phase,
    index: Math.min(Math.max(0, Number(saved.index) || 0), questions.length - 1),
    answers,
    open: false,
    rewards: { lidOpened: Boolean(complete && saved.rewards?.lidOpened) },
  }
}

interface QuizContextValue {
  state: QuizState
  result: QuizResult | null
  answeredCount: number
  start: () => void
  resume: () => void
  close: () => void
  answer: (letter: Letter) => void
  back: () => void
  finish: () => void
  restart: () => void
  openLid: () => void
}

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, hydrate)

  useEffect(() => {
    if (state.phase === 'idle') clearSession()
    else saveSession({ index: state.index, answers: state.answers, rewards: state.rewards })
  }, [state.phase, state.index, state.answers, state.rewards])

  const result = useMemo(
    () => (state.phase === 'done' ? computeResult(state.answers) : null),
    [state.phase, state.answers],
  )

  const value = useMemo<QuizContextValue>(
    () => ({
      state,
      result,
      answeredCount: state.answers.filter(Boolean).length,
      start: () => dispatch({ type: 'start' }),
      resume: () => dispatch({ type: 'resume' }),
      close: () => dispatch({ type: 'close' }),
      answer: (letter) => dispatch({ type: 'answer', letter }),
      back: () => dispatch({ type: 'back' }),
      finish: () => dispatch({ type: 'finish' }),
      restart: () => dispatch({ type: 'restart' }),
      openLid: () => dispatch({ type: 'openLid' }),
    }),
    [state, result],
  )

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz debe usarse dentro de <QuizProvider>')
  return ctx
}
