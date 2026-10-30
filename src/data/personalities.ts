import { images } from './assets'
import type { Letter } from './quiz'

export type ResultLayout = 'poster' | 'tilt' | 'collage' | 'calm'

export interface Personality {
  letter: Letter
  /** Nombre en mayúsculas, como en la campaña. */
  name: string
  /** Primera línea del nombre en la composición editorial. */
  article: string
  /** Palabra protagonista. */
  word: string
  description: string
  /** Tres palabras que acompañan el resultado. */
  moods: [string, string, string]
  image: string
  imageAlt: string
  secondaryImage?: string
  layout: ResultLayout
}

export const personalities: Record<Letter, Personality> = {
  A: {
    letter: 'A',
    name: 'LA VERANIEGA',
    article: 'La',
    word: 'Veraniega',
    description:
      'Representa a quienes viven esperando el verano, aman la playa y disfrutan cada momento bajo el sol.',
    moods: ['Arena', 'Sal', 'Siesta en la lona'],
    image: images.summerBeach,
    imageAlt: 'Sombrillas a rayas azules y blancas frente al mar',
    layout: 'poster',
  },
  B: {
    letter: 'B',
    name: 'LA AVENTURERA',
    article: 'La',
    word: 'Aventurera',
    description:
      'Representa a quienes no se quedan quietas, practican deportes y siempre buscan nuevas experiencias.',
    moods: ['Movimiento', 'Agua', 'Planes al aire libre'],
    image: images.pool,
    imageAlt: 'Agua turquesa de una pileta con reflejos de sol',
    layout: 'tilt',
  },
  C: {
    letter: 'C',
    name: 'LA ESPONTÁNEA',
    article: 'La',
    word: 'Espontánea',
    description:
      'Representa a quienes aman los planes improvisados, salir, pasear y aprovechar cada oportunidad.',
    moods: ['Improvisar', 'Pasear', 'Decir que sí'],
    image: images.summerTravel,
    imageAlt: 'Bolso de paja con pañuelo atado, apoyado en la arena',
    secondaryImage: images.summerStill,
    layout: 'collage',
  },
  D: {
    letter: 'D',
    name: 'LA AMANTE DEL SKINCARE',
    article: 'La amante',
    word: 'del skincare',
    description:
      'Representa a quienes disfrutan sus rutinas, el cuidado personal y los pequeños momentos para ellas mismas.',
    moods: ['Rutina', 'Calma', 'Tiempo para mí'],
    image: images.summerSkincare,
    imageAlt: 'Sombrero de paja, libro y anteojos de sol sobre una toalla amarilla',
    layout: 'calm',
  },
}
