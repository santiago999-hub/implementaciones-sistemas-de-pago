/**
 * Company Routes
 * Defines API endpoints for company operations
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// GET /api/companies - Get all companies
router.get('/', paymentController.getCompanies);

module.exports = router;
