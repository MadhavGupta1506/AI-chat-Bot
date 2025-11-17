const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');
const { auth, roleAuth } = require('../middleware/auth');

// Create investment (investors)
router.post('/', auth, roleAuth('investor'), investmentController.createInvestment);

// Get my investments (investors)
router.get('/my-investments', auth, roleAuth('investor'), investmentController.getMyInvestments);

// Get farmer investments (farmers)
router.get('/farmer-investments', auth, roleAuth('farmer'), investmentController.getFarmerInvestments);

// Get investment opportunities (public)
router.get('/opportunities', investmentController.getInvestmentOpportunities);

// Get single investment
router.get('/:investmentId', auth, investmentController.getInvestment);

// Update investment status (farmers)
router.put('/:investmentId/status', auth, roleAuth('farmer'), investmentController.updateInvestmentStatus);

// Update investment payment status
router.put('/:investmentId/payment', auth, investmentController.updateInvestmentPayment);

module.exports = router;
