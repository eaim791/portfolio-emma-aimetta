import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gsap, ScrollTrigger, scroller, MQ_MOTION_OK, useGSAP } from './lib/gsap'
import { LangProvider, useLang } from './lib/i18n'
import { NavContext, PAGE_HASH, pageFromHash } from './lib/nav'
import { SmoothScroll, useScrollTo } from './components/SmoothScroll'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import TemplatesTeaser from './components/TemplatesTeaser'
import Skills from './components/Skills'
import Contact from './components/Contact'
import TemplatesPage from './components/TemplatesPage'
import ProjectsPage from './components/ProjectsPage'
import Cursor from './components/Cursor'
import Loader from './components/Loader'

/** Línea fina de progreso de lectura en el borde superior (reemplaza a la barra de scroll, que está oculta). */
function ScrollProgress({ page }) {
  const bar = useRef(null)
  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          bar.current.style.transform = `scaleX(${self.progress})`
        },
      })
      return () => st.kill()
    },
    { dependencies: [page] },
  )
  return <div className="progress" ref={bar} aria-hidden="true" />
}

function Site() {
  const { lang, t } = useLang()
  const scrollTo = useScrollTo()
  const prevLang = useRef(lang)
  const [page, setPage] = useState(pageFromHash)
  const pageRef = useRef(page)
  pageRef.current = page
  const curtain = useRef(null)
  const busy = useRef(false)
  const anchor = useRef(null)
  const firstPage = useRef(true)

  // Teclado: con el documento en overflow:hidden, las teclas de scroll solo actúan sobre el
  // contenedor que tiene el foco. Lo enfocamos al cargar (sin mover nada).
  useEffect(() => {
    scroller.focus({ preventScroll: true })
  }, [])

  // Las fuentes cambian las métricas del texto → recalcular pins y triggers cuando estén listas.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  /* ── Cambio de página con cortina ─────────────────────────────────────────────
     1) la cortina sube y tapa; 2) se cambia el contenido; 3) se vuelve arriba (o al ancla) y la cortina se va. */
  const go = useCallback(
    (to, id, { push = true } = {}) => {
      if (to === pageRef.current) {
        id ? scrollTo(`#${id}`) : scrollTo(0)
        return
      }
      if (busy.current) return
      busy.current = true
      anchor.current = id || null
      const swap = () => {
        if (push) history.pushState(null, '', PAGE_HASH[to] || location.pathname + location.search)
        setPage(to)
      }
      if (!window.matchMedia(MQ_MOTION_OK).matches) return swap()
      gsap.set(curtain.current, { yPercent: 100, visibility: 'visible' })
      gsap.to(curtain.current, { yPercent: 0, duration: 0.75, ease: 'power4.inOut', onComplete: swap })
    },
    [scrollTo],
  )

  const navigate = useCallback((to, id) => go(to, id), [go])

  // Botón atrás / adelante del navegador
  useEffect(() => {
    const onPop = () => {
      const to = pageFromHash()
      if (to !== pageRef.current) {
        busy.current = false
        go(to, null, { push: false })
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [go])

  // Tras montar la página nueva: arriba (o a su ancla), recalcular triggers y abrir la cortina.
  useEffect(() => {
    if (firstPage.current) {
      firstPage.current = false
      return
    }
    scroller.scrollTop = 0
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      if (anchor.current) {
        scrollTo(`#${anchor.current}`, { immediate: true })
        anchor.current = null
      }
      const done = () => {
        busy.current = false
        gsap.set(curtain.current, { visibility: 'hidden' })
      }
      if (!window.matchMedia(MQ_MOTION_OK).matches) return done()
      gsap.to(curtain.current, { yPercent: -100, duration: 0.85, ease: 'power4.inOut', delay: 0.15, onComplete: done })
    })
    return () => cancelAnimationFrame(id)
  }, [page, scrollTo])

  // Cambio de idioma: <main key> remonta todo (SplitText no convive con un React re-render
  // del mismo nodo), así que volvemos arriba y recalculamos.
  useEffect(() => {
    document.documentElement.lang = lang
    if (prevLang.current === lang) return // solo reaccionar a un cambio real de idioma
    prevLang.current = lang
    scrollTo(0, { immediate: true })
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [lang, scrollTo])

  const nav = useMemo(() => ({ page, navigate }), [page, navigate])

  return (
    <NavContext.Provider value={nav}>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <ScrollProgress page={page} />
      <Cursor />
      <Loader />
      <Header />
      <main id="main" tabIndex={-1} key={`${page}-${lang}`}>
        {page === 'home' ? (
          <>
            <Hero />
            <About />
            <Projects />
            <TemplatesTeaser />
            <Skills />
            <Contact />
          </>
        ) : page === 'projects' ? (
          <ProjectsPage />
        ) : (
          <TemplatesPage />
        )}
      </main>
      <div className="curtain" ref={curtain} aria-hidden="true" />
    </NavContext.Provider>
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
