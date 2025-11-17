# 🚀 GUÍA RÁPIDA: Conectar con tu Google Sheet

## ✅ Tu Google Sheet ya está configurado
**URL:** https://docs.google.com/spreadsheets/d/1ThgfHPMCgOAaobuhsyhFboRitIEWFvCDnw-oRR_VlD0/edit

---

## 📝 PASOS PARA ACTIVAR LA SINCRONIZACIÓN

### **PASO 1:** Ir a Google Cloud Console
👉 https://console.cloud.google.com/

1. **Crear proyecto nuevo:**
   - Haz clic en el selector de proyectos (arriba)
   - Clic en "Nuevo proyecto"
   - Nombre: `Sistema de Pagos`
   - Clic en "Crear"

---

### **PASO 2:** Habilitar Google Sheets API

1. En el menú lateral → **APIs y servicios** → **Biblioteca**
2. Buscar: `Google Sheets API`
3. Clic en **Google Sheets API**
4. Clic en **HABILITAR**

---

### **PASO 3:** Crear Cuenta de Servicio

1. **APIs y servicios** → **Credenciales**
2. Clic en **+ CREAR CREDENCIALES**
3. Seleccionar **Cuenta de servicio**
4. Completar:
   - **Nombre:** `sistema-pagos`
   - **ID:** se genera automático
   - Clic en **CREAR Y CONTINUAR**
5. **Otorgar acceso:** Selecciona el rol **Editor**
6. Clic en **CONTINUAR** → **LISTO**

---

### **PASO 4:** Descargar Credenciales JSON

1. En la lista de **Cuentas de servicio**, haz clic en la que acabas de crear
2. Pestaña **CLAVES**
3. Clic en **AGREGAR CLAVE** → **Crear nueva clave**
4. Tipo: **JSON**
5. Clic en **CREAR**
6. Se descarga un archivo `.json`

---

### **PASO 5:** Copiar el archivo de credenciales

1. **Renombra** el archivo descargado a: `credentials.json`
2. **Cópialo** a la carpeta del proyecto:
   ```
   c:\Users\Santy\OneDrive\Desktop\implementacionde sistemas de pago\credentials.json
   ```

---

### **PASO 6:** Compartir Google Sheet con la cuenta de servicio

1. **Abre** el archivo `credentials.json` con un editor de texto
2. **Busca** la línea `"client_email"` (ejemplo):
   ```json
   "client_email": "sistema-pagos@tu-proyecto-123456.iam.gserviceaccount.com"
   ```
3. **Copia** ese email completo
4. **Ve a tu Google Sheet:** https://docs.google.com/spreadsheets/d/1ThgfHPMCgOAaobuhsyhFboRitIEWFvCDnw-oRR_VlD0/edit
5. Clic en **Compartir** (botón verde arriba a la derecha)
6. **Pega** el email de la cuenta de servicio
7. Permisos: **Editor**
8. **DESACTIVA** "Notificar a las personas"
9. Clic en **Enviar**

---

### **PASO 7:** Verificar estructura del Google Sheet

Tu Google Sheet debe tener estas columnas en la **primera fila** (Fila 1):

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| ID | Nombre Cliente | Apellido Cliente | Empresa | Importe | Método Pago | Número Comprobante | Fecha |

Si no las tiene, **agrégalas manualmente** o el sistema las creará automáticamente.

---

### **PASO 8:** Reiniciar el servidor

1. **Detén** el servidor (Ctrl+C en la terminal)
2. **Inicia** nuevamente:
   ```bash
   npm start
   ```
3. Deberías ver:
   ```
   ✓ Google Sheets API conectada exitosamente
   ✓ Sistema híbrido: Excel local + Google Sheets en la nube
   ```

---

## ✅ ¡LISTO! Ahora cada pago se guardará en:

1. **Excel local** (`pagos.xlsx`) ✓
2. **Google Sheets en la nube** ✓

---

## 🔍 Verificar que funciona

1. Ve a: http://localhost:3000
2. Realiza un pago de prueba
3. Revisa tu Google Sheet: https://docs.google.com/spreadsheets/d/1ThgfHPMCgOAaobuhsyhFboRitIEWFvCDnw-oRR_VlD0/edit
4. **Deberías ver el pago agregado automáticamente** 🎉

---

## ⚠️ Solución de problemas

### ❌ "Unable to read credentials"
→ Verifica que `credentials.json` esté en la carpeta correcta

### ❌ "Permission denied" o "403 Forbidden"
→ Asegúrate de haber compartido el Google Sheet con el `client_email`

### ❌ "Spreadsheet not found"
→ Verifica que el ID del Google Sheet en `google-sheets.js` sea correcto

### ⚠️ "credentials.json no encontrado"
→ El sistema funciona solo con Excel local. Completa los pasos anteriores para activar Google Sheets

---

## 🔐 SEGURIDAD

- ✅ `credentials.json` está en `.gitignore` (no se subirá a GitHub)
- ✅ Nunca compartas este archivo públicamente
- ✅ Si subes tu código a GitHub, el archivo NO se incluirá

---

## 📊 Ventajas del sistema híbrido

✅ **Backup automático** en la nube
✅ **Acceso desde cualquier lugar** al Google Sheet
✅ **Colaboración en tiempo real**
✅ **No depende 100% de la nube** (funciona sin internet con Excel local)
✅ **Fácil de visualizar** datos en Google Sheets

