import { createContext, useContext, useMemo, useState } from 'react'
import { content } from '../data/content'

const LangContext = createContext(null)
const STORAGE_KEY = 'eaim-lang'

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && saved in content) return saved
  } catch {
    /* storage bloqueado: seguimos con el default */
  }
  return 'es'
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang)

  const value = useMemo(
    () => ({
      lang,
      t: content[lang],
      setLang(next) {
        setLangState(next)
        try {
          localStorage.setItem(STORAGE_KEY, next)
        } catch {
          /* noop */
        }
      },
    }),
    [lang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
