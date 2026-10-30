import { useState } from 'react'
import type { Product, ProductShape } from '../data/products'

interface ProductImageProps {
  product: Product
  className?: string
  /** Muestra el nombre de archivo esperado dentro del placeholder. */
  showFilename?: boolean
  tone?: 'light' | 'dark'
}

const silhouettes: Record<ProductShape, string> = {
  bottle: 'M38 6h24v12c0 2 2 3 6 6 6 4 10 10 10 20v138c0 6-4 10-10 10H32c-6 0-10-4-10-10V44c0-10 4-16 10-20 4-3 6-4 6-6z',
  spray: 'M40 4h20v18H40zM34 24h32c4 0 6 3 6 7v153c0 5-3 8-8 8H36c-5 0-8-3-8-8V31c0-4 2-7 6-7z',
  tube: 'M30 4h40l8 158c0 4-2 6-6 6H28c-4 0-6-2-6-6zM34 168h32v22H34z',
  'face-tube': 'M26 4h48l6 150c0 4-3 7-7 7H27c-4 0-7-3-7-7zM36 161h28v29H36z',
}

/**
 * Packshot oficial del producto. Mientras el archivo no exista en /public/images,
 * muestra una silueta lineal claramente identificada como pendiente (no simula el envase).
 */
export function ProductImage({ product, className = '', showFilename = true, tone = 'dark' }: ProductImageProps) {
  const [missing, setMissing] = useState(false)

  if (!missing) {
    return (
      <img
        src={product.image}
        alt={`Envase de ${product.name}`}
        className={`object-contain ${className}`}
        onError={() => setMissing(true)}
        draggable={false}
      />
    )
  }

  const stroke = tone === 'light' ? 'text-paper/70' : 'text-ink/45'
  return (
    <div
      role="img"
      aria-label={`Imagen oficial pendiente: ${product.name}`}
      className={`relative flex flex-col items-center justify-end ${className}`}
    >
      <svg viewBox="0 0 100 196" className={`h-full w-auto ${stroke}`} aria-hidden>
        <path d={silhouettes[product.shape]} fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" />
      </svg>
      <span
        className={`absolute inset-x-0 top-1/2 -translate-y-1/2 px-1 text-center leading-tight ${tone === 'light' ? 'text-paper' : 'text-ink'}`}
      >
        <span className="kicker block text-[0.55rem]">Envase oficial</span>
        <span className="kicker block text-[0.55rem]">pendiente</span>
        {showFilename && (
          <span className="mt-1 block font-mono text-[0.55rem] opacity-60">{product.image.split('/').pop()}</span>
        )}
      </span>
    </div>
  )
}
