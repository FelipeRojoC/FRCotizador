/* =========================================================
   FRCotizador — Contenido del formulario (taller mecánico)
   Edita este archivo para cambiar textos, opciones y ejemplos.
   ========================================================= */

const CONFIG = {
  /* Correo donde llegan los formularios. FormSubmit envía un
     correo de activación la PRIMERA vez que alguien envía el form. */
  email: "felipe.rojo@alumnos.ucn.cl",
  /* WhatsApp en formato internacional sin + ni espacios. Ej: "56912345678".
     Si lo dejas vacío, el botón de WhatsApp no aparece. */
  whatsapp: "56976728541",
  autor: "Felipe Rojo",
  asunto: "Nuevo brief de página web — Taller",
  /* Dónde queda publicada esta página. Se usa para armar el link
     "VER EL DISEÑO" que va en el correo. Si lo dejas vacío, se arma
     con la dirección desde donde se abrió el formulario. */
  urlPublica: "https://feliperojoc.github.io/FRCotizador/"
};

/* ---------- PASO 7: rangos de presupuesto ---------- */
const PRESUPUESTOS = [
  { id: "r50",  txt: "$50.000 a $100.000" },
  { id: "r100", txt: "$100.000 a $200.000" },
  { id: "r200", txt: "$200.000 a $300.000" },
  { id: "r300", txt: "$300.000 a $500.000" },
  { id: "r500", txt: "Más de $500.000" },
  { id: "prop", txt: "Prefiero que me propongas" }
];

/* ---------- PASO 2: tipos de página ---------- */
const PAGE_TYPES = [
  {
    id: "landing",
    icon: "📄",
    name: "Landing (una sola página)",
    tag: { txt: "La más pedida", cls: "ok" },
    desc: "Todo en una sola página larga: quién eres, qué haces, fotos, precios y contacto. El cliente baja con el dedo y llega al botón de WhatsApp.",
    eg: "Ej: un taller que quiere que le escriban por WhatsApp para cotizar una mantención de 10.000 km.",
    wire: "landing"
  },
  {
    id: "sitio",
    icon: "🗂️",
    name: "Sitio con varias páginas",
    tag: { txt: "Más completo", cls: "acc" },
    desc: "Un menú arriba con páginas separadas: Inicio, Servicios, Nosotros, Trabajos y Contacto. Sirve cuando tienes harto que contar.",
    eg: "Ej: un taller con 3 sucursales, servicio a empresas y una página aparte para flotas.",
    wire: "sitio"
  },
  {
    id: "precios",
    icon: "🏷️",
    name: "Servicios con precios",
    tag: { txt: "Filtra pedidos", cls: "acc" },
    desc: "Una lista de servicios con precio de referencia (\"desde $\") y un botón para cotizar. El cliente llega sabiendo más o menos cuánto cuesta.",
    eg: "Ej: cambio de aceite desde $45.000, pastillas de freno desde $60.000, scanner $25.000.",
    wire: "precios"
  },
  {
    id: "agenda",
    icon: "📅",
    name: "Agenda de horas",
    tag: { txt: "Se cotiza aparte", cls: "warn" },
    desc: "El cliente elige día y hora para dejar el vehículo y te llega la reserva. Necesita un calendario conectado, por eso se cotiza aparte.",
    eg: "Ej: \"Martes 10:00 — Toyota Hilux — mantención\" te llega al correo y al WhatsApp.",
    wire: "agenda"
  },
  {
    id: "repuestos",
    icon: "🛒",
    name: "Tienda de repuestos online",
    tag: { txt: "Se cotiza aparte", cls: "warn" },
    desc: "Vender repuestos con carrito y pago en línea (Webpay, Mercado Pago). Es el proyecto más grande: lleva stock, despacho y boletas.",
    eg: "Ej: vender filtros, pastillas y aceites con despacho a regiones.",
    wire: "tienda"
  },
  {
    id: "nose",
    icon: "🤔",
    name: "No estoy seguro",
    tag: { txt: "Yo te recomiendo", cls: "ok" },
    desc: "Perfecto. Responde el resto del formulario y yo te propongo la opción que más te conviene según lo que quieres lograr y tu presupuesto.",
    eg: "Ej: \"quiero que me lleguen más clientes\" — con eso ya puedo recomendarte.",
    wire: "nose"
  }
];

