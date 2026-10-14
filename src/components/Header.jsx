import { useRef } from 'react'
import { ScrollTrigger, useGSAP } from '../lib/gsap'
import { useLang } from '../lib/i18n'
import { useScrollTo } from './SmoothScroll'
import './Header.css'

export default function Header() {
  const { t } = useLang()
  const scrollTo = useScrollTo()
  const ref = useRef(null)

  // Se oculta al bajar y reaparece al subir: nunca tapa el contenido y todo va por transform.
  useGSAP(
    () => {
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          ref.current.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > 240)
        },
      })
    },
    { scope: ref },
  )

  const go = (id) => (e) => {
    e.preventDefault()
    scrollTo(`#${id}`)
  }

  return (
    <header className="header chrome" ref={ref}>
      <a className="header__brand" href="#top" onClick={(e) => { e.preventDefault(); scrollTo(0) }}>
        <strong>EAIM</strong> <span>/ PORTFOLIO</span>
      </a>
      <nav aria-label="Principal">
        <ul className="header__nav">
          {t.nav.map((item) => (
            <li key={item.id}>
              <a className="header__link" href={`#${item.id}`} onClick={go(item.id)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
