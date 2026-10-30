import { useEffect } from 'react'
import { ScrollTrigger } from './animations/gsap'
import { initSmoothScroll } from './animations/smoothScroll'
import { QuizProvider, useQuiz } from './hooks/QuizContext'
import { ToastProvider } from './components/Toast'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Intro } from './sections/Intro'
import { Campaign } from './sections/Campaign'
import { QuizStart } from './sections/QuizStart'
import { QuizOverlay } from './sections/quiz/QuizOverlay'
import { ResultSection } from './sections/result/ResultSection'
import { Rewards } from './sections/Rewards'

/** Recalcula los triggers cuando cambia la altura de la página (resultado revelado o reiniciado). */
function ScrollSync() {
  const { result } = useQuiz()
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [result?.primary, result?.secondary])
  useEffect(() => {
    initSmoothScroll()
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
          <Campaign />
          <QuizStart />
          <ResultSection />
          <Rewards />
        </main>
        <Footer />
        <QuizOverlay />
      </QuizProvider>
    </ToastProvider>
  )
}
