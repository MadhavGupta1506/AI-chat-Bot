const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, roleAuth } = require('../middleware/auth');

// Create order (buyers)
router.post('/', auth, orderController.createOrder);

// Get my orders (buyers)
router.get('/my-orders', auth, orderController.getMyOrders);

// Get farmer orders (farmers)
router.get('/farmer-orders', auth, roleAuth('farmer'), orderController.getFarmerOrders);

// Get single order
router.get('/:orderId', auth, orderController.getOrder);

// Update order status (farmers)
router.put('/:orderId/status', auth, roleAuth('farmer'), orderController.updateOrderStatus);

// Update payment status
router.put('/:orderId/payment', auth, orderController.updatePaymentStatus);

module.exports = router;
