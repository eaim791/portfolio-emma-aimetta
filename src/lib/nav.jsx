import { createContext, useContext } from 'react'

/** Páginas del sitio. La portada no lleva hash; las demás viven en `#/nombre` (funciona en cualquier hosting estático). */
export const PAGE_HASH = { home: '', templates: '#/vitrina', projects: '#/proyectos' }

export const pageFromHash = () =>
  location.hash.startsWith(PAGE_HASH.templates) ? 'templates' : location.hash.startsWith(PAGE_HASH.projects) ? 'projects' : 'home'

/** { page, navigate(to, anchorId?) } — navigate cambia de página con la transición de cortina. */
export const NavContext = createContext({ page: 'home', navigate: () => {} })
export const useNav = () => useContext(NavContext)
