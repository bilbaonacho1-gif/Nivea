/**
 * Manifiesto de imágenes. Todas viven en /public/images.
 *
 * Las fotografías marcadas como "ref" fueron recortadas del carrusel de referencia
 * provisto para el proyecto (1080 px de ancho como máximo) y llevan un grade común
 * (luz cálida, sombras azuladas). Reemplazalas por las finales en alta resolución
 * manteniendo el mismo nombre de archivo.
 */
export const images = {
  logo: '/images/nivea-logo.png',
  wordmarkWhite: '/images/nivea-wordmark-white.png',

  /** Portada: frame del aviso NIVEA Creme provisto, sin el texto original. */
  hero: '/images/hero.jpg',
  /** Lata NIVEA Creme recortada de la portada: tapa y base (la base se reconstruyó bajo la tapa). */
  tinLid: '/images/tin-lid.png',
  tinBase: '/images/tin-base.png',
  /** Packshot recortado del carrusel de referencia (versión UK, baja resolución). */
  productProtectMoisture: '/images/product-protect-moisture.png',

  summerBeach: '/images/summer-beach.jpg', // ref: sombrillas a rayas
  pool: '/images/pool-background.jpg', // ref: agua de pileta
  summerSkincare: '/images/summer-skincare.jpg', // ref: sombrero, libro y anteojos sobre toalla
  summerTravel: '/images/summer-travel.jpg', // ref: bolso de playa
  summerStill: '/images/summer-still.jpg', // ref: cámara, libro y bolso en la arena
  sky: '/images/sky.jpg', // ref: cielo
} as const
