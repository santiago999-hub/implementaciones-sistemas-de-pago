/**
 * Servidor Express - Sistema de Pagos Online
 * API REST para gestión de pagos y empresas
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./database-excel');
const googleSheets = require('./google-sheets');

const app = express();

// Inicializar archivos Excel
db.initExcelFiles();

// Inicializar Google Sheets (opcional)
let googleSheetsEnabled = false;
googleSheets.initGoogleSheets().then(success => {
    googleSheetsEnabled = success;
    if (success) {
        console.log('✓ Sistema híbrido: Excel local + Google Sheets en la nube');
    } else {
        console.log('✓ Sistema funcionando solo con Excel local');
    }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// ==================== RUTAS DE EMPRESAS ====================

/**
 * GET /api/empresas
 * Obtener todas las empresas activas
 */
app.get('/api/empresas', (req, res) => {
  db.getEmpresas((err, empresas) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener empresas', details: err.message });
    } else {
      const activas = empresas.filter(e => e.activo === 1).sort((a, b) => a.nombre.localeCompare(b.nombre));
      res.json(activas);
    }
  });
});

/**
 * GET /api/empresas/:id
 * Obtener una empresa por ID
 */
app.get('/api/empresas/:id', (req, res) => {
  db.getEmpresaById(req.params.id, (err, empresa) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener empresa', details: err.message });
    } else if (!empresa || empresa.activo !== 1) {
      res.status(404).json({ error: 'Empresa no encontrada' });
    } else {
      res.json(empresa);
    }
  });
});

/**
 * POST /api/empresas
 * Crear nueva empresa
 */
app.post('/api/empresas', (req, res) => {
  const { nombre, contacto, email, telefono } = req.body;
  
  // Validación
  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre de la empresa es obligatorio' });
  }
  
  db.createEmpresa({ nombre, contacto, email, telefono }, (err, result) => {
    if (err) {
      if (err.message.includes('Ya existe')) {
        res.status(400).json({ error: 'Ya existe una empresa con ese nombre' });
      } else {
        res.status(500).json({ error: 'Error al crear empresa', details: err.message });
      }
    } else {
      res.status(201).json({ 
        id: result.id, 
        message: 'Empresa creada exitosamente',
        empresa: result
      });
    }
  });
});

/**
 * PUT /api/empresas/:id
 * Actualizar empresa existente
 */
app.put('/api/empresas/:id', (req, res) => {
  const { nombre, contacto, email, telefono } = req.body;
  const { id } = req.params;
  
  // Validación
  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre de la empresa es obligatorio' });
  }
  
  db.updateEmpresa(id, { nombre, contacto, email, telefono }, (err, result) => {
    if (err) {
      if (err.message.includes('Ya existe')) {
        res.status(400).json({ error: 'Ya existe una empresa con ese nombre' });
      } else if (err.message.includes('no encontrada')) {
        res.status(404).json({ error: 'Empresa no encontrada' });
      } else {
        res.status(500).json({ error: 'Error al actualizar empresa', details: err.message });
      }
    } else {
      res.json({ message: 'Empresa actualizada exitosamente' });
    }
  });
});

/**
 * DELETE /api/empresas/:id
 * Eliminar empresa (soft delete)
 */
app.delete('/api/empresas/:id', (req, res) => {
  db.deleteEmpresa(req.params.id, (err, result) => {
    if (err) {
      if (err.message.includes('no encontrada')) {
        res.status(404).json({ error: 'Empresa no encontrada' });
      } else {
        res.status(500).json({ error: 'Error al eliminar empresa', details: err.message });
      }
    } else {
      res.json({ message: 'Empresa eliminada exitosamente' });
    }
  });
});

// ==================== RUTAS DE PAGOS ====================

/**
 * POST /api/pagos
 * Registrar nuevo pago
 */
