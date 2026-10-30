import type { QuizResult } from '../../lib/quizLogic'
import { personalities } from '../../data/personalities'
import { Photo } from '../../components/Photo'
import { DrawnCircle } from '../../components/DrawnCircle'
import { SunMark } from '../../components/SunMark'
import { Moods, NameLines, ResultActions, ResultKicker, ResultProduct, SecondaryNote } from './ResultParts'

interface LayoutProps {
  result: QuizResult
}

/** A · LA VERANIEGA — póster: fotografía a sangre con el nombre sobre la imagen. */
export function PosterLayout({ result }: LayoutProps) {
  const p = personalities[result.primary]
  return (
    <div className="bg-cream text-ink">
      <div className="relative h-[82svh] min-h-[520px] overflow-hidden text-paper">
        <div data-r="photo" className="absolute inset-0">
          <Photo src={p.image} alt={p.imageAlt} className="h-full w-full" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-night/80 to-transparent" />
        <div className="absolute inset-0 mx-auto flex max-w-[1400px] flex-col justify-between px-5 pt-24 pb-10 md:px-10 md:pb-14">
          <div className="flex items-start justify-between">
            <span className="bg-paper px-3 py-2">
              <ResultKicker />
            </span>
            <span data-r="fade" className="display text-[clamp(5rem,12vw,10rem)] leading-none italic text-sun">
              {p.letter}
            </span>
          </div>
          <NameLines
            className="text-[clamp(4.2rem,15vw,14rem)]"
            lines={[{ text: p.article, className: 'italic text-[0.5em]' }, { text: p.word }]}
          />
        </div>
      </div>
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 md:grid-cols-12 md:px-10 md:py-24">
        <div className="space-y-8 md:col-span-6">
          <p data-r="fade" className="display text-[clamp(1.9rem,3.2vw,2.9rem)] leading-[1.08]">
            {p.description}
          </p>
          <Moods letter={p.letter} />
          <SecondaryNote letter={result.secondary} />
          <ResultActions />
        </div>
        <div className="md:col-span-5 md:col-start-8 md:pt-3">
          <ResultProduct letter={p.letter} />
        </div>
      </div>
    </div>
  )
}

/** B · LA AVENTURERA — azul NIVEA, foto inclinada y letra gigante en contorno. */
export function TiltLayout({ result }: LayoutProps) {
  const p = personalities[result.primary]
  return (
    <div className="relative overflow-hidden bg-nivea text-paper">
      <span
        aria-hidden
        className="display pointer-events-none absolute -top-[0.18em] -right-[0.05em] text-[clamp(18rem,48vw,46rem)] leading-none text-transparent [-webkit-text-stroke:1.5px_rgb(255_212_92/0.55)]"
      >
        {p.letter}
      </span>
      <div className="relative mx-auto grid max-w-[1400px] gap-14 px-5 pt-28 pb-20 md:grid-cols-12 md:px-10 md:pt-40 md:pb-32">
        <div className="space-y-8 md:col-span-6">
          <ResultKicker tone="light" />
          <NameLines
            className="text-[clamp(4rem,11vw,10.5rem)]"
            lines={[{ text: p.article, className: 'text-[0.5em]' }, { text: p.word, className: 'italic text-sun' }]}
          />
          <p data-r="fade" className="max-w-[30ch] text-xl leading-relaxed text-paper/90 md:text-2xl">
            {p.description}
          </p>
          <Moods letter={p.letter} tone="light" />
          <SecondaryNote letter={result.secondary} tone="light" />
          <ResultActions tone="light" />
        </div>
        <div className="relative md:col-span-6 md:pt-10">
          <div data-r="photo" className="relative ml-auto w-[88%] rotate-[-4deg] bg-paper p-3 pb-14 shadow-[0_40px_60px_-30px_rgb(0_0_0/0.6)] md:p-4 md:pb-16">
            <Photo src={p.image} alt={p.imageAlt} className="aspect-[4/5] w-full" />
            <p className="display absolute bottom-4 left-5 text-2xl italic text-ink md:bottom-5">Nunca quieta.</p>
          </div>
          <div className="mt-12 md:ml-[12%]">
            <ResultProduct letter={p.letter} tone="light" />
          </div>
        </div>
      </div>
    </div>
  )
}

