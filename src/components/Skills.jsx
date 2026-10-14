import { useRef } from 'react'
import { useLang } from '../lib/i18n'
import { useSection } from '../hooks/useSection'
import './Skills.css'

export default function Skills() {
  const { t } = useLang()
  const root = useRef(null)
  useSection(root, { theme: 'ink' })

  const { skills } = t
  // El carril del marquee se duplica: al desplazar -50 % el bucle es imperceptible.
  const loop = [...skills.marquee, ...skills.marquee]

  return (
    <section id="skills" className="skills" ref={root}>
      <div className="skills__inner">
        <header className="skills__head">
          <p className="mono" data-reveal>
            (03) {skills.label}
          </p>
          <h2 className="skills__title display" data-split>
            {skills.title}
          </h2>
          <p className="skills__intro" data-reveal>
            {skills.intro}
          </p>
        </header>

        <ol className="skills__list">
          {skills.items.map((s, i) => (
            <li className="skill" key={s.title} data-reveal>
              <span className="skill__n mono">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="skill__title display">{s.title}</h3>
              <div className="skill__body">
                <p className="skill__desc">{s.desc}</p>
                <ul className="skill__tags">
                  {s.tags.map((tag) => (
                    <li className="tag mono" key={tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="marquee" role="group" aria-label={skills.marqueeLabel}>
        <p className="marquee__label mono">{skills.marqueeLabel}</p>
        <div className="marquee__viewport" aria-hidden="true">
          <div className="marquee__track">
            {loop.map((tech, i) => (
              <span className="marquee__item display" key={`${tech}-${i}`}>
                {tech}
                <i className="marquee__dot" />
              </span>
            ))}
          </div>
        </div>
        {/* Lectura para lector de pantalla (el carril animado está oculto) */}
        <p className="sr-only">{skills.marquee.join(', ')}</p>
      </div>
    </section>
  )
}
