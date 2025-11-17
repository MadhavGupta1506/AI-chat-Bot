const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const { auth, roleAuth } = require('../middleware/auth');

// Create farmer profile
router.post('/profile', auth, roleAuth('farmer'), farmerController.createFarmerProfile);

// Get my farmer profile
router.get('/profile/me', auth, roleAuth('farmer'), farmerController.getMyFarmerProfile);

// Update farmer profile
router.put('/profile', auth, roleAuth('farmer'), farmerController.updateFarmerProfile);

// Get all farmers (public)
router.get('/', farmerController.getAllFarmers);

// Get specific farmer profile (public)
router.get('/:farmerId', farmerController.getFarmerProfile);

module.exports = router;
