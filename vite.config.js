import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' → las rutas "./img/..." funcionan igual en dev, en build y en cualquier hosting.
export default defineConfig({
  base: './',
  plugins: [react()],
})
