import { appConfig, defaultSiteConfig } from '../config/appConfig';
import { demoProducts } from '../data/demoProducts';

async function request(action, payload = {}, method = 'POST') {
  if (!appConfig.apiUrl) {
    throw new Error('Falta configurar VITE_API_URL.');
  }

  const isGet = method === 'GET';
  const url = isGet
    ? `${appConfig.apiUrl}?action=${encodeURIComponent(action)}`
    : appConfig.apiUrl;

  const response = await fetch(url, {
    method: isGet ? 'GET' : 'POST',
    headers: isGet ? undefined : { 'Content-Type': 'text/plain;charset=utf-8' },
    body: isGet ? undefined : JSON.stringify({ action, ...payload }),
  });

  const data = await response.json();
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || 'La API no respondio correctamente.');
  }
  return data;
}

export async function listProducts() {
  if (!appConfig.apiUrl) return demoProducts;
  const data = await request('listProducts', {}, 'GET');
  return data.products || [];
}

export async function createProduct(product) {
  const data = await request('createProduct', { product });
  return data.product;
}

export async function updateProduct(product) {
  const data = await request('updateProduct', { product });
  return data.product;
}

export async function deleteProduct(id) {
  return request('deleteProduct', { id });
}

export async function getSiteConfig() {
  try {
    const data = await request('getConfig', {}, 'GET');
    return { ...defaultSiteConfig, ...(data.config || {}) };
  } catch (error) {
    if (!appConfig.apiUrl) return defaultSiteConfig;
    throw error;
  }
}

export async function updateSiteConfig(config) {
  const data = await request('updateConfig', { config });
  return { ...defaultSiteConfig, ...(data.config || {}) };
}
