import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP, MQ_MOTION_OK } from '../lib/gsap'
import { useLang } from '../lib/i18n'
import { useNav } from '../lib/nav'
import { site } from '../data/content'
import { templates, templateText, templatesUi, tiers } from '../data/templates'
import { autoFlows, autoText, autoTiers, autoPacks, combos, autoUi } from '../data/automations'
import { useSection } from '../hooks/useSection'
import { useMagnetic } from '../hooks/useMagnetic'
import { useMarquee } from '../hooks/useMarquee'
import { useTilt } from '../hooks/useTilt'
import { useScrollTo } from './SmoothScroll'
import TemplateMock from './TemplateMock'
import FlowMock from './FlowMock'
import AutoAnim from './AutoAnim'
import Constellation from './Constellation'
import LangSwitch from './LangSwitch'
import './TemplatesPage.css'

const mail = (subject) => `mailto:${site.email}?subject=${encodeURIComponent(subject)}`
const lines = (t) => t.split(/\n/).map((l) => <span key={l}>{l}</span>)

/* ── Portada: título + dos puertas (Webs / Automatizaciones) ──────────────────
   Las puertas comparten el ancho; la que tiene el cursor se abre (ver CSS). Cada una lleva a su capítulo. */
function Intro({ ui, a }) {
  const root = useRef(null)
  const scrollTo = useScrollTo()
  useSection(root, { theme: 'paper' })

  const go = (id) => (e) => {
    e.preventDefault()
    scrollTo(`#${id}`)
  }

  return (
    <section className="tp-intro" ref={root}>
      <Constellation />
      <div className="tp-intro__top">
        <p className="mono eyebrow" data-reveal>
          {ui.eyebrow}
        </p>
        <h1 className="tp-intro__title display" data-split="chars">
          {lines(ui.title)}
        </h1>
        <p className="tp-intro__lead" data-reveal>
          {ui.lead}
        </p>
      </div>

      <div className="doors" role="group" aria-label={a.doors.aria} data-reveal>
        <a className="door door--web" href="#webs" onClick={go('webs')} data-cursor-tone="dark">
          <span className="mono door__n">{a.doors.web.n}</span>
          <span className="door__t display">{a.doors.web.t}</span>
          <span className="door__d">{a.doors.web.d}</span>
          <span className="door__cta mono">
            {a.doors.web.cta} <i aria-hidden="true">→</i>
          </span>
          <span className="door__art door__art--web" aria-hidden="true">
            <b />
            <i />
            <i />
          </span>
        </a>
        <a className="door door--auto" href="#auto" onClick={go('auto')} data-cursor-tone="light">
          <span className="mono door__n">{a.doors.auto.n}</span>
          <span className="door__t display">{a.doors.auto.t}</span>
          <span className="door__d">{a.doors.auto.d}</span>
          <span className="door__cta mono">
            {a.doors.auto.cta} <i aria-hidden="true">→</i>
          </span>
          <span className="door__art door__art--auto" aria-hidden="true">
            <FlowMock steps={[]} />
          </span>
        </a>
      </div>

      <button type="button" className="tp-intro__combo mono" onClick={go('combo')}>
        {a.doors.combo} <span aria-hidden="true">↓</span>
      </button>
    </section>
  )
}

