import './FlowMock.css'

/**
 * Mini diagrama de un flujo de automatización: tres pasos unidos por una línea; un punto recorre el camino y cada
 * paso "late" cuando le llega. Todo en SVG/CSS (sin imágenes). Con prefers-reduced-motion queda estático.
 * El color lo manda el contenedor (currentColor); el punto usa --gold.
 */
export default function FlowMock({ steps, className = '' }) {
  return (
    <div className={`flow ${className}`} aria-hidden="true">
      <svg viewBox="0 0 300 96" className="flow__svg">
        <path d="M50 40 L250 40" className="flow__line" />
        <circle cx="50" cy="40" r="13" className="flow__node flow__node--1" />
        <rect x="138" y="28" width="24" height="24" rx="6" className="flow__node flow__node--2" />
        <path d="M250 26 L264 40 L250 54 L236 40 Z" className="flow__node flow__node--3" />
        <circle r="3.4" className="flow__dot">
          <animateMotion dur="3.4s" repeatCount="indefinite" path="M50 40 L250 40" />
        </circle>
      </svg>
      {steps?.length > 0 && (
        <ul className="flow__labels mono">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
