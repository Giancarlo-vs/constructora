// Formato de peticiones, quejas, reclamos y sugerencias (FO-GC-02 del SGC).
// `valor` es lo que se guarda en la Hoja, siempre en español, y debe coincidir
// con TIPOS_PQRS y SERVICIOS_PQRS en google-apps-script/Codigo.gs.

export const formatoPqrs = {
  codigo: 'FO-GC-02',
  version: '01',
  emision: '09/11/2026',
  proceso: {
    es: 'Gestión comercial (ISO 9001:2015, num. 8.2.1 y 9.1.2)',
    en: 'Commercial management (ISO 9001:2015, cl. 8.2.1 and 9.1.2)',
  },
};

export const tiposPqrs = [
  {
    valor: 'Petición',
    texto: { es: 'Petición', en: 'Request' },
    ayuda: { es: 'Solicitud de información, documentos o un servicio', en: 'Request for information, documents or a service' },
  },
  {
    valor: 'Queja',
    texto: { es: 'Queja', en: 'Complaint' },
    ayuda: { es: 'Inconformidad con la atención o el trato del personal', en: 'Dissatisfaction with our service or staff conduct' },
  },
  {
    valor: 'Reclamo',
    texto: { es: 'Reclamo', en: 'Claim' },
    ayuda: { es: 'Inconformidad con un servicio, resultado, informe o factura', en: 'Dissatisfaction with a service, result, report or invoice' },
  },
  {
    valor: 'Sugerencia',
    texto: { es: 'Sugerencia', en: 'Suggestion' },
    ayuda: { es: 'Propuesta para mejorar nuestros servicios', en: 'A proposal to improve our services' },
  },
  {
    valor: 'Felicitación',
    texto: { es: 'Felicitación', en: 'Compliment' },
    ayuda: { es: 'Reconocimiento al servicio o al personal', en: 'Recognition of our service or staff' },
  },
];

export const serviciosPqrs = [
  { valor: 'Estudios de suelos y geotecnia', texto: { es: 'Estudios de suelos y geotecnia', en: 'Soil studies and geotechnics' } },
  { valor: 'Ensayos de laboratorio', texto: { es: 'Ensayos de laboratorio', en: 'Laboratory testing' } },
  { valor: 'Asesoría geotécnica', texto: { es: 'Asesoría geotécnica', en: 'Geotechnical consulting' } },
  { valor: 'Construcciones civiles', texto: { es: 'Construcciones civiles', en: 'Civil construction' } },
  { valor: 'Atención, cotización o facturación', texto: { es: 'Atención, cotización o facturación', en: 'Customer service, quotes or invoicing' } },
  { valor: 'Otro', texto: { es: 'Otro', en: 'Other' } },
];
