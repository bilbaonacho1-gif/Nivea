import { images } from './assets'
import type { Letter } from './quiz'

export interface Product {
  letter: Letter
  /** Nombre tal como figura en el brief de campaña. */
  name: string
  /** Foto del envase (recortada del carrusel de campaña). */
  image: string
  /** Precio ilustrativo en pesos para la simulación del canje (no es un precio real). */
  price: number
}

/** Producto NIVEA SUN asociado a cada personalidad. */
export const products: Record<Letter, Product> = {
  A: { letter: 'A', name: 'NIVEA SUN Protect & Moisture', image: images.wonProtectMoisture, price: 24900 },
  B: { letter: 'B', name: 'NIVEA SUN Protect & Dry Touch', image: images.wonDryTouch, price: 27500 },
  C: { letter: 'C', name: 'NIVEA SUN UV Face Control de Brillo', image: images.wonFaceControlBrillo, price: 21900 },
  D: { letter: 'D', name: 'NIVEA SUN UV Face Antimanchas', image: images.wonFaceAntimanchas, price: 25900 },
}
