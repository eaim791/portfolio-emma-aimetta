import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, scroller } from '../lib/gsap'
import { LOADER_REVEAL, markLoaderSeen } from '../lib/loader'
import { useLang } from '../lib/i18n'
import { useLenis } from './SmoothScroll'
import './Loader.css'

const MIN_MS = 1500 // tiempo mínimo de carga visible: evita el parpadeo en conexiones rápidas
const CAP_MS = 8000 // tope: si algo tarda más, se abre igual

/**
 * Pantalla de carga "Retrato que se revela" (opción C1).
 *
 *  1. Marfil a pantalla completa, contador 000 → 100 y, al centro, un marco terracota donde la
 *     foto aparece de abajo hacia arriba según el progreso.
 *  2. Progreso: sube solo hasta ~90 % y llega a 100 % cuando de verdad están listas las fuentes y
 *     la foto (con un mínimo de 1,5 s y un tope de 8 s).
 *  3. Salida: el marco vuela y crece hasta ocupar EXACTAMENTE el sitio de la foto del hero
 *     (FLIP con transform), el marfil se disuelve y el hero anima su texto.
 *
 * Se decide en index.html (clase `is-loading` en <html>): solo primera visita de la sesión y nunca
 * con prefers-reduced-motion. Para verlo siempre: añade `?loader` a la URL.
 */
export default function Loader() {
  const { t } = useLang()
  const lenis = useLenis()
  const lenisRef = useRef(null)
  lenisRef.current = lenis

  const [show, setShow] = useState(() => document.documentElement.classList.contains('is-loading'))

  const bg = useRef(null)
  const fades = useRef(null)
  const num = useRef(null)
  const frame = useRef(null)
  const img = useRef(null)

  // El scroll suave no debe correr detrás del loader.
  useEffect(() => {
    if (show) lenis?.stop()
  }, [show, lenis])

  useLayoutEffect(() => {
    if (!show) return

    const html = document.documentElement
    const state = { p: 0 }
    let dead = false
    let exiting = false
    scroller.scrollTop = 0

    const heroRect = () => document.querySelector('.hero__photo')?.getBoundingClientRect()

    // Marco = mismo tamaño que la foto del hero, reducido y centrado (escala hacia abajo → nítido al final).
    const layout = () => {
      const r = heroRect()
      if (!r || !frame.current) return
      const w0 = Math.max(140, Math.min(window.innerWidth * 0.26, r.width * 0.72))
      const s0 = w0 / r.width
      gsap.set(frame.current, {
        width: r.width,
        height: r.height,
        transformOrigin: '0 0',
        scale: s0,
        x: window.innerWidth / 2 - w0 / 2,
        y: window.innerHeight * 0.47 - (r.height * s0) / 2,
      })
    }

    const render = () => {
      if (!num.current || !img.current) return // el componente ya se desmontó (los refs son null)
      num.current.textContent = String(Math.round(state.p * 100)).padStart(3, '0')
      img.current.style.clipPath = `inset(${(1 - state.p) * 100}% 0 0 0)`
    }

    const done = () => {
      html.classList.remove('is-loading')
      markLoaderSeen()
      lenisRef.current?.start()
      setShow(false)
    }

    const exit = () => {
      exiting = true
      const r = heroRect()
      if (!r) return done()
      gsap
        .timeline({ defaults: { ease: 'power4.inOut' }, onComplete: done })
        .to(fades.current, { opacity: 0, duration: 0.35, ease: 'power2.out' }, 0.05)
        .to(frame.current, { x: r.left, y: r.top, scale: 1, duration: 1.25 }, 0.15)
        .to(bg.current, { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, 0.5)
        .call(() => window.dispatchEvent(new Event(LOADER_REVEAL)), null, 0.85)
    }

    const finish = () => {
      if (dead || exiting) return
      gsap.to(state, { p: 1, duration: 0.4, ease: 'power1.inOut', overwrite: true, onUpdate: render, onComplete: exit })
    }

    const onResize = () => !exiting && layout()

    const ctx = gsap.context(() => {
      layout()
      render()
      gsap.fromTo(fades.current, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.1 })
      // Progreso "de cortesía" hasta 90 %; el 10 % final lo da la carga real.
      gsap.to(state, { p: 0.9, duration: 1.5, ease: 'power2.out', onUpdate: render })
    })

    const fontsReady = Promise.all([
      document.fonts?.load('1em "Instrument Serif"'),
      document.fonts?.load('italic 1em "Instrument Serif"'),
      document.fonts?.ready,
    ]).catch(() => {})
    const photoReady = img.current?.decode ? img.current.decode().catch(() => {}) : Promise.resolve()
    const minTime = new Promise((resolve) => setTimeout(resolve, MIN_MS))
    const cap = new Promise((resolve) => setTimeout(resolve, CAP_MS))

    Promise.race([Promise.all([fontsReady, photoReady, minTime]), cap]).then(finish)

    window.addEventListener('resize', onResize)
    return () => {
      dead = true
      window.removeEventListener('resize', onResize)
      ctx.kill() // no revert: al desmontar los refs ya son null y no hay nada que restaurar
    }
  }, [show])

  if (!show) return null

  return (
    <div className="loader" role="status">
      <span className="sr-only">{t.loader.label}</span>

      <div className="loader__bg" ref={bg} aria-hidden="true" />

      <div className="loader__fades" ref={fades} aria-hidden="true">
        <p className="loader__name mono">Emma Aimetta</p>
        <p className="loader__meta mono">Portfolio 2026</p>
        <p className="loader__count" ref={num}>
          000
        </p>
      </div>

      {/* Misma foto del hero (./img/home-emma.jpg): ya está en caché, así que también sirve de "carga real". */}
      <div className="loader__frame" ref={frame} aria-hidden="true">
        <img ref={img} src="./img/home-emma.jpg" alt="" decoding="async" />
      </div>
    </div>
  )
}
