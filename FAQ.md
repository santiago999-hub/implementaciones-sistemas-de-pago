# FAQ - Preguntas Frecuentes

## Sistema de Pagos Online

### 🔧 Instalación y Configuración

#### ❓ ¿Qué requisitos necesito para ejecutar el sistema?
**R:** Solo necesitas tener instalado Node.js (versión 14 o superior). El sistema incluye todas las demás dependencias que se instalan automáticamente con `npm install`.

#### ❓ ¿Necesito instalar una base de datos?
**R:** No. El sistema usa SQLite, que es una base de datos embebida. El archivo de base de datos (`pagos.db`) se crea automáticamente cuando inicias el servidor por primera vez.

#### ❓ ¿Cómo instalo las dependencias?
**R:** Ejecuta `npm install` en la carpeta del proyecto. Este comando instalará Express, SQLite3, body-parser, cors y otras dependencias necesarias.

#### ❓ El servidor no inicia, ¿qué hago?
**R:** Verifica que:
1. Node.js esté instalado: `node --version`
2. Las dependencias estén instaladas: `npm install`
3. El puerto 3000 esté disponible (o cambia el puerto en `server.js`)
4. No haya errores en los archivos JavaScript

---

### 💳 Uso del Sistema de Pagos

#### ❓ ¿Cómo realizo un pago?
**R:** 
1. Abre http://localhost:3000
2. Completa el formulario con nombre, apellido, empresa, importe y método de pago
3. Haz clic en "Confirmar Pago"
4. Verás una confirmación en pantalla

#### ❓ ¿Qué métodos de pago están disponibles?
**R:** Actualmente el sistema soporta Visa y Mastercard. Puedes agregar más métodos modificando el formulario en `index.html` y la validación en `server.js`.

#### ❓ ¿El sistema valida los números de tarjeta?
**R:** No. Es un sistema de **simulación** de pagos, no procesa transacciones reales ni valida números de tarjeta reales. Solo registra la información en la base de datos.

#### ❓ ¿Puedo hacer pagos sin internet?
**R:** Sí, el sistema funciona completamente en localhost y no requiere conexión a internet una vez que las dependencias están instaladas.

---

### 📊 Consulta de Ventas

#### ❓ ¿Cómo consulto las ventas?
**R:** 
1. Ve al panel de administración: http://localhost:3000/admin
2. En la pestaña "Consultar Ventas"
3. Selecciona los filtros que desees (empresa, fechas)
4. Haz clic en "Buscar"

#### ❓ ¿Puedo exportar las ventas?
**R:** Sí, en el panel de ventas hay un botón "Exportar CSV" que descarga todas las ventas filtradas en formato CSV, compatible con Excel.

#### ❓ ¿Las estadísticas se actualizan automáticamente?
**R:** Sí, cada vez que haces una búsqueda, las estadísticas (total ventas, importe total, promedio) se calculan y muestran automáticamente.

#### ❓ ¿Puedo ver ventas de todas las empresas?
**R:** Sí, deja el filtro de empresa en "Todas las empresas" para ver todas las ventas sin importar la empresa.

---

### 🏢 Gestión de Empresas

#### ❓ ¿Cómo agrego una nueva empresa?
**R:**
1. Panel de administración > pestaña "Gestionar Empresas"
2. Clic en "+ Nueva Empresa"
3. Completa los datos (solo el nombre es obligatorio)
4. Clic en "Guardar"

#### ❓ ¿Puedo editar una empresa existente?
**R:** Sí, haz clic en el ícono de editar (✏️) junto a la empresa, modifica los datos y guarda.

#### ❓ ¿Qué pasa si elimino una empresa que tiene pagos asociados?
**R:** La empresa se marca como inactiva (no se elimina físicamente) y los pagos asociados se conservan. La empresa ya no aparecerá en el listado de empresas activas ni en el dropdown de pagos.

#### ❓ ¿Puedo tener dos empresas con el mismo nombre?
**R:** No, el sistema valida que los nombres de empresas sean únicos. Si intentas crear o modificar una empresa con un nombre existente, recibirás un error.

#### ❓ ¿Las empresas precargadas se pueden eliminar?
**R:** Sí, puedes eliminar cualquier empresa, incluyendo las que vienen precargadas (Edesur, Aysa, Telecom, Metrogas).

---

### 🗄️ Base de Datos

#### ❓ ¿Dónde se guardan los datos?
**R:** Los datos se guardan en el archivo `pagos.db` en SQLite, ubicado en la carpeta raíz del proyecto.

