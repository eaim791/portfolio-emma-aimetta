import { useEffect, useRef } from 'react'
import './Constellation.css'

const TAU = Math.PI * 2
const rnd = (a, b) => a + Math.random() * (b - a)
const FINE = '(hover: hover) and (pointer: fine)'

/**
 * Fondo animado "constelación": puntos que flotan y se unen con líneas finas; con el cursor cerca, los puntos se
 * acercan y se conectan con él. Se dibuja en un <canvas> que llena su contenedor (el padre debe ser position: relative).
 *
 *  • Rendimiento: densidad según el área (menos puntos en móvil), DPR máx. 2, y no se calcula nada cuando el
 *    contenedor está fuera de pantalla (IntersectionObserver) o la pestaña está oculta.
 *  • Con prefers-reduced-motion se dibuja un solo cuadro estático.
 */
export default function Constellation() {
  const ref = useRef(null)

  useEffect(() => {
    const cv = ref.current
    const host = cv.parentElement
    const ctx = cv.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia(FINE).matches
    let W = 0
    let H = 0
    let pts = []
    let raf = 0
    let visible = true
    const m = { x: 0, y: 0, on: false }

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = host.clientWidth
      H = host.clientHeight
      cv.width = W * dpr
      cv.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.round(Math.min(85, Math.max(26, (W * H) / 16000)))
      pts = Array.from({ length: n }, () => ({ x: rnd(0, W), y: rnd(0, H), vx: rnd(-0.22, 0.22), vy: rnd(-0.22, 0.22) }))
      if (reduce) draw()
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const L = Math.min(W * 0.14, 190) // distancia máxima para unir dos puntos
      const LM = L * 1.35 // alcance del cursor
      for (const p of pts) {
        if (!reduce) {
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0 || p.x > W) p.vx *= -1
          if (p.y < 0 || p.y > H) p.vy *= -1
          if (m.on) {
            const dx = m.x - p.x
            const dy = m.y - p.y
            const d = Math.hypot(dx, dy)
            if (d < LM && d > 1) {
              p.x += (dx / d) * 0.35
              p.y += (dy / d) * 0.35
            }
          }
        }
      }
      ctx.lineWidth = 1
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < L) {
            ctx.strokeStyle = `rgba(143,79,46,${(1 - d / L) * 0.5})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
        if (m.on) {
          const d = Math.hypot(a.x - m.x, a.y - m.y)
          if (d < LM) {
            ctx.strokeStyle = `rgba(35,28,22,${(1 - d / LM) * 0.55})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(m.x, m.y)
            ctx.stroke()
          }
        }
        ctx.fillStyle = 'rgba(35,28,22,.62)'
        ctx.beginPath()
        ctx.arc(a.x, a.y, 1.7, 0, TAU)
        ctx.fill()
      }
    }

    const loop = () => {
      if (visible && !document.hidden) draw()
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e) => {
      const r = host.getBoundingClientRect()
      m.x = e.clientX - r.left
      m.y = e.clientY - r.top
      m.on = true
    }
    const onLeave = () => (m.on = false)

    const ro = new ResizeObserver(fit)
    ro.observe(host)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(host)
    fit()
    if (!reduce) {
      raf = requestAnimationFrame(loop)
      if (fine) {
        host.addEventListener('pointermove', onMove)
        host.addEventListener('pointerleave', onLeave)
      }
    }
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas className="constellation" ref={ref} aria-hidden="true" />
}
