// Encuesta de satisfacción (formato FO-GC-01 del SGC).
// Si cambian las preguntas, actualiza también los `id` y títulos en google-apps-script/Codigo.gs.

export const formato = {
  codigo: 'FO-GC-01',
  version: '01',
  emision: '09/11/2026',
  proceso: 'Evaluación y mejora (ISO 9001:2015, num. 9.1.2)',
};

// URL de la aplicación web de Apps Script y clave pública de Cloudflare Turnstile.
export const conexion = {
  endpoint: '',
  turnstile: '0x4AAAAAAF6cSrILXHbUq0dN',
};

export const correoDatos = 'ingesuelosconcalidad@gmail.com';

export const escala = [
  { valor: '1', texto: 'Muy malo' },
  { valor: '2', texto: 'Malo' },
  { valor: '3', texto: 'Regular' },
  { valor: '4', texto: 'Bueno' },
  { valor: '5', texto: 'Excelente' },
  { valor: 'N/A', texto: 'No aplica' },
];

export const servicios = [
  { id: 's1', texto: 'Estudios de suelos y geotecnia (SPT, apiques, informe)' },
  { id: 's2', texto: 'Ensayos de laboratorio de suelos, concretos y pavimentos' },
  { id: 's3', texto: 'Asesoría y consultoría geotécnica' },
  { id: 's4', texto: 'Cumplimiento en la ejecución de obras civiles' },
  { id: 's5', texto: 'Construcción de obras civiles' },
];

export const atencion = [
  { id: 'a1', texto: 'Atención y amabilidad del personal' },
  { id: 'a2', texto: 'Cumplimiento de fechas y plazos de entrega' },
  { id: 'a3', texto: 'Claridad y confiabilidad de los resultados e informes' },
  { id: 'a4', texto: 'Relación calidad / precio' },
  { id: 'a5', texto: 'Atención de solicitudes, quejas y reclamos (PQRS)' },
];
