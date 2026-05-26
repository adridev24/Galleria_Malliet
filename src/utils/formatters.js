export const placeholderImage =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><rect width="1200" height="900" fill="%23eef2f1"/><path d="M250 620h700L770 405 628 555 518 452z" fill="%23c9d8d3"/><circle cx="407" cy="340" r="70" fill="%23d9e4e0"/><text x="600" y="735" text-anchor="middle" font-family="Arial" font-size="42" fill="%23738880">Imagen no disponible</text></svg>';

export function formatCurrency(value) {
  if (value === undefined || value === null || value === '') return '';
  const number = Number(String(value).replace(',', '.'));
  if (Number.isNaN(number)) return value;
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(number);
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
    return String(a.nombre || '').localeCompare(String(b.nombre || ''), 'es');
  });
}
