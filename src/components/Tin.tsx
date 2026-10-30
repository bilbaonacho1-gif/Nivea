import type { ReactNode } from 'react'
import { images } from '../data/assets'

interface TinProps {
  className?: string
  /** Contenido impreso sobre la crema (por ejemplo, el premio). */
  children?: ReactNode
  /** Brillo que recorre la tapa al aparecer. */
  shine?: boolean
}

/**
 * Lata NIVEA Creme armada con la foto real: base con crema y tapa por separado.
 * La tapa ([data-tin="lid"]) se anima desde afuera; el resto de la lata queda quieto.
 */
export function Tin({ className = '', children, shine = false }: TinProps) {
  return (
    <div data-tin="root" className={`relative aspect-square ${className}`}>
      <div className="absolute inset-0 rounded-full shadow-[0_40px_70px_-25px_rgb(0_8_40/0.7)]">
        <img src={images.tinBase} alt="" className="h-full w-full select-none" draggable={false} />
      </div>
      <div data-tin="inside" className="absolute inset-[16%] flex items-center justify-center">
        {children}
      </div>
      <div
        data-tin="lid"
        className="absolute inset-[1.2%] rounded-full shadow-[0_24px_50px_-18px_rgb(0_8_40/0.75)] will-change-transform"
      >
        <img
          src={images.tinLid}
          alt="Lata de NIVEA Creme"
          className="h-full w-full select-none"
          draggable={false}
        />
        {shine && (
          <span aria-hidden className="absolute inset-0 overflow-hidden rounded-full">
            <span
              data-tin="shine"
              className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent"
            />
          </span>
        )}
      </div>
    </div>
  )
}
