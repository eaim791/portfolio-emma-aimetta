import { useRef } from 'react'
import { gsap, useGSAP, MQ_MOTION_OK } from '../lib/gsap'
import { splitReveal } from '../lib/reveal'
import { LOADER_REVEAL } from '../lib/loader'
import { useLang } from '../lib/i18n'
import { useSection } from '../hooks/useSection'
import { useMagnetic } from '../hooks/useMagnetic'
import { useScrollTo } from './SmoothScroll'
import LangSwitch from './LangSwitch'
import './Hero.css'

export default function Hero() {
  const { t } = useLang()
  const scrollTo = useScrollTo()
  const root = useRef(null)
  const cta = useRef(null)

  useSection(root, { theme: 'paper', reveals: false }) // la intro del hero es una línea de tiempo propia
  useMagnetic(cta, 0.25)

  useGSAP(
    (_, contextSafe) => {
      // Primera visita: el Loader (clase is-loading) trae la foto hasta su sitio y avisa con LOADER_REVEAL.
      const withLoader = document.documentElement.classList.contains('is-loading')
      if (withLoader) gsap.set('.hero__curtain', { scaleY: 0 }) // la foto ya la pone el loader: sin cortina

      const mm = gsap.matchMedia()

      mm.add(MQ_MOTION_OK, () => {
        /* ── Parallax al salir del hero (scrub → sigue a Lenis sin retraso).
           La foto NO se mueve ni se amplía: se ve completa, silla incluida. ── */
        const out = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to('.hero__ghost', { yPercent: -8, ease: 'none', scrollTrigger: out })
        gsap.to('.hero__copy', { yPercent: -8, ease: 'none', scrollTrigger: out })

        /* ── Intro. Sin loader: cortina que se abre sobre la foto + foto que "respira" + texto que sube.
           Con loader: solo el texto, cuando el marco del loader está a punto de aterrizar. ── */
        const play = () => {
          const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
          if (!withLoader) {
            tl.to('.hero__curtain', { scaleY: 0, duration: 1.5, ease: 'power4.inOut' }, 0.1).fromTo(
              '.hero__img',
              { scale: 1.06 },
              { scale: 1, duration: 2 },
              0.1,
            )
          }
          tl.fromTo('.hero__ghost', { xPercent: 35, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.6 }, withLoader ? 0 : 0.3).fromTo(
            '[data-hero-fade]',
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.1 },
            withLoader ? 0.35 : 1.1,
          )

          root.current.querySelectorAll('[data-split]').forEach((el, i) => {
            splitReveal(el, { delay: (withLoader ? 0.05 : 0.75) + i * 0.12, stagger: 0.1 })
          })
        }

        if (!withLoader) return play()

        const onReveal = contextSafe(play)
        window.addEventListener(LOADER_REVEAL, onReveal, { once: true })
        return () => window.removeEventListener(LOADER_REVEAL, onReveal)
      })
    },
    { scope: root },
  )

  return (
    <section id="top" className="hero" ref={root}>
      {/* Palabra fantasma vertical por el margen derecho (detrás de todo) */}
      <p className="hero__ghost" aria-hidden="true">
        <span className="hero__ghost-text display it">Portfolio 2026</span>
      </p>

      <figure className="hero__photo">
        {/* FOTO PRINCIPAL — ruta local pedida: ./img/home-emma.jpg
            (el archivo vive en public/img/home-emma.jpg; Vite lo sirve como /img/home-emma.jpg).
            Es la versión retocada (fondo terracota, sin firma) que genera scripts/process-images.py
            a partir de img/51ca2332-….jpg. Para cambiarla, sustituye ese archivo. */}
        <img
          className="hero__img"
          src="./img/home-emma.jpg"
          alt={t.hero.photoAlt}
          width="1152"
          height="1536"
          decoding="async"
          fetchPriority="high"
        />
        <span className="hero__curtain" aria-hidden="true" />
      </figure>

      <div className="hero__copy">
        <p className="hero__meta mono" data-hero-fade>
          {t.hero.eyebrow}
        </p>

        <div className="hero__main">
          <h1 className="hero__name display" data-split>
            <span>Emma</span>
            <span className="it">Aimetta</span>
          </h1>

          <p className="hero__role" data-split>
            {t.hero.role[0]} <span className="serif-i">&amp;</span> {t.hero.role[1]}
          </p>

          <p className="hero__tagline" data-hero-fade>
            {t.hero.tagline}
          </p>

          <a
            ref={cta}
            className="btn hero__cta"
            href="#work"
            data-hero-fade
            data-cursor-tone="light" /* el botón se rellena de tinta al hover: el cursor pasa a marfil */
            onClick={(e) => {
              e.preventDefault()
              scrollTo('#work')
            }}
          >
            {t.hero.cta} <span className="btn__arrow" aria-hidden="true">↓</span>
          </a>
        </div>

        <LangSwitch className="hero__lang" />
      </div>
    </section>
  )
}
