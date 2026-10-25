import { useRef } from 'react'
import { ScrollTrigger, useGSAP } from '../lib/gsap'
import { useLang } from '../lib/i18n'
import { PAGE_HASH, useNav } from '../lib/nav'
import { useScrollTo } from './SmoothScroll'
import './Header.css'

export default function Header() {
  const { t } = useLang()
  const scrollTo = useScrollTo()
  const { page, navigate } = useNav()
  const ref = useRef(null)

  // Se oculta al bajar y reaparece al subir: nunca tapa el contenido y todo va por transform.
  useGSAP(
    () => {
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const y = self.scroll()
          ref.current.classList.toggle('is-hidden', self.direction === 1 && y > 240)
          ref.current.classList.toggle('is-stuck', y > 40)
        },
      })
    },
    { scope: ref },
  )

  // En la portada los enlaces desplazan a la sección; en otra página vuelven a la portada y desplazan al llegar.
  const go = (item) => (e) => {
    e.preventDefault()
    if (item.page) return navigate(item.page)
    if (page === 'home') return scrollTo(`#${item.id}`)
    navigate('home', item.id)
  }

  const brand = (e) => {
    e.preventDefault()
    if (page === 'home') scrollTo(0)
    else navigate('home')
  }

  return (
    <header className="header chrome" ref={ref}>
      <a className="header__brand" href="#top" onClick={brand}>
        <strong>EAIM</strong> <span>/ PORTFOLIO</span>
      </a>
      <nav aria-label="Principal">
        <ul className="header__nav">
          {t.nav.map((item) => (
            <li key={item.id}>
              <a
                className="header__link"
                href={item.page ? PAGE_HASH[item.page] || '#' : `#${item.id}`}
                aria-current={item.page === page ? 'page' : undefined}
                onClick={go(item)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