/* ── Índice lateral fijo: marca en qué capítulo estás y permite saltar ─────── */
function Rail({ a }) {
  const scrollTo = useScrollTo()
  const [active, setActive] = useState('webs')
  const [show, setShow] = useState(false)

  useGSAP(() => {
    const ts = a.rail.items.map((it) =>
      ScrollTrigger.create({ trigger: `#${it.id}`, start: 'top 55%', end: 'bottom 55%', onToggle: (self) => self.isActive && setActive(it.id) }),
    )
    ts.push(ScrollTrigger.create({ trigger: '#webs', start: 'top 75%', endTrigger: '#combo', end: 'bottom 35%', onToggle: (self) => setShow(self.isActive) }))
    return () => ts.forEach((t) => t.kill())
  }, [])

  return (
    <nav className={`rail${show ? ' is-on' : ''}`} aria-label={a.rail.aria}>
      <ul>
        {a.rail.items.map((it) => (
          <li key={it.id}>
            <button type="button" className={it.id === active ? 'is-active' : ''} aria-current={it.id === active ? 'true' : undefined} onClick={() => scrollTo(`#${it.id}`)}>
              <span className="rail__n mono">{it.n}</span>
              <span className="rail__l mono">{it.l}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ── Cabecera de capítulo ─────────────────────────────────────────────────── */
function ChapterHead({ theme, eyebrow, title, lead, num }) {
  const root = useRef(null)
  useSection(root, { theme })

  return (
    <section className={`tp-chap tp-chap--${theme}`} ref={root}>
      <span className="tp-chap__num display it" aria-hidden="true">
        {num}
      </span>
      <div className="tp-chap__body">
        <p className="mono eyebrow" data-reveal>
          {eyebrow}
        </p>
        <h2 className="tp-chap__title display" data-split>
          {lines(title)}
        </h2>
        <p className="tp-chap__lead" data-reveal>
          {lead}
        </p>
      </div>
    </section>
  )
}

/* ── Tarjeta de plantilla ─────────────────────────────────────────────────── */
function Card({ tpl, txt, ui, lang, hidden }) {
  const inner = useRef(null)
  useTilt(inner, { max: 3.5 })
  const href = mail(`${ui.requestSubject}: ${txt.name}`)

  return (
    <article className={`tcard tcard--item${hidden ? ' is-off' : ''}`} data-id={tpl.id}>
      <div className="tcard__inner" ref={inner}>
        <a className="tcard__media" href={href} data-cursor="view" data-cursor-label={ui.cursor} aria-label={`${ui.request}: ${txt.name}`}>
          <TemplateMock tpl={tpl} txt={txt} lang={lang} />
        </a>
        <div className="tcard__meta">
          <div>
            <p className="mono tcard__type">{txt.type}</p>
            <h3 className="tcard__name display">{txt.name}</h3>
          </div>
          <a className="tcard__cta mono" href={href}>
            {ui.request} <span aria-hidden="true">→</span>
          </a>
        </div>
        <ul className="tcard__tags mono">
          {txt.tags.map((tg) => (
            <li key={tg}>{tg}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}

/* ── Galería con filtro ───────────────────────────────────────────────────────
   Entrada inicial: un único ScrollTrigger.batch. Al filtrar: las tarjetas salen con un fundido, React cambia
   cuáles se ven y las nuevas entran escalonadas. Después se recalculan TODOS los triggers de la página
   (la altura de la galería cambió y, sin esto, lo de más abajo quedaba mal medido). */
function Gallery({ ui, lang, label }) {
  const root = useRef(null)
  const grid = useRef(null)
  const batch = useRef([])
  const busy = useRef(false)
  const lastGroup = useRef('all')
  const [group, setGroup] = useState('all')
  useSection(root, { theme: 'paper' })

  const groups = ['all', ...Object.keys(ui.groups)]
  const cards = () => [...grid.current.querySelectorAll('.tcard--item')]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ_MOTION_OK, () => {
        const els = cards()
        gsap.set(els, { opacity: 0, y: 40 })
        batch.current = ScrollTrigger.batch(els, {
          start: 'top 92%',
          once: true,
          onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1, stagger: 0.1, overwrite: true, clearProps: 'opacity,transform' }),
        })
        return () => {
          batch.current.forEach((t) => t.kill())
          batch.current = []
          gsap.set(els, { clearProps: 'opacity,transform' })
        }
      })
    },
    { scope: grid },
  )

  const choose = (g) => {
    if (g === group || busy.current) return
    if (!window.matchMedia(MQ_MOTION_OK).matches) return setGroup(g)
    busy.current = true
    batch.current.forEach((t) => t.kill()) // las que aún no entraron en pantalla se muestran todas juntas tras el filtro
    batch.current = []
    const visible = cards().filter((c) => !c.classList.contains('is-off'))
    gsap.to(visible, { opacity: 0, y: -14, duration: 0.28, stagger: 0.02, ease: 'power2.in', overwrite: true, onComplete: () => setGroup(g) })
  }

  useLayoutEffect(() => {
    if (lastGroup.current === group) return
    lastGroup.current = group
    const all = cards()
    const shown = all.filter((c) => !c.classList.contains('is-off'))
    const hiddenCards = all.filter((c) => c.classList.contains('is-off'))
    if (hiddenCards.length) gsap.set(hiddenCards, { clearProps: 'opacity,transform' })
    gsap.fromTo(
      shown,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: 'power3.out',
        overwrite: true,
        clearProps: 'opacity,transform',
        onComplete: () => {
          busy.current = false
          ScrollTrigger.refresh()
        },
      },
    )
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    const safety = setTimeout(() => (busy.current = false), 2500) // nunca dejar el filtro bloqueado
    return () => {
      cancelAnimationFrame(id)
      clearTimeout(safety)
    }
  }, [group])

  return (
    <section className="tp-gallery" ref={root}>
      <header className="tp-head">
        <p className="mono eyebrow" data-reveal>
          {label}
        </p>
        <h2 className="tp-head__title display" data-split>
          {ui.galleryTitle}
        </h2>
      </header>

      <div className="tp-filters" role="group" aria-label={ui.galleryTitle} data-reveal>
        {groups.map((g) => (
          <button key={g} type="button" className="tp-chip mono" aria-pressed={g === group} onClick={() => choose(g)}>
            {g === 'all' ? ui.all : ui.groups[g]}
          </button>
        ))}
      </div>

      <div className="tp-grid" ref={grid}>
        {templates.map((tpl) => (
          <Card key={tpl.id} tpl={tpl} txt={templateText[lang][tpl.id]} ui={ui} lang={lang} hidden={group !== 'all' && tpl.group !== group} />
        ))}
      </div>
      <p className="tp-hint mono">{ui.hoverHint}</p>
    </section>
  )
}

/* ── Precio que cuenta hasta su valor al entrar en pantalla ───────────────── */
function Price({ value, lang }) {
  const ref = useRef(null)
  const fmt = (n) => Math.round(n).toLocaleString(lang === 'es' ? 'de-DE' : 'en-US')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ_MOTION_OK, () => {
        const o = { n: 0 }
        ref.current.textContent = '0'
        gsap.to(o, {
          n: value,
          duration: 1.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
          onUpdate: () => (ref.current.textContent = fmt(o.n)),
        })
      })
    },
    { scope: ref, dependencies: [value, lang] },
  )

  return <span ref={ref}>{fmt(value)}</span>
}

