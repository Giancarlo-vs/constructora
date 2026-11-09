// Recibe la encuesta de satisfacción (FO-GC-01) y las PQRS (FO-GC-02) de la web, las guarda
// en la Hoja y envía un aviso por correo. Se instala como proyecto de Apps Script en la cuenta de la empresa.
// En Configuración del proyecto → Propiedades de la secuencia de comandos van:
// TURNSTILE_SECRET (clave secreta, nunca en este archivo) y HOJA_ID (identificador de la Hoja,
// necesario si el proyecto no se creó desde Extensiones → Apps Script de la propia Hoja).

const HOJA = 'Respuestas';
const HOJA_PQRS = 'PQRS';
const ZONA = 'America/Bogota';

// Criterio para sugerir una acción correctiva o de mejora (num. 10.2). Lo define el SGC.
const PROMEDIO_MINIMO = 4;
const CALIFICACION_CRITICA = 2;

// Los `id` deben coincidir con src/data/encuesta.ts.
const SERVICIOS = [
  ['s1', 'Estudios de suelos y geotecnia'],
  ['s2', 'Ensayos de laboratorio'],
  ['s3', 'Asesoría y consultoría geotécnica'],
  ['s4', 'Cumplimiento en obras civiles'],
  ['s5', 'Construcción de obras civiles'],
];
const ATENCION = [
  ['a1', 'Atención y amabilidad'],
  ['a2', 'Cumplimiento de plazos'],
  ['a3', 'Resultados e informes'],
  ['a4', 'Relación calidad / precio'],
  ['a5', 'Atención de PQRS'],
];
const PREGUNTAS = SERVICIOS.concat(ATENCION);

const ENCABEZADOS = [
  'Recibido',
  'Formato',
  'Versión',
  'Cliente',
  'Proyecto',
  'Fecha',
  'Teléfono / Correo',
  ...PREGUNTAS.map((p) => p[1]),
  'Promedio / 5',
  '¿Recomendaría?',
  '¿Qué podemos mejorar?',
  'Nombre',
  'Autoriza datos (Ley 1581)',
  '¿Requiere acción? (sugerido)',
  'Decisión y responsable',
];

// Deben coincidir con src/data/pqrs.ts.
const TIPOS_PQRS = ['Petición', 'Queja', 'Reclamo', 'Sugerencia', 'Felicitación'];
const SERVICIOS_PQRS = [
  'Estudios de suelos y geotecnia',
  'Ensayos de laboratorio',
  'Asesoría geotécnica',
  'Construcciones civiles',
  'Atención, cotización o facturación',
  'Otro',
];
const DIAS_RESPUESTA_PQRS = 5;

const ENCABEZADOS_PQRS = [
  'Radicado',
  'Fecha de recibo',
  'Formato',
  'Versión',
  'Medio de recepción',
  'Nombre o razón social',
  'NIT / C.C.',
  'Teléfono',
  'Correo electrónico',
  'Dirección',
  'Municipio',
  'Proyecto / cotización / informe',
  'Tipo de solicitud',
  'Servicio relacionado',
  'Descripción',
  'Nombre del solicitante',
  'Autoriza datos (Ley 1581)',
  'Fecha límite (sin descontar festivos)',
  // Sección 5 del formato: uso interno, la diligencia la empresa.
  'Responsable asignado',
  'Análisis de la causa',
  'Respuesta o solución dada',
  'Fecha de respuesta',
  'Días hábiles transcurridos',
  '¿Requiere acción? (num. 10.2)',
  'N.º de acción',
  'Conformidad del cliente',
  'Cerró (nombre)',
];

function abrirLibro() {
  const id = PropertiesService.getScriptProperties().getProperty('HOJA_ID');
  return id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
}

