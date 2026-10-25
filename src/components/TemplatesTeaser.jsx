import { useRef } from 'react'
import { useLang } from '../lib/i18n'
import { useNav } from '../lib/nav'
import { useSection } from '../hooks/useSection'
import { useMagnetic } from '../hooks/useMagnetic'
import { templates, templateText, templatesUi, tiers } from '../data/templates'
import { autoTiers } from '../data/automations'
import TemplateMock from './TemplateMock'
import AutoAnim from './AutoAnim'
import './TemplatesTeaser.css'

/** Lo que se asoma en la portada: dos plantillas (índices de `templates`) y una automatización en medio. */
const SHOWN = [{ tpl: 0 }, { auto: 'respuestas' }, { tpl: 6 }]

/** Banda de la portada que invita a la página de plantillas y precios. */
export default function TemplatesTeaser() {
  const { lang } = useLang()
  const { navigate } = useNav()
  const ui = templatesUi[lang].teaser
  const root = useRef(null)
  const cta = useRef(null)
  useSection(root, { theme: 'paper' })
  useMagnetic(cta, 0.22)

  return (
    <section id="templates" className="tz" ref={root}>
      <div className="tz__copy">
        <p className="mono eyebrow" data-reveal>
          03 — {ui.label}
        </p>
        <h2 className="tz__title display" data-split>
          {ui.title}
        </h2>
        <p className="tz__text" data-reveal>
          {ui.text}
        </p>
        <div className="tz__row" data-reveal>
          <p className="tz__price">
            <span className="mono">{ui.from}</span> USD {tiers[0].price}
            <small className="mono">{ui.web}</small>
          </p>
          <p className="tz__price">
            <span className="mono">{ui.from}</span> USD {autoTiers[0].price}
            <small className="mono">{ui.auto}</small>
          </p>
          <a
            ref={cta}
            className="btn btn--solid"
            href="#/vitrina"
            data-cursor-tone="light"
            onClick={(e) => {
              e.preventDefault()
              navigate('templates')
            }}
          >
            {ui.cta} <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      {/* Tres plantillas apiladas con parallax a distinta velocidad; al pasar el cursor, la miniatura "scrollea". */}
      <div className="tz__stack" aria-hidden="true">
        {SHOWN.map((it, i) => {
          const tpl = it.tpl !== undefined ? templates[it.tpl] : null
          return (
            <div className={`tz__card tz__card--${i + 1} ${tpl ? 'tcard' : 'tz__card--auto'}`} key={tpl ? tpl.id : it.auto} data-parallax-y={[4, 9, 6][i]} data-reveal>
              {tpl ? <TemplateMock tpl={tpl} txt={templateText[lang][tpl.id]} lang={lang} /> : <AutoAnim id={it.auto} lang={lang} />}
            </div>
          )
        })}
      </div>
    </section>
  )
}
