import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP, MQ_MOTION_OK } from '../lib/gsap'
import { useLang } from '../lib/i18n'
import { useNav } from '../lib/nav'
import { site } from '../data/content'
import { projectKinds, projectsUi } from '../data/projectsPage'
import { useSection } from '../hooks/useSection'
import { useMagnetic } from '../hooks/useMagnetic'
import { useMarquee } from '../hooks/useMarquee'
import { useTilt } from '../hooks/useTilt'
import { useScrollTo } from './SmoothScroll'
import Constellation from './Constellation'
import LangSwitch from './LangSwitch'
import './ProjectsPage.css'

const pad = (n) => String(n).padStart(2, '0')
const lines = (t) =>
  t.split(/\n/).map((l, i, a) => (
    <span key={l} className={i === a.length - 1 ? 'it' : undefined}>
      {l}
    </span>
  ))

/* ── Portada: título + cinta con los nombres de los proyectos ── */
function Intro({ ui, names }) {
  const root = useRef(null)
  const viewport = useRef(null)
  const track = useRef(null)
  useSection(root, { theme: 'paper' })
  useMarquee(viewport, track, { speed: 0.5, boost: 0.2 })
  const loop = [...names, ...names]

  return (
    <section className="pp-intro" ref={root}>
      <Constellation />
      <div className="pp-intro__top">
        <p className="mono eyebrow" data-reveal>
          {ui.eyebrow}
        </p>
        <h1 className="pp-intro__title display" data-split="chars">
          {lines(ui.title)}
        </h1>
        <p className="pp-intro__lead" data-reveal>
          {ui.lead}
        </p>
      </div>
      <div className="pp-strip" role="group" aria-label={`${ui.marqueeLabel}: ${names.join(', ')}`} data-reveal>
        <div className="pp-strip__viewport" ref={viewport} aria-hidden="true">
          <div className="pp-strip__track" ref={track}>
            {loop.map((n, i) => (
              <span className="pp-strip__item display it" key={`${n}-${i}`}>
                {n}
                <i />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Destacado: AIGO a todo el ancho (banda oscura) ── */
function Feature({ ui, item }) {
  const root = useRef(null)
  const img = useRef(null)
  useSection(root, { theme: 'ink' })

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ_MOTION_OK, () => {
        gsap.fromTo(
          img.current,
          { yPercent: -5 },
          { yPercent: 5, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
    },
    { scope: root },
  )

  return (
    <section className="pp-feature" ref={root}>
      <div className="pp-feature__copy">
        <p className="mono eyebrow" data-reveal>
          {ui.featureEyebrow}
        </p>
        <h2 className="pp-feature__title display" aria-label={item.title} data-split="chars">
          <span>{ui.featureTitle[0]}</span>
          <span className="it">{ui.featureTitle[1]}</span>
        </h2>
        <p className="pp-feature__text" data-reveal>
          {ui.featureText}
        </p>
        <p className="mono pp-feature__tag" data-reveal>
          <i aria-hidden="true" /> {ui.featureTag}
        </p>
        <p className="mono pp-feature__note" data-reveal>
          {ui.featureNote}
        </p>
      </div>
      <figure className="pp-feature__media" data-cursor="view" data-cursor-label={ui.privateTag}>
        <img ref={img} src={item.cover} alt={`${item.title} — ${item.category}`} loading="lazy" decoding="async" />
        <span className="pp-feature__shine" aria-hidden="true" />
      </figure>
    </section>
  )
}

/* ── Tarjeta de la cuadrícula ── */
function Card({ p, n, ui }) {
  const ref = useRef(null)
  useTilt(ref, { max: 3 })
  const Tag = p.url ? 'a' : 'article'
  const link = p.url ? { href: p.url, target: '_blank', rel: 'noreferrer' } : {}

  return (
    <Tag
      ref={ref}
      className="pp-card"
      data-kind={p.kind}
      data-cursor="view"
      data-cursor-label={p.url ? ui.open : ui.privateTag}
      {...link}
    >
      <div className="pp-card__media">
        {p.cover ? (
          <img src={p.cover} alt={`${p.title} — ${p.category}`} loading="lazy" decoding="async" />
        ) : (
          <div className="pp-card__ph" style={{ background: p.color }} />
        )}
        <span className="pp-card__badge mono">{p.url ? ui.liveTag : ui.privateTag}</span>
        <span className="pp-card__go mono" aria-hidden="true">
          {p.url ? `${ui.open} ↗` : '·'}
        </span>
      </div>
      <div className="pp-card__info">
        <span className="mono pp-card__n">{pad(n)}</span>
        <div>
          <h3 className="pp-card__title display">{p.title}</h3>
          <p className="mono pp-card__cat">{p.category}</p>
        </div>
        <span className="mono pp-card__year">{p.year || '—'}</span>
      </div>
    </Tag>
  )
}

/* ── Filtros + cuadrícula ── */
function Grid({ ui, items }) {
  const root = useRef(null)
  const grid = useRef(null)
  const [filter, setFilter] = useState('all')
  const first = useRef(true)
  useSection(root, { theme: 'paper' })

  const kinds = ['all', ...new Set(items.map((p) => p.kind))].filter((k) => ui.filters[k])

  useGSAP(
    () => {
      const cards = gsap.utils.toArray('.pp-card', grid.current)
      const mm = gsap.matchMedia()
      mm.add(MQ_MOTION_OK, () => {
        ScrollTrigger.batch(cards, {
          start: 'top 90%',
          once: true,
          onEnter: (b) => gsap.fromTo(b, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.12, overwrite: true }),
        })
        gsap.set(cards, { opacity: 0, y: 48 })
      })
    },
    { scope: root },
  )

  // Filtro: los que no coinciden se desvanecen y salen del flujo; los demás se recolocan con un fundido.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const cards = gsap.utils.toArray('.pp-card', grid.current)
    const show = cards.filter((c) => filter === 'all' || c.dataset.kind === filter)
    const hide = cards.filter((c) => !show.includes(c))
    gsap.killTweensOf(cards)
    gsap.to(hide, {
      opacity: 0,
      scale: 0.96,
      duration: 0.25,
      onComplete: () => {
        hide.forEach((c) => (c.hidden = true))
        show.forEach((c) => (c.hidden = false))
        gsap.fromTo(show, { opacity: 0, y: 28, scale: 1 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08, clearProps: 'scale' })
        ScrollTrigger.refresh()
      },
    })
    if (!hide.length) {
      show.forEach((c) => (c.hidden = false))
      gsap.fromTo(show, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 })
    }
  }, [filter])

  return (
    <section className="pp-grid" ref={root}>
      <div className="pp-filters" role="group" aria-label={ui.filtersLabel} data-reveal>
        {kinds.map((k) => (
          <button key={k} type="button" className="pp-chip mono" aria-pressed={filter === k} onClick={() => setFilter(k)}>
            {ui.filters[k]}
          </button>
        ))}
      </div>
      <div className="pp-grid__list" ref={grid}>
        {items.map((p, i) => (
          <Card key={p.id} p={p} n={i + 1} ui={ui} />
        ))}
      </div>
    </section>
  )
}

/* ── Cierre ── */
function Closing({ ui }) {
  const root = useRef(null)
  const btn = useRef(null)
  const { navigate } = useNav()
  const scrollTo = useScrollTo()
  useSection(root, { theme: 'stone' })
  useMagnetic(btn, 0.2)

  return (
    <section className="pp-close" ref={root}>
      <h2 className="pp-close__title display" data-split>
        {ui.closeTitle}
      </h2>
      <p className="pp-close__text" data-reveal>
        {ui.closeText}
      </p>
      <a
        ref={btn}
        className="btn btn--solid"
        href={`mailto:${site.email}?subject=${encodeURIComponent(ui.subject)}`}
        data-reveal
        data-cursor-tone="light"
      >
        {ui.closeButton} <span className="btn__arrow" aria-hidden="true">↗</span>
      </a>
      <footer className="pp-foot mono">
        <button type="button" onClick={() => navigate('home')}>
          ← {ui.back}
        </button>
        <LangSwitch />
        <button type="button" onClick={() => scrollTo(0)}>
          ↑
        </button>
      </footer>
    </section>
  )
}

export default function ProjectsPage() {
  const { lang, t } = useLang()
  const ui = projectsUi[lang]

  const all = t.projects.items.filter((p) => projectKinds[p.id]).map((p) => ({ ...p, ...projectKinds[p.id] }))
  const feature = all.find((p) => p.feature)
  const list = all.filter((p) => !p.feature)

  return (
    <>
      <Intro ui={ui} names={all.map((p) => p.title)} />
      {feature && <Feature ui={ui} item={feature} />}
      <Grid ui={ui} items={list} />
      <Closing ui={ui} />
    </>
  )
}
