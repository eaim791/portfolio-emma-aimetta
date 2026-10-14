import './Placeholder.css'

/**
 * Imagen o marcador de posición.
 *
 *  • Con `src`  → <img> real (lazy, async-decoded).
 *  • Sin `src`  → bloque de color sólido con una etiqueta que dice qué archivo va ahí.
 *
 * Para reemplazar un placeholder NO hay que tocar este componente: pon la ruta de la foto
 * en `src/data/content.js` (campo `cover` de cada proyecto o `site.aboutPhoto`).
 */
export default function Placeholder({ src, alt = '', color = '#0e0d0c', label, className = '', ...rest }) {
  if (src) {
    return <img className={className} src={src} alt={alt} loading="lazy" decoding="async" {...rest} />
  }
  return (
    <div
      className={`ph ${className}`}
      style={{ backgroundColor: color }}
      role="img"
      aria-label={alt || label}
      {...rest}
    >
      {label && <span className="ph__label mono">{label}</span>}
    </div>
  )
}
