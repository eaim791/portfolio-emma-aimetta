/* ──────────────────────────────────────────────────────────────────────────
   CONTENIDO DEL SITIO (ES / EN) — todo el texto editable vive aquí.
   ──────────────────────────────────────────────────────────────────────────
   ▸ FOTOS DE PROYECTOS: cada proyecto tiene `cover: null`. Para poner una foto:
       1. Copia el archivo a  public/img/projects/  (p. ej. 01-maison-atelier.jpg)
       2. Cambia  cover: null  →  cover: './img/projects/01-maison-atelier.jpg'
     Mientras `cover` sea null se muestra un bloque de color sólido (`color`).
     Tamaño recomendado: 1600×1200 px, JPG/WebP < 300 KB.
   ▸ MDM Surgery es un proyecto real (con `url` y captura de portada). AIGO (e-commerce), Avanza Textil y
     los otros tres están como "Próximamente" (`soon: true`): mira las instrucciones sobre `projectMeta`.
   ▸ FOTOS DE LA PÁGINA (Sobre mí, Contacto): campos `aboutPhoto`, `aboutPhoto2` y `contactPhoto`
     de `site` (abajo).
   ▸ CONTACTO: `email` y `socials` de `site` (los que tengan href vacío no se muestran).
   ────────────────────────────────────────────────────────────────────────── */

export const site = {
  name: 'Emma Aimetta',
  email: 'aimetta.emm4@gmail.com',
  year: 2026,
  // Los href vacíos se ocultan (para sumar otra red, añade { label, href }).
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/emmaaimetta/' },
    { label: 'GitHub', href: 'https://github.com/eaim791' },
    { label: 'Instagram', href: 'https://www.instagram.com/emm4_ws7/' },
  ],
  // Fotos ya procesadas (scripts/process-images.py). Para cambiar una: copia la nueva a public/img/ y pon aquí su ruta.
  aboutPhoto: './img/about-emma.jpg',
  aboutPhoto2: './img/about-emma-2.jpg',
  contactPhoto: './img/contact-emma.jpg', // retrato grande de la sección Contacto (772×976)
}

/** Proyectos: la parte no textual es común a ambos idiomas.
 *  `soon: true` → tarjeta "Próximamente" (sin enlace). Cuando tengas el proyecto listo:
 *    1) pon `soon: false`  2) `cover: './img/projects/xx.jpg'` (+ `ratio` = ancho/alto)  3) `url: 'https://…'`
 *    4) `year: '2026'`  5) ajusta título y categoría en `projectText`. */
const projectMeta = [
  // Proyecto real: captura de la portada de mdmsurgery.com (public/img/projects/01-mdm-surgery.jpg, 1424×890 → ratio 1.6)
  { id: 'mdm', color: '#1b1512', cover: './img/projects/01-mdm-surgery.jpg', ratio: 1.6, url: 'https://mdmsurgery.com', width: '58vw', year: '2026' },
  { id: 'aigo', soon: true, color: '#7c3420', cover: null, url: '', width: '44vw', year: '' }, //     cover → './img/projects/02-aigo.jpg'
  { id: 'avanza', soon: true, color: '#1b1512', cover: null, url: '', width: '30vw', year: '' }, //  cover → './img/projects/03-avanza-textil.jpg'
  { id: 'soon-1', soon: true, color: '#a64c2e', cover: null, url: '', width: '38vw', year: '' }, // cover → './img/projects/04-….jpg'
  { id: 'soon-2', soon: true, color: '#4a2a1e', cover: null, url: '', width: '46vw', year: '' }, // cover → './img/projects/05-….jpg'
  { id: 'soon-3', soon: true, color: '#5e2616', cover: null, url: '', width: '32vw', year: '' }, // cover → './img/projects/06-….jpg'
]

const projectText = {
  es: [
    { title: 'MDM Surgery', category: 'Sitio web · Clínica de cirugía plástica' },
    { title: 'AIGO', category: 'E-commerce · Próximamente' },
    { title: 'Avanza Textil', category: 'Próximamente' },
    { title: 'Nuevo proyecto', category: 'Próximamente' },
    { title: 'Nuevo proyecto', category: 'Próximamente' },
    { title: 'Nuevo proyecto', category: 'Próximamente' },
  ],
  en: [
    { title: 'MDM Surgery', category: 'Website · Plastic surgery clinic' },
    { title: 'AIGO', category: 'E-commerce · Coming soon' },
    { title: 'Avanza Textil', category: 'Coming soon' },
    { title: 'New project', category: 'Coming soon' },
    { title: 'New project', category: 'Coming soon' },
    { title: 'New project', category: 'Coming soon' },
  ],
}

