import { gsap, useGSAP, MQ_MOTION_OK } from '../lib/gsap'
import { useLenis } from '../components/SmoothScroll'

/**
 * Marquee conducido por el ticker de GSAP: avanza a velocidad base y se acelera (e invierte el sentido)
 * con la velocidad del scroll de Lenis. El carril está duplicado, así que al llegar a -50 % salta a 0 sin que se note.
 * Con prefers-reduced-motion no se anima (el CSS lo deja como una tira desplazable).
 */
export function useMarquee(viewportRef, trackRef, { speed = 0.7, boost = 0.28 } = {}) {
  const lenis = useLenis()

  useGSAP(
    () => {
      const track = trackRef.current
      if (!track) return
      const mm = gsap.matchMedia()

      mm.add(MQ_MOTION_OK, () => {
        const setX = gsap.quickSetter(track, 'x', 'px')
        let x = 0
        let half = track.scrollWidth / 2
        let visible = true

        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '200px' })
        io.observe(viewportRef.current)
        const ro = new ResizeObserver(() => (half = track.scrollWidth / 2))
        ro.observe(track)

        const tick = () => {
          if (!visible) return // fuera de pantalla no se calcula nada
          const v = lenis?.velocity ?? 0
          x -= speed + v * boost
          if (x <= -half) x += half
          if (x > 0) x -= half
          setX(x)
        }
        gsap.ticker.add(tick)
        return () => {
          gsap.ticker.remove(tick)
          io.disconnect()
          ro.disconnect()
          gsap.set(track, { x: 0 })
        }
      })
    },
    { scope: viewportRef, dependencies: [lenis] },
  )
}
