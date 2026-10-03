// Datos generales de la empresa. Edita este archivo para actualizar
// teléfono, correo, dirección, etc. en todo el sitio a la vez.
// Los textos con { es, en } se muestran según el idioma de la página.

const fundacion = 2013;

export const empresa = {
  nombre: 'Ingesuelos Concalidad S.A.S.',
  nombreCorto: 'Ingesuelos',
  eslogan: {
    es: 'Obras civiles, consultoría, interventoría y laboratorio',
    en: 'Civil works, consulting, construction supervision and laboratory',
  },
  descripcion: {
    es: 'Construcción de obras civiles, consultoría, interventoría y laboratorio de suelos, concretos y pavimentos en el Urabá antioqueño y chocoano.',
    en: 'Civil construction, consulting, construction supervision and soil, concrete and pavement laboratory services in the Urabá region of Antioquia and Chocó, Colombia.',
  },
  fundacion,
  nit: '900.609.918-6',
  telefonos: [
    { etiqueta: { es: 'Fijo', en: 'Landline' }, numero: '604 815 0611' },
    { etiqueta: { es: 'Celular', en: 'Mobile' }, numero: '320 694 0024' },
    { etiqueta: { es: 'Celular', en: 'Mobile' }, numero: '320 694 0005' },
  ],
  whatsapp: '573206940024', // Solo números, con indicativo 57
  email: 'josealdana45@yahoo.es',
  direccion: 'Calle 101 No. 97-10, primer piso, Barrio Chinita',
  ciudad: 'Apartadó, Antioquia',
  web: 'https://www.ingesuelosconcalidad.com',

  // URL de un servicio de formularios (Formspree, Web3Forms...).
  // Si se deja vacío, el formulario de contacto envía el mensaje por WhatsApp.
  formAction: '',

  cifras: [
    { valor: String(new Date().getFullYear() - fundacion), etiqueta: { es: 'años de experiencia', en: 'years of experience' } },
    { valor: String(fundacion), etiqueta: { es: 'año de fundación', en: 'year founded' } },
    { valor: 'Urabá', etiqueta: { es: 'antioqueño y chocoano', en: 'Antioquia and Chocó' } },
    { valor: '3', etiqueta: { es: 'frentes: obra, consultoría y laboratorio', en: 'areas: construction, consulting and laboratory' } },
  ],
};

// Crédito del sitio web (pie de página).
export const disenador = { email: 'ingenierogian@gmail.com' };

export const telefonoHref = (numero: string) => `tel:+57${numero.replace(/\s/g, '')}`;

export const whatsappUrl = (mensaje: string) => `https://wa.me/${empresa.whatsapp}?text=${encodeURIComponent(mensaje)}`;
