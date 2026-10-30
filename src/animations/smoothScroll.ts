import Lenis from 'lenis'
import { gsap, prefersReducedMotion, ScrollTrigger } from './gsap'

/** Scroll suave (Lenis) sincronizado con ScrollTrigger. Se desactiva con movimiento reducido. */
let lenis: Lenis | null = null

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return
  lenis = new Lenis({ lerp: 0.09, anchors: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

export function scrollToId(id: string, immediate = false) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) {
    lenis.resize()
    lenis.scrollTo(el, { immediate, force: true })
  }
  else el.scrollIntoView({ behavior: immediate ? 'instant' : 'smooth' })
}
