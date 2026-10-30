import { useState, type ImgHTMLAttributes } from 'react'

interface PhotoProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
}

/** Fotografía con placeholder identificable si el archivo todavía no existe. */
export function Photo({ src, alt, className = '', ...rest }: PhotoProps) {
  const [missing, setMissing] = useState(false)
  if (missing) {
    return (
      <div
        role="img"
        aria-label={`Foto pendiente: ${alt}`}
        className={`flex flex-col items-center justify-center gap-2 bg-sand p-6 text-center text-ink/70 ${className}`}
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, transparent 0 14px, rgb(0 26 92 / 0.06) 14px 15px)',
        }}
      >
        <span className="kicker">Foto pendiente</span>
        <span className="font-mono text-xs">{src.split('/').pop()}</span>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      onError={() => setMissing(true)}
      draggable={false}
      {...rest}
    />
  )
}
