// Idiomas del sitio: textos de la interfaz, rutas traducidas y utilidades.
// El español es el idioma por defecto (sin prefijo); el inglés vive en /en/.
import type { CollectionEntry } from 'astro:content';

export const IDIOMAS = ['es', 'en'] as const;
export type Idioma = (typeof IDIOMAS)[number];

export const idiomaActual = (locale: string | undefined): Idioma => (locale === 'en' ? 'en' : 'es');

/** Texto con versión en cada idioma. */
export type Bilingue = Record<Idioma, string>;

// ---------------------------------------------------------------- Rutas

const RUTAS = {
  inicio: { es: '', en: '' },
  servicios: { es: 'servicios', en: 'services' },
  proyectos: { es: 'proyectos', en: 'projects' },
  nosotros: { es: 'nosotros', en: 'about' },
  contacto: { es: 'contacto', en: 'contact' },
} satisfies Record<string, Bilingue>;
export type ClaveRuta = keyof typeof RUTAS;

/** Construye la URL de una página en un idioma: ruta('en', 'proyectos', 'placa-huella') → /en/projects/placa-huella */
export function ruta(idioma: Idioma, clave: ClaveRuta, ...resto: string[]) {
  const partes = [idioma === 'en' ? 'en' : '', RUTAS[clave][idioma], ...resto].filter(Boolean);
  return '/' + partes.join('/');
}

/** URL equivalente de la página actual en el otro idioma. */
export function rutaEquivalente(pathname: string, destino: Idioma) {
  const segmentos = pathname.split('/').filter(Boolean);
  const origen: Idioma = segmentos[0] === 'en' ? 'en' : 'es';
  if (origen === 'en') segmentos.shift();
  const [primero, ...resto] = segmentos;
  const clave = (Object.keys(RUTAS) as ClaveRuta[]).find((k) => RUTAS[k][origen] === (primero ?? ''));
  return clave ? ruta(destino, clave, ...resto) : ruta(destino, 'inicio');
}

// ---------------------------------------------------------------- Categorías y líneas

export const NOMBRE_CATEGORIA: Record<CollectionEntry<'proyectos'>['data']['categoria'], Bilingue> = {
  Vías: { es: 'Vías', en: 'Roads' },
  'Puentes y contención': { es: 'Puentes y contención', en: 'Bridges and retaining walls' },
  Edificaciones: { es: 'Edificaciones', en: 'Buildings' },
  'Escenarios deportivos': { es: 'Escenarios deportivos', en: 'Sports facilities' },
  'Urbanismo y redes': { es: 'Urbanismo y redes', en: 'Urban works and utilities' },
  'Estudios y laboratorio': { es: 'Estudios y laboratorio', en: 'Studies and laboratory' },
};

export const NOMBRE_LINEA: Record<CollectionEntry<'servicios'>['data']['linea'], Bilingue> = {
  'Obras civiles': { es: 'Obras civiles', en: 'Civil works' },
  'Consultoría y laboratorio': { es: 'Consultoría y laboratorio', en: 'Consulting and laboratory' },
  Tecnología: { es: 'Tecnología', en: 'Technology' },
};

// ---------------------------------------------------------------- Contenido

/** Datos de un servicio en el idioma pedido (si falta la traducción, usa el español). */
export function servicioEn(s: CollectionEntry<'servicios'>, idioma: Idioma) {
  const en = idioma === 'en' ? s.data.en : undefined;
  return {
    ...s.data,
    titulo: en?.titulo ?? s.data.titulo,
    resumen: en?.resumen ?? s.data.resumen,
    incluye: en?.incluye ?? s.data.incluye,
    linea: NOMBRE_LINEA[s.data.linea][idioma],
    // null = usar el cuerpo Markdown en español
    descripcion: en?.descripcion ?? null,
  };
}

/** Datos de un proyecto en el idioma pedido (si falta la traducción, usa el español). */
export function proyectoEn(p: CollectionEntry<'proyectos'>, idioma: Idioma) {
  const en = idioma === 'en' ? p.data.en : undefined;
  return {
    ...p.data,
    titulo: en?.titulo ?? p.data.titulo,
    resumen: en?.resumen ?? p.data.resumen,
    alcance: en?.alcance ?? p.data.alcance,
    cliente: en?.cliente ?? p.data.cliente,
    nombreCategoria: NOMBRE_CATEGORIA[p.data.categoria][idioma],
    descripcion: en?.descripcion ?? null,
  };
}

// ---------------------------------------------------------------- Textos de la interfaz

