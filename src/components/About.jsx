import { useRef } from 'react'
import { useLang } from '../lib/i18n'
import { site } from '../data/content'
import { useSection } from '../hooks/useSection'
import Placeholder from './Placeholder'
import './About.css'

export default function About() {
  const { t } = useLang()
  const root = useRef(null)
  useSection(root, { theme: 'stone' })

  return (
    <section id="about" className="about" ref={root}>
      <p className="about__label mono eyebrow" data-reveal>
        01 — {t.about.label}
      </p>

      {/* Se enciende palabra a palabra con el scroll (SplitText + scrub) */}
      <p className="about__statement" data-words>
        {t.about.statement}
      </p>

      <div className="about__grid">
        {/* FOTO — ruta en src/data/content.js → site.aboutPhoto (public/img/about-emma.jpg, 772×976).
            El marco tiene la proporción exacta de la foto (se ve entera); la ventana se abre al entrar
            en pantalla (data-img-reveal) y el marco se desliza suavemente con el scroll (data-parallax-y). */}
        <figure className="about__frame" data-img-reveal data-parallax-y="3">
          <Placeholder
            className="about__img"
            src={site.aboutPhoto}
            alt={t.about.photoAlt}
            color="#8f8d6e"
            label={t.about.photoLabel}
            width="772"
            height="976"
          />
        </figure>

        <div className="about__text">
          <p className="about__body" data-reveal>
            {t.about.body}
          </p>
          <dl className="about__facts" data-reveal>
            {t.about.facts.map((f) => (
              <div key={f.k}>
                <dt className="mono">{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
