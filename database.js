/**
 * Módulo de configuración de base de datos SQLite
 * Gestiona la conexión y creación de tablas
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear conexión a la base de datos
const db = new sqlite3.Database(path.join(__dirname, 'pagos.db'), (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
  } else {
    console.log('✓ Conectado a la base de datos SQLite');
    initDatabase();
  }
});

/**
 * Inicializar tablas de la base de datos
 */
function initDatabase() {
  // Tabla de empresas
  db.run(`
    CREATE TABLE IF NOT EXISTS empresas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE,
      contacto TEXT,
      email TEXT,
      telefono TEXT,
      activo INTEGER DEFAULT 1,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear tabla empresas:', err);
    } else {
      console.log('✓ Tabla empresas lista');
      insertDefaultEmpresas();
    }
  });

  // Tabla de pagos
  db.run(`
    CREATE TABLE IF NOT EXISTS pagos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_cliente TEXT NOT NULL,
      apellido_cliente TEXT NOT NULL,
      empresa_id INTEGER NOT NULL,
      importe REAL NOT NULL,
      metodo_pago TEXT NOT NULL,
      fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear tabla pagos:', err);
    } else {
      console.log('✓ Tabla pagos lista');
    }
  });
}

/**
 * Insertar empresas por defecto si no existen
 */
function insertDefaultEmpresas() {
  const empresasDefault = [
    { nombre: 'Edesur', contacto: 'Servicio Eléctrico', email: 'info@edesur.com.ar', telefono: '0800-333-7871' },
    { nombre: 'Aysa', contacto: 'Agua y Saneamientos', email: 'contacto@aysa.com.ar', telefono: '0800-345-2972' },
    { nombre: 'Telecom', contacto: 'Telecomunicaciones', email: 'atencion@telecom.com.ar', telefono: '0800-888-0123' },
    { nombre: 'Metrogas', contacto: 'Servicio de Gas', email: 'clientes@metrogas.com.ar', telefono: '0800-555-4427' }
  ];

  db.get('SELECT COUNT(*) as count FROM empresas', [], (err, row) => {
    if (!err && row.count === 0) {
      const stmt = db.prepare('INSERT INTO empresas (nombre, contacto, email, telefono) VALUES (?, ?, ?, ?)');
      empresasDefault.forEach(empresa => {
        stmt.run(empresa.nombre, empresa.contacto, empresa.email, empresa.telefono);
      });
      stmt.finalize();
      console.log('✓ Empresas por defecto insertadas');
    }
  });
}

module.exports = db;
