import { gsap, useGSAP } from '../lib/gsap'

const MQ_FINE_POINTER =
  '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

/**
 * Micro-interacción: el elemento se "imanta" hacia el puntero.
 * Solo transform (compositor) y quickTo (reutiliza un único tween → sin garbage por frame).
 * No se activa en táctil ni con reduced-motion.
 */
export function useMagnetic(ref, strength = 0.3) {
  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const mm = gsap.matchMedia()
      mm.add(MQ_FINE_POINTER, () => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' })
        const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' })
        let rect = null

        const enter = () => {
          rect = el.getBoundingClientRect() // medido en reposo → sin bucle de feedback
        }
        const move = (e) => {
          if (!rect) return
          xTo((e.clientX - (rect.left + rect.width / 2)) * strength)
          yTo((e.clientY - (rect.top + rect.height / 2)) * strength)
        }
        const leave = () => {
          rect = null
          xTo(0)
          yTo(0)
        }

        el.addEventListener('pointerenter', enter)
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        return () => {
          el.removeEventListener('pointerenter', enter)
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        }
      })
    },
    { scope: ref },
  )
}
