import { useEffect, useRef } from 'react'
import { ScrollTrigger, scroller } from './lib/gsap'
import { LangProvider, useLang } from './lib/i18n'
import { SmoothScroll, useScrollTo } from './components/SmoothScroll'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Cursor from './components/Cursor'
import Loader from './components/Loader'

function Site() {
  const { lang, t } = useLang()
  const scrollTo = useScrollTo()
  const prevLang = useRef(lang)

  // Teclado: con el documento en overflow:hidden, las teclas de scroll solo actúan sobre el
  // contenedor que tiene el foco. Lo enfocamos al cargar (sin mover nada).
  useEffect(() => {
    scroller.focus({ preventScroll: true })
  }, [])

  // Las fuentes cambian las métricas del texto → recalcular pins y triggers cuando estén listas.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  // Cambio de idioma: <main key={lang}> remonta todo (SplitText no convive con un React re-render
  // del mismo nodo), así que volvemos arriba y recalculamos.
  useEffect(() => {
    document.documentElement.lang = lang
    if (prevLang.current === lang) return // solo reaccionar a un cambio real de idioma
    prevLang.current = lang
    scrollTo(0, { immediate: true })
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [lang, scrollTo])

  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <Cursor />
      <Loader />
      <Header />
      <main id="main" tabIndex={-1} key={lang}>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </>
  )
}

export default function App() {
  return (
    <LangProvider>
      <SmoothScroll>
        <Site />
      </SmoothScroll>
    </LangProvider>
  )
}
