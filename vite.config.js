import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' → las rutas "./img/..." funcionan igual en dev, en build y en cualquier hosting.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    // El proyecto vive en OneDrive: al guardar, el archivo puede leerse a medias (vacío) y el servidor se queda con
    // esa copia rota hasta reiniciar. Esperar a que la escritura termine lo evita.
    watch: { awaitWriteFinish: { stabilityThreshold: 250, pollInterval: 50 } },
  },
})
