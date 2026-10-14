import './LangSwitch.css'
import { useLang } from '../lib/i18n'

const LANGS = ['en', 'es']

/** Selector EN / ES (como en la referencia). Al cambiar, App remonta el contenido. */
export default function LangSwitch({ className = '' }) {
  const { lang, setLang, t } = useLang()

  return (
    <div className={`lang mono ${className}`} role="group" aria-label={t.lang.aria}>
      {LANGS.map((code, i) => (
        <span key={code}>
          {i > 0 && <span aria-hidden="true"> / </span>}
          <button
            type="button"
            className="lang__btn"
            aria-pressed={lang === code}
            lang={code}
            onClick={() => setLang(code)}
          >
            {code.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  )
}
