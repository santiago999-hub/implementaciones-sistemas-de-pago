# Guía de Uso - Sistema de Pagos Online

## 🎯 Descripción General

Sistema web completo para simulación de pagos online con gestión de empresas y consulta de ventas. Incluye interfaz de usuario moderna, panel de administración completo y API REST.

## ✅ Funcionalidades Implementadas

### 1. **Registro de Pagos**
- ✓ Formulario con validación de campos obligatorios
- ✓ Campos: Nombre, Apellido, Empresa (dropdown), Importe, Método de pago (Visa/Mastercard)
- ✓ Registro en base de datos SQLite con fecha/hora automática
- ✓ Mensaje de confirmación visual
- ✓ Diseño atractivo con colores azules y formulario a la derecha

### 2. **Consulta de Ventas**
- ✓ Filtros por empresa y rango de fechas
- ✓ Visualización en tabla con todos los detalles
- ✓ Estadísticas en tiempo real (total ventas, importe total, promedio)
- ✓ Exportación a CSV
- ✓ Interfaz responsive

### 3. **ABM de Empresas**
- ✓ Alta de empresas con nombre, contacto, email y teléfono
- ✓ Modificación de empresas existentes
- ✓ Baja lógica (soft delete) sin eliminar pagos asociados
- ✓ Validación de nombres únicos
- ✓ Interfaz intuitiva con formulario in-line

### 4. **Diseño y UX**
- ✓ Fondo degradado azul/morado
- ✓ Formulario de pago a la derecha con ilustración a la izquierda
- ✓ Botones de pago claros con iconos de Visa/Mastercard
- ✓ Animaciones suaves y modales de confirmación
- ✓ Completamente responsive
- ✓ Paleta de colores moderna

### 5. **Extras Implementados**
- ✓ Validación completa de formularios
- ✓ Exportación de ventas a CSV
- ✓ Interfaz 100% responsive
- ✓ Mensajes de error detallados
- ✓ Estadísticas visuales
- ✓ Código modular y comentado

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js instalado (v14 o superior)
- Navegador web moderno

### Pasos de Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Iniciar el servidor:**
```bash
npm start
```

3. **Acceder a la aplicación:**
- Página de pagos: http://localhost:3000
- Panel de administración: http://localhost:3000/admin

## 📖 Guía de Uso

### Para Realizar un Pago

1. Abrir http://localhost:3000
2. Completar el formulario:
   - Ingresar nombre del cliente
   - Ingresar apellido del cliente
   - Seleccionar empresa a pagar
   - Ingresar importe (números positivos)
   - Seleccionar método de pago (Visa o Mastercard)
3. Hacer clic en "Confirmar Pago"
4. Ver confirmación en pantalla

### Para Consultar Ventas

1. Ir al panel de administración: http://localhost:3000/admin
2. En la pestaña "Consultar Ventas":
   - Seleccionar empresa (opcional)
   - Seleccionar rango de fechas (opcional)
   - Hacer clic en "Buscar"
3. Ver resultados en la tabla
4. Para exportar: hacer clic en "Exportar CSV"

### Para Gestionar Empresas

1. En el panel de administración, ir a la pestaña "Gestionar Empresas"
2. **Para crear nueva empresa:**
   - Hacer clic en "+ Nueva Empresa"
   - Completar el formulario
   - Hacer clic en "Guardar"
3. **Para editar empresa:**
   - Hacer clic en el ícono de editar (✏️)
   - Modificar los datos
   - Hacer clic en "Guardar"
4. **Para eliminar empresa:**
   - Hacer clic en el ícono de eliminar (🗑️)
   - Confirmar la acción

## 🏗️ Arquitectura del Proyecto

```
implementacionde sistemas de pago/
├── server.js              # Servidor Express con todas las rutas API
├── database.js            # Configuración de SQLite y creación de tablas
├── package.json           # Dependencias del proyecto
├── pagos.db              # Base de datos SQLite (generada automáticamente)
├── README.md             # Documentación del proyecto
└── public/               # Archivos del frontend
    ├── index.html        # Página principal de pagos
    ├── admin.html        # Panel de administración
    ├── app.js            # Lógica de la página de pagos
    ├── admin.js          # Lógica del panel de administración
    └── styles.css        # Estilos CSS globales
```