/** Ejecutar una vez desde el editor: crea la hoja de respuestas y pide los permisos. */
function configurar() {
  const libro = abrirLibro();
  const hoja = prepararHoja(libro, HOJA, ENCABEZADOS);
  prepararHoja(libro, HOJA_PQRS, ENCABEZADOS_PQRS);

  const columna = ENCABEZADOS.indexOf('¿Requiere acción? (sugerido)') + 1;
  const rango = hoja.getRange(2, columna, hoja.getMaxRows() - 1);
  hoja.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Sí').setBackground('#f8c9a0').setRanges([rango]).build(),
  ]);
  Logger.log('Hoja lista. Avisos a: ' + Session.getEffectiveUser().getEmail());
}

function prepararHoja(libro, nombre, encabezados) {
  const hoja = libro.getSheetByName(nombre) || libro.insertSheet(nombre);
  hoja.getRange(1, 1, 1, encabezados.length).setValues([encabezados]).setFontWeight('bold').setBackground('#0e3440').setFontColor('#ffffff').setWrap(true);
  hoja.setFrozenRows(1);
  return hoja;
}

function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);
    // Trampa para robots: se responde "ok" sin guardar nada.
    if (datos.sitio) return responder({ ok: true });

    if (datos.registro === 'pqrs') {
      const pqrs = validarPqrs(datos);
      verificarTurnstile(datos.turnstile);
      pqrs.radicado = guardarPqrs(pqrs);
      avisarPqrs(pqrs);
      confirmarPqrs(pqrs);
      return responder({ ok: true, radicado: pqrs.radicado });
    }

    const encuesta = validar(datos);
    verificarTurnstile(datos.turnstile);
    guardar(encuesta);
    avisar(encuesta);
    return responder({ ok: true });
  } catch (error) {
    console.error(error);
    return responder({ ok: false, error: error.codigo || 'interno' });
  }
}

function fallo(codigo) {
  const error = new Error(codigo);
  error.codigo = codigo;
  throw error;
}

function validar(d) {
  const permitidos = ['1', '2', '3', '4', '5', 'N/A'];

  const respuestas = {};
  for (const [id] of PREGUNTAS) {
    if (!permitidos.includes(d[id])) fallo('calificacion');
    respuestas[id] = d[id] === 'N/A' ? 'N/A' : Number(d[id]);
  }
  if (SERVICIOS.every(([id]) => respuestas[id] === 'N/A')) fallo('sin_servicios');
  if (d.autoriza !== true) fallo('sin_autorizacion');
  if (d.recomendaria !== 'Sí' && d.recomendaria !== 'No') fallo('recomendaria');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.fecha || '')) fallo('fecha');

  const encuesta = {
    formato: texto(d.formato, 20),
    version: texto(d.version, 10),
    cliente: texto(d.cliente, 150),
    proyecto: texto(d.proyecto, 200),
    fecha: d.fecha,
    contacto: texto(d.contacto, 150),
    respuestas,
    recomendaria: d.recomendaria,
    mejorar: texto(d.mejorar, 2000),
    nombre: texto(d.nombre, 150),
  };
  if (!encuesta.cliente || !encuesta.proyecto || !encuesta.nombre) fallo('incompleta');

  const notas = PREGUNTAS.map(([id]) => respuestas[id]).filter((n) => n !== 'N/A');
  encuesta.promedio = Math.round((notas.reduce((a, b) => a + b, 0) / notas.length) * 100) / 100;
  encuesta.accion = encuesta.promedio < PROMEDIO_MINIMO || Math.min(...notas) <= CALIFICACION_CRITICA || d.recomendaria === 'No' ? 'Sí' : 'No';
  return encuesta;
}

function texto(valor, maximo) {
  return String(valor === undefined || valor === null ? '' : valor)
    .trim()
    .slice(0, maximo);
}

function verificarTurnstile(token) {
  const secreto = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET');
  if (!secreto) throw new Error('Falta la propiedad TURNSTILE_SECRET');
  const respuesta = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post',
    payload: { secret: secreto, response: String(token || '') },
    muteHttpExceptions: true,
  });
  if (!JSON.parse(respuesta.getContentText()).success) {
    const error = new Error('turnstile');
    error.codigo = 'turnstile';
    throw error;
  }
}

