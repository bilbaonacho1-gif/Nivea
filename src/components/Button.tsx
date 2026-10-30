import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'sun' | 'ink' | 'outline' | 'outline-light' | 'text'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  icon?: ReactNode
}

const variants: Record<Variant, string> = {
  sun: 'bg-sun text-ink hover:bg-sun-soft',
  ink: 'bg-ink text-paper hover:bg-nivea',
  outline: 'border border-ink/80 text-ink hover:bg-ink hover:text-paper',
  'outline-light': 'border border-paper/70 text-paper hover:bg-paper hover:text-ink',
  text: 'text-current underline decoration-1 underline-offset-[6px] hover:decoration-sun px-0!',
}

export function Button({ variant = 'sun', icon, className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={`group inline-flex min-h-12 items-center justify-center gap-3 px-6 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.16em] wide transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`}
      {...rest}
    >
      <span>{children}</span>
      {icon && <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
    </button>
  )
}
