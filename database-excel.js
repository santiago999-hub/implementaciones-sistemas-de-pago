/**
 * Módulo de gestión de datos con Excel
 * Reemplaza SQLite por archivos Excel
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Rutas de archivos Excel
const EMPRESAS_FILE = path.join(__dirname, 'empresas.xlsx');
const PAGOS_FILE = path.join(__dirname, 'pagos.xlsx');

/**
 * Inicializar archivos Excel si no existen
 */
function initExcelFiles() {
    console.log('✓ Inicializando sistema de archivos Excel');
    
    // Crear archivo de empresas si no existe
    if (!fs.existsSync(EMPRESAS_FILE)) {
        const empresasDefault = [
            { id: 1, nombre: 'Edesur', contacto: 'Servicio Eléctrico', email: 'info@edesur.com.ar', telefono: '0800-333-7871', activo: 1 },
            { id: 2, nombre: 'Aysa', contacto: 'Agua y Saneamientos', email: 'contacto@aysa.com.ar', telefono: '0800-345-2972', activo: 1 },
            { id: 3, nombre: 'Telecom', contacto: 'Telecomunicaciones', email: 'atencion@telecom.com.ar', telefono: '0800-888-0123', activo: 1 },
            { id: 4, nombre: 'Metrogas', contacto: 'Servicio de Gas', email: 'clientes@metrogas.com.ar', telefono: '0800-555-4427', activo: 1 }
        ];
        
        const ws = XLSX.utils.json_to_sheet(empresasDefault);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Empresas');
        XLSX.writeFile(wb, EMPRESAS_FILE);
        console.log('✓ Archivo empresas.xlsx creado con datos por defecto');
    }
    
    // Crear archivo de pagos si no existe
    if (!fs.existsSync(PAGOS_FILE)) {
        const ws = XLSX.utils.json_to_sheet([]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Pagos');
        XLSX.writeFile(wb, PAGOS_FILE);
        console.log('✓ Archivo pagos.xlsx creado');
    }
    
    console.log('✓ Sistema Excel listo');
}

/**
 * Leer empresas del archivo Excel
 */
function getEmpresas(callback) {
    try {
        const workbook = XLSX.readFile(EMPRESAS_FILE);
        const worksheet = workbook.Sheets['Empresas'];
        const data = XLSX.utils.sheet_to_json(worksheet);
        callback(null, data);
    } catch (error) {
        callback(error, null);
    }
}

/**
 * Obtener empresa por ID
 */
function getEmpresaById(id, callback) {
    try {
        const workbook = XLSX.readFile(EMPRESAS_FILE);
        const worksheet = workbook.Sheets['Empresas'];
        const data = XLSX.utils.sheet_to_json(worksheet);
        const empresa = data.find(e => e.id == id);
        callback(null, empresa);
    } catch (error) {
        callback(error, null);
    }
}

/**
 * Crear nueva empresa
 */
function createEmpresa(empresa, callback) {
    try {
        const workbook = XLSX.readFile(EMPRESAS_FILE);
        const worksheet = workbook.Sheets['Empresas'];
        const data = XLSX.utils.sheet_to_json(worksheet);
        
        // Verificar si ya existe
        if (data.some(e => e.nombre === empresa.nombre && e.activo === 1)) {
            return callback(new Error('Ya existe una empresa con ese nombre'), null);
        }
        
        // Generar nuevo ID
        const newId = data.length > 0 ? Math.max(...data.map(e => e.id)) + 1 : 1;
        
        const nuevaEmpresa = {
            id: newId,
            nombre: empresa.nombre,
            contacto: empresa.contacto || '',
            email: empresa.email || '',
            telefono: empresa.telefono || '',
            activo: 1
        };
        
        data.push(nuevaEmpresa);
        
        const newWs = XLSX.utils.json_to_sheet(data);
        workbook.Sheets['Empresas'] = newWs;
        XLSX.writeFile(workbook, EMPRESAS_FILE);
        
        callback(null, { id: newId, ...nuevaEmpresa });
    } catch (error) {
        callback(error, null);
    }
}

/**
 * Actualizar empresa
 */
function updateEmpresa(id, empresa, callback) {
    try {
        const workbook = XLSX.readFile(EMPRESAS_FILE);
        const worksheet = workbook.Sheets['Empresas'];
        const data = XLSX.utils.sheet_to_json(worksheet);
        
        const index = data.findIndex(e => e.id == id);
        if (index === -1) {
            return callback(new Error('Empresa no encontrada'), null);
        }
        
        // Verificar nombre único
        if (data.some((e, i) => i !== index && e.nombre === empresa.nombre && e.activo === 1)) {
            return callback(new Error('Ya existe una empresa con ese nombre'), null);
        }
        
        data[index] = {
            ...data[index],
            nombre: empresa.nombre,
            contacto: empresa.contacto || '',
            email: empresa.email || '',
            telefono: empresa.telefono || ''
        };
        
        const newWs = XLSX.utils.json_to_sheet(data);
        workbook.Sheets['Empresas'] = newWs;
        XLSX.writeFile(workbook, EMPRESAS_FILE);
        
        callback(null, { changes: 1 });
    } catch (error) {
        callback(error, null);
    }
}

/**
 * Eliminar empresa (soft delete)
 */
function deleteEmpresa(id, callback) {
    try {
        const workbook = XLSX.readFile(EMPRESAS_FILE);
        const worksheet = workbook.Sheets['Empresas'];
        const data = XLSX.utils.sheet_to_json(worksheet);
        
        const index = data.findIndex(e => e.id == id);
        if (index === -1) {
            return callback(new Error('Empresa no encontrada'), null);
        }
        
        data[index].activo = 0;
        
        const newWs = XLSX.utils.json_to_sheet(data);
        workbook.Sheets['Empresas'] = newWs;
        XLSX.writeFile(workbook, EMPRESAS_FILE);
        
        callback(null, { changes: 1 });
    } catch (error) {
        callback(error, null);
    }
}

/**
 * Crear nuevo pago
 */
function createPago(pago, callback) {
    try {
        const workbook = XLSX.readFile(PAGOS_FILE);
        const worksheet = workbook.Sheets['Pagos'];
        let data = XLSX.utils.sheet_to_json(worksheet);
        
        // Si el archivo está vacío, inicializar array
        if (!Array.isArray(data)) {
            data = [];
        }
        
        // Generar nuevo ID
        const newId = data.length > 0 ? Math.max(...data.map(p => p.id || 0)) + 1 : 1;
        
        // Generar número de comprobante único
        const numeroComprobante = 'BR-' + Date.now().toString().slice(-8);
        
        const nuevoPago = {
            id: newId,
            numero_comprobante: numeroComprobante,
            nombre_cliente: pago.nombre_cliente,
            apellido_cliente: pago.apellido_cliente,
            empresa_id: pago.empresa_id,
            importe: pago.importe,
            metodo_pago: pago.metodo_pago,
            fecha_pago: new Date().toISOString()
        };
        
        data.push(nuevoPago);
        
        const newWs = XLSX.utils.json_to_sheet(data);
        workbook.Sheets['Pagos'] = newWs;
        XLSX.writeFile(workbook, PAGOS_FILE);
        
        callback(null, { id: newId, numero_comprobante: numeroComprobante });
    } catch (error) {
        callback(error, null);
    }
}

/**
 * Obtener pagos con filtros
 */
function getPagos(filters, callback) {
    try {
        const workbook = XLSX.readFile(PAGOS_FILE);
        const worksheet = workbook.Sheets['Pagos'];
        let data = XLSX.utils.sheet_to_json(worksheet);
        
        if (!Array.isArray(data)) {
            data = [];
        }
        
        // Aplicar filtros
        if (filters.empresa_id) {
            data = data.filter(p => p.empresa_id == filters.empresa_id);
        }
        
        if (filters.fecha_desde) {
            data = data.filter(p => {
                const fechaPago = new Date(p.fecha_pago).toISOString().split('T')[0];
                return fechaPago >= filters.fecha_desde;
            });
        }
        
        if (filters.fecha_hasta) {
            data = data.filter(p => {
                const fechaPago = new Date(p.fecha_pago).toISOString().split('T')[0];
                return fechaPago <= filters.fecha_hasta;
            });
        }
        
        // Obtener nombres de empresas
        const empresasWorkbook = XLSX.readFile(EMPRESAS_FILE);
        const empresasWorksheet = empresasWorkbook.Sheets['Empresas'];
        const empresas = XLSX.utils.sheet_to_json(empresasWorksheet);
        
        // Agregar nombre de empresa a cada pago
        data = data.map(pago => {
            const empresa = empresas.find(e => e.id == pago.empresa_id);
            return {
                ...pago,
                empresa_nombre: empresa ? empresa.nombre : 'Desconocida'
            };
        });
        
        // Ordenar por fecha descendente
        data.sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago));
        
        callback(null, data);
    } catch (error) {
        callback(error, null);
    }
}

module.exports = {
    initExcelFiles,
    getEmpresas,
    getEmpresaById,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa,
    createPago,
    getPagos
};
