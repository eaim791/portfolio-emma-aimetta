import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Los estilos globales primero: los CSS de cada componente (importados por App) van después.
import './styles/tokens.css'
import './styles/scroll.css'
import './styles/base.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
