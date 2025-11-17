/**
 * Main Server File
 * Initializes and configures the Express server
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const paymentRoutes = require('./routes/paymentRoutes');
const companyRoutes = require('./routes/companyRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/pagos', (req, res) => {
  res.render('payments');
});

// API Routes
app.use('/api/payments', paymentRoutes);
app.use('/api/companies', companyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Sistema de Pagos Online iniciado correctamente`);
});

module.exports = app;