const es = {
  saltar: 'Saltar al contenido',
  menu: { servicios: 'Servicios', proyectos: 'Proyectos', nosotros: 'Nosotros', contacto: 'Contacto' },
  abrirMenu: 'Abrir menú',
  cotizar: 'Solicitar cotización',
  whatsapp: 'Escribir por WhatsApp',
  whatsappMensaje: 'Hola, quisiera solicitar una cotización.',
  tema: 'Cambiar entre modo claro y oscuro',
  idioma: { etiqueta: 'English', aria: 'Ver el sitio en inglés' },
  inicio: {
    titulo1: 'Construimos el Urabá',
    titulo2: 'con calidad.',
    texto: (anio: number) =>
      `Desde ${anio} construimos obras civiles y prestamos servicios de consultoría, interventoría y laboratorio de suelos, concretos y pavimentos en el Urabá antioqueño y chocoano.`,
    verServicios: 'Ver servicios',
    tarjeta: 'Del estudio de suelos a la obra',
    serviciosTitulo: 'Construcción, interventoría y laboratorio en un solo lugar.',
    todosServicios: 'Todos los servicios',
    proyectosTitulo: 'Obras ejecutadas en la región.',
    todasObras: 'Ver todas las obras',
  },
  servicios: {
    descripcion:
      'Construcción de obras civiles, consultoría, interventoría, estudios de suelos, laboratorio de suelos, concretos y pavimentos, y diseño de software.',
    titulo: 'Obras civiles, consultoría, interventoría y laboratorio.',
    texto: 'Acompañamos su proyecto desde el estudio de suelos hasta la construcción y el control de calidad.',
    incluye: 'Incluye',
  },
  proyectos: {
    descripcion:
      'Obras ejecutadas por Ingesuelos Concalidad: vías, puentes, edificaciones, escenarios deportivos, urbanismo, redes y estudios de suelos.',
    titulo: 'Obras ejecutadas.',
    texto: 'Una muestra del trabajo que hemos realizado en la región de Urabá desde 2013.',
    filtrar: 'Filtrar por categoría',
    todos: 'Todos',
    volver: 'Volver al catálogo',
    categoria: 'Categoría',
    ubicacion: 'Ubicación',
    anio: 'Año',
    cliente: 'Cliente',
    alcance: 'Alcance',
    galeria: 'Galería',
    foto: 'foto',
    otros: 'Otros proyectos',
  },
  nosotros: {
    descripcion: (nombre: string, anio: number) =>
      `Conozca a ${nombre}, empresa de obras civiles, consultoría e interventoría en Urabá desde ${anio}.`,
    titulo: 'Una empresa nacida en Urabá, para Urabá.',
    texto: (nombre: string, anio: number) =>
      `${nombre} trabaja desde ${anio} en el desarrollo de la infraestructura del Urabá antioqueño y chocoano.`,
    parrafos: (anio: number) => [
      `La empresa fue constituida legalmente el 17 de abril de ${anio}, visionando el desarrollo que a futuro tendría la región de Urabá. Al analizar las pocas empresas de ingeniería que existían en la región, vimos la necesidad de crear una empresa que sirviera de apoyo para ejercer los controles de calidad en las obras de ingeniería que desarrollaban los municipios del Urabá antioqueño y chocoano.`,
      'Empezamos con la consultoría en suelos y el control de calidad de obras mediante nuestro laboratorio de concretos y pavimentos. Con los años fuimos creciendo y ampliando nuestros servicios, y hoy somos una empresa de consultoría, interventoría y construcción de obras civiles.',
    ],
    historiaAntetitulo: 'Nuestra historia',
    historiaTitulo: 'Creciendo con la región.',
    historia: (nombre: string) => [
      {
        hito: '17 abr 2013',
        titulo: 'Constitución de la empresa',
        texto: `${nombre} se constituye legalmente en Apartadó, previendo el desarrollo que tendría la región de Urabá.`,
      },
      {
        hito: 'Primeros años',
        titulo: 'Suelos y control de calidad',
        texto:
          'Comenzamos prestando servicios de consultoría en suelos y control de calidad de obras mediante laboratorio de concretos y pavimentos.',
      },
      {
        hito: 'Hoy',
        titulo: 'Consultoría, interventoría y construcción',
        texto:
          'Ampliamos nuestros servicios y hoy nos desempeñamos como empresa de consultoría, interventoría y construcción de obras civiles.',
      },
    ],
  },
  contacto: {
    descripcion: (nombre: string) => `Solicite una cotización a ${nombre}.`,
    titulo: 'Solicite una cotización.',
    texto: 'Cuéntenos sobre su proyecto y le responderemos a la mayor brevedad.',
    nombre: 'Nombre',
    empresa: 'Empresa',
    opcional: '(opcional)',
    telefono: 'Teléfono',
    correo: 'Correo',
    servicio: 'Servicio de interés',
    otro: 'Otro',
    mensaje: 'Cuéntenos sobre su proyecto',
    placeholder: 'Tipo de obra o servicio, ubicación, cantidades…',
    enviar: 'Enviar solicitud',
    aviso: 'Se abrirá WhatsApp con su mensaje listo para enviar.',
    escribanos: 'Escríbanos',
    direccion: 'Dirección',
    pais: 'Colombia',
    // Encabezados del mensaje de WhatsApp
    wa: { proyecto: 'Proyecto' },
  },
  cta: {
    antetitulo: '¿Tiene un proyecto en mente?',
    titulo: 'Hagamos realidad su próxima obra.',
    texto: 'Cuéntenos sobre su proyecto: construcción, interventoría, estudios de suelos o ensayos de laboratorio.',
  },
  pie: {
    navegacion: 'Navegación',
    contacto: 'Contacto',
    credito: 'Diseño y desarrollo web',
  },
};

