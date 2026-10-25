/* ──────────────────────────────────────────────────────────────────────────
   AUTOMATIZACIONES, PLANES Y COMBOS — todo lo editable del capítulo "Automatizaciones" y del "Combo" (ES / EN).
   ──────────────────────────────────────────────────────────────────────────
   ▸ PRECIOS: son EJEMPLOS (USD). Cámbialos aquí:
       autoTiers[].price     → número que se anima (null = muestra `priceLabel`)
       combos[].price/regular → precio del combo y suma de comprar por separado (se calcula el ahorro)
   ▸ FLUJOS: cada flujo se dibuja con código (FlowMock.jsx). Para añadir uno: copia un bloque de `autoFlows`
     y añade su texto con el mismo id en `autoText.es` y `autoText.en`.
   ▸ Las solicitudes abren un correo a `site.email` (src/data/content.js).
   ────────────────────────────────────────────────────────────────────────── */

/** `price: [mín, máx]` = precio inicial razonable en USD de cada flujo suelto (EJEMPLOS). */
export const autoFlows = [
  { id: 'respuestas', price: [250, 500] },
  { id: 'cobros', price: [350, 650] },
  { id: 'clientes', price: [300, 600] },
  { id: 'reservas', price: [300, 600] },
  { id: 'stock', price: [400, 800] },
  { id: 'reportes', price: [250, 500] },
]

const flows = {
  es: {
    respuestas: { name: 'Respuestas automáticas', desc: 'Cada consulta que llega por correo o formulario recibe respuesta inmediata y queda registrada.', steps: ['Consulta', 'Respuesta', 'Registro'], tools: ['Correo', 'Formularios', 'Hojas de cálculo'], saves: 'Hasta 6 h por semana' },
    cobros: { name: 'Cobros y facturas', desc: 'Genera la factura, la envía y recuerda al cliente cuando el pago sigue pendiente.', steps: ['Venta', 'Factura', 'Recordatorio'], tools: ['Facturación', 'Correo', 'Pagos'], saves: 'Menos cobros olvidados' },
    clientes: { name: 'Seguimiento de clientes', desc: 'Cada contacto nuevo entra a tu CRM y recibe un seguimiento programado sin que lo recuerdes.', steps: ['Contacto', 'CRM', 'Seguimiento'], tools: ['CRM', 'Correo', 'Calendario'], saves: 'Ningún cliente sin respuesta' },
    reservas: { name: 'Reservas y recordatorios', desc: 'El cliente reserva solo y recibe confirmación y recordatorio; tú ves la agenda ordenada.', steps: ['Reserva', 'Confirmación', 'Recordatorio'], tools: ['Calendario', 'Mensajes', 'Pagos'], saves: 'Menos ausencias' },
    stock: { name: 'Stock y pedidos', desc: 'Cuando entra un pedido se descuenta el stock y se avisa al proveedor al llegar al mínimo.', steps: ['Pedido', 'Stock', 'Proveedor'], tools: ['Tienda online', 'Inventario', 'Correo'], saves: 'Stock siempre al día' },
    reportes: { name: 'Reportes automáticos', desc: 'Cada lunes recibes un resumen de ventas, consultas y tareas, listo para decidir.', steps: ['Datos', 'Resumen', 'Entrega'], tools: ['Hojas de cálculo', 'Paneles', 'Correo'], saves: 'Decides con datos, no con intuición' },
  },
  en: {
    respuestas: { name: 'Automatic replies', desc: 'Every enquiry that arrives by email or form gets an instant reply and is logged.', steps: ['Enquiry', 'Reply', 'Log'], tools: ['Email', 'Forms', 'Spreadsheets'], saves: 'Up to 6 h a week' },
    cobros: { name: 'Billing and invoices', desc: 'Creates the invoice, sends it and nudges the client when payment is still pending.', steps: ['Sale', 'Invoice', 'Reminder'], tools: ['Invoicing', 'Email', 'Payments'], saves: 'Fewer forgotten payments' },
    clientes: { name: 'Client follow-up', desc: 'Every new contact lands in your CRM and gets a scheduled follow-up without you remembering.', steps: ['Contact', 'CRM', 'Follow-up'], tools: ['CRM', 'Email', 'Calendar'], saves: 'No client left unanswered' },
    reservas: { name: 'Bookings and reminders', desc: 'Clients book on their own and get a confirmation and a reminder; you see an orderly calendar.', steps: ['Booking', 'Confirmation', 'Reminder'], tools: ['Calendar', 'Messages', 'Payments'], saves: 'Fewer no-shows' },
    stock: { name: 'Stock and orders', desc: 'When an order comes in stock is updated, and the supplier is alerted when it hits the minimum.', steps: ['Order', 'Stock', 'Supplier'], tools: ['Online store', 'Inventory', 'Email'], saves: 'Stock always up to date' },
    reportes: { name: 'Automatic reports', desc: 'Every Monday you get a summary of sales, enquiries and tasks, ready to decide on.', steps: ['Data', 'Summary', 'Delivery'], tools: ['Spreadsheets', 'Dashboards', 'Email'], saves: 'Decide with data, not hunches' },
  },
}
export const autoText = flows

