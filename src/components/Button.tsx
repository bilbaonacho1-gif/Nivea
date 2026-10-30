import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'sun' | 'ink' | 'outline' | 'outline-light' | 'text'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  icon?: ReactNode
}

/** Base, barrido de color al pasar el mouse y color de texto durante el barrido. */
const variants: Record<Variant, { base: string; sweep: string; hover: string }> = {
  sun: { base: 'bg-sun text-ink', sweep: 'bg-paper', hover: '' },
  ink: { base: 'bg-ink text-paper', sweep: 'bg-nivea', hover: '' },
  outline: { base: 'border border-ink/80 text-ink', sweep: 'bg-ink', hover: 'group-hover:text-paper' },
  'outline-light': { base: 'border border-paper/70 text-paper', sweep: 'bg-paper', hover: 'group-hover:text-ink' },
  text: { base: 'text-current', sweep: '', hover: '' },
}

export function Button({ variant = 'sun', icon, className = '', children, ...rest }: ButtonProps) {
  const v = variants[variant]
  const isText = variant === 'text'
  return (
    <button
      type="button"
      className={`group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden text-[0.76rem] font-semibold tracking-[0.16em] uppercase wide transition-transform duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 ${isText ? 'px-0 py-3' : 'px-6 py-3'} ${v.base} ${className}`}
      {...rest}
    >
      {!isText && (
        <span
          aria-hidden
          className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 ${v.sweep}`}
        />
      )}
      <span className={`relative transition-colors duration-300 ${v.hover}`}>
        {children}
        {isText && (
          <span
            aria-hidden
            className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-current transition-transform duration-500 group-hover:scale-x-0"
          />
        )}
      </span>
      {icon && (
        <span className={`relative transition-[transform,color] duration-300 group-hover:translate-x-1 ${v.hover}`}>{icon}</span>
      )}
    </button>
  )
}
