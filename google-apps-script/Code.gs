const PRODUCT_SHEET_NAME = 'Productos';
const CONFIG_SHEET_NAME = 'Configuracion';

const PRODUCT_HEADERS = [
  'id',
  'nombre',
  'descripcion',
  'categoria',
  'precio',
  'imagenUrl',
  'whatsapp',
  'instagram',
  'visible',
  'orden',
  'fechaAlta',
  'fechaModificacion',
];

const CONFIG_HEADERS = [
  'businessName',
  'logoUrl',
  'primaryColor',
  'secondaryColor',
  'whatsapp',
  'instagram',
  'welcomeText',
  'heroImageUrl',
];

function doGet(event) {
  try {
    const action = event.parameter.action || 'listProducts';
    if (action === 'listProducts') return json({ ok: true, products: listProducts_() });
    if (action === 'getConfig') return json({ ok: true, config: getConfig_() });
    return json({ ok: false, error: 'Accion GET no soportada.' }, 400);
  } catch (error) {
    return json({ ok: false, error: error.message }, 500);
  }
}

function doPost(event) {
  try {
    const body = parseBody_(event);
    const action = body.action;

    if (action === 'createProduct') {
      return json({ ok: true, product: createProduct_(body.product || {}) });
    }

    if (action === 'updateProduct') {
      return json({ ok: true, product: updateProduct_(body.product || {}) });
    }

    if (action === 'deleteProduct') {
      deleteProduct_(body.id);
      return json({ ok: true });
    }

    if (action === 'updateConfig') {
      return json({ ok: true, config: updateConfig_(body.config || {}) });
    }

    return json({ ok: false, error: 'Accion POST no soportada.' }, 400);
  } catch (error) {
    return json({ ok: false, error: error.message }, 500);
  }
}

function doPut(event) {
  const body = parseBody_(event);
  body.action = 'updateProduct';
  return doPost({ postData: { contents: JSON.stringify(body) } });
}

function doDelete(event) {
  const body = parseBody_(event);
  body.action = 'deleteProduct';
  return doPost({ postData: { contents: JSON.stringify(body) } });
}

function listProducts_() {
  const sheet = getSheet_(PRODUCT_SHEET_NAME, PRODUCT_HEADERS);
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  return values.slice(1).filter(row => row.some(Boolean)).map(rowToProduct_);
}

function createProduct_(product) {
  const sheet = getSheet_(PRODUCT_SHEET_NAME, PRODUCT_HEADERS);
  const now = new Date().toISOString();
  const newProduct = {
    id: product.id || Utilities.getUuid(),
    nombre: product.nombre || '',
    descripcion: product.descripcion || '',
    categoria: product.categoria || '',
    precio: product.precio || '',
    imagenUrl: product.imagenUrl || '',
    whatsapp: product.whatsapp || '',
    instagram: product.instagram || '',
    visible: normalizeVisible_(product.visible),
    orden: product.orden || '',
    fechaAlta: now,
    fechaModificacion: now,
  };

  sheet.appendRow(PRODUCT_HEADERS.map(header => newProduct[header] || ''));
  return newProduct;
}

function updateProduct_(product) {
  if (!product.id) throw new Error('Falta id del producto.');
  const sheet = getSheet_(PRODUCT_SHEET_NAME, PRODUCT_HEADERS);
  const rowNumber = findProductRow_(sheet, product.id);
  if (!rowNumber) throw new Error('Producto no encontrado.');

  const existing = rowToProduct_(sheet.getRange(rowNumber, 1, 1, PRODUCT_HEADERS.length).getValues()[0]);
  const updated = {
    ...existing,
    ...product,
    visible: normalizeVisible_(product.visible),
    fechaAlta: existing.fechaAlta || new Date().toISOString(),
    fechaModificacion: new Date().toISOString(),
  };

  sheet.getRange(rowNumber, 1, 1, PRODUCT_HEADERS.length).setValues([
    PRODUCT_HEADERS.map(header => updated[header] || ''),
  ]);
  return updated;
}

function deleteProduct_(id) {
  if (!id) throw new Error('Falta id del producto.');
  const sheet = getSheet_(PRODUCT_SHEET_NAME, PRODUCT_HEADERS);
  const rowNumber = findProductRow_(sheet, id);
  if (!rowNumber) throw new Error('Producto no encontrado.');
  sheet.deleteRow(rowNumber);
}

function getConfig_() {
  const sheet = getSheet_(CONFIG_SHEET_NAME, CONFIG_HEADERS);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    sheet.appendRow(['Mi Emprendimiento', '', '#2f6f5e', '#f2b84b', '', '', 'Bienvenidos a nuestro catalogo.', '']);
  }

  const row = sheet.getRange(2, 1, 1, CONFIG_HEADERS.length).getValues()[0];
  return rowToObject_(CONFIG_HEADERS, row);
}

function updateConfig_(config) {
  const sheet = getSheet_(CONFIG_SHEET_NAME, CONFIG_HEADERS);
  const current = getConfig_();
  const updated = { ...current, ...config };
  sheet.getRange(2, 1, 1, CONFIG_HEADERS.length).setValues([
    CONFIG_HEADERS.map(header => updated[header] || ''),
  ]);
  return updated;
}

function getSheet_(name, headers) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);

  const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const shouldWriteHeaders = headers.some((header, index) => currentHeaders[index] !== header);
  if (shouldWriteHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function findProductRow_(sheet, id) {
  const values = sheet.getDataRange().getValues();
  for (let index = 1; index < values.length; index += 1) {
    if (String(values[index][0]) === String(id)) return index + 1;
  }
  return null;
}

function rowToProduct_(row) {
  return rowToObject_(PRODUCT_HEADERS, row);
}

function rowToObject_(headers, row) {
  return headers.reduce((object, header, index) => {
    object[header] = row[index] === undefined || row[index] === null ? '' : row[index];
    return object;
  }, {});
}

function normalizeVisible_(value) {
  const normalized = String(value).trim().toUpperCase();
  return value === true || normalized === 'SI' || normalized === 'TRUE' || normalized === '1' ? 'SI' : 'NO';
}

function parseBody_(event) {
  if (!event || !event.postData || !event.postData.contents) return {};
  return JSON.parse(event.postData.contents);
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