export type Textos = typeof es;

const en: Textos = {
  saltar: 'Skip to content',
  menu: { servicios: 'Services', proyectos: 'Projects', nosotros: 'About us', contacto: 'Contact' },
  abrirMenu: 'Open menu',
  cotizar: 'Request a quote',
  whatsapp: 'Message us on WhatsApp',
  whatsappMensaje: 'Hello, I would like to request a quote.',
  tema: 'Switch between light and dark mode',
  idioma: { etiqueta: 'Español', aria: 'Ver el sitio en español' },
  inicio: {
    titulo1: 'Building Urabá',
    titulo2: 'with quality.',
    texto: (anio: number) =>
      `Since ${anio} we have been building civil works and providing consulting, construction supervision and soil, concrete and pavement laboratory services across the Urabá region of Antioquia and Chocó.`,
    verServicios: 'Our services',
    tarjeta: 'From soil study to finished work',
    serviciosTitulo: 'Construction, supervision and laboratory in one place.',
    todosServicios: 'All services',
    proyectosTitulo: 'Projects completed in the region.',
    todasObras: 'See all projects',
  },
  servicios: {
    descripcion:
      'Civil construction, consulting, construction supervision, soil studies, soil, concrete and pavement laboratory, and software design.',
    titulo: 'Civil works, consulting, supervision and laboratory.',
    texto: 'We support your project from the soil study through construction and quality control.',
    incluye: 'Includes',
  },
  proyectos: {
    descripcion:
      'Projects by Ingesuelos Concalidad: roads, bridges, buildings, sports facilities, urban works, utilities and soil studies.',
    titulo: 'Completed projects.',
    texto: 'A sample of the work we have carried out in the Urabá region since 2013.',
    filtrar: 'Filter by category',
    todos: 'All',
    volver: 'Back to projects',
    categoria: 'Category',
    ubicacion: 'Location',
    anio: 'Year',
    cliente: 'Client',
    alcance: 'Scope',
    galeria: 'Gallery',
    foto: 'photo',
    otros: 'Other projects',
  },
  nosotros: {
    descripcion: (nombre: string, anio: number) =>
      `Meet ${nombre}, a civil works, consulting and construction supervision company in Urabá since ${anio}.`,
    titulo: 'Born in Urabá, built for Urabá.',
    texto: (nombre: string, anio: number) =>
      `Since ${anio}, ${nombre} has been contributing to the development of infrastructure in the Urabá region of Antioquia and Chocó.`,
    parrafos: (anio: number) => [
      `The company was legally incorporated on April 17, ${anio}, anticipating the growth the Urabá region would see in the years ahead. Seeing how few engineering firms operated in the area, we recognized the need for a company that could provide quality control for the engineering works being carried out by the municipalities of Urabá in Antioquia and Chocó.`,
      'We started out offering soil consulting and construction quality control through our concrete and pavement laboratory. Over the years we grew and expanded our services, and today we are a consulting, construction supervision and civil construction company.',
    ],
    historiaAntetitulo: 'Our story',
    historiaTitulo: 'Growing with the region.',
    historia: (nombre: string) => [
      {
        hito: 'Apr 17, 2013',
        titulo: 'Company founded',
        texto: `${nombre} is legally incorporated in Apartadó, anticipating the growth of the Urabá region.`,
      },
      {
        hito: 'Early years',
        titulo: 'Soils and quality control',
        texto: 'We began providing soil consulting and construction quality control through our concrete and pavement laboratory.',
      },
      {
        hito: 'Today',
        titulo: 'Consulting, supervision and construction',
        texto: 'We expanded our services and now operate as a consulting, construction supervision and civil construction company.',
      },
    ],
  },
  contacto: {
    descripcion: (nombre: string) => `Request a quote from ${nombre}.`,
    titulo: 'Request a quote.',
    texto: 'Tell us about your project and we will get back to you as soon as possible.',
    nombre: 'Name',
    empresa: 'Company',
    opcional: '(optional)',
    telefono: 'Phone',
    correo: 'Email',
    servicio: 'Service of interest',
    otro: 'Other',
    mensaje: 'Tell us about your project',
    placeholder: 'Type of work or service, location, quantities…',
    enviar: 'Send request',
    aviso: 'WhatsApp will open with your message ready to send.',
    escribanos: 'Message us',
    direccion: 'Address',
    pais: 'Colombia',
    wa: { proyecto: 'Project' },
  },
  cta: {
    antetitulo: 'Have a project in mind?',
    titulo: 'Let’s build your next project.',
    texto: 'Tell us about your project: construction, supervision, soil studies or laboratory testing.',
  },
  pie: {
    navegacion: 'Navigation',
    contacto: 'Contact',
    credito: 'Website design & development',
  },
};

export const textos: Record<Idioma, Textos> = { es, en };