/** C · LA ESPONTÁNEA — collage de dos fotos y una anotación a mano. */
export function CollageLayout({ result }: LayoutProps) {
  const p = personalities[result.primary]
  return (
    <div className="bg-sand text-ink">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 pt-28 pb-20 md:grid-cols-12 md:px-10 md:pt-40 md:pb-32">
        <div className="order-2 md:order-1 md:col-span-6">
          <div className="relative min-h-[420px] md:min-h-[600px]">
            <div data-r="photo" className="absolute top-0 left-0 w-[64%] rotate-[-2deg]">
              <Photo src={p.image} alt={p.imageAlt} className="aspect-[4/5] w-full shadow-[0_30px_50px_-25px_rgb(0_0_0/0.45)]" />
            </div>
            {p.secondaryImage && (
              <div data-r="photo" className="absolute right-0 bottom-0 w-[62%] rotate-[3deg] bg-paper p-2 md:p-3">
                <Photo src={p.secondaryImage} alt="Cámara de fotos y libro sobre la arena" className="aspect-[3/2] w-full" />
              </div>
            )}
            <p data-r="fade" className="absolute top-[4%] right-[2%] max-w-[11ch] text-right">
              <span className="display block text-3xl leading-none italic text-nivea md:text-4xl">plan B: no tener plan</span>
              <svg viewBox="0 0 80 60" className="ml-auto h-12 w-16 text-nivea" fill="none" aria-hidden>
                <path d="M70 4C66 30 46 48 10 52M18 42l-8 10 12 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </p>
          </div>
          <div className="mt-12 md:mt-16">
            <ResultProduct letter={p.letter} />
          </div>
        </div>
        <div className="order-1 space-y-8 md:order-2 md:col-span-5 md:col-start-8 md:pt-16">
          <ResultKicker />
          <h2 className="display text-[clamp(3.8rem,9vw,8.5rem)]">
            <span className="block overflow-hidden pb-[0.1em]">
              <span data-r="line" className="block text-[0.5em]">
                {p.article}
              </span>
            </span>
            <span className="relative inline-block overflow-visible">
              <span className="block overflow-hidden pb-[0.1em]">
                <span data-r="line" className="block italic">
                  {p.word}
                </span>
              </span>
              <DrawnCircle className="-inset-x-[6%] -inset-y-[18%] h-[136%] w-[112%] text-sun" />
            </span>
          </h2>
          <p data-r="fade" className="max-w-[32ch] text-xl leading-relaxed text-ink/85">
            {p.description}
          </p>
          <Moods letter={p.letter} />
          <SecondaryNote letter={result.secondary} />
          <ResultActions />
        </div>
      </div>
    </div>
  )
}

/** D · LA AMANTE DEL SKINCARE — calma: mucho blanco, foto vertical y tipografía centrada. */
export function CalmLayout({ result }: LayoutProps) {
  const p = personalities[result.primary]
  return (
    <div className="bg-paper text-ink">
      <div className="mx-auto grid max-w-[1400px] items-stretch md:grid-cols-12">
        <div data-r="photo" className="relative h-[60svh] md:col-span-5 md:h-auto md:min-h-[100svh]">
          <Photo src={p.image} alt={p.imageAlt} className="absolute inset-0 h-full w-full" />
        </div>
        <div className="flex flex-col items-center px-5 py-20 text-center md:col-span-7 md:px-16 md:py-36">
          <ResultKicker />
          <span data-r="fade" className="mt-10 text-sun">
            <SunMark className="h-12 w-12" />
          </span>
          <NameLines
            className="mt-8 text-[clamp(3.6rem,8.5vw,8rem)]"
            lines={[{ text: p.article }, { text: p.word, className: 'italic text-nivea' }]}
          />
          <p data-r="fade" className="mt-10 max-w-[34ch] text-lg leading-relaxed text-ink/80 md:text-xl">
            {p.description}
          </p>
          <div className="mt-8 flex justify-center">
            <Moods letter={p.letter} />
          </div>
          <div className="mt-14 w-full max-w-md text-left">
            <ResultProduct letter={p.letter} />
          </div>
          <div className="mt-12 flex w-full max-w-md flex-col items-center gap-8">
            <SecondaryNote letter={result.secondary} />
            <ResultActions />
          </div>
        </div>
      </div>
    </div>
  )
}
