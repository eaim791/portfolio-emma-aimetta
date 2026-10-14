import { gsap, SplitText } from './gsap'

/**
 * Revelado por líneas con máscara (el texto "sube" desde una línea recortada).
 * `autoSplit` vuelve a partir el texto al cambiar el ancho o al cargar la fuente,
 * así las líneas siempre coinciden con lo que se ve.
 */
export function splitReveal(el, { scrollTrigger, delay = 0, stagger = 0.09, duration = 1.15 } = {}) {
  let played = false
  return SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    onSplit(self) {
      el.classList.add('is-split') // base.css lo oculta hasta este momento (sin parpadeo)
      if (played) return // re-split tras resize: el texto ya se mostró, no repetir
      return gsap.from(self.lines, {
        yPercent: 115,
        duration,
        delay,
        stagger,
        ease: 'power4.out',
        scrollTrigger: scrollTrigger && { ...scrollTrigger },
        onStart: () => {
          played = true
        },
      })
    },
  })
}

/** Frase que se "enciende" palabra a palabra al hacer scroll (scrub, solo opacidad). */
export function wordsScrub(el) {
  return SplitText.create(el, {
    type: 'words',
    autoSplit: true,
    onSplit(self) {
      el.classList.add('is-split')
      return gsap.fromTo(
        self.words,
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: true },
        },
      )
    },
  })
}

/** Entrada suave (sube + aparece) para bloques sueltos. */
export function fadeUp(el) {
  return gsap.from(el, {
    y: 36,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
  })
}
