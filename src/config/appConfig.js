const rawApiUrl = import.meta.env.VITE_API_URL || '';
const isPlaceholder = (value) => !value || value.includes('AKfycb...') || value.startsWith('tu_');

export const appConfig = {
  apiUrl: isPlaceholder(rawApiUrl) ? '' : rawApiUrl,
  cloudinaryCloudName: isPlaceholder(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '') ? '' : import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  cloudinaryUploadPreset: isPlaceholder(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '') ? '' : import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  adminPassword: import.meta.env.VITE_ADMIN_PASSWORD || '',
  businessName: import.meta.env.VITE_BUSINESS_NAME || 'MALLIET Automotores',
  defaultWhatsapp: import.meta.env.VITE_DEFAULT_WHATSAPP || '03447436621',
  defaultInstagram: import.meta.env.VITE_DEFAULT_INSTAGRAM || '',
};

export const defaultSiteConfig = {
  businessName: appConfig.businessName,
  logoUrl: '/assets/logo.PNG',
  primaryColor: '#0b0b0d',
  secondaryColor: '#d7b46a',
  whatsapp: appConfig.defaultWhatsapp,
  instagram: appConfig.defaultInstagram,
  welcomeText: 'Seleccion de vehiculos usados y seminuevos, revisados y listos para transferir. Consultanos por financiacion, permutas y disponibilidad.',
  heroImageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=85',
};