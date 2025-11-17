const Order = require('../models/Order');
const Crop = require('../models/Crop');
const Farmer = require('../models/Farmer');

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const buyerId = req.userId;
    const { items, deliveryAddress, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Calculate total and validate crops
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const crop = await Crop.findById(item.cropId);
      
      if (!crop) {
        return res.status(404).json({
          success: false,
          message: `Crop ${item.cropId} not found`
        });
      }

      if (crop.status !== 'available') {
        return res.status(400).json({
          success: false,
          message: `Crop ${crop.cropName} is not available`
        });
      }

      if (item.quantity > crop.quantity.value) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for ${crop.cropName}`
        });
      }

      const itemTotal = item.quantity * crop.pricePerUnit;
      totalAmount += itemTotal;

      orderItems.push({
        cropId: crop._id,
        cropName: crop.cropName,
        quantity: item.quantity,
        pricePerUnit: crop.pricePerUnit,
        totalPrice: itemTotal
      });
    }

    // Get farmer ID from first item
    const firstCrop = await Crop.findById(items[0].cropId);
    const farmerId = firstCrop.farmerId;

    const order = new Order({
      buyerId,
      farmerId,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      notes
    });

    await order.save();

    // Update crop quantities
    for (const item of items) {
      const crop = await Crop.findById(item.cropId);
      crop.quantity.value -= item.quantity;
      
      if (crop.quantity.value === 0) {
        crop.status = 'sold';
      }
      
      await crop.save();
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
};

// Get All Orders (for buyers)
exports.getMyOrders = async (req, res) => {
  try {
    const buyerId = req.userId;
    const { page = 1, limit = 10, status } = req.query;

    const query = { buyerId };
    if (status) query.orderStatus = status;

    const orders = await Order.find(query)
      .populate({
        path: 'farmerId',
        populate: {
          path: 'userId',
          select: 'name phone'
        }
      })
      .populate('items.cropId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get Orders for Farmer
exports.getFarmerOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10, status } = req.query;

    const farmer = await Farmer.findOne({ userId });
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer profile not found'
      });
    }

    const query = { farmerId: farmer._id };
    if (status) query.orderStatus = status;

    const orders = await Order.find(query)
      .populate('buyerId', 'name email phone')
      .populate('items.cropId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error('Get farmer orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get Single Order
exports.getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    const order = await Order.findById(orderId)
      .populate('buyerId', 'name email phone')
      .populate({
        path: 'farmerId',
        populate: {
          path: 'userId',
          select: 'name email phone'
        }
      })
      .populate('items.cropId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user has permission to view this order
    const farmer = await Farmer.findOne({ userId });
    const isBuyer = order.buyerId._id.toString() === userId;
    const isFarmer = farmer && order.farmerId._id.toString() === farmer._id.toString();

    if (!isBuyer && !isFarmer && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, trackingId } = req.body;
    const userId = req.userId;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is the farmer for this order
    const farmer = await Farmer.findOne({ userId });
    if (!farmer || order.farmerId.toString() !== farmer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this order'
      });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (trackingId) order.trackingId = trackingId;

    if (orderStatus === 'delivered') {
      order.deliveryDate = new Date();
      
      // Update farmer's total sales
      farmer.totalSales += order.totalAmount;
      await farmer.save();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update Payment Status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus, transactionId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (transactionId) order.transactionId = transactionId;

    if (paymentStatus === 'completed') {
      order.orderStatus = 'confirmed';
    }

    await order.save();

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
