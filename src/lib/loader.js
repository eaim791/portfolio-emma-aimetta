/** Evento que lanza el loader cuando su foto ya casi aterriza: el hero arranca ahí su animación de texto. */
export const LOADER_REVEAL = 'loader:reveal'

/** Clave de sessionStorage: el loader solo sale en la primera visita de cada sesión. */
export const LOADER_KEY = 'eaim-loader'

export function markLoaderSeen() {
  try {
    sessionStorage.setItem(LOADER_KEY, '1')
  } catch {
    /* almacenamiento bloqueado: el loader saldrá otra vez, sin más consecuencias */
  }
}