/* ---------- PASO 1: chips ---------- */
const ESPECIALIDADES = [
  "Mantención general", "Frenos", "Scanner / diagnóstico", "Electricidad automotriz",
  "Alineación y balanceo", "Suspensión", "Motor y culata", "Caja de cambios",
  "Aire acondicionado", "Desabolladura y pintura", "Diésel", "Neumáticos",
  "Embrague", "Inyección", "Revisión técnica (preparación)"
];

const VEHICULOS = [
  "Autos", "Camionetas", "4x4 / SUV", "Camiones", "Motos", "Furgones / vans", "Maquinaria", "Vehículos eléctricos / híbridos"
];

const SERVICIOS_EXTRA = [
  "Grúa", "Mecánica a domicilio", "Retiro y entrega del vehículo",
  "Garantía por escrito", "Pago con tarjeta", "Convenio con empresas",
  "Atención de seguros", "Auto de reemplazo"
];

/* ---------- PASO 3: objetivos ---------- */
const OBJETIVOS = [
  { id: "wsp", txt: "Que me escriban o llamen para cotizar", icon: "💬" },
  { id: "agenda", txt: "Que agenden hora para dejar el vehículo", icon: "📅" },
  { id: "empresas", txt: "Que empresas me encuentren (flotas y convenios)", icon: "🏢" },
  { id: "google", txt: "Aparecer en Google cuando busquen taller en mi ciudad", icon: "🔍" },
  { id: "trabajos", txt: "Mostrar mis trabajos y que se note la calidad", icon: "📸" },
  { id: "confianza", txt: "Verme serio y profesional frente a la competencia", icon: "🏆" },
  { id: "precios", txt: "Que sepan los precios antes de llamar", icon: "🏷️" },
  { id: "repuestos", txt: "Vender repuestos o accesorios", icon: "🛒" },
  { id: "tarjeta", txt: "Tener algo que mostrar en el QR de mi tarjeta o el local", icon: "📱" }
];

/* ---------- PASO 4: secciones ---------- */
const SECCIONES = [
  { id:"portada", name:"Portada", must:true, what:"Lo primero que se ve: el nombre del taller, en qué eres bueno y un botón grande para contactarte.", eg:"\"Taller El Pistón — Mantención y frenos en Antofagasta. Cotiza por WhatsApp\"." },
  { id:"sobre", name:"Sobre el taller", what:"Tu historia corta: cuántos años llevas, quién está detrás y por qué confiar en ti.", eg:"\"18 años atendiendo camionetas de faena en el norte\"." },
  { id:"servicios", name:"Servicios", what:"La lista de lo que haces, explicado simple.", eg:"Frenos, scanner, alineación, mantención por kilometraje.", input:{ label:"Escribe tus servicios, uno por línea", ph:"Cambio de aceite y filtros\nFrenos: pastillas y discos\nScanner de fallas\nAlineación y balanceo" } },
  { id:"precios", name:"Precios de referencia", what:"Precios \"desde\" para filtrar a quien solo pregunta por preguntar.", eg:"Cambio de aceite desde $45.000.", input:{ label:"Precios de referencia (uno por línea)", ph:"Cambio de aceite desde $45.000\nPastillas de freno desde $60.000\nScanner $25.000" } },
  { id:"marcas", name:"Marcas que atiendes", what:"Los logos o nombres de las marcas que trabajas. Da confianza inmediata.", eg:"Toyota, Chevrolet, Hyundai, Ford, Nissan.", input:{ label:"Marcas (separadas por coma)", ph:"Toyota, Chevrolet, Hyundai, Ford, Nissan, Mitsubishi" } },
  { id:"galeria", name:"Galería de trabajos (antes y después)", what:"Fotos de trabajos terminados. Es lo que más mira la gente antes de llamar.", eg:"Una suspensión antes y después, una pintura recuperada." },
  { id:"garantia", name:"Garantía y confianza", what:"Cuánta garantía das, si usas repuestos originales y si entregas boleta o factura.", eg:"\"6 meses de garantía por escrito en mano de obra\"." },
  { id:"empresas", name:"Empresas y flotas", what:"Una parte dedicada a convenios con empresas: facturación, mantención programada y retiro de vehículos.", eg:"\"Mantenemos flotas de hasta 40 camionetas con reporte mensual\"." },
  { id:"resenas", name:"Reseñas de clientes", what:"Comentarios reales de clientes, con estrellitas como en Google.", eg:"\"Me salvaron un domingo con la camioneta botada. 5 estrellas\".", input:{ label:"Pega 2 o 3 reseñas reales (si las tienes)", ph:"\"Rápidos y honestos, me explicaron todo\" — Carlos M.\n\"Llevé la Hilux y quedó impecable\" — Paulina R." } },
  { id:"cotizador", name:"Formulario de cotización", what:"Un formulario donde el cliente pone patente, marca, modelo y qué le pasa al auto. Te llega listo al correo o WhatsApp.", eg:"\"Hilux 2018, se siente un ruido al frenar\" — y ya sabes qué preguntar." },
  { id:"ubicacion", name:"Ubicación y mapa", what:"Dónde estás, con el mapa de Google y un botón \"Cómo llegar\".", eg:"Para que el cliente abra Waze de una." },
  { id:"horarios", name:"Horarios de atención", what:"Cuándo estás abierto, incluyendo sábados y urgencias.", eg:"Lun a Vie 8:30 a 18:30 · Sáb 9:00 a 14:00." },
  { id:"faq", name:"Preguntas frecuentes", what:"Las preguntas que te hacen todo el día, respondidas de una vez.", eg:"\"¿Puedo llevar mi propio repuesto?\", \"¿Cuánto se demoran?\"." },
  { id:"blog", name:"Consejos / blog", what:"Artículos cortos de mantención. Ayudan a que Google te muestre más.", eg:"\"Cada cuántos kilómetros cambiar las pastillas de freno\"." },
  { id:"redes", name:"Redes sociales", what:"Links a tu Instagram o Facebook, o tus últimas publicaciones.", eg:"Para que vean que el taller está activo." }
];

