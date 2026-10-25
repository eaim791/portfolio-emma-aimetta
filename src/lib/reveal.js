import { gsap, SplitText } from './gsap'

/**
 * Revelado por líneas con máscara (el texto "sube" desde una línea recortada).
 * `autoSplit` vuelve a partir el texto al cambiar el ancho o al cargar la fuente,
 * así las líneas siempre coinciden con lo que se ve.
 */
export function splitReveal(el, { scrollTrigger, delay = 0, stagger, duration = 1.15, chars = el.dataset.split === 'chars' } = {}) {
  let played = false
  return SplitText.create(el, {
    type: chars ? 'lines,chars' : 'lines',
    mask: 'lines',
    linesClass: 'split-line', // la máscara hereda 'split-line-mask' (ver base.css)
    autoSplit: true,
    onSplit(self) {
      el.classList.add('is-split') // base.css lo oculta hasta este momento (sin parpadeo)
      if (played) return // re-split tras resize: el texto ya se mostró, no repetir
      return gsap.from(chars ? self.chars : self.lines, {
        yPercent: 140, // > 100 % + el relleno de la máscara, para que la línea parta totalmente oculta
        duration,
        delay,
        stagger: stagger ?? (chars ? 0.028 : 0.09),
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

/**
 * Revelado de imagen: la ventana se abre (clip-path) mientras la foto "se asienta" de 1.18× a 1×.
 * `data-img-reveal="up"` abre de abajo hacia arriba; por defecto, de arriba hacia abajo.
 * La foto termina a 1× exacto: no queda recortada.
 */
export function imgReveal(el) {
  const up = el.dataset.imgReveal === 'up'
  const from = up ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)'
  const media = el.querySelector('img, .ph')
  const st = { trigger: el, start: 'top 88%', once: true }
  gsap.fromTo(el, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power4.inOut', scrollTrigger: st })
  if (media) gsap.fromTo(media, { scale: 1.18 }, { scale: 1, duration: 2, ease: 'power3.out', scrollTrigger: st })
}
