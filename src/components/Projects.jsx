import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, scroller, MQ_HORIZONTAL } from '../lib/gsap'
import { useLang } from '../lib/i18n'
import { useSection } from '../hooks/useSection'
import { useNav } from '../lib/nav'
import { useLenis } from './SmoothScroll'
import Placeholder from './Placeholder'
import './Projects.css'

const pad = (n) => String(n).padStart(2, '0')

/**
 * Galería con scroll horizontal "pinned":
 *  el bloque se fija al llegar arriba, el scroll vertical del usuario se convierte en
 *  desplazamiento horizontal del carril, y al terminar la página sigue hacia abajo.
 *
 * < 900 px o prefers-reduced-motion → no hay pin: las tarjetas se apilan en vertical
 * (mismo DOM, otro layout por CSS) para que sea usable en móvil y sin marear.
 */
export default function Projects() {
  const { t } = useLang()
  const { navigate } = useNav()
  const lenis = useLenis()
  const root = useRef(null)
  const pin = useRef(null)
  const track = useRef(null)
  const bar = useRef(null)
  const counter = useRef(null)
  const travelRef = useRef(null) // tween horizontal activo (null cuando el layout es vertical)

  const items = t.projects.items

  // ⚠ Orden: primero el pin, luego useSection → el trigger de tema de la sección se mide
  // ya con el espaciador del pin aplicado.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MQ_HORIZONTAL, () => {
        const trackEl = track.current
        const distance = () => Math.max(0, trackEl.scrollWidth - pin.current.clientWidth)
        let current = 0

        const travel = gsap.to(trackEl, {
          x: () => -distance(),
          ease: 'none', // imprescindible para que containerAnimation quede sincronizado
          scrollTrigger: {
            trigger: pin.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            pinType: 'fixed', // #scroller no lleva transform → fixed es más suave que el pin por transform
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true, // recalcula la distancia al redimensionar / cargar fuentes
            onUpdate(self) {
              bar.current.style.transform = `scaleX(${self.progress})`
              const idx = Math.min(items.length - 1, Math.round(self.progress * (items.length - 1)))
              if (idx !== current) {
                current = idx
                counter.current.textContent = pad(idx + 1)
              }
            },
          },
        })
        travelRef.current = travel

        // Parallax interno: cada imagen se desliza a contramarcha de su tarjeta.
        trackEl.querySelectorAll('[data-parallax]').forEach((el) => {
          gsap.fromTo(
            el,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: 'none',
              scrollTrigger: {
                trigger: el.closest('.project'),
                containerAnimation: travel,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          )
        })

        /* Foco central: la tarjeta que pasa por el centro de la pantalla crece y se ve nítida; las de los lados se
           achican y se apagan un poco. Solo `scale` y `opacity` (compositor) y solo mientras la galería está en pantalla.
           Se usa la propiedad CSS `scale` (independiente de `transform`) para no pisar el escalonado vertical de las tarjetas. */
        const cards = gsap.utils.toArray('.project', trackEl)
        let onScreen = false
        const watch = ScrollTrigger.create({
          trigger: pin.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (onScreen = self.isActive),
        })
        const tick = () => {
          if (!onScreen) return
          const half = pin.current.clientWidth / 2
          const rects = cards.map((c) => c.getBoundingClientRect()) // primero se lee todo…
          cards.forEach((c, i) => {
            // …y luego se escribe todo (evita relayouts intercalados)
            const d = Math.abs((rects[i].left + rects[i].width / 2 - half) / half)
            const a = Math.min(Math.max(d - 0.15, 0) / 0.85, 1) // 0 en la zona central, 1 en los bordes
            c.style.scale = (1 - 0.14 * a).toFixed(3)
            c.style.opacity = (1 - 0.55 * a).toFixed(3)
          })
        }
        gsap.ticker.add(tick)

        return () => {
          gsap.ticker.remove(tick)
          watch.kill()
          cards.forEach((c) => {
            c.style.scale = ''
            c.style.opacity = ''
          })
          travelRef.current = null
        }
      })
    },
    { scope: root },
  )

  useSection(root, { theme: 'paper' })

  // Accesibilidad: si una tarjeta recibe foco con teclado estando fuera de pantalla,
  // llevamos el scroll vertical al punto que la deja visible.
  const revealOnFocus = (e) => {
    const st = travelRef.current?.scrollTrigger
    if (!st) return
    const card = e.currentTarget
    const dist = -gsap.getProperty(track.current, 'x') // px ya recorridos
    const total = track.current.scrollWidth - pin.current.clientWidth
    const wanted = gsap.utils.clamp(0, total, card.offsetLeft - pin.current.clientWidth * 0.08)
    if (Math.abs(wanted - dist) < 1) return
    const y = st.start + (wanted / total) * (st.end - st.start)
    if (lenis) lenis.scrollTo(y, { immediate: false })
    else scroller.scrollTo({ top: y })
  }

  return (
    <section id="work" className="projects" ref={root}>
      <div className="projects__pin" ref={pin}>
        <div className="projects__bar mono">
          <span className="eyebrow">02 — {t.projects.label}</span>
          <span className="projects__counter" aria-hidden="true">
            {t.projects.counterLabel} <b ref={counter}>01</b> / {pad(items.length)}
          </span>
        </div>

        <div className="projects__viewport">
          <div className="projects__track" ref={track}>
            <div className="projects__intro">
              <h2 className="projects__title display" data-split>
                {t.projects.title.split(/\n/).map((l, i, a) => (
                  <span key={l} className={i === a.length - 1 ? 'it' : undefined}>{l}</span>
                ))}
              </h2>
              <p className="projects__note mono" data-reveal>
                {t.projects.note} <span aria-hidden="true">→</span>
              </p>
              <a
                className="btn projects__all"
                href="#/proyectos"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('projects')
                }}
              >
                {t.projects.all} <span aria-hidden="true">↗</span>
              </a>
            </div>

            {items.map((p, i) => {
              const Tag = p.url ? 'a' : 'article'
              const linkProps = p.url ? { href: p.url, target: '_blank', rel: 'noreferrer' } : {}
              return (
                <Tag
                  key={p.id}
                  className={`project${p.ratio ? ' project--ratio' : ''}`}
                  style={{ '--w': p.width, ...(p.ratio ? { '--ar': p.ratio } : {}) }}
                  data-cursor="view"
                  data-cursor-label={p.soon ? t.projects.soonCursor : t.projects.view}
                  onFocus={revealOnFocus}
                  {...linkProps}
                >
                  <div className="project__media">
                    {/* IMAGEN DEL PROYECTO — para reemplazar el bloque de color:
                        1) copia la foto a public/img/projects/  2) en src/data/content.js
                        pon  cover: './img/projects/xx-tu-proyecto.jpg'  en este proyecto
                        (y, si quieres que no se recorte, su proporción: ratio: ancho / alto).
                        El parallax solo se aplica a los marcadores de color; las fotos reales se muestran enteras. */}
                    <Placeholder
                      className="project__img"
                      src={p.cover}
                      alt={`${p.title} — ${p.category}`}
                      color={p.color}
                      label={p.soon ? t.projects.soon : `IMG · ${pad(i + 1)}-${p.id}.jpg`}
                      {...(p.cover ? {} : { 'data-parallax': '' })}
                    />
                    <span className="project__view mono" aria-hidden="true">
                      {p.soon ? t.projects.soonCursor : t.projects.view}
                    </span>
                  </div>

                  <div className="project__info">
                    <span className="project__n mono">{pad(i + 1)}</span>
                    <div>
                      <h3 className="project__title">{p.title}</h3>
                      <p className="project__cat mono">{p.category}</p>
                    </div>
                    <span className="project__year mono">{p.soon ? '—' : p.year}</span>
                  </div>
                </Tag>
              )
            })}
          </div>
        </div>

        <div className="projects__progress" aria-hidden="true">
          <span ref={bar} className="projects__progress-fill" />
        </div>
      </div>
    </section>
  )
}
