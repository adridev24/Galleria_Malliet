# Galeria Personalizable

Aplicacion React + Vite para publicar una galeria personalizable de vehiculos y administrarla con Google Sheets, Google Apps Script y Cloudinary. No usa backend Node, .NET ni base de datos tradicional.

## Stack

- React
- Vite
- JavaScript
- CSS moderno mobile first
- Google Sheets como almacenamiento
- Google Apps Script como mini API
- Cloudinary para imagenes con unsigned upload preset

## Configurar Google Sheets

1. Crea una planilla nueva.
2. Agrega una hoja llamada `Productos` con estos encabezados en la primera fila:

```text
id, nombre, descripcion, categoria, precio, imagenUrl, whatsapp, instagram, visible, orden, fechaAlta, fechaModificacion
```

3. Agrega otra hoja llamada `Configuracion` con estos encabezados:

```text
businessName, logoUrl, primaryColor, secondaryColor, whatsapp, instagram, welcomeText, heroImageUrl
```

El Apps Script incluido tambien puede crear ambas hojas automaticamente.

## Configurar Google Apps Script

1. En la planilla, entra a `Extensiones > Apps Script`.
2. Copia el contenido de `google-apps-script/Code.gs`.
3. Guarda el proyecto.
4. Publica con `Implementar > Nueva implementación`.
5. Selecciona `Aplicación web`.
6. Usa `Ejecutar como: Yo`.
7. Usa `Quién tiene acceso: Cualquier persona`.
8. Copia la URL terminada en `/exec`.

La API expone:

- `GET ?action=listProducts`
- `GET ?action=getConfig`
- `POST { action: "createProduct", product }`
- `POST { action: "updateProduct", product }`
- `POST { action: "deleteProduct", id }`
- `POST { action: "updateConfig", config }`

## Configurar Cloudinary

1. Crea una cuenta en Cloudinary.
2. En `Settings > Upload`, crea un unsigned upload preset.
3. Copia el `cloud name`.
4. Usa esos valores en las variables de entorno.

## Variables de entorno

Copia `.env.example` a `.env` y completa:

```text
VITE_API_URL=https://script.google.com/macros/s/AKfycb.../exec
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=tu_unsigned_upload_preset
VITE_ADMIN_PASSWORD=cambia-esta-clave
VITE_BUSINESS_NAME=MALLIET Automotores
VITE_DEFAULT_WHATSAPP=5491112345678
VITE_DEFAULT_INSTAGRAM=https://instagram.com/miemprendimiento
```

`VITE_ADMIN_PASSWORD` es una proteccion simple del panel. No reemplaza autenticacion avanzada, pero sirve para esta version sin backend.

## Ejecucion local

```bash
npm install
npm run dev
```

Luego abre la URL que muestra Vite. El panel esta en `/admin`.

## Deploy sugerido

### Vercel

1. Sube el repositorio a GitHub.
2. Importa el proyecto en Vercel.
3. Agrega las variables de entorno.
4. Deploy.

### Netlify

1. Sube el repositorio a GitHub.
2. Importa el proyecto en Netlify.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Agrega las variables de entorno.

## Arquitectura

La interfaz consume `src/services/productService.js`. Si en el futuro se reemplaza Google Sheets por una API real, la mayoria de los cambios deberian quedar concentrados en ese servicio.

La configuracion visual vive en la hoja `Configuracion` y se aplica al layout publico:

- nombre del negocio
- logo
- color principal
- color secundario
- WhatsApp por defecto
- Instagram por defecto
- texto de bienvenida
- imagen principal

La arquitectura queda lista para sumar deteccion automatica de colores desde el logo mas adelante, idealmente como una funcion nueva en `src/services` o `src/utils` sin tocar las pantallas.
