/* ──────────────────────────────────────────────────────────────────────────
   PLANTILLAS Y PLANES — todo lo editable de la página "Plantillas" vive aquí (ES / EN).
   ──────────────────────────────────────────────────────────────────────────
   ▸ PRECIOS: los montos de `tiers` son EJEMPLOS (USD). Cámbialos por los tuyos:
       price: 190        → número que se anima al entrar en pantalla
       price: null       → muestra `priceLabel` (p. ej. "A medida")
     `from: true` antepone "Desde". `featured: true` resalta el plan.
   ▸ PLANTILLAS: cada una se dibuja con código (TemplateMock.jsx), sin imágenes. Para añadir una:
       1. Copia un bloque de `templates` y cambia id, group, kind, pal (colores) y datos.
       2. Añade su texto en `templateText.es` y `templateText.en` con el mismo id.
     `kind` elige el diseño: listing · menu · split · center · bold · shop · gallery.
   ▸ CONTACTO: las solicitudes abren un correo a `site.email` (src/data/content.js).
   ────────────────────────────────────────────────────────────────────────── */

export const templates = [
  { id: 'casa-norte', group: 'negocios', kind: 'listing', pal: { bg: '#f4f1ea', fg: '#1d1d1b', ac: '#9a7b4a', blk: '#d9d3c5' }, serif: true },
  { id: 'brasa-sal', group: 'gastro', kind: 'menu', pal: { bg: '#1b1714', fg: '#efe6d8', ac: '#c9a265', blk: '#2e2722' }, serif: true },
  { id: 'clinica-aura', group: 'salud', kind: 'split', pal: { bg: '#f1f5f3', fg: '#16302d', ac: '#3f7f76', blk: '#cfe0dc' }, serif: true },
  { id: 'lex-asociados', group: 'negocios', kind: 'center', pal: { bg: '#10151f', fg: '#eef0f3', ac: '#c8a96a', blk: '#1d2635' }, serif: true },
  { id: 'forma-studio', group: 'salud', kind: 'bold', pal: { bg: '#101010', fg: '#f4f3ee', ac: '#d6f25c', blk: '#222222' }, serif: false },
  { id: 'hotel-alba', group: 'gastro', kind: 'center', pal: { bg: '#eee8dd', fg: '#2a2118', ac: '#8a5a3b', blk: '#cdbfa8' }, serif: true },
  { id: 'maison-textil', group: 'comercio', kind: 'shop', pal: { bg: '#f6f4f0', fg: '#141414', ac: '#b3562c', blk: '#e4ded2' }, serif: false },
  { id: 'atelier-barber', group: 'salud', kind: 'split', pal: { bg: '#232120', fg: '#efe7d9', ac: '#b88a4a', blk: '#34312e' }, serif: true },
  { id: 'lumiere', group: 'creativos', kind: 'gallery', pal: { bg: '#f9f8f6', fg: '#121212', ac: '#121212', blk: '#e3e0da' }, serif: true },
]

