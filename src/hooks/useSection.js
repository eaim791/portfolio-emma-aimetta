import { gsap, ScrollTrigger, useGSAP, MQ_MOTION_OK } from '../lib/gsap'
import { splitReveal, wordsScrub, fadeUp } from '../lib/reveal'

const setHeaderTheme = (theme) => {
  document.documentElement.dataset.header = theme
}

/**
 * Comportamiento común de cada sección:
 *  1. `theme`: cuando la sección está bajo el header, este cambia de color (paper | clay | ink).
 *  2. Revelados declarativos por atributo, solo si el usuario acepta movimiento:
 *       [data-split]   → texto por líneas con máscara
 *       [data-words]   → frase que se enciende palabra a palabra (scrub)
 *       [data-reveal]  → entrada suave de un bloque
 *       [data-parallax-y] → parallax vertical (transform) de imágenes
 *
 * Solo se activa la clase de tema al ENTRAR en la sección, así un cálculo de pin
 * desfasado nunca deja al header sin color.
 */
export function useSection(scope, { theme, reveals = true } = {}) {
  useGSAP(
    () => {
      const root = scope.current
      if (!root) return

      if (theme) {
        root.dataset.theme = theme // lo lee el cursor para elegir su color según la sección bajo el puntero
        ScrollTrigger.create({
          trigger: root,
          start: 'top 64px',
          end: 'bottom 64px',
          onToggle: (self) => self.isActive && setHeaderTheme(theme),
        })
      }

      if (!reveals) return

      const mm = gsap.matchMedia()
      mm.add(MQ_MOTION_OK, () => {
        root.querySelectorAll('[data-split]').forEach((el) =>
          splitReveal(el, { scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
        )
        root.querySelectorAll('[data-words]').forEach(wordsScrub)
        root.querySelectorAll('[data-reveal]').forEach(fadeUp)

        // Parallax vertical suave: data-parallax-y="6" → la capa se desplaza de −6 % a +6 % de su alto
        root.querySelectorAll('[data-parallax-y]').forEach((el) => {
          const amp = Number(el.dataset.parallaxY) || 5
          gsap.fromTo(
            el,
            { yPercent: -amp },
            {
              yPercent: amp,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })
      })
    },
    { scope },
  )
}
