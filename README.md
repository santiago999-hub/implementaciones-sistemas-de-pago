# Sistema de Pagos Online

Sistema web de simulación de pagos online con gestión de empresas y consulta de ventas.

## Características

- ✅ Registro de pagos con múltiples métodos (Visa, Mastercard)
- ✅ Consulta de ventas por empresa y rango de fechas
- ✅ ABM completo de empresas
- ✅ Interfaz responsive y moderna
- ✅ Base de datos SQLite para persistencia
- ✅ Exportación de datos a CSV

## Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js + Express
- **Base de datos**: SQLite3
- **Arquitectura**: REST API

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor:
```bash
npm start
```

3. Abrir en el navegador:
```
http://localhost:3000
```

## Estructura del Proyecto

```
├── server.js           # Servidor Express
├── database.js         # Configuración de base de datos
├── public/            
│   ├── index.html     # Página de pagos
│   ├── admin.html     # Panel de administración
│   ├── styles.css     # Estilos globales
│   └── app.js         # Lógica del frontend
└── package.json
```

## Uso

### Página de Pagos
- Ingresar nombre y apellido del cliente
- Seleccionar empresa a pagar
- Ingresar importe
- Elegir método de pago (Visa/Mastercard)
- Confirmar pago

### Panel de Administración
- **Ventas**: Consultar ventas por empresa y fecha, exportar a CSV
- **Empresas**: Crear, editar y eliminar empresas

## API Endpoints

### Pagos
- `POST /api/pagos` - Registrar nuevo pago
- `GET /api/pagos` - Obtener pagos (filtros: empresa, fecha)

### Empresas
- `GET /api/empresas` - Listar empresas
- `POST /api/empresas` - Crear empresa
- `PUT /api/empresas/:id` - Actualizar empresa
- `DELETE /api/empresas/:id` - Eliminar empresa