#### ❓ ¿Cómo veo el contenido de la base de datos?
**R:** Puedes usar:
1. **DB Browser for SQLite**: https://sqlitebrowser.org/ (recomendado, interfaz gráfica)
2. **SQLite CLI**: `sqlite3 pagos.db` desde la terminal
3. **VS Code Extension**: SQLite Viewer

#### ❓ ¿Cómo reseteo la base de datos?
**R:** 
1. Detén el servidor (Ctrl+C)
2. Elimina el archivo `pagos.db`
3. Reinicia el servidor con `npm start`
4. Se creará una nueva base de datos vacía con las empresas precargadas

#### ❓ ¿Los datos persisten al reiniciar el servidor?
**R:** Sí, todos los datos (pagos y empresas) se guardan en el archivo `pagos.db` y persisten entre reinicios del servidor.

#### ❓ ¿Puedo usar otro tipo de base de datos?
**R:** Sí, el código está estructurado de forma modular. Podrías reemplazar SQLite por MySQL, PostgreSQL o MongoDB modificando el archivo `database.js` y las consultas en `server.js`.

---

### 🌐 Acceso y Red

#### ❓ ¿Puedo acceder al sistema desde otro dispositivo en mi red local?
**R:** Sí:
1. Encuentra tu IP local con `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
2. Accede desde otro dispositivo a: `http://TU_IP:3000`
3. Asegúrate de que el firewall permita conexiones al puerto 3000

#### ❓ ¿Cómo cambio el puerto?
**R:** Edita `server.js` y cambia el valor de `PORT`:
```javascript
const PORT = process.env.PORT || 3000; // Cambia 3000 por el puerto deseado
```

#### ❓ ¿Puedo usar el sistema en producción?
**R:** El sistema actual es para desarrollo/demostración. Para producción, deberías:
- Agregar autenticación y autorización
- Usar HTTPS
- Implementar validaciones adicionales
- Usar una base de datos más robusta (PostgreSQL, MySQL)
- Agregar logging y monitoreo
- Implementar rate limiting

---

### 🎨 Personalización y Diseño

