import type { RefObject } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from './gsap'

/**
 * Entradas al hacer scroll para todo elemento con [data-reveal] dentro del scope.
 * data-reveal="up" (por defecto) | "mask" (la imagen se descubre de abajo hacia arriba) | "fade"
 * data-delay="0.1" agrega un retraso individual.
 */
export function useReveal(scope: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', scope.current)
      items.forEach((el) => {
        const kind = el.dataset.reveal || 'up'
        const delay = Number(el.dataset.delay || 0)
        const trigger = { trigger: el, start: 'top 88%', once: true }
        if (kind === 'mask') {
          gsap.fromTo(
            el,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.out', delay, scrollTrigger: trigger },
          )
        } else if (kind === 'fade') {
          gsap.from(el, { autoAlpha: 0, duration: 1.1, delay, scrollTrigger: trigger })
        } else {
          gsap.from(el, { y: 48, autoAlpha: 0, duration: 1.1, ease: 'expo.out', delay, scrollTrigger: trigger })
        }
      })
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  )
}
