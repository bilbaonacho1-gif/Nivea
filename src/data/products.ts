import type { Letter } from './quiz'

export type ProductShape = 'bottle' | 'spray' | 'tube' | 'face-tube'

export interface Product {
  id: string
  letter: Letter
  /** Nombre tal como figura en el brief de campaña. */
  name: string
  /** Parte del nombre que se destaca tipográficamente. */
  shortName: string
  area: 'Corporal' | 'Facial'
  image: string
  /** Silueta usada por el placeholder mientras falta el packshot oficial. */
  shape: ProductShape
  /**
   * Descripción breve. Se limita a lo que expresa el nombre oficial del producto:
   * no agrega FPS, resistencias ni beneficios que no estén verificados.
   * Validar con la ficha oficial de nivea.com.ar antes de publicar.
   */
  description: string
}

export const products: Record<Letter, Product> = {
  A: {
    id: 'protect-moisture',
    letter: 'A',
    name: 'NIVEA SUN Protect & Moisture',
    shortName: 'Protect & Moisture',
    area: 'Corporal',
    image: '/images/product-protect-moisture.png',
    shape: 'bottle',
    description: 'Protector solar corporal de la línea Protect & Moisture: protección solar e hidratación en un mismo paso.',
  },
  B: {
    id: 'dry-touch',
    letter: 'B',
    name: 'NIVEA SUN Protect & Dry Touch',
    shortName: 'Protect & Dry Touch',
    area: 'Corporal',
    image: '/images/product-dry-touch.png',
    shape: 'spray',
    description: 'Protector solar corporal de la línea Protect & Dry Touch, de textura toque seco.',
  },
  C: {
    id: 'control-brillo',
    letter: 'C',
    name: 'NIVEA SUN UV Face Control de Brillo',
    shortName: 'UV Face Control de Brillo',
    area: 'Facial',
    image: '/images/product-control-brillo.png',
    shape: 'face-tube',
    description: 'Protector solar facial de la línea UV Face, pensado para el control del brillo.',
  },
  D: {
    id: 'antimanchas',
    letter: 'D',
    name: 'NIVEA SUN UV Face Antimanchas',
    shortName: 'UV Face Antimanchas',
    area: 'Facial',
    image: '/images/product-antimanchas.png',
    shape: 'tube',
    description: 'Protector solar facial de la línea UV Face, orientado al cuidado de las manchas.',
  },
}

export const productList = Object.values(products)
