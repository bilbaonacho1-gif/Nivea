/**
 * Manifiesto de imágenes. Todas viven en /public/images.
 *
 * Las fotografías marcadas como "ref" fueron recortadas del carrusel de referencia
 * provisto para el proyecto (1080 px de ancho como máximo). Reemplazalas por las
 * fotografías finales en alta resolución manteniendo el mismo nombre de archivo.
 */
export const images = {
  logo: '/images/nivea-logo.png',
  wordmarkWhite: '/images/nivea-wordmark-white.png',

  /** Portada: frame del aviso NIVEA Creme provisto, sin el texto original. */
  hero: '/images/hero.jpg',
  brandOpenTin: '/images/brand-open-tin.jpg',

  summerBeach: '/images/summer-beach.jpg', // ref: sombrillas a rayas
  pool: '/images/pool-background.jpg', // ref: agua de pileta
  summerSkincare: '/images/summer-skincare.jpg', // ref: sombrero, libro y anteojos sobre toalla
  summerTravel: '/images/summer-travel.jpg', // ref: bolso de playa
  summerStill: '/images/summer-still.jpg', // ref: cámara, libro y bolso en la arena
  sky: '/images/sky.jpg', // ref: cielo
} as const
