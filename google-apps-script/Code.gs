const PRODUCT_SHEET_NAME = 'Productos';
const CONFIG_SHEET_NAME = 'Configuracion';

const PRODUCT_HEADERS = [
  'id',
  'nombre',
  'marca',
  'modelo',
  'anio',
  'km',
  'descripcion',
  'categoria',
  'precio',
  'moneda',
  'combustible',
  'transmision',
  'motor',
  'color',
  'puertas',
  'ubicacion',
  'imagenUrl',
  'whatsapp',
  'instagram',
  'visible',
  'orden',
  'fechaAlta',
  'fechaModificacion',
];

const CONFIG_HEADERS = ['key', 'value'];
const VISUAL_CONFIG_KEYS = [
  'businessName',
  'logoUrl',
  'primaryColor',
  'secondaryColor',
  'whatsapp',
  'instagram',
  'welcomeText',
  'heroImageUrl',
];

const DEFAULT_CONFIG = {
  businessName: 'MALLIET Automotores',
  logoUrl: '/assets/logo.PNG',
  primaryColor: '#0b0b0d',
  secondaryColor: '#d7b46a',
  whatsapp: '03447436621',
  instagram: '',
  welcomeText: 'Seleccion de vehiculos usados y seminuevos, revisados y listos para transferir.',
  heroImageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=85',
  admin_user: 'admin',
  admin_password_hash: hashPassword('Malliet2026!'),
};

function doGet(event) {
  try {
    const action = event.parameter.action || 'listProducts';
    if (action === 'listProducts') return json({ ok: true, products: listProducts_() });
    if (action === 'getConfig') return json({ ok: true, config: getConfig_() });
    return json({ ok: false, error: 'Accion GET no soportada.' });
  } catch (error) {
    return json({ ok: false, error: error.message });
  }
}

function doPost(event) {
  try {
    const body = parseBody_(event);
    const action = body.action;

    if (action === 'login') {
      return json(login_(body.user || '', body.password || ''));
    }

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

    return json({ ok: false, error: 'Accion POST no soportada.' });
  } catch (error) {
    return json({ ok: false, error: error.message });
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

function login_(user, password) {
  const config = getConfigKeyValue_();
  const expectedUser = String(config.admin_user || '').trim();
  const expectedHash = String(config.admin_password_hash || '').trim().toLowerCase();
  const receivedUser = String(user || '').trim();
  const receivedHash = hashPassword(password);

  if (receivedUser === expectedUser && receivedHash === expectedHash) {
    return { success: true };
  }

  return {
    success: false,
    message: 'Usuario o contraseña incorrectos',
  };
}

function listProducts_() {
  const sheet = getSheet_(PRODUCT_SHEET_NAME, PRODUCT_HEADERS);
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const headers = values[0];
  return values.slice(1).filter(row => row.some(Boolean)).map(row => rowToObject_(headers, row));
}

function createProduct_(product) {
  const sheet = getSheet_(PRODUCT_SHEET_NAME, PRODUCT_HEADERS);
  const now = new Date().toISOString();
  const newProduct = buildProduct_({
    ...product,
    id: product.id || Utilities.getUuid(),
    nombre: product.nombre || buildVehicleName_(product),
    visible: normalizeVisible_(product.visible),
    fechaAlta: now,
    fechaModificacion: now,
  });

  sheet.appendRow(PRODUCT_HEADERS.map(header => newProduct[header] || ''));
  return newProduct;
}

function updateProduct_(product) {
  if (!product.id) throw new Error('Falta id del producto.');
  const sheet = getSheet_(PRODUCT_SHEET_NAME, PRODUCT_HEADERS);
  const rowNumber = findProductRow_(sheet, product.id);
  if (!rowNumber) throw new Error('Producto no encontrado.');

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const existing = rowToObject_(headers, sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0]);
  const updated = buildProduct_({
    ...existing,
    ...product,
    nombre: product.nombre || existing.nombre || buildVehicleName_(product),
    visible: normalizeVisible_(product.visible),
    fechaAlta: existing.fechaAlta || new Date().toISOString(),
    fechaModificacion: new Date().toISOString(),
  });

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
  const config = getConfigKeyValue_();
  return VISUAL_CONFIG_KEYS.reduce((publicConfig, key) => {
    publicConfig[key] = config[key] || '';
    return publicConfig;
  }, {});
}

function updateConfig_(config) {
  const sheet = getConfigSheet_();
  const current = getConfigKeyValue_();
  const next = { ...current };

  VISUAL_CONFIG_KEYS.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      next[key] = config[key] || '';
    }
  });

  writeConfigKeyValue_(sheet, next);
  return getConfig_();
}

