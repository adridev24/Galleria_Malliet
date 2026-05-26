# Google Apps Script

Este script convierte Google Sheets en una mini API para la galeria.

## Hojas

El script crea automaticamente las hojas si no existen:

- `Productos`
- `Configuracion`

`Productos` usa estos encabezados:

```text
id, nombre, descripcion, categoria, precio, imagenUrl, whatsapp, instagram, visible, orden, fechaAlta, fechaModificacion
```

`Configuracion` usa estos encabezados:

```text
businessName, logoUrl, primaryColor, secondaryColor, whatsapp, instagram, welcomeText, heroImageUrl
```

## Publicacion

1. Crea una planilla nueva en Google Sheets.
2. Abri `Extensiones > Apps Script`.
3. Pegá el contenido de `Code.gs`.
4. Guardá el proyecto.
5. Elegí `Implementar > Nueva implementación`.
6. Tipo: `Aplicación web`.
7. Ejecutar como: `Yo`.
8. Quién tiene acceso: `Cualquier persona`.
9. Copiá la URL `/exec` y usala como `VITE_API_URL`.

Google Apps Script trabaja de forma más confiable con `GET` y `POST` desde aplicaciones web. Por eso la app React envia crear, actualizar y eliminar como `POST` con una propiedad `action`, aunque el archivo tambien deja funciones `doPut` y `doDelete` preparadas.