const marquee = [
  'TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Supabase', 'GraphQL', 'Astro',
  'Three.js', 'Framer Motion', 'Playwright', 'Vercel', 'Cloudflare', 'GitHub Actions',
  'Docker', 'Sentry', 'Git',
]

export const content = {
  es: {
    nav: [
      { id: 'about', label: 'Sobre mí' },
      { id: 'work', label: 'Proyectos' },
      { id: 'skills', label: 'Servicios' },
      { id: 'contact', label: 'Contacto' },
    ],
    skip: 'Saltar al contenido',
    hero: {
      eyebrow: 'Portafolio 2026 — Disponible para proyectos',
      role: ['Front-End Developer', 'UX/UI Designer'],
      tagline:
        'Creo experiencias digitales elegantes, funcionales y mínimas — del píxel al pedido entregado.',
      cta: 'Explorar proyectos',
      photoAlt: 'Retrato de Emma Aimetta agachada sobre un banco, con fondo terracota',
    },
    about: {
      label: 'Sobre mí',
      statement:
        'Diseño y programo interfaces con criterio editorial, integro IA generativa donde suma valor y entiendo el e-commerce desde el catálogo hasta la última milla.',
      body:
        'Trabajo en la intersección entre diseño, código y operación: quien dibuja la interfaz también entiende cómo se prepara, se envía y se cobra un pedido. Eso se nota en cada decisión, desde la tipografía hasta el stock.',
      photoAlt: 'Retrato de Emma Aimetta con blazer de rayas finas',
      photoAlt2: 'Emma Aimetta sentada con las piernas cruzadas, vestida de negro',
      photoLabel: 'Foto · about-emma.jpg',
      facts: [
        { k: 'Disciplinas', v: '05' },
        { k: 'Stack base', v: 'React · GSAP · IA' },
        { k: 'Enfoque', v: 'Diseño + Código + Operación' },
      ],
    },
    projects: {
      label: 'Proyectos seleccionados',
      title: 'Trabajo\nselecto',
      note: 'Desplázate para recorrer la galería',
      view: 'Ver',
      soon: 'Próximamente',
      soonCursor: 'Pronto',
      counterLabel: 'Proyecto',
      items: projectText.es.map((p, i) => ({ ...projectMeta[i], ...p })),
    },
    skills: {
      label: 'Servicios y habilidades',
      title: 'Perfil técnico\navanzado',
      intro:
        'Cinco disciplinas que se cruzan en cada proyecto: la interfaz, el sistema que la sostiene y la operación que la hace real.',
      items: [
        {
          title: 'Desarrollo Front-End',
          desc: 'Interfaces rápidas, accesibles y con movimiento con criterio. De la arquitectura de componentes al último frame a 60 fps.',
          tags: ['React 19', 'Next.js', 'TypeScript', 'GSAP + ScrollTrigger', 'Lenis', 'Three.js / WebGL', 'Tailwind CSS', 'Vite', 'WCAG 2.2', 'Core Web Vitals'],
        },
        {
          title: 'Diseño UX/UI',
          desc: 'Sistemas visuales editoriales, investigación con usuarios y prototipos que se traducen a código sin pérdida.',
          tags: ['Figma', 'Design Systems', 'Prototipado', 'UX Research', 'Arquitectura de información', 'Motion design', 'Tipografía'],
        },
        {
          title: 'Integración de IA Generativa',
          desc: 'IA como capa de producto, no como adorno: asistentes, automatizaciones y contenido generado con control de calidad.',
          tags: ['APIs de LLM (Claude, GPT)', 'Prompt engineering', 'RAG', 'Agentes y tool use', 'MCP', 'Imagen y video generativo', 'Evaluación de resultados'],
        },
        {
          title: 'Arquitectura E-commerce',
          desc: 'Tiendas que convierten y escalan: catálogo, checkout, pagos e integraciones pensadas de punta a punta.',
          tags: ['Shopify (Liquid, Hydrogen)', 'Headless commerce', 'Storefront API', 'Checkout y pagos', 'PIM / catálogo', 'SEO técnico', 'Analítica y CRO'],
        },
        {
          title: 'Logística Operativa',
          desc: 'Entiendo la operación detrás del clic: stock, preparación, envíos y trazabilidad conectados a la interfaz.',
          tags: ['Integración WMS / OMS', 'Sincronización de inventario', 'Fulfillment', 'Última milla', 'KPIs operativos', 'Automatización (n8n, Zapier)', 'APIs y webhooks'],
        },
      ],
      marqueeLabel: 'Tecnologías complementarias',
      marquee,
    },
    contact: {
      label: 'Contacto',
      title: 'Hablemos.',
      lead: 'Cuéntame tu proyecto — respondo en menos de 48 h.',
      photoAlt: 'Retrato de Emma Aimetta con blazer negro sobre fondo terracota',
      top: 'Volver arriba',
      rights: 'Todos los derechos reservados',
    },
    lang: { aria: 'Idioma' },
    loader: { label: 'Cargando portafolio' },
  },

  en: {
    nav: [
      { id: 'about', label: 'About' },
      { id: 'work', label: 'Work' },
      { id: 'skills', label: 'Services' },
      { id: 'contact', label: 'Contact' },
    ],
    skip: 'Skip to content',
    hero: {
      eyebrow: 'Portfolio 2026 — Open to new projects',
      role: ['Front-End Developer', 'UX/UI Designer'],
      tagline:
        'Crafting elegant, functional and minimal digital experiences — from pixel to delivered order.',
      cta: 'Explore projects',
      photoAlt: 'Portrait of Emma Aimetta crouching on a stool against a terracotta backdrop',
    },
    about: {
      label: 'About',
      statement:
        'I design and build interfaces with an editorial eye, bring generative AI in where it adds value, and understand e-commerce from the catalogue to the last mile.',
      body:
        'I work where design, code and operations meet: the person who draws the interface also understands how an order is picked, shipped and paid. It shows in every decision, from typography to stock levels.',
      photoAlt: 'Portrait of Emma Aimetta in a pinstripe blazer',
      photoAlt2: 'Emma Aimetta seated with crossed legs, dressed in black',
      photoLabel: 'Photo · about-emma.jpg',
      facts: [
        { k: 'Disciplines', v: '05' },
        { k: 'Core stack', v: 'React · GSAP · AI' },
        { k: 'Approach', v: 'Design + Code + Operations' },
      ],
    },
    projects: {
      label: 'Selected projects',
      title: 'Selected\nwork',
      note: 'Scroll to travel through the gallery',
      view: 'View',
      soon: 'Coming soon',
      soonCursor: 'Soon',
      counterLabel: 'Project',
      items: projectText.en.map((p, i) => ({ ...projectMeta[i], ...p })),
    },
    skills: {
      label: 'Services & skills',
      title: 'Advanced\ntechnical profile',
      intro:
        'Five disciplines that cross in every project: the interface, the system behind it and the operation that makes it real.',
      items: [
        {
          title: 'Front-End Development',
          desc: 'Fast, accessible interfaces with motion that has a reason. From component architecture to the last frame at 60 fps.',
          tags: ['React 19', 'Next.js', 'TypeScript', 'GSAP + ScrollTrigger', 'Lenis', 'Three.js / WebGL', 'Tailwind CSS', 'Vite', 'WCAG 2.2', 'Core Web Vitals'],
        },
        {
          title: 'UX/UI Design',
          desc: 'Editorial visual systems, user research and prototypes that translate into code without loss.',
          tags: ['Figma', 'Design Systems', 'Prototyping', 'UX Research', 'Information architecture', 'Motion design', 'Typography'],
        },
        {
          title: 'Generative AI Integration',
          desc: 'AI as a product layer, not decoration: assistants, automations and generated content with quality control.',
          tags: ['LLM APIs (Claude, GPT)', 'Prompt engineering', 'RAG', 'Agents & tool use', 'MCP', 'Generative image & video', 'Output evaluation'],
        },
        {
          title: 'E-commerce Architecture',
          desc: 'Stores that convert and scale: catalogue, checkout, payments and integrations designed end to end.',
          tags: ['Shopify (Liquid, Hydrogen)', 'Headless commerce', 'Storefront API', 'Checkout & payments', 'PIM / catalogue', 'Technical SEO', 'Analytics & CRO'],
        },
        {
          title: 'Operational Logistics',
          desc: 'I understand the operation behind the click: stock, picking, shipping and traceability wired into the interface.',
          tags: ['WMS / OMS integration', 'Inventory sync', 'Fulfilment', 'Last mile', 'Operational KPIs', 'Automation (n8n, Zapier)', 'APIs & webhooks'],
        },
      ],
      marqueeLabel: 'Complementary technologies',
      marquee,
    },
    contact: {
      label: 'Contact',
      title: "Let's talk.",
      lead: 'Tell me about your project — I reply within 48 h.',
      photoAlt: 'Portrait of Emma Aimetta in a black blazer against a terracotta backdrop',
      top: 'Back to top',
      rights: 'All rights reserved',
    },
    lang: { aria: 'Language' },
    loader: { label: 'Loading portfolio' },
  },
}
