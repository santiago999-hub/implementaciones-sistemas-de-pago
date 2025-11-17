/**
 * Payment Controller
 * Handles payment processing logic
 */

const Payment = require('../models/Payment');
const { validateLuhn, identifyCardType, maskCardNumber } = require('../utils/luhnValidator');
const { companies } = require('../models/Company');

// In-memory storage for payments (in a real app, this would be a database)
let payments = [];
let nextPaymentId = 1;

/**
 * Process a new payment
 */
function processPayment(req, res) {
  const { clientName, clientEmail, cardNumber, cvv, expiryDate, amount, companyId } = req.body;

  // Validation
  if (!clientName || !clientEmail || !cardNumber || !cvv || !expiryDate || !amount || !companyId) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son requeridos'
    });
  }

  // Validate card number with Luhn algorithm
  if (!validateLuhn(cardNumber)) {
    return res.status(400).json({
      success: false,
      message: 'Número de tarjeta inválido. Por favor, verifica el número de tarjeta.'
    });
  }

  // Identify card type
  const cardType = identifyCardType(cardNumber);
  if (cardType === 'Unknown') {
    return res.status(400).json({
      success: false,
      message: 'Tipo de tarjeta no soportado. Solo se aceptan Visa y Mastercard.'
    });
  }

  // Validate amount
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'El monto debe ser un número positivo'
    });
  }

  // Validate CVV (3 or 4 digits)
  if (!/^\d{3,4}$/.test(cvv)) {
    return res.status(400).json({
      success: false,
      message: 'CVV inválido'
    });
  }

  // Validate expiry date (MM/YY format)
  if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
    return res.status(400).json({
      success: false,
      message: 'Fecha de expiración inválida. Use el formato MM/YY'
    });
  }

  // Check if card is expired
  const [month, year] = expiryDate.split('/').map(num => parseInt(num, 10));
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits of year
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return res.status(400).json({
      success: false,
      message: 'La tarjeta está vencida'
    });
  }

  // Find company
  const company = companies.find(c => c.id === parseInt(companyId));
  if (!company) {
    return res.status(400).json({
      success: false,
      message: 'Empresa no encontrada'
    });
  }

  // Create payment
  const payment = new Payment(
    nextPaymentId++,
    clientName,
    clientEmail,
    maskCardNumber(cardNumber),
    cardType,
    numAmount,
    company.name,
    'pending'
  );

  // Simulate payment processing (in real system, this would call a payment gateway)
  // Random success/failure for simulation
  const randomSuccess = Math.random() > 0.1; // 90% success rate
  
  if (randomSuccess) {
    payment.approve();
    payments.push(payment);
    
    return res.json({
      success: true,
      message: 'Pago procesado exitosamente',
      payment: payment.toJSON()
    });
  } else {
    payment.reject('Fondos insuficientes o problema con el banco emisor');
    payments.push(payment);
    
    return res.status(400).json({
      success: false,
      message: 'Pago rechazado: ' + payment.rejectionReason,
      payment: payment.toJSON()
    });
  }
}

/**
 * Get all payments
 */
function getAllPayments(req, res) {
  res.json({
    success: true,
    payments: payments.map(p => p.toJSON())
  });
}

/**
 * Get payment by ID
 */
function getPaymentById(req, res) {
  const paymentId = parseInt(req.params.id);
  const payment = payments.find(p => p.id === paymentId);
  
  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Pago no encontrado'
    });
  }
  
  res.json({
    success: true,
    payment: payment.toJSON()
  });
}

/**
 * Get all companies
 */
function getCompanies(req, res) {
  res.json({
    success: true,
    companies: companies.map(c => c.toJSON())
  });
}

module.exports = {
  processPayment,
  getAllPayments,
  getPaymentById,
  getCompanies
};
