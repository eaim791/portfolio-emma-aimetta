import { useRef } from 'react'
import { useLang } from '../lib/i18n'
import { site } from '../data/content'
import { useSection } from '../hooks/useSection'
import Placeholder from './Placeholder'
import './About.css'

export default function About() {
  const { t } = useLang()
  const root = useRef(null)
  useSection(root, { theme: 'clay' })

  return (
    <section id="about" className="about" ref={root}>
      <p className="about__label mono" data-reveal>
        (01) {t.about.label}
      </p>

      {/* Se enciende palabra a palabra con el scroll (SplitText + scrub) */}
      <p className="about__statement" data-words>
        {t.about.statement}
      </p>

      <div className="about__grid">
        {/* FOTOS — collage asimétrico. Las rutas se cambian en src/data/content.js
            (site.aboutPhoto y site.aboutPhoto2; archivos en public/img/, ratio 4:5).
            `data-parallax-y` (en cada marco) los desliza a distinta velocidad al hacer scroll,
            sin recortar la foto. */}
        <div className="about__photos">
          <figure className="about__frame about__frame--a" data-parallax-y="3">
            <Placeholder
              className="about__img"
              src={site.aboutPhoto}
              alt={t.about.photoAlt}
              color="#1b1512"
              label={t.about.photoLabel}
              width="1000"
              height="1266"
            />
          </figure>
          <figure className="about__frame about__frame--b" data-parallax-y="8">
            <Placeholder
              className="about__img"
              src={site.aboutPhoto2}
              alt={t.about.photoAlt2}
              color="#5e2616"
              label="Foto · about-emma-2.jpg"
              width="720"
              height="910"
            />
          </figure>
        </div>

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
