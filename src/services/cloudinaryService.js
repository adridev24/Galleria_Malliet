import { appConfig } from '../config/appConfig';

export async function uploadImage(file) {
  if (!appConfig.cloudinaryCloudName || !appConfig.cloudinaryUploadPreset) {
    throw new Error('Faltan VITE_CLOUDINARY_CLOUD_NAME o VITE_CLOUDINARY_UPLOAD_PRESET.');
  }

  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', appConfig.cloudinaryUploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${appConfig.cloudinaryCloudName}/image/upload`,
    { method: 'POST', body },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'No se pudo subir la imagen a Cloudinary.');
  }

  return data.secure_url;
}
