import { mockCommon } from '../data/templates'
import './TemplateMock.css'

/**
 * Miniatura de una plantilla web, dibujada con HTML/CSS (sin imágenes): una "ventana de navegador" con la
 * portada y una segunda pantalla que aparece al pasar el cursor (efecto de scroll).
 * Todo se mide en `cqw` (unidades de contenedor), así que escala nítido a cualquier tamaño.
 *
 * Los colores salen de `tpl.pal`; el diseño, de `tpl.kind` (listing · menu · split · center · bold · shop · gallery).
 */
export default function TemplateMock({ tpl, txt, lang }) {
  const { pal, kind } = tpl
  const nav = mockCommon[lang].nav
  const slug = txt.name.toLowerCase().replace(/[^a-z0-9]+/g, '')

  const Nav = () => (
    <div className="m-nav">
      <b>{txt.name}</b>
      <span>{nav.join('  ')}</span>
      <em>{txt.cta}</em>
    </div>
  )

  // Funciones (no JSX directo): solo se construye el diseño de este `kind`; los demás usan datos que esta plantilla no tiene.
  const screens = {
    listing: () => (
      <>
        <Nav />
        <div className="m-hero m-hero--left">
          <h4 className="m-h">{txt.heading}</h4>
          <div className="m-search">
            <span>{lang === 'es' ? 'Ubicación' : 'Location'}</span>
            <span>{lang === 'es' ? 'Tipo' : 'Type'}</span>
            <span>{lang === 'es' ? 'Precio' : 'Price'}</span>
            <b>→</b>
          </div>
        </div>
        <div className="m-row">
          {txt.items.map((it, i) => (
            <div className="m-card" key={it}>
              <div className="m-img" style={{ '--tone': 0.5 + i * 0.18 }} />
              <p>{it}</p>
              <small>{txt.prices[i]}</small>
            </div>
          ))}
        </div>
      </>
    ),
    menu: () => (
      <>
        <Nav />
        <div className="m-menu">
          <div className="m-menu__l">
            <h4 className="m-h">{txt.heading}</h4>
            <p className="m-p">{lang === 'es' ? 'Cocina de fuego, producto de estación.' : 'Wood-fired cooking, seasonal produce.'}</p>
            <span className="m-btn">{txt.cta}</span>
          </div>
          <ul className="m-menu__r">
            {txt.items.map((it, i) => (
              <li key={it}>
                <span>{it}</span>
                <i />
                <b>{txt.prices[i]}</b>
              </li>
            ))}
          </ul>
        </div>
        <div className="m-strip">
          <div className="m-img" style={{ '--tone': 0.9 }} />
          <div className="m-img" style={{ '--tone': 0.6 }} />
          <div className="m-img" style={{ '--tone': 1.1 }} />
        </div>
      </>
    ),
    split: () => (
      <>
        <Nav />
        <div className="m-split">
          <div>
            <h4 className="m-h">{txt.heading}</h4>
            <p className="m-p">{txt.items.join(' · ')}</p>
            <span className="m-btn">{txt.cta}</span>
          </div>
          <div className="m-arch">
            <i />
          </div>
        </div>
      </>
    ),
    center: () => (
      <>
        <Nav />
        <div className="m-center">
          <small className="m-eyebrow">{txt.type}</small>
          <h4 className="m-h m-h--c">{txt.heading}</h4>
          <span className="m-btn">{txt.cta}</span>
          <ul className="m-center__chips">
            {txt.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </div>
      </>
    ),
    bold: () => (
      <>
        <Nav />
        <div className="m-bold">
          <h4 className="m-h m-h--xl">{txt.heading}</h4>
          <i className="m-bold__dot" />
        </div>
        <ul className="m-stats">
          {txt.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      </>
    ),
    shop: () => (
      <>
        <Nav />
        <div className="m-shop">
          <div className="m-shop__banner">
            <small className="m-eyebrow">{txt.type}</small>
            <h4 className="m-h">{txt.heading}</h4>
            <span className="m-btn">{txt.cta}</span>
          </div>
          {txt.items.slice(0, 2).map((it, i) => (
            <div className="m-card" key={it}>
              <div className="m-img m-img--tall" style={{ '--tone': 0.7 + i * 0.3 }} />
              <p>{it}</p>
              <small>{txt.prices[i]}</small>
            </div>
          ))}
        </div>
      </>
    ),
    gallery: () => (
      <>
        <div className="m-nav m-nav--min">
          <b>{txt.name}</b>
          <span>{txt.items.join('  ')}</span>
        </div>
        <div className="m-gal">
          {[0.9, 0.55, 1.1, 0.7, 1, 0.6].map((t, i) => (
            <div className="m-img" key={i} style={{ '--tone': t }} />
          ))}
        </div>
        <h4 className="m-h m-h--s">{txt.heading}</h4>
      </>
    ),
  }

  return (
    <div
      className={`mock mock--${kind}`}
      style={{ '--bg': pal.bg, '--fg': pal.fg, '--ac': pal.ac, '--blk': pal.blk, '--mf': tpl.serif ? 'var(--font-serif)' : 'var(--font-sans)' }}
      aria-hidden="true"
    >
      <div className="mock__bar">
        <i />
        <i />
        <i />
        <span>{slug}.com</span>
      </div>
      <div className="mock__view">
        <div className="mock__page">
          <section className="mock__screen">{screens[kind]()}</section>
          <section className="mock__screen mock__screen--2">
            <h5 className="m-h m-h--s">{txt.type}</h5>
            <div className="m-feats">
              {txt.tags.map((tg) => (
                <div key={tg}>
                  <i />
                  <p>{tg}</p>
                  <u />
                  <u />
                </div>
              ))}
            </div>
            <div className="m-foot">
              <b>{txt.name}</b>
              <span>© 2026</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
