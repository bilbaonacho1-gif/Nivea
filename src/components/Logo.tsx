import { images } from '../data/assets'

interface LogoProps {
  tone?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'h-9', md: 'h-12', lg: 'h-16' }

/**
 * Lockup NIVEA + SUN. Usa el logotipo NIVEA provisto sin alterarlo.
 * Reemplazar por el archivo oficial NIVEA SUN cuando esté disponible.
 */
export function Logo({ tone = 'dark', size = 'md', className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="NIVEA SUN">
      <img src={images.logo} alt="" className={`${sizes[size]} w-auto`} draggable={false} />
      <span
        aria-hidden
        className={`wide text-[0.8em] font-bold tracking-[0.32em] ${tone === 'light' ? 'text-sun' : 'text-nivea'}`}
      >
        SUN
      </span>
    </span>
  )
}