/* ---------- PASO 5: estilos ---------- */
const ESTILOS = [
  { id:"industrial", name:"Industrial y robusto", desc:"Oscuro, fuerte, con carácter de taller", bg:"#1a1d21", fg:"#f2f4f6", acc:"#ff7a1a", font:"'Barlow Condensed',sans-serif", up:true },
  { id:"deportivo",  name:"Deportivo",            desc:"Rápido, con rojo y diagonales", bg:"#111", fg:"#fff", acc:"#e12323", font:"'Space Grotesk',sans-serif", up:true },
  { id:"confiable",  name:"Confiable y cercano",  desc:"Claro, azul, amable y familiar", bg:"#f4f7fb", fg:"#17222f", acc:"#1e6fd9", font:"'Inter',sans-serif" },
  { id:"premium",    name:"Premium",              desc:"Negro y dorado, para autos de alta gama", bg:"#0f0f10", fg:"#f5f0e6", acc:"#c9a227", font:"'Playfair Display',serif" },
  { id:"clasico",    name:"Clásico / vintage",    desc:"Tipo taller de antaño, cálido", bg:"#f3ece1", fg:"#2b2318", acc:"#a8562a", font:"'Playfair Display',serif" },
  { id:"moderno",    name:"Moderno",              desc:"Limpio, con degradados y bordes suaves", bg:"#0e1628", fg:"#eef3fb", acc:"#4f8cff", font:"'Inter',sans-serif" },
  { id:"corporativo",name:"Corporativo",          desc:"Serio, pensado para empresas y flotas", bg:"#ffffff", fg:"#1b2430", acc:"#0f4c81", font:"'Inter',sans-serif" },
  { id:"minimal",    name:"Minimalista",          desc:"Mucho blanco, poco ruido, directo", bg:"#ffffff", fg:"#111", acc:"#111111", font:"'Inter',sans-serif" }
];

const COLORES = [
  { id:"naranjo", name:"Naranjo", hex:"#ff7a1a" },
  { id:"rojo", name:"Rojo", hex:"#e12323" },
  { id:"azul", name:"Azul", hex:"#1e6fd9" },
  { id:"azulm", name:"Azul marino", hex:"#12305c" },
  { id:"verde", name:"Verde", hex:"#1fa855" },
  { id:"amarillo", name:"Amarillo", hex:"#f2b807" },
  { id:"negro", name:"Negro", hex:"#141414" },
  { id:"gris", name:"Gris acero", hex:"#5c6a7a" },
  { id:"dorado", name:"Dorado", hex:"#c9a227" },
  { id:"celeste", name:"Celeste", hex:"#38b6d9" },
  { id:"morado", name:"Morado", hex:"#6b3fa0" },
  { id:"blanco", name:"Blanco", hex:"#f2f4f7" }
];