## 🔌 API Endpoints

### Empresas
- `GET /api/empresas` - Obtener todas las empresas activas
- `GET /api/empresas/:id` - Obtener una empresa por ID
- `POST /api/empresas` - Crear nueva empresa
- `PUT /api/empresas/:id` - Actualizar empresa
- `DELETE /api/empresas/:id` - Eliminar empresa (soft delete)

### Pagos
- `POST /api/pagos` - Registrar nuevo pago
- `GET /api/pagos` - Obtener pagos (con filtros opcionales)
  - Query params: `empresa_id`, `fecha_desde`, `fecha_hasta`
- `GET /api/pagos/stats` - Obtener estadísticas de pagos

## 💾 Base de Datos

### Tabla: empresas
```sql
- id (INTEGER PRIMARY KEY)
- nombre (TEXT, UNIQUE)
- contacto (TEXT)
- email (TEXT)
- telefono (TEXT)
- activo (INTEGER, DEFAULT 1)
- fecha_creacion (DATETIME)
```

### Tabla: pagos
```sql
- id (INTEGER PRIMARY KEY)
- nombre_cliente (TEXT)
- apellido_cliente (TEXT)
- empresa_id (INTEGER, FK)
- importe (REAL)
- metodo_pago (TEXT)
- fecha_pago (DATETIME)
```

## 🎨 Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **SQLite3** - Base de datos
- **Body-parser** - Parseo de peticiones
- **CORS** - Manejo de CORS

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos (con variables CSS y animaciones)
- **JavaScript (Vanilla)** - Lógica del cliente
- **Fetch API** - Comunicación con el backend

## 🔒 Validaciones Implementadas

### Frontend
- Campos obligatorios con atributo `required`
- Validación de tipos de datos (number, email, etc.)
- Validación de importes positivos
- Validación visual en tiempo real

### Backend
- Validación de datos obligatorios
- Validación de tipos de datos
- Validación de importes positivos
- Validación de nombres únicos de empresas
- Mensajes de error descriptivos

## 📊 Características Adicionales

1. **Empresas Precargadas**: El sistema incluye 4 empresas de ejemplo:
   - Edesur (Servicio Eléctrico)
   - Aysa (Agua y Saneamientos)
   - Telecom (Telecomunicaciones)
   - Metrogas (Servicio de Gas)

2. **Soft Delete**: Las empresas no se eliminan físicamente, se marcan como inactivas

3. **Timestamps Automáticos**: Todas las operaciones registran fecha y hora

4. **Estadísticas en Tiempo Real**: El panel muestra totales y promedios actualizados

5. **Exportación de Datos**: Las ventas pueden exportarse a formato CSV

## 🐛 Solución de Problemas

### El servidor no inicia
- Verificar que el puerto 3000 esté disponible
- Comprobar que las dependencias estén instaladas
- Revisar los logs de error en la consola

### No se pueden cargar las empresas
- Verificar que el servidor esté corriendo
- Revisar la consola del navegador (F12)
- Verificar que la base de datos se haya creado

### Error al realizar pagos
- Completar todos los campos obligatorios
- Ingresar un importe válido (número positivo)
- Seleccionar un método de pago

## 📝 Notas Importantes

- El sistema usa SQLite, por lo que no requiere instalación de servidor de base de datos
- Los datos se persisten en el archivo `pagos.db`
- La base de datos se crea automáticamente al iniciar el servidor
- El sistema es completamente funcional en localhost

## 🔄 Futuras Mejoras Sugeridas

1. Sistema de autenticación de usuarios
2. Roles y permisos (admin, usuario)
3. Notificaciones por email
4. Reportes en PDF
5. Gráficos y dashboards
6. Integración con pasarelas de pago reales
7. Historial de cambios en empresas
8. Búsqueda avanzada de pagos
9. API de webhooks
10. Tests unitarios e integración

## 👨‍💻 Desarrollo

Para desarrollo con recarga automática:
```bash
npm install -g nodemon
npm run dev
```

## 📄 Licencia

ISC - Libre para uso educativo y comercial

---

**¡Sistema listo para usar!** 🚀

Para cualquier duda o sugerencia, revisar el código fuente que está completamente comentado.
