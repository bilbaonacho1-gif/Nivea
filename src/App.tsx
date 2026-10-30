import { useEffect } from 'react'
import { ScrollTrigger } from './animations/gsap'
import { QuizProvider, useQuiz } from './hooks/QuizContext'
import { ToastProvider } from './components/Toast'
import { Header } from './components/Header'
import { Intro } from './sections/Intro'
import { Universe } from './sections/Universe'
import { QuizStart } from './sections/QuizStart'
import { QuizOverlay } from './sections/quiz/QuizOverlay'
import { ResultSection } from './sections/result/ResultSection'
import { Rewards } from './sections/Rewards'
import { Share } from './sections/Share'

/** Recalcula los triggers cuando cambia la altura de la página (resultado revelado o reiniciado). */
function ScrollSync() {
  const { result } = useQuiz()
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [result?.primary, result?.secondary])
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    document.fonts?.ready.then(onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])
  return null
}

export default function App() {
  return (
    <ToastProvider>
      <QuizProvider>
        <ScrollSync />
        <Header />
        <main>
          <Intro />
          <Universe />
          <QuizStart />
          <ResultSection />
          <Rewards />
          <Share />
        </main>
        <QuizOverlay />
      </QuizProvider>
    </ToastProvider>
  )
}