app.post('/api/pagos', (req, res) => {
  const { nombre_cliente, apellido_cliente, empresa_id, importe, metodo_pago } = req.body;
  
  // Validaciones
  if (!nombre_cliente || nombre_cliente.trim() === '') {
    return res.status(400).json({ error: 'El nombre del cliente es obligatorio' });
  }
  if (!apellido_cliente || apellido_cliente.trim() === '') {
    return res.status(400).json({ error: 'El apellido del cliente es obligatorio' });
  }
  if (!empresa_id) {
    return res.status(400).json({ error: 'Debe seleccionar una empresa' });
  }
  if (!importe || isNaN(importe) || parseFloat(importe) <= 0) {
    return res.status(400).json({ error: 'El importe debe ser un número positivo' });
  }
  if (!metodo_pago || !['Visa', 'Mastercard'].includes(metodo_pago)) {
    return res.status(400).json({ error: 'Método de pago inválido' });
  }
  
  const pagoData = {
    nombre_cliente,
    apellido_cliente,
    empresa_id: parseInt(empresa_id),
    importe: parseFloat(importe),
    metodo_pago
  };
  
  db.createPago(pagoData, async (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error al registrar pago', details: err.message });
    } else {
      // Obtener nombre de la empresa para Google Sheets
      db.getEmpresaById(empresa_id, async (errEmpresa, empresa) => {
        const pagoCompleto = {
          ...pagoData,
          numero_comprobante: result.numero_comprobante,
          empresa_nombre: empresa ? empresa.nombre : 'N/A'
        };

        // Intentar guardar en Google Sheets (no bloqueante)
        if (googleSheetsEnabled) {
          try {
            await googleSheets.agregarPagoGoogleSheet(pagoCompleto);
          } catch (error) {
            console.error('⚠️  Error al sincronizar con Google Sheets:', error.message);
            // No fallar la operación si Google Sheets falla
          }
        }

        res.status(201).json({ 
          id: result.id, 
          numero_comprobante: result.numero_comprobante,
          message: 'Pago registrado exitosamente',
          google_sheets_sync: googleSheetsEnabled,
          pago: { 
            id: result.id,
            numero_comprobante: result.numero_comprobante,
            ...pagoData
          }
        });
      });
    }
  });
});

/**
 * GET /api/pagos
 * Obtener pagos con filtros opcionales
 * Query params: empresa_id, fecha_desde, fecha_hasta
 */
app.get('/api/pagos', (req, res) => {
  const { empresa_id, fecha_desde, fecha_hasta } = req.query;
  
  const filters = {
    empresa_id: empresa_id || null,
    fecha_desde: fecha_desde || null,
    fecha_hasta: fecha_hasta || null
  };
  
  db.getPagos(filters, (err, pagos) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener pagos', details: err.message });
    } else {
      res.json(pagos);
    }
  });
});

/**
 * GET /api/pagos/stats
 * Obtener estadísticas de pagos
 */
app.get('/api/pagos/stats', (req, res) => {
  db.getPagos({}, (err, pagos) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener estadísticas', details: err.message });
    } else {
      const stats = {
        total_pagos: pagos.length,
        total_importe: pagos.reduce((sum, p) => sum + parseFloat(p.importe || 0), 0),
        promedio_importe: pagos.length > 0 ? pagos.reduce((sum, p) => sum + parseFloat(p.importe || 0), 0) / pagos.length : 0,
        minimo_importe: pagos.length > 0 ? Math.min(...pagos.map(p => parseFloat(p.importe || 0))) : 0,
        maximo_importe: pagos.length > 0 ? Math.max(...pagos.map(p => parseFloat(p.importe || 0))) : 0
      };
      res.json(stats);
    }
  });
});

// ==================== RUTAS FRONTEND ====================

// Ruta principal - Página de pagos
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta admin - Panel de administración
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║   🚀 Servidor iniciado exitosamente                   ║
║                                                       ║
║   📍 URL: http://localhost:${PORT}                      ║
║   📄 Página de pagos: http://localhost:${PORT}         ║
║   ⚙️  Panel admin: http://localhost:${PORT}/admin      ║
║                                                       ║
║   💾 Base de datos: Excel (empresas.xlsx, pagos.xlsx) ║
║   Presiona Ctrl+C para detener el servidor           ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Manejo de errores global
process.on('unhandledRejection', (err) => {
  console.error('Error no manejado:', err);
});
