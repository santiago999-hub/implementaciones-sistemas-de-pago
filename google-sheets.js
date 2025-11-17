/**
 * google-sheets.js - Módulo para integración con Google Sheets
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// ID del Google Sheet (extraído de la URL)
const SPREADSHEET_ID = '1ThgfHPMCgOAaobuhsyhFboRitIEWFvCDnw-oRR_VlD0';
const SHEET_NAME = 'Hoja 1'; // Cambia esto si tu hoja tiene otro nombre

let auth = null;
let sheets = null;

/**
 * Inicializar autenticación con Google Sheets
 */
async function initGoogleSheets() {
    try {
        const credentialsPath = path.join(__dirname, 'credentials.json');
        
        // Verificar si existe el archivo de credenciales
        if (!fs.existsSync(credentialsPath)) {
            console.log('⚠️  Archivo credentials.json no encontrado');
            console.log('📋 Lee INSTRUCCIONES_GOOGLE_SHEETS.md para configurar Google Sheets API');
            return false;
        }

        // Leer credenciales
        const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

        // Crear cliente de autenticación
        auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        // Crear cliente de Sheets API
        sheets = google.sheets({ version: 'v4', auth });

        // Verificar conexión y estructura del sheet
        await verificarEstructura();

        console.log('✓ Google Sheets API conectada exitosamente');
        return true;

    } catch (error) {
        console.error('❌ Error al inicializar Google Sheets:', error.message);
        console.log('📋 Lee INSTRUCCIONES_GOOGLE_SHEETS.md para configurar correctamente');
        return false;
    }
}

/**
 * Verificar y crear estructura del sheet si no existe
 */
async function verificarEstructura() {
    try {
        // Intentar leer la primera fila
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A1:H1`,
        });

        const headers = response.data.values ? response.data.values[0] : [];
        
        // Si no hay headers, crear la estructura
        if (!headers || headers.length === 0) {
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEET_NAME}!A1:H1`,
                valueInputOption: 'RAW',
                resource: {
                    values: [[
                        'ID',
                        'Nombre Cliente',
                        'Apellido Cliente',
                        'Empresa',
                        'Importe',
                        'Método Pago',
                        'Número Comprobante',
                        'Fecha'
                    ]]
                }
            });
            console.log('✓ Estructura del Google Sheet creada');
        }
    } catch (error) {
        throw new Error(`Error al verificar estructura: ${error.message}`);
    }
}

/**
 * Agregar un pago al Google Sheet
 */
async function agregarPagoGoogleSheet(pago) {
    if (!sheets || !auth) {
        console.log('⚠️  Google Sheets no está configurado, datos guardados solo localmente');
        return false;
    }

    try {
        // Obtener el siguiente ID
        const ultimaFila = await obtenerUltimaFila();
        const nuevoId = ultimaFila;

        // Formatear fecha
        const fecha = new Date().toLocaleString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // Preparar datos
        const valores = [[
            nuevoId,
            pago.nombre_cliente,
            pago.apellido_cliente,
            pago.empresa_nombre || 'N/A',
            parseFloat(pago.importe).toFixed(2),
            pago.metodo_pago,
            pago.numero_comprobante,
            fecha
        ]];

        // Agregar fila al sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:H`,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: valores
            }
        });

        console.log(`✓ Pago agregado a Google Sheet - Comprobante: ${pago.numero_comprobante}`);
        return true;

    } catch (error) {
        console.error('❌ Error al agregar pago a Google Sheet:', error.message);
        return false;
    }
}

/**
 * Obtener número de la última fila (para generar ID)
 */
async function obtenerUltimaFila() {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:A`,
        });

        const filas = response.data.values || [];
        return filas.length; // Retorna el número de la próxima fila

    } catch (error) {
        console.error('Error al obtener última fila:', error.message);
        return 1; // Si hay error, empezar desde 1
    }
}

/**
 * Obtener todos los pagos del Google Sheet
 */
async function obtenerPagosGoogleSheet() {
    if (!sheets || !auth) {
        return [];
    }

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A2:H`, // Desde la fila 2 (sin headers)
        });

        const filas = response.data.values || [];
        
        return filas.map(fila => ({
            id: fila[0],
            nombre_cliente: fila[1],
            apellido_cliente: fila[2],
            empresa_nombre: fila[3],
            importe: fila[4],
            metodo_pago: fila[5],
            numero_comprobante: fila[6],
            fecha: fila[7]
        }));

    } catch (error) {
        console.error('Error al obtener pagos de Google Sheet:', error.message);
        return [];
    }
}

module.exports = {
    initGoogleSheets,
    agregarPagoGoogleSheet,
    obtenerPagosGoogleSheet,
    isGoogleSheetsEnabled: () => sheets !== null && auth !== null
};
