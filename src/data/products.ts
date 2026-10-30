import type { Letter } from './quiz'

export interface Product {
  letter: Letter
  /** Nombre tal como figura en el brief de campaña. */
  name: string
}

/** Producto NIVEA SUN asociado a cada personalidad (solo nombre: validar con la ficha oficial). */
export const products: Record<Letter, Product> = {
  A: { letter: 'A', name: 'NIVEA SUN Protect & Moisture' },
  B: { letter: 'B', name: 'NIVEA SUN Protect & Dry Touch' },
  C: { letter: 'C', name: 'NIVEA SUN UV Face Control de Brillo' },
  D: { letter: 'D', name: 'NIVEA SUN UV Face Antimanchas' },
}