#### ❓ ¿Puedo cambiar los colores?
**R:** Sí, edita el archivo `public/styles.css`. Las variables CSS están definidas al inicio:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #10b981;
    /* etc... */
}
```

#### ❓ ¿Cómo agrego mi logo?
**R:** 
1. Coloca tu logo en la carpeta `public`
2. Edita `index.html` o `admin.html`
3. Agrega una etiqueta `<img>` donde quieras mostrar el logo

#### ❓ ¿El diseño es responsive?
**R:** Sí, el sistema está completamente optimizado para móviles, tablets y escritorio.

#### ❓ ¿Puedo cambiar el texto o idioma?
**R:** Sí, todos los textos están en los archivos HTML (`index.html`, `admin.html`) y JavaScript (`app.js`, `admin.js`). Puedes modificarlos libremente.

---

### 🔌 API y Desarrollo

#### ❓ ¿La API está documentada?
**R:** Sí, revisa los archivos `README.md` y `GUIA_USO.md` para la documentación completa de los endpoints.

#### ❓ ¿Puedo consumir la API desde otra aplicación?
**R:** Sí, la API REST puede ser consumida desde cualquier cliente HTTP (React, Vue, Angular, aplicación móvil, Postman, etc.).

#### ❓ ¿La API tiene CORS habilitado?
**R:** Sí, el sistema usa el middleware `cors` que permite peticiones desde cualquier origen. Para producción, deberías configurarlo para aceptar solo orígenes específicos.

#### ❓ ¿Cómo pruebo los endpoints?
**R:** Puedes usar:
- **Navegador**: para endpoints GET (ej: http://localhost:3000/api/empresas)
- **Postman**: para todos los endpoints
- **PowerShell**: con `Invoke-RestMethod` (ver COMANDOS.md)
- **curl**: desde terminal

#### ❓ ¿Hay validación en el backend?
**R:** Sí, todos los endpoints validan:
- Campos obligatorios
- Tipos de datos correctos
- Valores válidos (importes positivos, métodos de pago válidos)
- Nombres únicos de empresas

---

### 🐛 Problemas Comunes

#### ❓ Error: "Cannot find module 'express'"
**R:** Las dependencias no están instaladas. Ejecuta `npm install`.

#### ❓ Error: "EADDRINUSE: address already in use"
**R:** El puerto 3000 ya está en uso. Opciones:
1. Cierra la aplicación que usa el puerto 3000
2. Cambia el puerto en `server.js`
3. Encuentra y mata el proceso: `netstat -ano | findstr :3000` en Windows

#### ❓ La página no carga o muestra "Cannot GET /"
**R:** 
1. Verifica que el servidor esté corriendo
2. Revisa la consola del servidor por errores
3. Asegúrate de acceder a la URL correcta: http://localhost:3000

#### ❓ Los cambios en el código no se reflejan
**R:** 
1. Reinicia el servidor (Ctrl+C y luego `npm start`)
2. Limpia el caché del navegador (Ctrl+Shift+R)
3. Usa modo desarrollo con nodemon: `npm run dev`

#### ❓ Error al exportar CSV
**R:** Verifica que:
1. Haya ventas para exportar
2. El navegador tenga permisos para descargar archivos
3. La consola del navegador no muestre errores (F12)

---

### 📦 Despliegue y Producción

#### ❓ ¿Cómo despliego esto en un servidor?
**R:** Opciones populares:
- **Heroku**: Fácil, gratis para proyectos pequeños
- **DigitalOcean**: Droplets con Node.js
- **AWS EC2**: Más configuración pero más control
- **Vercel/Netlify**: Para el frontend (necesitarías separar backend)

#### ❓ ¿Necesito modificar algo para producción?
**R:** Recomendaciones:
1. Cambiar `NODE_ENV` a `production`
2. Usar variables de entorno para configuración
3. Implementar HTTPS
4. Agregar autenticación
5. Usar PM2 para mantener el proceso corriendo
6. Configurar CORS para dominios específicos

#### ❓ ¿Cómo mantengo el servidor corriendo 24/7?
**R:** Usa un process manager como:
- **PM2**: `npm install -g pm2` y luego `pm2 start server.js`
- **Forever**: Similar a PM2
- **Systemd**: En servidores Linux

---

### 📚 Aprendizaje y Extensión

#### ❓ ¿Cómo agrego más funcionalidades?
**R:** El código está modularizado y comentado. Pasos generales:
1. **Backend**: Agrega rutas en `server.js` y consultas en `database.js`
2. **Frontend**: Modifica HTML en `index.html` o `admin.html`
3. **Estilos**: Actualiza `styles.css`
4. **Lógica**: Edita `app.js` o `admin.js`

#### ❓ ¿Puedo agregar autenticación de usuarios?
**R:** Sí, necesitarías:
1. Crear tabla de usuarios
2. Implementar hash de contraseñas (bcrypt)
3. Agregar sesiones (express-session) o JWT
4. Proteger rutas en el backend
5. Agregar formularios de login/registro

#### ❓ ¿Dónde aprendo más sobre estas tecnologías?
**R:** Recursos recomendados:
- **Node.js**: https://nodejs.org/docs
- **Express**: https://expressjs.com/
- **SQLite**: https://www.sqlitetutorial.net/
- **JavaScript**: https://developer.mozilla.org/es/
- **REST API**: https://restfulapi.net/

#### ❓ ¿Puedo usar este proyecto como base para mi tesis/proyecto?
**R:** Sí, el código es libre para uso educativo y comercial. Puedes modificarlo y extenderlo como necesites.

---

### 💡 Tips y Mejores Prácticas

#### ❓ ¿Cómo hago backup de los datos?
**R:** Simplemente copia el archivo `pagos.db` a un lugar seguro. Es un solo archivo que contiene todos los datos.

#### ❓ ¿Cómo importo datos existentes?
**R:** Puedes:
1. Usar SQL directo con SQLite CLI
2. Crear un endpoint de importación en el backend
3. Modificar `database.js` para insertar datos al iniciar

#### ❓ ¿Puedo agregar más tablas a la base de datos?
**R:** Sí, edita `database.js` y agrega nuevas llamadas a `db.run()` con tus sentencias CREATE TABLE.

#### ❓ ¿Cómo optimizo el rendimiento?
**R:** 
- Agrega índices en la base de datos
- Implementa paginación para grandes volúmenes de datos
- Usa caché para consultas frecuentes
- Minifica CSS y JavaScript

---

## 🆘 ¿Necesitas más ayuda?

Si tienes una pregunta que no está aquí:

1. **Revisa los logs**: La consola del servidor muestra errores detallados
2. **Consola del navegador**: F12 para ver errores de JavaScript
3. **Documentación**: Lee `README.md`, `GUIA_USO.md` y `COMANDOS.md`
4. **Código fuente**: Está completamente comentado
5. **Stack Overflow**: Busca errores específicos

---

**Última actualización:** Noviembre 2025
