import { useEffect, useRef } from 'react'
import './AutoAnim.css'

/**
 * Mini interfaz animada para cada automatización (chat, factura, tablero, calendario, inventario, gráfico).
 * Todo con la Web Animations API sobre transform / opacity (+ alto de barras), en un ciclo de 7 s.
 *  • Fuera de pantalla las animaciones se pausan (IntersectionObserver).
 *  • Con prefers-reduced-motion no se anima: queda el estado final, visible.
 * Colores: variables del tema (--graphite, --paper, --gold).
 */
const T = 7000
const f = (ms) => Math.min(1, ms / T)
const HIDE = { opacity: 0 }

const TXT = {
  es: {
    chatIn: '¿Tienen turno?', chatOut: 'Sí, martes 10:30', chatLog: '✓ Registrado en tu CRM',
    inv: 'Factura 0042', rows: ['Web', 'Hosting', 'Flujo'], total: 'Total', remind: 'Recordatorio enviado', paid: 'PAGADO',
    cols: ['Nuevo', 'Contacto', 'Cliente'], who: 'Ana R.', what: 'Consulta web', closed: '✓ Cierre',
    month: 'Octubre', slot: '10:30 confirmada', rem24: 'Recordatorio 24 h',
    low: 'Stock bajo', order: 'Pedido enviado al proveedor', sent: 'Enviado el lunes',
  },
  en: {
    chatIn: 'Any slots?', chatOut: 'Yes, Tuesday 10:30', chatLog: '✓ Logged in your CRM',
    inv: 'Invoice 0042', rows: ['Website', 'Hosting', 'Workflow'], total: 'Total', remind: 'Reminder sent', paid: 'PAID',
    cols: ['New', 'Contact', 'Client'], who: 'Ana R.', what: 'Web enquiry', closed: '✓ Closed',
    month: 'October', slot: '10:30 confirmed', rem24: '24 h reminder',
    low: 'Low stock', order: 'Order sent to supplier', sent: 'Sent on Monday',
  },
}

/* Línea de tiempo genérica: steps = [[ms, {propiedades CSS}], …] */
function tl(el, steps, out) {
  const kf = steps.map(([ms, s]) => ({ ...s, offset: f(ms) }))
  if (kf[0].offset > 0) kf.unshift({ ...steps[0][1], offset: 0 })
  if (kf[kf.length - 1].offset < 1) kf.push({ ...steps[steps.length - 1][1], offset: 1 })
  out.push(el.animate(kf, { duration: T, iterations: Infinity, easing: 'linear' }))
}
/* Aparece en `s`, se queda hasta `e` y se desvanece */
function vis(el, s, e, out, sc = 1) {
  const h = { opacity: 0, transform: `translateY(6px) scale(${sc})` }
  const v = { opacity: 1, transform: 'none' }
  tl(el, [[0, h], [s, h], [s + 380, v], [e, v], [e + 300, h]], out)
}

function run(root, id, out) {
  const q = (s) => root.querySelector(s)
  const qa = (s) => [...root.querySelectorAll(s)]
  if (id === 'respuestas') {
    vis(q('.i'), 300, 6300, out)
    vis(q('.t'), 1500, 3000, out)
    vis(q('.o'), 3100, 6300, out)
    vis(q('.l'), 4300, 6300, out, 0.9)
  } else if (id === 'cobros') {
    ;[300, 600, 900, 1200].forEach((t, i) => vis(q('.r' + (i + 1)), t, 6300, out))
    vis(q('.c'), 2800, 6300, out)
    const s = { opacity: 0, transform: 'scale(2.4)' }
    const v = { opacity: 1, transform: 'scale(1)' }
    tl(q('.s'), [[0, s], [4300, s], [4700, v], [6300, v], [6600, { opacity: 0, transform: 'scale(1)' }]], out)
  } else if (id === 'clientes') {
    const h = (o, x) => ({ opacity: o, transform: `translateX(${x}cqw)` })
    tl(q('.k'), [[0, h(0, 0)], [300, h(0, 0)], [700, h(1, 0)], [1900, h(1, 0)], [2700, h(1, 32.5)], [3900, h(1, 32.5)], [4700, h(1, 65)], [6200, h(1, 65)], [6600, h(0, 65)]], out)
    vis(q('.ck'), 5000, 6300, out)
  } else if (id === 'reservas') {
    const off = { backgroundColor: 'color-mix(in srgb, var(--paper) 10%, transparent)', transform: 'scale(1)' }
    const on = { backgroundColor: 'var(--gold)', transform: 'scale(1)' }
    tl(q('.d9'), [[0, off], [1200, off], [1600, { ...on, transform: 'scale(1.25)' }], [2000, on], [6200, on], [6700, off]], out)
    vis(q('.c1'), 2500, 6300, out)
    vis(q('.c2'), 4300, 6300, out)
  } else if (id === 'stock') {
    const hi = { height: '85%', backgroundColor: 'var(--gold)' }
    const lo = { height: '16%', backgroundColor: '#e0654f' }
    tl(q('.b1'), [[0, hi], [900, hi], [3200, lo], [6200, lo], [6700, hi]], out)
    vis(q('.c1'), 3300, 6300, out)
    vis(q('.c2'), 4900, 6300, out)
  } else if (id === 'reportes') {
    qa('.bar').forEach((b, i) => {
      const lo = { transform: 'scaleY(.04)' }
      tl(b, [[0, lo], [300 + i * 250, lo], [1000 + i * 250, { transform: 'scaleY(1)' }], [6200, { transform: 'scaleY(1)' }], [6700, lo]], out)
    })
    vis(q('.n'), 3000, 6300, out)
    vis(q('.c'), 4600, 6300, out)
  }
}

