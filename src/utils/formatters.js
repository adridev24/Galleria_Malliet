export const placeholderImage =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><rect width="1200" height="900" fill="%231f1f23"/><path d="M235 590h730l-62-125c-22-43-66-70-114-70H455c-48 0-92 27-114 70z" fill="%23333338"/><circle cx="405" cy="610" r="58" fill="%230b0b0d"/><circle cx="805" cy="610" r="58" fill="%230b0b0d"/><text x="600" y="735" text-anchor="middle" font-family="Arial" font-size="42" fill="%23d7b46a">Imagen no disponible</text></svg>';

export function formatCurrency(value, currency = 'ARS') {
  if (value === undefined || value === null || value === '') return '';
  const number = Number(String(value).replace(/\./g, '').replace(',', '.'));
  if (Number.isNaN(number)) return value;
  const normalizedCurrency = String(currency || 'ARS').toUpperCase();
  const locale = normalizedCurrency === 'USD' ? 'en-US' : 'es-AR';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: normalizedCurrency,
    maximumFractionDigits: 0,
  }).format(number);
}

export function formatPrice(product) {
  return formatCurrency(product.precio, product.moneda || 'ARS');
}

export function formatKm(value) {
  if (value === undefined || value === null || value === '') return '';
  const number = Number(String(value).replace(/\./g, '').replace(',', '.'));
  if (Number.isNaN(number)) return `${value} km`;
  return `${new Intl.NumberFormat('es-AR').format(number)} km`;
}

export function getVehicleTitle(product) {
  const title = [product.marca, product.modelo, product.anio].filter(Boolean).join(' ');
  return title || product.nombre || 'Vehiculo';
}

export function getVehicleSpecs(product) {
  return [
    { label: 'Marca', value: product.marca },
    { label: 'Modelo', value: product.modelo },
    { label: 'Año', value: product.anio },
    { label: 'Km', value: formatKm(product.km) },
    { label: 'Combustible', value: product.combustible },
    { label: 'Transmision', value: product.transmision },
    { label: 'Motor', value: product.motor },
    { label: 'Color', value: product.color },
    { label: 'Puertas', value: product.puertas },
    { label: 'Ubicacion', value: product.ubicacion },
  ].filter((item) => item.value);
}

export function getVehicleSearchText(product) {
  return [
    product.nombre,
    product.descripcion,
    product.categoria,
    product.marca,
    product.modelo,
    product.anio,
    product.km,
    product.precio,
    product.moneda,
    product.combustible,
    product.transmision,
    product.motor,
    product.color,
    product.puertas,
    product.ubicacion,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function isVisible(value) {
  return value === true || ['SI', '1', 'TRUE', 'true', 'si', 'Si'].includes(String(value).trim());
}

export function normalizeWhatsapp(value = '') {
  return String(value).replace(/[^\d]/g, '');
}

export function buildWhatsappUrl(phone, productName) {
  const cleanPhone = normalizeWhatsapp(phone);
  const text = encodeURIComponent(`Hola, quiero consultar por ${productName}`);
  return cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : '';
}

export function safeUrl(value = '') {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export function sortByOrder(products) {
  return [...products].sort((a, b) => {
    const orderA = Number(a.orden || 999999);
    const orderB = Number(b.orden || 999999);
    if (orderA !== orderB) return orderA - orderB;
    return getVehicleTitle(a).localeCompare(getVehicleTitle(b), 'es');
  });
}