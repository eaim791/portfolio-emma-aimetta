import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

// Único punto donde se registran los plugins → el resto de la app importa desde aquí.
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

gsap.defaults({ ease: 'power3.out', duration: 1 })
ScrollTrigger.config({ ignoreMobileResize: true })

/** Contenedor que scrollea (su barra nativa queda a la izquierda; ver styles/scroll-left.css). */
export const scroller = document.getElementById('scroller')

// Todos los ScrollTrigger miden y escuchan a #scroller en vez de a window.
ScrollTrigger.defaults({ scroller })

export { gsap, ScrollTrigger, SplitText, useGSAP }

/** Misma query que usa el CSS para activar el scroll horizontal. Mantenerlas sincronizadas. */
export const MQ_HORIZONTAL = '(min-width: 900px) and (prefers-reduced-motion: no-preference)'
export const MQ_MOTION_OK = '(prefers-reduced-motion: no-preference)'