const text = {
  es: {
    'casa-norte': { name: 'Casa Norte', type: 'Inmobiliaria', heading: 'Encuentra tu próximo hogar', cta: 'Ver propiedades', items: ['Penthouse Centro', 'Casa del Lago', 'Loft Norte'], prices: ['USD 420.000', 'USD 685.000', 'USD 298.000'], tags: ['Buscador de propiedades', 'Fichas con galería', 'Contacto por WhatsApp'] },
    'brasa-sal': { name: 'Brasa & Sal', type: 'Restaurante', heading: 'Fuego, sal y tiempo', cta: 'Reservar mesa', items: ['Entraña a la brasa', 'Pulpo y papa ahumada', 'Risotto de hongos', 'Flan de dulce de leche'], prices: ['28', '24', '22', '9'], tags: ['Carta digital', 'Reservas online', 'Mapa y horarios'] },
    'clinica-aura': { name: 'Clínica Aura', type: 'Clínica', heading: 'Cuidado médico con calma', cta: 'Pedir turno', items: ['Medicina general', 'Dermatología', 'Nutrición'], tags: ['Turnos online', 'Equipo médico', 'Obras sociales'] },
    'lex-asociados': { name: 'Lex & Asociados', type: 'Estudio jurídico', heading: 'Defensa con criterio', cta: 'Consulta inicial', items: ['Civil', 'Laboral', 'Empresas'], tags: ['Áreas de práctica', 'Perfil del equipo', 'Formulario de consulta'] },
    'forma-studio': { name: 'Forma Studio', type: 'Gimnasio y fitness', heading: 'Entrena con intención', cta: 'Clase de prueba', items: ['+40 clases', '12 coaches', '3 sedes'], tags: ['Horarios de clases', 'Planes y membresías', 'Alta online'] },
    'hotel-alba': { name: 'Hotel Alba', type: 'Hotel boutique', heading: 'Dormir en calma', cta: 'Ver habitaciones', items: ['Suite Jardín', 'Doble Superior', 'Estudio Alba'], tags: ['Habitaciones y tarifas', 'Motor de reservas', 'Galería de espacios'] },
    'maison-textil': { name: 'Maison Textil', type: 'Tienda online', heading: 'Colección otoño', cta: 'Comprar ahora', items: ['Manta de lino', 'Cojín bouclé', 'Set de mesa'], prices: ['USD 86', 'USD 42', 'USD 58'], tags: ['Catálogo y filtros', 'Carrito y pagos', 'Panel de pedidos'] },
    'atelier-barber': { name: 'Atelier Barber', type: 'Barbería y spa', heading: 'El oficio del buen corte', cta: 'Reservar turno', items: ['Corte clásico', 'Barba y toalla', 'Spa facial'], tags: ['Servicios y precios', 'Agenda de turnos', 'Galería de trabajos'] },
    lumiere: { name: 'Lumière', type: 'Fotografía y portfolio', heading: 'Luz, tiempo y mirada', cta: 'Ver portfolio', items: ['Retrato', 'Editorial', 'Bodas'], tags: ['Galería a pantalla completa', 'Sesiones y precios', 'Contacto directo'] },
  },
  en: {
    'casa-norte': { name: 'Casa Norte', type: 'Real estate', heading: 'Find your next home', cta: 'Browse listings', items: ['City Penthouse', 'Lake House', 'North Loft'], prices: ['USD 420,000', 'USD 685,000', 'USD 298,000'], tags: ['Property search', 'Listings with gallery', 'WhatsApp contact'] },
    'brasa-sal': { name: 'Brasa & Sal', type: 'Restaurant', heading: 'Fire, salt and time', cta: 'Book a table', items: ['Grilled skirt steak', 'Octopus, smoked potato', 'Wild mushroom risotto', 'Dulce de leche flan'], prices: ['28', '24', '22', '9'], tags: ['Digital menu', 'Online booking', 'Map and hours'] },
    'clinica-aura': { name: 'Clínica Aura', type: 'Clinic', heading: 'Calm, careful medicine', cta: 'Book a visit', items: ['General medicine', 'Dermatology', 'Nutrition'], tags: ['Online booking', 'Medical team', 'Insurance info'] },
    'lex-asociados': { name: 'Lex & Associates', type: 'Law firm', heading: 'Counsel with judgement', cta: 'First consultation', items: ['Civil', 'Labour', 'Business'], tags: ['Practice areas', 'Team profiles', 'Enquiry form'] },
    'forma-studio': { name: 'Forma Studio', type: 'Gym and fitness', heading: 'Train with intent', cta: 'Free trial class', items: ['40+ classes', '12 coaches', '3 studios'], tags: ['Class timetable', 'Plans and memberships', 'Online sign-up'] },
    'hotel-alba': { name: 'Hotel Alba', type: 'Boutique hotel', heading: 'Sleep in stillness', cta: 'See rooms', items: ['Garden Suite', 'Superior Double', 'Alba Studio'], tags: ['Rooms and rates', 'Booking engine', 'Space gallery'] },
    'maison-textil': { name: 'Maison Textil', type: 'Online store', heading: 'Autumn collection', cta: 'Shop now', items: ['Linen throw', 'Bouclé cushion', 'Table set'], prices: ['USD 86', 'USD 42', 'USD 58'], tags: ['Catalogue and filters', 'Cart and payments', 'Order dashboard'] },
    'atelier-barber': { name: 'Atelier Barber', type: 'Barbershop and spa', heading: 'The craft of a good cut', cta: 'Book a chair', items: ['Classic cut', 'Beard and towel', 'Facial spa'], tags: ['Services and prices', 'Booking calendar', 'Work gallery'] },
    lumiere: { name: 'Lumière', type: 'Photography portfolio', heading: 'Light, time, gaze', cta: 'View portfolio', items: ['Portrait', 'Editorial', 'Weddings'], tags: ['Full-screen gallery', 'Sessions and pricing', 'Direct contact'] },
  },
}

const common = {
  es: { nav: ['Inicio', 'Servicios', 'Nosotros', 'Contacto'] },
  en: { nav: ['Home', 'Services', 'About', 'Contact'] },
}

export const templateText = text
export const mockCommon = common

/** Planes. `price` en USD (EJEMPLOS: cámbialos). */
export const tiers = [
  { id: 'standard', price: 190, from: true, featured: false },
  { id: 'profesional', price: 390, from: true, featured: true },
  { id: 'advanced', price: 790, from: true, featured: false },
  { id: 'premium', price: null, from: false, featured: false },
]

