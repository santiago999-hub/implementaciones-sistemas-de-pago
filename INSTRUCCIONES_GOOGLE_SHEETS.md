# 📋 Configuración de Google Sheets API

## Pasos para configurar la integración:

### 1️⃣ Crear credenciales en Google Cloud Console

1. Ve a: https://console.cloud.google.com/
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google Sheets:
   - Ve a "APIs y servicios" → "Biblioteca"
   - Busca "Google Sheets API"
   - Haz clic en "Habilitar"

### 2️⃣ Crear cuenta de servicio

1. Ve a "APIs y servicios" → "Credenciales"
2. Haz clic en "Crear credenciales" → "Cuenta de servicio"
3. Completa el formulario:
   - Nombre: "Sistema de Pagos"
   - ID: generado automáticamente
   - Haz clic en "Crear y continuar"
4. Otorga el rol "Editor" → Continuar
5. Haz clic en "Listo"

### 3️⃣ Descargar archivo de credenciales

1. En la lista de cuentas de servicio, haz clic en la que creaste
2. Ve a la pestaña "Claves"
3. Haz clic en "Agregar clave" → "Crear nueva clave"
4. Selecciona "JSON"
5. Se descargará un archivo `.json`
6. **RENOMBRA** ese archivo a `credentials.json`
7. **COPIA** el archivo a la carpeta del proyecto: `c:\Users\Santy\OneDrive\Desktop\implementacionde sistemas de pago\credentials.json`

### 4️⃣ Compartir tu Google Sheet

1. Abre el archivo JSON `credentials.json`
2. Busca el campo `"client_email"` (algo como `nombre@proyecto.iam.gserviceaccount.com`)
3. **COPIA** ese email
4. Ve a tu Google Sheet: https://docs.google.com/spreadsheets/d/1ThgfHPMCgOAaobuhsyhFboRitIEWFvCDnw-oRR_VlD0
5. Haz clic en "Compartir"
6. **PEGA** el email de la cuenta de servicio
7. Otorga permisos de "Editor"
8. Haz clic en "Enviar"

### 5️⃣ Verificar estructura del Google Sheet

Tu hoja debe tener estas columnas en la primera fila:
- `ID`
- `Nombre Cliente`
- `Apellido Cliente`
- `Empresa`
- `Importe`
- `Método Pago`
- `Número Comprobante`
- `Fecha`

### 6️⃣ Reiniciar el servidor

Una vez completados los pasos anteriores:
```bash
npm start
```

## ⚠️ IMPORTANTE

- **NO SUBAS** el archivo `credentials.json` a GitHub o repositorios públicos
- El archivo ya está incluido en `.gitignore` para tu seguridad
- Cada vez que haya un pago, se guardará automáticamente en Google Sheets

## 🔍 Solución de problemas

**Error: "Unable to read credentials"**
→ Verifica que `credentials.json` esté en la carpeta raíz del proyecto

**Error: "Permission denied"**
→ Asegúrate de haber compartido el Sheet con el email de la cuenta de servicio

**Error: "Spreadsheet not found"**
→ Verifica que el ID del spreadsheet sea correcto en el código
