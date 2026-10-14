import { useRef } from 'react'
import { useLang } from '../lib/i18n'
import { site } from '../data/content'
import { useSection } from '../hooks/useSection'
import { useMagnetic } from '../hooks/useMagnetic'
import { useScrollTo } from './SmoothScroll'
import Placeholder from './Placeholder'
import LangSwitch from './LangSwitch'
import './Contact.css'

export default function Contact() {
  const { t } = useLang()
  const scrollTo = useScrollTo()
  const root = useRef(null)
  const mail = useRef(null)

  useSection(root, { theme: 'clay' })
  useMagnetic(mail, 0.18)

  const socials = site.socials.filter((s) => s.href)

  return (
    <section id="contact" className="contact" ref={root}>
      {/* RETRATO GRANDE — sus bordes izquierdo y superior se difuminan hacia el color del bloque.
          Cambia la ruta en src/data/content.js → site.contactPhoto (proporción 772×976). */}
      <figure className="contact__portrait">
        <Placeholder
          className="contact__img"
          src={site.contactPhoto}
          alt={t.contact.photoAlt}
          color="#5e2616"
          label="Foto · contact-emma.jpg"
          width="772"
          height="976"
        />
      </figure>

      <p className="mono" data-reveal>
        (04) {t.contact.label}
      </p>

      <h2 className="contact__title display" data-split>
        {t.contact.title}
      </h2>

      <div className="contact__row">
        <p className="contact__lead" data-reveal>
          {t.contact.lead}
        </p>

        <a ref={mail} className="contact__mail" href={`mailto:${site.email}`}>
          <span>{site.email}</span>
          <span className="contact__arrow" aria-hidden="true">↗</span>
        </a>
      </div>

      {socials.length > 0 && (
        <ul className="contact__socials mono">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer">
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
      )}

      <footer className="contact__foot mono">
        <span>
          © {site.year} {site.name} — {t.contact.rights}
        </span>
        <LangSwitch />
        <button type="button" className="contact__top" onClick={() => scrollTo(0)}>
          {t.contact.top} ↑
        </button>
      </footer>
    </section>
  )
}