// Un texto que empiece por = + - @ sería interpretado por la hoja como fórmula.
function seguro(valor) {
  return typeof valor === 'string' && /^[=+\-@\t\r]/.test(valor) ? "'" + valor : valor;
}

function guardar(c) {
  const recibido = Utilities.formatDate(new Date(), ZONA, 'yyyy-MM-dd HH:mm');
  const fila = [
    recibido,
    c.formato,
    c.version,
    c.cliente,
    c.proyecto,
    c.fecha,
    c.contacto,
    ...PREGUNTAS.map(([id]) => c.respuestas[id]),
    c.promedio,
    c.recomendaria,
    c.mejorar,
    c.nombre,
    'Sí',
    c.accion,
    '',
  ];
  abrirLibro().getSheetByName(HOJA).appendRow(fila.map(seguro));
}

// Si el correo falla, la respuesta ya quedó guardada: no se informa error al cliente.
function avisar(c) {
  try {
    const asunto = `Encuesta ${c.formato}: ${c.cliente} (${c.promedio} / 5)`.replace(/[\r\n]+/g, ' ');
    const cuerpo = [
      `Cliente: ${c.cliente}`,
      `Proyecto: ${c.proyecto}`,
      `Responde: ${c.nombre}`,
      `Contacto: ${c.contacto || '—'}`,
      '',
      ...PREGUNTAS.map(([id, titulo]) => `${titulo}: ${c.respuestas[id]}`),
      '',
      `Promedio: ${c.promedio} / 5`,
      `¿Recomendaría?: ${c.recomendaria}`,
      `¿Qué podemos mejorar?: ${c.mejorar || '—'}`,
      '',
      `¿Requiere acción? (sugerido): ${c.accion}`,
      abrirLibro().getUrl(),
    ].join('\n');
    MailApp.sendEmail(Session.getEffectiveUser().getEmail(), asunto, cuerpo);
  } catch (error) {
    console.error(error);
  }
}

function validarPqrs(d) {
  if (!TIPOS_PQRS.includes(d.tipo)) fallo('tipo');
  if (!SERVICIOS_PQRS.includes(d.servicio)) fallo('servicio');
  if (d.autoriza !== true) fallo('sin_autorizacion');

  const otro = texto(d.servicioOtro, 100);
  const pqrs = {
    formato: texto(d.formato, 20),
    version: texto(d.version, 10),
    nombre: texto(d.nombre, 150),
    documento: texto(d.documento, 30),
    telefono: texto(d.telefono, 40),
    correo: texto(d.correo, 150),
    idioma: d.idioma === 'en' ? 'en' : 'es',
    direccion: texto(d.direccion, 200),
    municipio: texto(d.municipio, 100),
    proyecto: texto(d.proyecto, 200),
    tipo: d.tipo,
    servicio: d.servicio === 'Otro' ? 'Otro: ' + otro : d.servicio,
    descripcion: texto(d.descripcion, 4000),
    firma: texto(d.firma, 150),
  };
  if (!pqrs.nombre || !pqrs.documento || !pqrs.telefono || !pqrs.descripcion || !pqrs.firma) fallo('incompleta');
  if (d.servicio === 'Otro' && !otro) fallo('incompleta');
  return pqrs;
}

// Solo salta fines de semana: con festivos de por medio, la fecha queda antes del plazo real.
function sumarDiasHabiles(fecha, dias) {
  const dia = 24 * 60 * 60 * 1000;
  let actual = fecha;
  for (let restantes = dias; restantes > 0; ) {
    actual = new Date(actual.getTime() + dia);
    if (Number(Utilities.formatDate(actual, ZONA, 'u')) <= 5) restantes--;
  }
  return actual;
}