/* ── Plan (sirve para webs y automatizaciones; `light` = sobre fondo claro) ── */
function Tier({ tier, txt, ui, lang, light, subject }) {
  const inner = useRef(null)
  useTilt(inner, { max: 2.5 })
  const href = mail(`${subject}: ${txt.name} — ${tier.price ? `${ui.from} USD ${tier.price}` : ui.quote}`)
  const btn = tier.featured ? 'btn--solid' : light ? '' : 'btn--light'

  return (
    <li className={`tier${tier.featured ? ' tier--featured' : ''}`} data-reveal>
      <div className="tier__inner" ref={inner}>
        {tier.featured && <p className="tier__badge mono">{ui.featured}</p>}
        <h3 className="tier__name display">{txt.name}</h3>
        <p className="tier__tagline">{txt.tagline}</p>

        <p className="tier__price">
          {tier.price ? (
            <>
              <span className="mono">{ui.from}</span>
              <span className="tier__cur">USD</span>
              <b className="display">
                <Price value={tier.price} lang={lang} />
                {tier.max && <span className="tier__max">–{tier.max.toLocaleString(lang === 'es' ? 'de-DE' : 'en-US')}</span>}
              </b>
            </>
          ) : (
            <b className="display tier__custom">{txt.priceLabel}</b>
          )}
        </p>
        <p className="tier__delivery mono">
          {ui.delivery}: {txt.delivery}
        </p>

        <ul className="tier__list">
          {txt.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>

        <a className={`btn tier__btn ${btn}`} href={href} data-cursor-tone={light === !!tier.featured ? 'light' : 'dark'}>
          {tier.price ? ui.choose : ui.quote} <span className="btn__arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </li>
  )
}

function Plans({ id, label, title, note, list, txt, ui, lang, light, subject }) {
  const root = useRef(null)
  useSection(root, { theme: light ? 'paper' : 'ink' })

  return (
    <section id={id} className={`tp-pricing${light ? ' tp-pricing--light' : ''}`} ref={root}>
      <header className="tp-head">
        <p className="mono eyebrow" data-reveal>
          {label}
        </p>
        <h2 className="tp-head__title display" data-split>
          {title}
        </h2>
      </header>
      <ul className={`tiers${list.length === 3 ? ' tiers--3' : ''}`}>
        {list.map((tier) => (
          <Tier key={tier.id} tier={tier} txt={txt[tier.id]} ui={ui} lang={lang} light={light} subject={subject} />
        ))}
      </ul>
      <p className="tp-note mono" data-reveal>
        {note}
      </p>
    </section>
  )
}

/* ── Paquetes de automatizaciones por rubro ──────────────────────────────── */
function Packs({ a, ui, lang }) {
  const root = useRef(null)
  useSection(root, { theme: 'paper' })
  const fmt = (n) => n.toLocaleString(lang === 'es' ? 'de-DE' : 'en-US')
  const k = a.packs

  return (
    <section id="paquetes" className="tp-pricing tp-pricing--light tp-packs" ref={root}>
      <header className="tp-head">
        <p className="mono eyebrow" data-reveal>
          {k.label}
        </p>
        <h2 className="tp-head__title display" data-split>
          {k.title}
        </h2>
      </header>
      <ul className="tiers tiers--3">
        {autoPacks.map((pk) => {
          const r = k.items[pk.id]
          return (
            <li className={`tier${pk.featured ? ' tier--featured' : ''}`} key={pk.id} data-reveal>
              <div className="tier__inner">
                {pk.featured && <p className="tier__badge mono">{ui.featured}</p>}
                <h3 className="tier__name display">{r.name}</h3>
                <p className="tier__tagline">{r.tagline}</p>
                <p className="tier__price">
                  <span className="mono">{ui.from}</span>
                  <span className="tier__cur">USD</span>
                  <b className="display">
                    {fmt(pk.price)}
                    <span className="tier__max">–{fmt(pk.max)}</span>
                  </b>
                </p>
                <ul className="tier__list">
                  {r.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p className="tier__delivery mono">
                  {k.maint}: {k.perMonth}
                </p>
                <a
                  className={`btn tier__btn ${pk.featured ? 'btn--solid' : ''}`}
                  href={mail(`${k.subject}: ${r.name} — ${ui.from} USD ${pk.price}`)}
                  data-cursor-tone={pk.featured ? 'light' : 'dark'}
                >
                  {k.choose} <span className="btn__arrow" aria-hidden="true">→</span>
                </a>
              </div>
            </li>
          )
        })}
      </ul>
      <p className="tp-note mono" data-reveal>
        {k.note}
      </p>
    </section>
  )
}

/* ── Catálogo de flujos de automatización ─────────────────────────────────── */
function FlowCard({ id, txt, a, lang, price }) {
  const inner = useRef(null)
  useTilt(inner, { max: 3 })
  const href = mail(`${a.auto.askSubject}: ${txt.name}`)

  return (
    <article className="fcard" data-reveal>
      <div className="fcard__inner" ref={inner}>
        <a className="fcard__media" href={href} data-cursor="view" data-cursor-label={a.auto.cursor} aria-label={`${a.auto.ask}: ${txt.name}`}>
          <AutoAnim id={id} lang={lang} />
        </a>
        <h3 className="fcard__name display">{txt.name}</h3>
        <p className="fcard__desc">{txt.desc}</p>
        {price && (
          <p className="fcard__price mono">
            {a.auto.fromLabel} <b>USD {price.map((n) => n.toLocaleString(lang === 'es' ? 'de-DE' : 'en-US')).join('–')}</b>
          </p>
        )}
        <ul className="fcard__tools mono">
          {txt.tools.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className="fcard__foot">
          <p className="mono fcard__saves">
            {a.auto.saves}: {txt.saves}
          </p>
          <a className="tcard__cta mono" href={href}>
            {a.auto.ask} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </article>
  )
}

function Flows({ a, lang }) {
  const root = useRef(null)
  useSection(root, { theme: 'paper' })

  return (
    <section className="tp-flows" ref={root}>
      <header className="tp-head">
        <p className="mono eyebrow" data-reveal>
          {a.auto.flowsLabel}
        </p>
        <h2 className="tp-head__title display" data-split>
          {a.auto.flowsTitle}
        </h2>
      </header>
      <div className="fgrid">
        {autoFlows.map((f) => (
          <FlowCard key={f.id} id={f.id} txt={autoText[lang][f.id]} a={a} lang={lang} price={f.price} />
        ))}
      </div>
      <p className="tp-hint mono">{a.auto.flowsHint}</p>
    </section>
  )
}

/* ── Combo Web + Automatización ───────────────────────────────────────────── */
function Combo({ ui, a, lang }) {
  const root = useRef(null)
  useSection(root, { theme: 'ink' })
  const tpl = templates[0]
  const fmt = (n) => n.toLocaleString(lang === 'es' ? 'de-DE' : 'en-US')

  return (
    <section className="tp-combo" ref={root}>
      <div className="tp-combo__copy">
        <p className="mono eyebrow" data-reveal>
          {a.combo.eyebrow}
        </p>
        <h2 className="tp-combo__title display" data-split>
          {lines(a.combo.title)}
        </h2>
        <p className="tp-combo__lead" data-reveal>
          {a.combo.lead}
        </p>

        {/* Una web + un flujo, unidos: ilustran que el sitio nace conectado */}
        <div className="tp-combo__art" aria-hidden="true" data-reveal>
          <div className="tp-combo__web">
            <TemplateMock tpl={tpl} txt={templateText[lang][tpl.id]} lang={lang} />
          </div>
          <span className="tp-combo__plus display it">+</span>
          <div className="tp-combo__flow">
            <FlowMock steps={autoText[lang].respuestas.steps} />
          </div>
        </div>
      </div>

      <ul className="combos">
        {combos.map((c) => {
          const r = a.combo.rows[c.id]
          return (
            <li className="combo" key={c.id} data-reveal>
              <div className="combo__head">
                <div>
                  <h3 className="combo__name display">{r.name}</h3>
                  <p className="mono combo__sub">{r.sub}</p>
                </div>
                <p className="combo__save mono">
                  {a.combo.range} USD {fmt(c.price)}–{fmt(c.max)}
                </p>
              </div>
              <p className="combo__price">
                <span className="mono">{ui.from}</span>
                <span className="tier__cur">USD</span>
                <b className="display">{fmt(c.price)}</b>
                <s className="mono">
                  → {fmt(c.max)}
                </s>
              </p>
              <p className="tier__delivery mono">
                {ui.delivery}: {r.delivery}
              </p>
              <ul className="tier__list">
                {r.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a className="btn btn--solid" href={mail(`${a.combo.subject}: ${r.name} — ${ui.from} USD ${c.price}`)} data-cursor-tone="dark">
                {a.combo.choose} <span className="btn__arrow" aria-hidden="true">→</span>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/* ── Proceso ──────────────────────────────────────────────────────────────── */
function Steps({ ui, steps }) {
  const root = useRef(null)
  useSection(root, { theme: 'paper' })

  return (
    <section className="tp-steps" ref={root}>
      <header className="tp-head">
        <p className="mono eyebrow" data-reveal>
          04 — {ui.stepsLabel}
        </p>
        <h2 className="tp-head__title display" data-split>
          {ui.stepsTitle}
        </h2>
      </header>
      <ol className="steps">
        {steps.map((s, i) => (
          <li key={s.t} data-reveal>
            <span className="steps__n display">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="steps__t display">{s.t}</h3>
            <p>{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ── Cierre ───────────────────────────────────────────────────────────────── */
const shortUrl = (u) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

function Closing({ ui }) {
  const root = useRef(null)
  const btn = useRef(null)
  const viewport = useRef(null)
  const track = useRef(null)
  const { navigate } = useNav()
  const scrollTo = useScrollTo()
  useSection(root, { theme: 'stone' })
  useMagnetic(btn, 0.2)
  useMarquee(viewport, track, { speed: 0.55, boost: 0.22 }) // cinta de rubros: acelera con el scroll

  const channels = [
    { k: 'email', label: ui.channelEmail, value: site.email, href: `mailto:${site.email}` },
    site.whatsapp && { k: 'wa', label: ui.channelWhatsapp, value: `+${site.whatsapp}`, href: `https://wa.me/${site.whatsapp}` },
    ...site.socials.filter((s) => s.href).map((s) => ({ k: s.label, label: s.label, value: shortUrl(s.href), href: s.href })),
  ].filter(Boolean)
  const loop = [...ui.rubros, ...ui.rubros]

  return (
    <section className="tp-close" ref={root}>
      <div className="tp-close__top">
        <div className="tp-close__copy">
          <p className="mono eyebrow" data-reveal>
            05 — {ui.closeLabel}
          </p>
          <h2 className="tp-close__title display" data-split>
            {ui.ctaTitle}
          </h2>
          <p className="tp-close__text" data-reveal>
            {ui.ctaText}
          </p>
          <a ref={btn} className="btn btn--solid" href={`mailto:${site.email}`} data-reveal data-cursor-tone="light">
            {ui.ctaButton} <span className="btn__arrow" aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="tp-channels" data-reveal>
          <p className="mono tp-channels__label">{ui.channelsLabel}</p>
          <ul>
            {channels.map((c) => (
              <li key={c.k}>
                <a href={c.href} target={c.k === 'email' ? undefined : '_blank'} rel="noreferrer">
                  <span className="mono">{c.label}</span>
                  <b className="display">{c.value}</b>
                  <i aria-hidden="true">↗</i>
                </a>
              </li>
            ))}
          </ul>
          <p className="mono tp-channels__reply">{ui.reply}</p>
        </div>
      </div>

      {/* Cinta de rubros: da vida al cierre y responde a "¿no ves tu rubro?" */}
      <div className="tp-rubros" role="group" aria-label={ui.rubros.join(', ')}>
        <div className="tp-rubros__viewport" ref={viewport} aria-hidden="true">
          <div className="tp-rubros__track" ref={track}>
            {loop.map((r, i) => (
              <span className="tp-rubros__item display it" key={`${r}-${i}`}>
                {r}
                <i />
              </span>
            ))}
          </div>
        </div>
      </div>

      <footer className="tp-foot mono">
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

export default function TemplatesPage() {
  const { lang } = useLang()
  const ui = templatesUi[lang].page
  const a = autoUi[lang]

  return (
    <>
      <Intro ui={ui} a={a} />
      <Rail a={a} />

      {/* Capítulo 01 · Webs */}
      <div id="webs">
        <ChapterHead theme="paper" num="01" eyebrow={a.webs.eyebrow} title={a.webs.title} lead={a.webs.lead} />
        <Gallery ui={ui} lang={lang} label={a.webs.galleryLabel} />
        <Plans id="planes" label={a.webs.plansLabel} title={ui.pricingTitle} note={ui.pricingNote} list={tiers} txt={templatesUi[lang].tiers} ui={ui} lang={lang} subject={ui.requestSubject} />
      </div>

      {/* Capítulo 02 · Automatizaciones */}
      <div id="auto">
        <ChapterHead theme="stone" num="02" eyebrow={a.auto.eyebrow} title={a.auto.title} lead={a.auto.lead} />
        <Flows a={a} lang={lang} />
        <Plans id="planes-auto" label={a.auto.plansLabel} title={a.auto.plansTitle} note={a.auto.plansNote} list={autoTiers} txt={a.tiers} ui={ui} lang={lang} light subject={a.auto.askSubject} />
        <Packs a={a} ui={ui} lang={lang} />
      </div>

      {/* Capítulo 03 · Combo */}
      <div id="combo">
        <Combo ui={ui} a={a} lang={lang} />
      </div>

      <Steps ui={ui} steps={templatesUi[lang].steps} />
      <Closing ui={ui} />
    </>
  )
}
