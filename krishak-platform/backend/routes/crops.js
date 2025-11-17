const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');
const { auth, roleAuth } = require('../middleware/auth');

// Create crop listing (farmers only)
router.post('/', auth, roleAuth('farmer'), cropController.createCrop);

// Get all crops (public)
router.get('/', cropController.getAllCrops);

// Get my crops (farmers only)
router.get('/my-crops', auth, roleAuth('farmer'), cropController.getMyCrops);

// Get single crop (public)
router.get('/:cropId', cropController.getCrop);

// Update crop (farmers only)
router.put('/:cropId', auth, roleAuth('farmer'), cropController.updateCrop);

// Delete crop (farmers only)
router.delete('/:cropId', auth, roleAuth('farmer'), cropController.deleteCrop);

module.exports = router;
