const Investment = require('../models/Investment');
const Farmer = require('../models/Farmer');
const Crop = require('../models/Crop');

// Create Investment
exports.createInvestment = async (req, res) => {
  try {
    const investorId = req.userId;
    const {
      farmerId,
      cropId,
      investmentAmount,
      investmentType,
      expectedROI,
      duration,
      terms,
      notes
    } = req.body;

    // Validate farmer
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // If crop-specific, validate crop
    if (investmentType === 'crop-specific' && cropId) {
      const crop = await Crop.findById(cropId);
      if (!crop) {
        return res.status(404).json({
          success: false,
          message: 'Crop not found'
        });
      }

      if (!crop.availableForInvestment) {
        return res.status(400).json({
          success: false,
          message: 'This crop is not available for investment'
        });
      }
    }

    // Calculate maturity date
    const startDate = new Date();
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + parseInt(duration));

    const investment = new Investment({
      investorId,
      farmerId,
      cropId: investmentType === 'crop-specific' ? cropId : undefined,
      investmentAmount,
      investmentType,
      expectedROI,
      duration,
      startDate,
      maturityDate,
      terms,
      notes
    });

    await investment.save();

    res.status(201).json({
      success: true,
      message: 'Investment created successfully',
      investment
    });
  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating investment'
    });
  }
};

// Get My Investments (Investor)
exports.getMyInvestments = async (req, res) => {
  try {
    const investorId = req.userId;
    const { page = 1, limit = 10, status } = req.query;

    const query = { investorId };
    if (status) query.status = status;

    const investments = await Investment.find(query)
      .populate({
        path: 'farmerId',
        populate: {
          path: 'userId',
          select: 'name phone'
        }
      })
      .populate('cropId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Investment.countDocuments(query);

    res.json({
      success: true,
      investments,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error('Get my investments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get Investments for Farmer
exports.getFarmerInvestments = async (req, res) => {
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
    if (status) query.status = status;

    const investments = await Investment.find(query)
      .populate('investorId', 'name email phone')
      .populate('cropId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Investment.countDocuments(query);

    // Calculate total investment received
    const totalInvestment = await Investment.aggregate([
      { $match: { farmerId: farmer._id, status: 'active' } },
      { $group: { _id: null, total: { $sum: '$investmentAmount' } } }
    ]);

    res.json({
      success: true,
      investments,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
      totalInvestmentReceived: totalInvestment[0]?.total || 0
    });
  } catch (error) {
    console.error('Get farmer investments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get Single Investment
exports.getInvestment = async (req, res) => {
  try {
    const { investmentId } = req.params;
    const userId = req.userId;

    const investment = await Investment.findById(investmentId)
      .populate('investorId', 'name email phone')
      .populate({
        path: 'farmerId',
        populate: {
          path: 'userId',
          select: 'name email phone'
        }
      })
      .populate('cropId');

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }

    // Check permissions
    const farmer = await Farmer.findOne({ userId });
    const isInvestor = investment.investorId._id.toString() === userId;
    const isFarmer = farmer && investment.farmerId._id.toString() === farmer._id.toString();

    if (!isInvestor && !isFarmer && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this investment'
      });
    }

    res.json({
      success: true,
      investment
    });
  } catch (error) {
    console.error('Get investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update Investment Status
exports.updateInvestmentStatus = async (req, res) => {
  try {
    const { investmentId } = req.params;
    const { status, returnAmount, transactionId } = req.body;
    const userId = req.userId;

    const investment = await Investment.findById(investmentId);

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }

    // Check if user is the farmer
    const farmer = await Farmer.findOne({ userId });
    if (!farmer || investment.farmerId.toString() !== farmer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this investment'
      });
    }

    if (status) investment.status = status;
    if (returnAmount) investment.returnAmount = returnAmount;
    if (transactionId) investment.transactionId = transactionId;

    await investment.save();

    res.json({
      success: true,
      message: 'Investment status updated successfully',
      investment
    });
  } catch (error) {
    console.error('Update investment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update Payment Status
exports.updateInvestmentPayment = async (req, res) => {
  try {
    const { investmentId } = req.params;
    const { paymentStatus, transactionId } = req.body;

    const investment = await Investment.findById(investmentId);

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }

    if (paymentStatus) investment.paymentStatus = paymentStatus;
    if (transactionId) investment.transactionId = transactionId;

    await investment.save();

    res.json({
      success: true,
      message: 'Investment payment status updated successfully',
      investment
    });
  } catch (error) {
    console.error('Update investment payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get Investment Opportunities
exports.getInvestmentOpportunities = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const crops = await Crop.find({ 
      availableForInvestment: true,
      status: 'available'
    })
      .populate({
        path: 'farmerId',
        populate: {
          path: 'userId',
          select: 'name phone'
        }
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Crop.countDocuments({ 
      availableForInvestment: true,
      status: 'available'
    });

    res.json({
      success: true,
      opportunities: crops,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error('Get investment opportunities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