function getConfigKeyValue_() {
  const sheet = getConfigSheet_();
  const values = sheet.getDataRange().getValues();
  const config = { ...DEFAULT_CONFIG };

  values.slice(1).forEach(row => {
    const key = String(row[0] || '').trim();
    if (key) config[key] = row[1] === undefined || row[1] === null ? '' : String(row[1]);
  });

  const missingKeys = Object.keys(DEFAULT_CONFIG).some(key => !values.slice(1).some(row => String(row[0] || '').trim() === key));
  if (missingKeys) writeConfigKeyValue_(sheet, config);

  return config;
}

function getConfigSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(CONFIG_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(CONFIG_SHEET_NAME);

  const data = sheet.getDataRange().getValues();
  const headers = data[0] || [];
  const isKeyValue = headers[0] === 'key' && headers[1] === 'value';

  if (!isKeyValue) {
    const migrated = { ...DEFAULT_CONFIG };
    if (data.length > 1 && headers.length > 0) {
      const oldConfig = rowToObject_(headers, data[1]);
      VISUAL_CONFIG_KEYS.forEach(key => {
        if (oldConfig[key] !== undefined && oldConfig[key] !== '') migrated[key] = oldConfig[key];
      });
    }
    sheet.clear();
    writeConfigKeyValue_(sheet, migrated);
  }

  sheet.getRange(1, 1, 1, CONFIG_HEADERS.length).setValues([CONFIG_HEADERS]);
  sheet.setFrozenRows(1);
  return sheet;
}

function writeConfigKeyValue_(sheet, config) {
  const rows = Object.keys(config).map(key => [key, config[key] || '']);
  sheet.clear();
  sheet.getRange(1, 1, 1, CONFIG_HEADERS.length).setValues([CONFIG_HEADERS]);
  if (rows.length) sheet.getRange(2, 1, rows.length, CONFIG_HEADERS.length).setValues(rows);
  sheet.setFrozenRows(1);
}

function getSheet_(name, headers) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);

  const currentLastColumn = Math.max(sheet.getLastColumn(), headers.length);
  const currentHeaders = sheet.getRange(1, 1, 1, currentLastColumn).getValues()[0];
  const existingData = sheet.getDataRange().getValues();
  const shouldWriteHeaders = headers.some((header, index) => currentHeaders[index] !== header);

  if (shouldWriteHeaders) {
    const oldHeaders = existingData[0] || [];
    const rows = existingData.slice(1).filter(row => row.some(Boolean)).map(row => {
      const object = rowToObject_(oldHeaders, row);
      return headers.map(header => object[header] || '');
    });
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    if (rows.length) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
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

function buildProduct_(product) {
  return PRODUCT_HEADERS.reduce((object, header) => {
    object[header] = product[header] || '';
    return object;
  }, {});
}

function buildVehicleName_(product) {
  return [product.marca, product.modelo, product.anio].filter(Boolean).join(' ');
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

// Guarda en Configuracion la key admin_password_hash con el resultado de esta funcion.
// Para calcular otro hash inicial, cambia el texto y ejecuta generarHashInicial desde Apps Script.
function hashPassword(password) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(password || ''), Utilities.Charset.UTF_8);
  return digest.map(byte => {
    const value = byte < 0 ? byte + 256 : byte;
    return value.toString(16).padStart(2, '0');
  }).join('');
}

function generarHashInicial() {
  Logger.log(hashPassword('Malliet2026!'));
}