# Comandos Útiles - Sistema de Pagos Online

## 🚀 Comandos Principales

### Instalar dependencias
```bash
npm install
```

### Iniciar servidor en producción
```bash
npm start
```

### Iniciar servidor en modo desarrollo (con nodemon)
```bash
npm run dev
```

## 🗄️ Base de Datos

### Ver el contenido de la base de datos (usando SQLite CLI)
```bash
# Instalar SQLite CLI si no está instalado
# Windows: descargar de https://www.sqlite.org/download.html

# Abrir la base de datos
sqlite3 pagos.db

# Comandos útiles dentro de SQLite:
.tables                          # Listar todas las tablas
.schema empresas                 # Ver estructura de tabla empresas
.schema pagos                    # Ver estructura de tabla pagos
SELECT * FROM empresas;          # Ver todas las empresas
SELECT * FROM pagos;             # Ver todos los pagos
.exit                            # Salir de SQLite
```

### Resetear base de datos (eliminar y recrear)
```bash
# Windows PowerShell
Remove-Item pagos.db
npm start
```

## 🔧 Comandos de Desarrollo

### Ver logs del servidor en tiempo real
El servidor muestra logs automáticamente en la consola

### Probar endpoints con curl (Windows PowerShell)

```powershell
# Obtener todas las empresas
Invoke-RestMethod -Uri "http://localhost:3000/api/empresas" -Method GET

# Crear nueva empresa
$body = @{
    nombre = "Nueva Empresa"
    contacto = "Contacto Empresa"
    email = "email@empresa.com"
    telefono = "0800-123-456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/empresas" -Method POST -Body $body -ContentType "application/json"

# Registrar un pago
$pago = @{
    nombre_cliente = "Juan"
    apellido_cliente = "Pérez"
    empresa_id = 1
    importe = 1500.50
    metodo_pago = "Visa"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/pagos" -Method POST -Body $pago -ContentType "application/json"

# Consultar pagos con filtros
Invoke-RestMethod -Uri "http://localhost:3000/api/pagos?empresa_id=1" -Method GET
```

## 📊 Comandos de Monitoreo

### Ver espacio usado por la base de datos
```bash
# Windows PowerShell
(Get-Item pagos.db).Length / 1KB
```

### Ver estructura del proyecto
```bash
tree /F
```

## 🧪 Testing Manual

### Endpoints a probar

1. **Página principal**: http://localhost:3000
2. **Panel admin**: http://localhost:3000/admin
3. **API empresas**: http://localhost:3000/api/empresas
4. **API pagos**: http://localhost:3000/api/pagos

## 🐛 Debugging

### Ver errores en el navegador
1. Presionar F12 para abrir DevTools
2. Ir a la pestaña Console
3. Ver errores de JavaScript

### Ver errores del servidor
Los errores se muestran automáticamente en la terminal donde corre el servidor

## 📦 Gestión de Paquetes

### Actualizar dependencias
```bash
npm update
```

### Ver versiones de paquetes
```bash
npm list
```

### Instalar paquete adicional
```bash
npm install nombre-paquete
```

## 🔄 Control de Versiones (Git)

### Inicializar repositorio Git
```bash
git init
git add .
git commit -m "Initial commit - Sistema de pagos online"
```

### Comandos Git útiles
```bash
git status                        # Ver estado
git add .                         # Agregar todos los cambios
git commit -m "mensaje"          # Crear commit
git log --oneline                # Ver historial
```

## 🌐 Deployment

### Variables de entorno (crear archivo .env)
```
PORT=3000
NODE_ENV=production
```

### Usar variables de entorno en el código
```javascript
const PORT = process.env.PORT || 3000;
```

## 🔐 Seguridad

### Generar .gitignore completo
Ya incluido en el proyecto con:
- node_modules/
- *.db
- .env
- .DS_Store
- npm-debug.log

## 📱 Acceso desde otros dispositivos en la red local

### Encontrar IP local (Windows)
```bash
ipconfig
# Buscar "Dirección IPv4"
```

### Acceder desde otro dispositivo
```
http://TU_IP_LOCAL:3000
# Ejemplo: http://192.168.1.100:3000
```

**Nota**: Asegurarse de que el firewall permita conexiones al puerto 3000

## 🎯 Atajos Útiles

### Detener servidor
```
Ctrl + C
```

### Limpiar consola
```bash
cls          # Windows
clear        # Linux/Mac
```

### Reiniciar servidor rápidamente
```bash
Ctrl + C
npm start
```

## 📚 Documentación de Dependencias

- **Express**: https://expressjs.com/
- **SQLite3**: https://github.com/TryGhost/node-sqlite3
- **Body-parser**: https://github.com/expressjs/body-parser
- **CORS**: https://github.com/expressjs/cors
- **Nodemon**: https://nodemon.io/

## 💡 Tips

1. **Auto-recarga del navegador**: Usar extensión Live Server o refrescar manualmente
2. **Ver cambios en DB**: Usar DB Browser for SQLite (https://sqlitebrowser.org/)
3. **Formatear código**: Usar Prettier o formato automático de VS Code
4. **Debugging avanzado**: Usar VS Code debugger con configuración de launch.json

---

¡Comandos listos para usar! 🚀