export const templatesUi = {
  es: {
    teaser: {
      label: 'Vitrina · webs y automatizaciones',
      title: 'Webs elegantes y\nprocesos que trabajan solos',
      text: 'Plantillas web para cada rubro y automatizaciones que ahorran horas: elige una, la otra o el combo, y yo lo adapto a tu negocio.',
      from: 'Desde',
      cta: 'Ver galería y precios',
      count: 'plantillas · 6 flujos · combos',
      web: 'plantilla web',
      auto: 'automatización',
    },
    page: {
      back: 'Volver al portafolio',
      eyebrow: 'Vitrina',
      title: 'Webs elegantes y\nprocesos que trabajan solos',
      lead: 'Dos formas de hacer crecer tu negocio: una web que se ve y se siente premium, y automatizaciones que se encargan de lo repetitivo. Elige una, la otra o las dos juntas.',
      cta: 'Ver planes',
      stats: [
        { n: String(templates.length), l: 'plantillas' },
        { n: '4', l: 'planes' },
        { n: '5–20', l: 'días de entrega' },
      ],
      galleryLabel: 'Galería',
      galleryTitle: 'Elige tu punto de partida',
      all: 'Todas',
      groups: {
        salud: 'Salud y bienestar',
        gastro: 'Gastronomía y hotelería',
        negocios: 'Negocios y servicios',
        comercio: 'Comercio online',
        creativos: 'Creativos',
      },
      request: 'Solicitar esta plantilla',
      cursor: 'Pedir',
      requestSubject: 'Plantilla',
      hoverHint: 'Pasa el cursor para ver más',
      pricingLabel: 'Planes y precios',
      pricingTitle: 'Un plan para cada etapa',
      pricingNote: 'Precios en USD, referenciales y sin impuestos. El alcance final se confirma por correo o mensaje.',
      from: 'Desde',
      featured: 'Más elegido',
      delivery: 'Entrega',
      choose: 'Elegir este plan',
      quote: 'Pedir presupuesto',
      stepsLabel: 'Cómo trabajamos',
      stepsTitle: 'De la idea a tu negocio funcionando',
      ctaTitle: '¿No ves tu rubro?',
      ctaText: 'Cuéntame tu negocio y armamos una plantilla, una automatización o un combo a medida.',
      ctaButton: 'Escribir un correo',
      closeLabel: 'Escríbeme',
      channelsLabel: 'Elige tu canal',
      channelEmail: 'Correo',
      channelWhatsapp: 'WhatsApp',
      reply: 'Respondo en menos de 48 h',
      rubros: ['Inmobiliarias', 'Restaurantes', 'Clínicas', 'Estudios jurídicos', 'Gimnasios', 'Hoteles', 'Tiendas online', 'Barberías', 'Fotógrafos', 'Cafeterías', 'Arquitectos', 'Academias', 'Y lo que imagines'],
    },
    tiers: {
      standard: {
        name: 'Standard',
        tagline: 'Presencia profesional, rápida.',
        priceLabel: '',
        delivery: '5–7 días',
        features: ['1 página con hasta 4 secciones', 'Plantilla a elección', 'Tus colores, logo y textos', 'Adaptada a móvil y tablet', 'Botón de WhatsApp y formulario', 'Publicación y dominio incluidos'],
      },
      profesional: {
        name: 'Profesional',
        tagline: 'El equilibrio para crecer.',
        priceLabel: '',
        delivery: '10 días',
        features: ['Hasta 5 páginas', 'Plantilla personalizada a fondo', 'Animaciones suaves de entrada', 'SEO básico y Google Maps', 'Analítica de visitas', 'Una ronda de cambios incluida'],
      },
      advanced: {
        name: 'Advanced',
        tagline: 'Más páginas, más funciones.',
        priceLabel: '',
        delivery: '15–20 días',
        features: ['Hasta 10 páginas', 'Animaciones avanzadas con GSAP', 'Blog, catálogo o reservas', 'Versión en dos idiomas', 'Optimización de velocidad', 'Tres rondas de cambios'],
      },
      premium: {
        name: 'Landing Premium',
        tagline: 'Diseño único, hecho a medida.',
        priceLabel: 'A medida',
        delivery: '4–6 semanas',
        features: ['Diseño desde cero, sin plantilla', 'Dirección de arte y motion premium', 'Scroll suave y transiciones de página', 'Integraciones: IA, e-commerce, CRM', 'Copy y estrategia de conversión', 'Soporte y mejoras posteriores'],
      },
    },
    steps: [
      { t: 'Nos escribimos', d: 'Por correo o mensaje me cuentas tu negocio, tu público y lo que necesitas.' },
      { t: 'Elegimos el camino', d: 'Web, automatización o combo: escoges la base y el plan; defino el alcance y el presupuesto final.' },
      { t: 'Diseño y construcción', d: 'Adapto tu web (colores, tipografías, textos) y conecto tus herramientas para que los procesos se hagan solos.' },
      { t: 'Puesta en marcha', d: 'Revisamos juntos, ajustamos y lo dejo funcionando: web online con su dominio y flujos activos.' },
    ],
  },
  en: {
    teaser: {
      label: 'Showroom · websites and automations',
      title: 'Elegant websites and\nprocesses that run themselves',
      text: 'Web templates for every industry and automations that save hours: pick one, the other or the bundle, and I adapt it to your business.',
      from: 'From',
      cta: 'See gallery and pricing',
      count: 'templates · 6 workflows · bundles',
      web: 'web template',
      auto: 'automation',
    },
    page: {
      back: 'Back to portfolio',
      eyebrow: 'Showroom',
      title: 'Elegant websites and\nprocesses that run themselves',
      lead: 'Two ways to grow your business: a website that looks and feels premium, and automations that handle the repetitive work. Pick one, the other or both together.',
      cta: 'See plans',
      stats: [
        { n: String(templates.length), l: 'templates' },
        { n: '4', l: 'plans' },
        { n: '5–20', l: 'days to deliver' },
      ],
      galleryLabel: 'Gallery',
      galleryTitle: 'Choose your starting point',
      all: 'All',
      groups: {
        salud: 'Health and wellness',
        gastro: 'Dining and hospitality',
        negocios: 'Business and services',
        comercio: 'Online retail',
        creativos: 'Creative',
      },
      request: 'Request this template',
      cursor: 'Ask',
      requestSubject: 'Template',
      hoverHint: 'Hover to preview more',
      pricingLabel: 'Plans and pricing',
      pricingTitle: 'A plan for every stage',
      pricingNote: 'Prices in USD, indicative and before taxes. Final scope is confirmed by email or message.',
      from: 'From',
      featured: 'Most popular',
      delivery: 'Delivery',
      choose: 'Choose this plan',
      quote: 'Request a quote',
      stepsLabel: 'How we work',
      stepsTitle: 'From idea to a business that runs',
      ctaTitle: "Don't see your industry?",
      ctaText: "Tell me about your business and we'll build a template, an automation or a custom bundle.",
      ctaButton: 'Write an email',
      closeLabel: 'Write to me',
      channelsLabel: 'Pick your channel',
      channelEmail: 'Email',
      channelWhatsapp: 'WhatsApp',
      reply: 'I reply within 48 h',
      rubros: ['Real estate', 'Restaurants', 'Clinics', 'Law firms', 'Gyms', 'Hotels', 'Online stores', 'Barbershops', 'Photographers', 'Cafés', 'Architects', 'Academies', 'And whatever you imagine'],
    },
    tiers: {
      standard: {
        name: 'Standard',
        tagline: 'A professional presence, fast.',
        priceLabel: '',
        delivery: '5–7 days',
        features: ['1 page with up to 4 sections', 'Template of your choice', 'Your colours, logo and copy', 'Mobile and tablet ready', 'WhatsApp button and contact form', 'Hosting and domain setup included'],
      },
      profesional: {
        name: 'Professional',
        tagline: 'The balance for growing.',
        priceLabel: '',
        delivery: '10 days',
        features: ['Up to 5 pages', 'Deeply customised template', 'Smooth entrance animations', 'Basic SEO and Google Maps', 'Visitor analytics', 'One revision round included'],
      },
      advanced: {
        name: 'Advanced',
        tagline: 'More pages, more features.',
        priceLabel: '',
        delivery: '15–20 days',
        features: ['Up to 10 pages', 'Advanced animation with GSAP', 'Blog, catalogue or bookings', 'Two-language version', 'Speed optimisation', 'Three revision rounds'],
      },
      premium: {
        name: 'Premium Landing',
        tagline: 'A unique design, made to measure.',
        priceLabel: 'Custom',
        delivery: '4–6 weeks',
        features: ['Designed from scratch, no template', 'Art direction and premium motion', 'Smooth scroll and page transitions', 'Integrations: AI, e-commerce, CRM', 'Copy and conversion strategy', 'Support and later improvements'],
      },
    },
    steps: [
      { t: 'We write', d: 'By email or message you tell me about your business, your audience and what you need.' },
      { t: 'Pick the path', d: 'Website, automation or bundle: you choose the base and plan; I define the scope and the final quote.' },
      { t: 'Design and build', d: 'I adapt your site (colours, type, copy) and connect your tools so processes run on their own.' },
      { t: 'Go live', d: 'We review together, fine-tune, and I leave it running: website online with its domain and workflows switched on.' },
    ],
  },
}