/** Planes de automatización por tamaño (USD, EJEMPLOS). `price` = desde, `max` = hasta. */
export const autoTiers = [
  { id: 'pequena', price: 200, max: 350, featured: false },
  { id: 'normal', price: 350, max: 600, featured: true },
  { id: 'compleja', price: 600, max: 1000, featured: false },
  { id: 'pack', price: 800, max: 1500, featured: false },
]

/** Paquetes de automatizaciones por rubro (USD, EJEMPLOS). Textos en `autoUi[lang].packs.items`. */
export const autoPacks = [
  { id: 'restaurante', price: 600, max: 1000, featured: false },
  { id: 'tienda', price: 800, max: 1500, featured: true },
  { id: 'servicios', price: 800, max: 1200, featured: false },
]

/** Combos Web + Automatización (USD, EJEMPLOS): "desde" y "hasta". */
export const combos = [
  { id: 'combo-esencial', price: 900, max: 1400 },
  { id: 'combo-pro', price: 1400, max: 2000 },
]

export const autoUi = {
  es: {
    rail: { aria: 'Secciones de la vitrina', items: [{ id: 'webs', n: '01', l: 'Webs' }, { id: 'auto', n: '02', l: 'Automatizaciones' }, { id: 'combo', n: '03', l: 'Combo' }] },
    doors: {
      aria: 'Elige qué te interesa',
      web: { n: '01', t: 'Webs', d: 'Plantillas y landings elegantes para cada rubro.', cta: 'Ver plantillas' },
      auto: { n: '02', t: 'Automatizaciones', d: 'Flujos que responden, cobran y ordenan por ti.', cta: 'Ver flujos' },
      combo: 'O las dos juntas: ver el combo',
    },
    webs: { eyebrow: '01 — Webs', title: 'Webs', lead: 'Elige una plantilla, la adapto a tu marca y la dejo publicada. Desde una página sencilla hasta una landing premium diseñada desde cero.', galleryLabel: '01.1 — Galería', plansLabel: '01.2 — Planes y precios' },
    auto: {
      eyebrow: '02 — Automatizaciones',
      title: 'Automatiza\nlo repetitivo',
      lead: 'Conecto tus herramientas para que las tareas que se repiten (responder, cobrar, avisar, ordenar) se hagan solas. Tú te quedas con lo importante.',
      flowsLabel: '02.1 — Flujos',
      flowsTitle: 'Lo que puede trabajar por ti',
      flowsHint: 'Ejemplos de flujos. Cada uno se adapta a tu negocio y a las herramientas que ya usas.',
      saves: 'Ahorro',
      ask: 'Quiero este flujo',
      askSubject: 'Automatización',
      cursor: 'Pedir',
      plansLabel: '02.2 — Planes y precios',
      plansTitle: 'Un plan según cuánto quieras automatizar',
      plansNote: 'Precios en USD, referenciales y sin impuestos. Las herramientas externas (licencias) se pagan aparte. El alcance final se confirma por correo o mensaje.',
      fromLabel: 'Desde',
    },
    packs: {
      label: '02.3 — Paquetes por rubro',
      title: 'Paquetes listos para tu negocio',
      note: 'Rangos en USD, referenciales. Incluyen puesta en marcha; el mantenimiento mensual es opcional y se acuerda aparte.',
      maint: 'Mantenimiento opcional',
      perMonth: 'USD 30–100 / mes',
      choose: 'Pedir este paquete',
      subject: 'Paquete',
      items: {
        restaurante: { name: 'Paquete Restaurante', tagline: 'Reservas llenas, mesas sin sorpresas.', features: ['Reservas automáticas', 'Confirmación de reservas', 'Recordatorio antes del turno', 'Consultas desde formulario o correo', 'Registro de clientes', 'Seguimiento', 'Reporte semanal', 'Avisos internos'] },
        tienda: { name: 'Paquete Tienda online', tagline: 'Vende, cobra y repone sin tocar nada.', features: ['Pedidos que descuentan stock', 'Alertas de stock bajo y aviso al proveedor', 'Factura y cobro automáticos', 'Recordatorio de pagos pendientes', 'Respuestas a consultas frecuentes', 'Reporte semanal de ventas'] },
        servicios: { name: 'Paquete Servicios y consultorios', tagline: 'Agenda ordenada y clientes atendidos.', features: ['Reservas y agenda online', 'Confirmación y recordatorio 24 h', 'Respuestas automáticas a consultas', 'Registro y seguimiento de clientes', 'Aviso interno por cada reserva', 'Reporte semanal'] },
      },
    },
    combo: {
      eyebrow: '03 — Combo',
      title: 'Web +\nautomatización',
      lead: 'Una web que atrae y procesos que se encargan del resto: tu sitio nace conectado a tus respuestas, reservas, cobros y clientes. Y al contratarlo junto, lo diseñamos como un solo sistema.',
      regular: 'Por separado',
      range: 'Rango',
      plus: 'incluye',
      choose: 'Pedir este combo',
      subject: 'Combo',
      rows: {
        'combo-esencial': { name: 'Combo Esencial', sub: 'Web Standard + 1 o 2 automatizaciones', delivery: '8–10 días', features: ['Una página elegante con tus colores y logo', 'Su formulario conectado a respuestas automáticas', 'Publicación y puesta en marcha incluidas'] },
        'combo-pro': { name: 'Combo Profesional', sub: 'Web Profesional + pack de 3 a 5 automatizaciones', delivery: '15–20 días', features: ['Hasta 5 páginas con animaciones suaves', 'Reservas, cobros o clientes conectados a tu web', 'Panel para ver qué pasó y soporte durante 30 días'] },
      },
    },
    tiers: {
      pequena: { name: 'Automatización pequeña', tagline: 'Un flujo simple, bien hecho.', priceLabel: '', delivery: '3–5 días', features: ['1 automatización sencilla', 'Conexión de hasta 2 herramientas', 'Pruebas y puesta en marcha', 'Guía breve de uso', 'Soporte durante 15 días'] },
      normal: { name: 'Automatización normal', tagline: 'El flujo que más tiempo te devuelve.', priceLabel: '', delivery: '5–8 días', features: ['1 automatización completa', 'Conexión de hasta 3 herramientas', 'Avisos y registro automático', 'Pruebas y puesta en marcha', 'Guía y capacitación breve', 'Soporte durante 30 días'] },
      compleja: { name: 'Automatización compleja', tagline: 'Varias reglas, varios sistemas.', priceLabel: '', delivery: '10–15 días', features: ['Flujo con condiciones y varias ramas', 'Integraciones con tus herramientas', 'Panel para ver qué pasó', 'Pruebas con casos reales', 'Capacitación', 'Soporte durante 30 días'] },
      pack: { name: 'Pack de 3 a 5', tagline: 'Tu operación en piloto automático.', priceLabel: '', delivery: '2–4 semanas', features: ['De 3 a 5 automatizaciones', 'Integraciones con tus herramientas', 'Avisos y reportes automáticos', 'Panel para ver qué pasó', 'Capacitación breve', 'Soporte durante 30 días'] },
    },
  },
  en: {
    rail: { aria: 'Showroom sections', items: [{ id: 'webs', n: '01', l: 'Websites' }, { id: 'auto', n: '02', l: 'Automations' }, { id: 'combo', n: '03', l: 'Bundle' }] },
    doors: {
      aria: 'Choose what interests you',
      web: { n: '01', t: 'Websites', d: 'Elegant templates and landing pages for every industry.', cta: 'See templates' },
      auto: { n: '02', t: 'Automations', d: 'Workflows that reply, bill and organise for you.', cta: 'See workflows' },
      combo: 'Or both together: see the bundle',
    },
    webs: { eyebrow: '01 — Websites', title: 'Websites', lead: 'Pick a template, I adapt it to your brand and publish it. From a simple page to a premium landing designed from scratch.', galleryLabel: '01.1 — Gallery', plansLabel: '01.2 — Plans and pricing' },
    auto: {
      eyebrow: '02 — Automations',
      title: 'Automate\nthe repetitive',
      lead: 'I connect your tools so repeating tasks (replying, billing, notifying, organising) run on their own. You keep the important part.',
      flowsLabel: '02.1 — Workflows',
      flowsTitle: 'What can work for you',
      flowsHint: 'Example workflows. Each one is adapted to your business and the tools you already use.',
      saves: 'Saves',
      ask: 'I want this workflow',
      askSubject: 'Automation',
      cursor: 'Ask',
      plansLabel: '02.2 — Plans and pricing',
      plansTitle: 'A plan for how much you want to automate',
      plansNote: 'Prices in USD, indicative and before taxes. Third-party tool licences are paid separately. Final scope is confirmed by email or message.',
      fromLabel: 'From',
    },
    packs: {
      label: '02.3 — Packages by industry',
      title: 'Ready-made packages for your business',
      note: 'Ranges in USD, indicative. They include set-up; monthly maintenance is optional and agreed separately.',
      maint: 'Optional maintenance',
      perMonth: 'USD 30–100 / month',
      choose: 'Request this package',
      subject: 'Package',
      items: {
        restaurante: { name: 'Restaurant package', tagline: 'Full tables, no surprises.', features: ['Automatic bookings', 'Booking confirmation', 'Reminder before the sitting', 'Enquiries from form or email', 'Client records', 'Follow-up', 'Weekly report', 'Internal alerts'] },
        tienda: { name: 'Online store package', tagline: 'Sells, bills and restocks on its own.', features: ['Orders that update stock', 'Low-stock alerts and supplier notice', 'Automatic invoice and payment', 'Reminders for pending payments', 'Replies to common questions', 'Weekly sales report'] },
        servicios: { name: 'Services and clinics package', tagline: 'An orderly calendar and clients looked after.', features: ['Online booking and calendar', '24 h confirmation and reminder', 'Automatic replies to enquiries', 'Client records and follow-up', 'Internal alert for every booking', 'Weekly report'] },
      },
    },
    combo: {
      eyebrow: '03 — Bundle',
      title: 'Website +\nautomation',
      lead: 'A website that attracts and processes that handle the rest: your site is born connected to your replies, bookings, billing and clients. And when you hire them together, we design them as a single system.',
      regular: 'Separately',
      range: 'Range',
      plus: 'includes',
      choose: 'Request this bundle',
      subject: 'Bundle',
      rows: {
        'combo-esencial': { name: 'Essential bundle', sub: 'Standard website + 1 or 2 automations', delivery: '8–10 days', features: ['An elegant page with your colours and logo', 'Its form wired to automatic replies', 'Launch and set-up included'] },
        'combo-pro': { name: 'Professional bundle', sub: 'Professional website + pack of 3 to 5 automations', delivery: '15–20 days', features: ['Up to 5 pages with smooth animation', 'Bookings, billing or clients wired to your site', 'A dashboard to see what happened and 30 days of support'] },
      },
    },
    tiers: {
      pequena: { name: 'Small automation', tagline: 'One simple workflow, done right.', priceLabel: '', delivery: '3–5 days', features: ['1 simple automation', 'Connection of up to 2 tools', 'Testing and launch', 'A short usage guide', '15 days of support'] },
      normal: { name: 'Standard automation', tagline: 'The workflow that gives you most time back.', priceLabel: '', delivery: '5–8 days', features: ['1 complete automation', 'Connection of up to 3 tools', 'Automatic alerts and logging', 'Testing and launch', 'A guide and short training', '30 days of support'] },
      compleja: { name: 'Complex automation', tagline: 'Several rules, several systems.', priceLabel: '', delivery: '10–15 days', features: ['Workflow with conditions and branches', 'Integrations with your tools', 'A dashboard to see what happened', 'Testing with real cases', 'Training', '30 days of support'] },
      pack: { name: 'Pack of 3 to 5', tagline: 'Your operations on autopilot.', priceLabel: '', delivery: '2–4 weeks', features: ['3 to 5 automations', 'Integrations with your tools', 'Automatic alerts and reports', 'A dashboard to see what happened', 'A short training session', '30 days of support'] },
    },
  },
}
