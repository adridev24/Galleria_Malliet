# Google Apps Script

Este script convierte Google Sheets en una mini API para la galeria y valida el login del panel admin sin exponer la contraseña en el frontend.

## Hojas

El script crea automaticamente las hojas si no existen:

- `Productos`
- `Configuracion`

`Productos` usa estos encabezados:

```text
id, nombre, marca, modelo, anio, km, descripcion, categoria, precio, moneda, combustible, transmision, motor, color, puertas, ubicacion, imagenUrl, whatsapp, instagram, visible, orden, fechaAlta, fechaModificacion
```

`Configuracion` usa formato key/value:

```text
key, value
```

Filas necesarias para login:

```text
admin_user, admin
admin_password_hash, HASH_SHA256_DE_LA_PASSWORD
```

El hash no se devuelve en `getConfig`.

## Generar hash inicial

En Apps Script podes ejecutar:

```js
function generarHashInicial() {
  Logger.log(hashPassword('Malliet2026!'));
}
```

Luego copia el valor del log y pegalo en `Configuracion`, key `admin_password_hash`.

## Publicacion

1. Crea una planilla nueva en Google Sheets.
2. Abri `Extensiones > Apps Script`.
3. Pega el contenido de `Code.gs`.
4. Guarda el proyecto.
5. Ejecuta `generarHashInicial` si necesitas calcular el hash inicial.
6. Elegi `Implementar > Nueva implementacion`.
7. Tipo: `Aplicacion web`.
8. Ejecutar como: `Yo`.
9. Quien tiene acceso: `Cualquier persona`.
10. Copia la URL `/exec` y usala como `VITE_API_URL`.

Google Apps Script trabaja de forma mas confiable con `GET` y `POST` desde aplicaciones web. Por eso la app React envia crear, actualizar y eliminar como `POST` con una propiedad `action`, aunque el archivo tambien deja funciones `doPut` y `doDelete` preparadas.