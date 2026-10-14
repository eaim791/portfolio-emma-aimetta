import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, scroller, MQ_MOTION_OK } from '../lib/gsap'

const LenisContext = createContext(null)

/**
 * Contenedor principal Lenis + GSAP.
 *
 *  • Lenis NO tiene su propio requestAnimationFrame (autoRaf: false): lo conduce el
 *    ticker de GSAP → un solo bucle de animación para todo (scroll + tweens) = 60 fps estables.
 *  • Cada tick de scroll de Lenis llama a ScrollTrigger.update → pin y scrub van sincronizados.
 *  • lagSmoothing(0): evita que GSAP "salte" tiempo tras un frame largo, lo que desincroniza Lenis.
 *  • Lenis scrollea `#scroller` (wrapper) de forma nativa (scrollTop), así que la barra
 *    IZQUIERDA (scroll-left.css) sigue siendo la barra real: se arrastra y refleja la posición.
 *  • Con prefers-reduced-motion no se crea Lenis: queda el scroll nativo, sin suavizado.
 */
export function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null)

  useEffect(() => {
    if (!window.matchMedia(MQ_MOTION_OK).matches) return

    const instance = new Lenis({
      wrapper: scroller, // el contenedor con la barra izquierda, no window
      content: scroller.firstElementChild,
      autoRaf: false,
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
    })

    const onScroll = () => ScrollTrigger.update()
    const tick = (time) => instance.raf(time * 1000)

    instance.on('scroll', onScroll)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)

    return () => {
      gsap.ticker.remove(tick)
      instance.off('scroll', onScroll)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export const useLenis = () => useContext(LenisContext)

/** Devuelve scrollTo(target|número, opciones) que usa Lenis si existe y el scroll nativo si no. */
export function useScrollTo() {
  const lenis = useLenis()
  return useCallback(
    (target, options = {}) => {
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4), ...options })
      } else if (typeof target === 'number') {
        scroller.scrollTo({ top: target, behavior: options.immediate ? 'auto' : 'smooth' })
      } else {
        const el = typeof target === 'string' ? document.querySelector(target) : target
        el?.scrollIntoView({ behavior: options.immediate ? 'auto' : 'smooth' })
      }
    },
    [lenis],
  )
}
