/**
 * Payment Routes
 * Defines API endpoints for payment operations
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// POST /api/payments - Process a new payment
router.post('/', paymentController.processPayment);

// GET /api/payments - Get all payments
router.get('/', paymentController.getAllPayments);

// GET /api/payments/:id - Get payment by ID
router.get('/:id', paymentController.getPaymentById);

module.exports = router;
