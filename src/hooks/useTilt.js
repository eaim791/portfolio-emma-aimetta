import { gsap, useGSAP } from '../lib/gsap'

const MQ_FINE_POINTER =
  '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

/**
 * Inclinación 3D suave hacia el puntero (tarjetas de plantillas y de planes).
 * Solo transform y quickTo (un único tween reutilizado). No se activa en táctil ni con reduced-motion.
 * El rect se mide al entrar (en reposo) para no realimentar la rotación.
 */
export function useTilt(ref, { max = 5 } = {}) {
  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const mm = gsap.matchMedia()
      mm.add(MQ_FINE_POINTER, () => {
        gsap.set(el, { transformPerspective: 900 })
        const rx = gsap.quickTo(el, 'rotationX', { duration: 0.7, ease: 'power3' })
        const ry = gsap.quickTo(el, 'rotationY', { duration: 0.7, ease: 'power3' })
        let rect = null

        const enter = () => {
          rect = el.getBoundingClientRect()
        }
        const move = (e) => {
          if (!rect) return
          ry(((e.clientX - rect.left) / rect.width - 0.5) * max * 2)
          rx(-((e.clientY - rect.top) / rect.height - 0.5) * max * 2)
        }
        const leave = () => {
          rect = null
          rx(0)
          ry(0)
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
