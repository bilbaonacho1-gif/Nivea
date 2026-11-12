import { images } from './assets'
import type { Letter } from './quiz'

export interface Product {
  letter: Letter
  /** Nombre tal como figura en el brief de campaña. */
  name: string
  /** Foto del envase (recortada del carrusel de campaña). */
  image: string
}

/** Producto NIVEA SUN asociado a cada personalidad. */
export const products: Record<Letter, Product> = {
  A: { letter: 'A', name: 'NIVEA SUN Protect & Moisture', image: images.wonProtectMoisture },
  B: { letter: 'B', name: 'NIVEA SUN Protect & Dry Touch', image: images.wonDryTouch },
  C: { letter: 'C', name: 'NIVEA SUN UV Face Control de Brillo', image: images.wonFaceControlBrillo },
  D: { letter: 'D', name: 'NIVEA SUN UV Face Antimanchas', image: images.wonFaceAntimanchas },
}
