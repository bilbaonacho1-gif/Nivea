import { images } from './assets'

export type Letter = 'A' | 'B' | 'C' | 'D'
export const LETTERS: Letter[] = ['A', 'B', 'C', 'D']

export interface Question {
  id: string
  title: string
  /** Palabra o fragmento del título que se compone en itálica. */
  emphasis?: string
  image: string
  imageAlt: string
  /** Lado de la fotografía en desktop: alterna el ritmo entre preguntas. */
  side: 'left' | 'right'
  caption: string
  /** Nombre de la escena: cada pregunta se presenta como una escena de campaña. */
  scene: string
  options: Record<Letter, string>
}

export const questions: Question[] = [
  {
    id: 'sabado',
    title: 'Es sábado, hay sol y no tenés planes. ¿Qué hacés?',
    emphasis: '¿Qué hacés?',
    image: images.summerBeach,
    imageAlt: 'Sombrillas a rayas azules y blancas frente al mar',
    side: 'left',
    caption: 'Sábado, 11:40',
    scene: 'Sábado',
    options: {
      A: 'Me voy a la playa o pileta.',
      B: 'Salgo a hacer deporte.',
      C: 'Me voy a pasear por la ciudad.',
      D: 'Me organizo un día de autocuidado.',
    },
  },
  {
    id: 'frase',
    title: '¿Qué frase te representa más?',
    emphasis: 'te representa',
    image: images.pool,
    imageAlt: 'Agua turquesa de una pileta con reflejos de sol',
    side: 'right',
    caption: 'Agua, 26°',
    scene: 'Agua',
    options: {
      A: 'Vivo esperando el verano.',
      B: 'No puedo quedarme quieta.',
      C: 'Amo los planes espontáneos.',
      D: 'Mi momento favorito es cuidarme.',
    },
  },
  {
    id: 'amigos',
    title: 'Tus amigos te describirían como…',
    emphasis: 'amigos',
    image: images.summerSkincare,
    imageAlt: 'Sombrero de paja, libro y anteojos de sol sobre una toalla amarilla en la arena',
    side: 'left',
    caption: 'Toalla compartida',
    scene: 'Amigos',
    options: {
      A: 'La que siempre propone vacaciones.',
      B: 'La más activa del grupo.',
      C: 'La que se suma a cualquier plan.',
      D: 'La que ama sus rutinas.',
    },
  },
  {
    id: 'bolso',
    title: 'Armás el bolso para un día de sol. ¿Qué no puede faltar?',
    emphasis: 'no puede faltar',
    image: images.summerTravel,
    imageAlt: 'Bolso de paja con pañuelo atado, apoyado en la arena frente al mar',
    side: 'right',
    caption: 'Bolso listo',
    scene: 'El bolso',
    options: {
      A: 'La lona, la sombrilla y una buena playlist.',
      B: 'Zapatillas, botella de agua y ganas de moverme.',
      C: 'Anteojos de sol y el celu con batería, por las dudas.',
      D: 'Mi neceser con todo lo de mi rutina.',
    },
  },
  {
    id: 'atardecer',
    title: 'El atardecer te encuentra…',
    emphasis: 'atardecer',
    image: images.sky,
    imageAlt: 'Cielo con nubes altas sobre un mar turquesa',
    side: 'left',
    caption: '19:58, todavía hay luz',
    scene: 'Atardecer',
    options: {
      A: 'Todavía en la orilla, sin ganas de irme.',
      B: 'Volviendo de una caminata o de un partido.',
      C: 'En una terraza a la que llegué de casualidad.',
      D: 'Recién bañada, con mi rutina de noche.',
    },
  },
]