const Chip = ({ cls = '', style, children }) => (
  <div className={`aa-chip ${cls}`} style={style}>
    {children}
  </div>
)

export default function AutoAnim({ id, lang }) {
  const ref = useRef(null)
  const t = TXT[lang]

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = ref.current
    const anims = []
    run(root, id, anims)
    const io = new IntersectionObserver(([e]) => anims.forEach((a) => (e.isIntersecting ? a.play() : a.pause())))
    io.observe(root)
    return () => {
      io.disconnect()
      anims.forEach((a) => a.cancel())
    }
  }, [id, lang])

  let body = null
  if (id === 'respuestas')
    body = (
      <>
        <div className="aa-bub i" style={{ left: '8cqw', top: '13cqw', background: 'color-mix(in srgb, var(--paper) 16%, var(--graphite))' }}>{t.chatIn}</div>
        <div className="aa-typing t" style={{ right: '12cqw', top: '33cqw' }}><i /><i /><i /></div>
        <div className="aa-bub o" style={{ right: '8cqw', top: '30cqw', background: 'var(--gold)', color: 'var(--graphite)' }}>{t.chatOut}</div>
        <div className="aa-mono l" style={{ left: '8cqw', bottom: '9cqw', color: 'var(--gold)' }}>{t.chatLog}</div>
      </>
    )
  else if (id === 'cobros')
    body = (
      <>
        <div className="aa-inv">
          <div className="aa-mono" style={{ color: 'var(--gold-deep)' }}>{t.inv}</div>
          {['$390', '$40', '$150'].map((p, i) => (
            <div key={p} className={`aa-row r${i + 1}`}><span>{t.rows[i]}</span><b>{p}</b></div>
          ))}
          <div className="aa-row aa-row--tot r4"><span>{t.total}</span><b>$580</b></div>
        </div>
        <Chip cls="c" style={{ right: '5cqw', top: '14cqw' }}>{t.remind}</Chip>
        <div className="aa-stampwrap"><div className="aa-stamp s">{t.paid}</div></div>
      </>
    )
  else if (id === 'clientes')
    body = (
      <>
        {t.cols.map((c, i) => (
          <div key={c}>
            <div className="aa-mono aa-colh" style={{ left: `${6 + i * 31}cqw` }}>{c}</div>
            <div className="aa-col" style={{ left: `${4 + i * 32.5}cqw` }} />
          </div>
        ))}
        <div className="aa-kc k" style={{ left: '6cqw', top: '19cqw' }}><b>{t.who}</b><br />{t.what}</div>
        <div className="aa-mono ck" style={{ left: '70cqw', top: '40cqw', color: 'var(--gold)' }}>{t.closed}</div>
      </>
    )
  else if (id === 'reservas')
    body = (
      <>
        <div className="aa-mono" style={{ left: '7cqw', top: '8cqw', opacity: 0.7 }}>{t.month}</div>
        <div className="aa-cal">
          {Array.from({ length: 14 }, (_, i) => (
            <i key={i} className={`aa-cell d${i}`} style={{ left: `${(i % 7) * 12.3}cqw`, top: `${Math.floor(i / 7) * 11}cqw` }} />
          ))}
        </div>
        <Chip cls="c1" style={{ left: '7cqw', bottom: '14cqw' }}>{t.slot}</Chip>
        <Chip cls="c2" style={{ left: '7cqw', bottom: '5cqw', background: 'var(--paper)' }}>{t.rem24}</Chip>
      </>
    )
  else if (id === 'stock')
    body = (
      <>
        <div className="aa-bars">
          {[62, 85, 55, 72].map((h, i) => (
            <i key={i} className={`aa-br b${i}`} style={{ left: `${i * 20 + 4}cqw`, height: `${h}%`, background: i === 1 ? 'var(--gold)' : 'color-mix(in srgb, var(--paper) 55%, transparent)' }} />
          ))}
        </div>
        <Chip cls="c1" style={{ left: '10cqw', bottom: '13cqw', background: '#e0654f', color: '#fff' }}>{t.low}</Chip>
        <Chip cls="c2" style={{ left: '10cqw', bottom: '4.5cqw', background: 'var(--paper)' }}>{t.order}</Chip>
      </>
    )
  else if (id === 'reportes')
    body = (
      <>
        <div className="aa-bars aa-bars--rep">
          {[35, 48, 42, 66, 78, 95].map((h, i) => (
            <i key={i} className="aa-br bar" style={{ left: `${i * 10.4}cqw`, width: '7.4cqw', height: `${h}%`, transformOrigin: 'bottom', background: i === 5 ? 'var(--gold)' : 'color-mix(in srgb, var(--paper) 60%, transparent)' }} />
          ))}
        </div>
        <div className="aa-big n">+24%</div>
        <Chip cls="c" style={{ right: '8cqw', bottom: '9cqw', background: 'var(--paper)' }}>{t.sent}</Chip>
      </>
    )

  return (
    <div className="aa" ref={ref} aria-hidden="true">
      {body}
    </div>
  )
}
