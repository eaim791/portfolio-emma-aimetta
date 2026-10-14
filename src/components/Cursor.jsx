import { useEffect, useRef } from 'react'
import { gsap, MQ_MOTION_OK } from '../lib/gsap'
import './Cursor.css'

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const INTERACTIVE = 'a, button, [role="button"], summary, input, textarea, select, [data-cursor="link"]'

/**
 * Cursor propio: un punto que sigue al puntero al instante + un anillo fino con inercia.
 *  • Sobre enlaces/botones el anillo crece; sobre un proyecto [data-cursor="view"] se rellena
 *    y muestra la etiqueta de `data-cursor-label`.
 *  • Cambia de color (tinta / marfil) según la sección que tiene debajo ([data-theme]).
 *  • Solo con puntero fino (ratón/trackpad): en táctil no existe y el cursor del sistema no se toca.
 *  • Rendimiento: solo transform. Las posiciones usan gsap.quickTo (un tween reutilizado, sin
 *    basura por frame) y la lectura de estado (elementFromPoint) va limitada a ~15 Hz.
 */
export default function Cursor() {
  const root = useRef(null)
  const ring = useRef(null)
  const dot = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    if (!window.matchMedia(FINE_POINTER).matches) return

    const el = root.current
    const html = document.documentElement
    const instant = !window.matchMedia(MQ_MOTION_OK).matches // reduced-motion: sin inercia

    gsap.set([ring.current, dot.current], { xPercent: -50, yPercent: -50 })
    const ringX = gsap.quickTo(ring.current, 'x', { duration: instant ? 0 : 0.55, ease: 'power3' })
    const ringY = gsap.quickTo(ring.current, 'y', { duration: instant ? 0 : 0.55, ease: 'power3' })
    const dotX = gsap.quickTo(dot.current, 'x', { duration: instant ? 0 : 0.12, ease: 'power2' })
    const dotY = gsap.quickTo(dot.current, 'y', { duration: instant ? 0 : 0.12, ease: 'power2' })

    let x = -100
    let y = -100
    let visible = false
    let state = ''
    let tone = ''
    let labelText = ''
    let lastProbe = 0

    // Lee qué hay bajo el puntero: estado (link / view) y tono (claro / oscuro según la sección).
    const probe = () => {
      const hit = document.elementFromPoint(x, y)
      if (!hit) return

      const special = hit.closest('[data-cursor]')
      const next = special ? special.dataset.cursor : hit.closest(INTERACTIVE) ? 'link' : ''
      const nextLabel = special?.dataset.cursorLabel ?? ''
      if (next !== state) {
        state = next
        el.dataset.state = state
      }
      if (nextLabel !== labelText) {
        labelText = nextLabel
        label.current.textContent = labelText
      }

      // Tono: un elemento puede forzarlo (data-cursor-tone="light"), p. ej. un botón que se rellena de tinta
      // al pasar el cursor; si no, lo decide la sección de debajo (paper → oscuro, clay/ink → claro).
      const forced = hit.closest('[data-cursor-tone]')?.dataset.cursorTone
      const theme = hit.closest('[data-theme]')?.dataset.theme
      const nextTone = forced ?? (theme ? (theme === 'paper' ? 'dark' : 'light') : tone)
      if (nextTone && nextTone !== tone) {
        tone = nextTone
        el.dataset.tone = tone
      }
    }

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      if (!visible) {
        // primer movimiento: el anillo aparece EN el puntero, sin viajar desde la esquina
        gsap.set([ring.current, dot.current], { x, y })
        visible = true
        el.classList.add('is-visible')
      }
      ringX(x)
      ringY(y)
      dotX(x)
      dotY(y)

      const now = performance.now()
      if (now - lastProbe > 60) {
        lastProbe = now
        probe()
      }
    }

    // Con el puntero quieto y la página moviéndose (scroll) también hay que releer.
    const tick = () => {
      if (!visible) return
      const now = performance.now()
      if (now - lastProbe > 140) {
        lastProbe = now
        probe()
      }
    }

    const hide = () => {
      visible = false
      el.classList.remove('is-visible')
    }
    const down = () => el.classList.add('is-down')
    const up = () => el.classList.remove('is-down')

    html.classList.add('has-cursor')
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseleave', hide)
    window.addEventListener('blur', hide)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    gsap.ticker.add(tick)

    return () => {
      html.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseleave', hide)
      window.removeEventListener('blur', hide)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      gsap.ticker.remove(tick)
    }
  }, [])

  return (
    <div className="cursor" ref={root} data-tone="dark" aria-hidden="true">
      <div className="cursor__ring" ref={ring}>
        <span className="cursor__ringshape" />
        <span className="cursor__label mono" ref={label} />
      </div>
      <div className="cursor__dot" ref={dot}>
        <span className="cursor__dotshape" />
      </div>
    </div>
  )
}
