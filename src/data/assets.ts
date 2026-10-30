/**
 * Manifiesto de imágenes. Todas viven en /public/images.
 *
 * Las fotografías marcadas como "ref" fueron recortadas del carrusel de referencia
 * provisto para el proyecto (1080 px de ancho como máximo). Reemplazalas por las
 * fotografías finales en alta resolución manteniendo el mismo nombre de archivo.
 *
 * Los envases que todavía no tienen packshot oficial se muestran con un placeholder
 * identificable (ver <ProductImage />) hasta que el archivo exista en /public/images.
 */
export const images = {
  logo: '/images/nivea-logo.png',
  wordmarkWhite: '/images/nivea-wordmark-white.png',

  heroProduct: '/images/product-protect-moisture.png',

  summerBeach: '/images/summer-beach.jpg', // ref: sombrillas a rayas
  pool: '/images/pool-background.jpg', // ref: agua de pileta
  summerSkincare: '/images/summer-skincare.jpg', // ref: sombrero, libro y anteojos sobre toalla
  summerTravel: '/images/summer-travel.jpg', // ref: bolso de playa
  summerStill: '/images/summer-still.jpg', // ref: cámara, libro y bolso en la arena
  seaHorizon: '/images/sea-horizon.jpg', // ref: horizonte de mar
  sky: '/images/sky.jpg', // ref: cielo
  summerSports: '/images/summer-sports.jpg', // pendiente
} as const