/* ---------- PASO 6: material ---------- */
const MATERIAL = [
  { id:"logo", name:"Logo del taller", sub:"En buena calidad (png, ai, pdf)" },
  { id:"fotos_taller", name:"Fotos del taller", sub:"Fachada, boxes, herramientas" },
  { id:"fotos_trabajos", name:"Fotos de trabajos", sub:"Antes y después, reparaciones" },
  { id:"fotos_equipo", name:"Fotos del equipo", sub:"Tú y tus mecánicos trabajando" },
  { id:"textos", name:"Textos", sub:"Quién eres, qué haces, tu historia" },
  { id:"precios", name:"Lista de precios", sub:"Aunque sea de referencia" },
  { id:"resenas", name:"Reseñas de clientes", sub:"De Google, Facebook o WhatsApp" },
  { id:"videos", name:"Videos", sub:"Del taller o de trabajos" },
  { id:"marcas", name:"Logos de marcas o convenios", sub:"Marcas que atiendes, seguros" }
];

/* ---------- PASO 7: funciones extra ---------- */
const EXTRAS = [
  { id:"cotizador", txt:"Cotizador con datos del vehículo (patente, marca, modelo, falla)" },
  { id:"seguimiento", txt:"Seguimiento del estado del auto (\"en revisión\", \"listo para retirar\")" },
  { id:"recordatorios", txt:"Recordatorios de mantención por kilometraje" },
  { id:"wsp", txt:"Botón flotante de WhatsApp" },
  { id:"mapa", txt:"Mapa de Google con cómo llegar" },
  { id:"resenasg", txt:"Reseñas de Google mostrándose solas" },
  { id:"blog", txt:"Blog de consejos de mantención" },
  { id:"panel", txt:"Panel para que yo mismo edite precios y fotos" },
  { id:"analitica", txt:"Estadísticas de cuánta gente entra" },
  { id:"idiomas", txt:"Página en más de un idioma" }
];

/* ---------- Glosario ---------- */
const GLOSARIO = [
  { t:"Dominio", d:"La dirección de tu página, lo que la gente escribe en el navegador.", e:"tallerelpiston.cl — se paga una vez al año." },
  { t:"Hosting", d:"El \"arriendo\" del espacio donde vive tu página para que esté prendida 24/7.", e:"Como el arriendo del local, pero en internet." },
  { t:"Landing", d:"Una sola página larga, hecha para que el visitante haga una cosa: contactarte.", e:"Bajas con el dedo y siempre hay un botón de WhatsApp a mano." },
  { t:"Responsive", d:"Que la página se vea bien en celular, tablet y computador.", e:"8 de cada 10 clientes te van a buscar desde el celular." },
  { t:"SEO", d:"Trabajo para que Google te muestre cuando alguien busca tu servicio.", e:"\"taller mecánico en Antofagasta\" y que aparezcas tú." },
  { t:"CTA (botón de acción)", d:"El botón que quieres que aprieten.", e:"\"Cotizar por WhatsApp\" o \"Agenda tu hora\"." },
  { t:"Gestor de contenido (CMS)", d:"Un panel para que tú mismo cambies fotos, precios o textos sin programar.", e:"Entras con usuario y clave y editas como en Word." },
  { t:"SSL / candado", d:"El candadito del navegador. Dice que tu página es segura.", e:"Sin él, Chrome muestra \"No es seguro\" y la gente se arranca." },
  { t:"Correo corporativo", d:"Correo con el nombre de tu taller en vez de gmail.", e:"contacto@tutaller.cl se ve mucho más serio." },
  { t:"Ficha de Google (Google Business)", d:"La ficha que sale al costado en Google con tu dirección, horario y reseñas.", e:"Es gratis y va de la mano con la página." }
];

const HORARIOS_PRESET = [
  "Lun a Vie 8:30 - 18:30 · Sáb 9:00 - 14:00",
  "Lun a Vie 9:00 - 19:00",
  "Lun a Sáb 8:00 - 20:00",
  "24/7 urgencias y grúa"
];
