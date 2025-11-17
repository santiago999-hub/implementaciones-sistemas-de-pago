# 🏦 Sistema de Pagos Online - Banco Robles

Sistema web completo de simulación de pagos online con validaciones avanzadas, dashboard de métricas en tiempo real y sincronización con Google Sheets.

## 📋 Descripción

**Sistema de Pagos Online** es una aplicación web desarrollada con Node.js y Express que simula un sistema bancario de procesamiento de pagos en tiempo real. Permite a los clientes realizar pagos a diferentes empresas utilizando tarjetas Visa o Mastercard, con validaciones avanzadas que incluyen el algoritmo de Luhn para verificar números de tarjeta reales.

## ✨ Características Principales

### 🎨 Interfaz de Usuario
- Diseño moderno inspirado en RoblesPayment con gradientes azul cielo
- Formulario de pago intuitivo con validación en tiempo real
- Animaciones de carga durante el procesamiento
- Comprobantes profesionales descargables en formato HTML

### 💾 Gestión de Datos Híbrida
- **Excel Local**: Almacenamiento inmediato en archivos `.xlsx` (empresas.xlsx, pagos.xlsx)
- **Google Sheets**: Sincronización automática con la nube para backup y colaboración
- Sistema robusto que funciona incluso si la conexión a Google Sheets falla

### 🔐 Validaciones y Seguridad
- Validación de nombres y apellidos (solo letras, 2-50 caracteres)
- Verificación de rangos de importe ($100 - $100,000)
- Algoritmo de Luhn para validar números de tarjeta
- Generación de comprobantes únicos con formato BR-XXXXXXXX

### 📊 Panel de Administración
- Dashboard con 6 métricas en tiempo real (total recaudado, cantidad de pagos, promedios, etc.)
- Consulta de ventas con filtros por empresa, fecha, cliente y método de pago
- Gestión CRUD completa de empresas
- Exportación de reportes a CSV
- Visualización de comprobantes por transacción

## 💡 Tecnologías Utilizadas

- **Backend**: Node.js, Express 4.18.2
- **Base de Datos**: XLSX (Excel local), Google Sheets API (nube)
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **APIs**: Google Sheets API v4 para sincronización en tiempo real

## 🚀 Instalación

1. **Clonar el repositorio**:
```bash
git clone https://github.com/santiago999-hub/implementaciones-sistemas-de-pago.git
cd implementaciones-sistemas-de-pago
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Iniciar el servidor**:
```bash
npm start
```

4. **Abrir en el navegador**:
```
http://localhost:3000
```

## 📁 Estructura del Proyecto

```
├── server.js                      # Servidor Express con API REST
├── database-excel.js              # Gestión de archivos Excel
├── google-sheets.js               # Integración con Google Sheets API
├── credentials.example.json       # Ejemplo de credenciales de Google
├── public/            
│   ├── index.html                 # Página de pagos
│   ├── admin.html                 # Panel de administración
│   ├── app.js                     # Lógica del formulario de pagos
│   ├── admin.js                   # Lógica del panel admin
│   └── styles.css                 # Estilos globales
├── empresas.xlsx                  # Base de datos de empresas
├── pagos.xlsx                     # Base de datos de pagos
└── package.json
```

## 📖 Uso

### Página de Pagos
1. Ingresar nombre y apellido del cliente (validación: solo letras)
2. Seleccionar empresa a pagar
3. Ingresar importe (entre $100 y $100,000)
4. Ingresar número de tarjeta (validación con algoritmo de Luhn)
5. Elegir método de pago (Visa/Mastercard)
6. Confirmar pago
7. Descargar o imprimir comprobante

### Panel de Administración
- **Dashboard**: Visualizar 6 métricas en tiempo real
- **Ventas**: Consultar ventas con filtros avanzados, exportar a CSV
- **Empresas**: Crear, editar y eliminar empresas

## 🔌 API Endpoints

### Pagos
- `POST /api/pagos` - Registrar nuevo pago
- `GET /api/pagos` - Obtener pagos (filtros: empresa, fecha, cliente, método)

### Empresas
- `GET /api/empresas` - Listar empresas activas
- `GET /api/empresas/:id` - Obtener empresa por ID
- `POST /api/empresas` - Crear nueva empresa
- `PUT /api/empresas/:id` - Actualizar empresa
- `DELETE /api/empresas/:id` - Eliminar empresa (soft delete)

## 🌐 Configuración de Google Sheets (Opcional)

Para sincronizar pagos con Google Sheets en la nube:

1. Sigue las instrucciones en `CONFIGURACION_GOOGLE_SHEETS.md`
2. Obtén credenciales de Google Cloud Console
3. Copia `credentials.json` en la raíz del proyecto
4. Comparte tu Google Sheet con la cuenta de servicio
5. Reinicia el servidor

**Nota**: El sistema funciona perfectamente sin Google Sheets usando solo Excel local.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