// El consecutivo vive en las propiedades del script: borrar una fila no reutiliza un radicado.
function guardarPqrs(p) {
  const candado = LockService.getScriptLock();
  candado.waitLock(20000);
  try {
    const ahora = new Date();
    const anio = Utilities.formatDate(ahora, ZONA, 'yyyy');
    const propiedades = PropertiesService.getScriptProperties();
    const clave = 'PQRS_' + anio;
    const numero = Number(propiedades.getProperty(clave) || 0) + 1;
    const radicado = `PQRS-${anio}-${String(numero).padStart(4, '0')}`;
    const fila = [
      radicado,
      Utilities.formatDate(ahora, ZONA, 'yyyy-MM-dd HH:mm'),
      p.formato,
      p.version,
      'Otro: Página web',
      p.nombre,
      p.documento,
      p.telefono,
      p.correo,
      p.direccion,
      p.municipio,
      p.proyecto,
      p.tipo,
      p.servicio,
      p.descripcion,
      p.firma,
      'Sí',
      Utilities.formatDate(sumarDiasHabiles(ahora, DIAS_RESPUESTA_PQRS), ZONA, 'yyyy-MM-dd'),
    ];
    abrirLibro().getSheetByName(HOJA_PQRS).appendRow(fila.map(seguro));
    propiedades.setProperty(clave, String(numero));
    return radicado;
  } finally {
    candado.releaseLock();
  }
}

// Si el correo falla, la solicitud ya quedó radicada: no se informa error al cliente.
function avisarPqrs(p) {
  try {
    const asunto = `${p.radicado}: ${p.tipo} de ${p.nombre}`.replace(/[\r\n]+/g, ' ');
    const cuerpo = [
      `Radicado: ${p.radicado}`,
      `Tipo: ${p.tipo}`,
      `Servicio: ${p.servicio}`,
      '',
      `Nombre o razón social: ${p.nombre}`,
      `NIT / C.C.: ${p.documento}`,
      `Teléfono: ${p.telefono}`,
      `Correo: ${p.correo || '—'}`,
      `Dirección: ${p.direccion || '—'}`,
      `Municipio: ${p.municipio || '—'}`,
      `Proyecto / cotización / informe: ${p.proyecto || '—'}`,
      '',
      'Descripción:',
      p.descripcion,
      '',
      `Solicitante: ${p.firma}`,
      `Plazo de respuesta: ${DIAS_RESPUESTA_PQRS} días hábiles.`,
      abrirLibro().getUrl(),
    ].join('\n');
    MailApp.sendEmail(Session.getEffectiveUser().getEmail(), asunto, cuerpo);
  } catch (error) {
    console.error(error);
  }
}

// Texto fijo, sin nada de lo que escribió el solicitante, y máximo uno por dirección cada hora:
// así el formulario no sirve para enviar mensajes a terceros. Si falla, la solicitud ya quedó radicada.
function confirmarPqrs(p) {
  if (!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(p.correo)) return;
  try {
    const cache = CacheService.getScriptCache();
    const clave = 'confirmacion:' + p.correo.toLowerCase();
    if (cache.get(clave)) return;
    cache.put(clave, '1', 3600);

    const empresa = 'Ingesuelos Concalidad S.A.S.';
    const mensaje =
      p.idioma === 'en'
        ? {
            asunto: `We received your submission ${p.radicado}`,
            cuerpo: `Hello,\n\nWe have received your submission. Your tracking number is ${p.radicado}.\nWe will reply within a maximum of ${DIAS_RESPUESTA_PQRS} business days.\n\nIf you did not make this submission, please disregard this message.\n\n${empresa}`,
          }
        : {
            asunto: `Recibimos su solicitud ${p.radicado}`,
            cuerpo: `Hola:\n\nRecibimos su solicitud. Su número de radicado es ${p.radicado}.\nLe responderemos en un plazo máximo de ${DIAS_RESPUESTA_PQRS} días hábiles.\n\nSi usted no realizó esta solicitud, por favor ignore este mensaje.\n\n${empresa}`,
          };
    MailApp.sendEmail(p.correo, mensaje.asunto, mensaje.cuerpo, { name: empresa });
  } catch (error) {
    console.error(error);
  }
}

function responder(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(ContentService.MimeType.JSON);
}
