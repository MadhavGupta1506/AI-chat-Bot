const Farmer = require('../models/Farmer');
const User = require('../models/User');

// Create Farmer Profile
exports.createFarmerProfile = async (req, res) => {
  try {
    const userId = req.userId;

    // Check if user is a farmer
    const user = await User.findById(userId);
    if (user.role !== 'farmer') {
      return res.status(403).json({
        success: false,
        message: 'Only farmers can create farmer profiles'
      });
    }

    // Check if farmer profile already exists
    const existingFarmer = await Farmer.findOne({ userId });
    if (existingFarmer) {
      return res.status(400).json({
        success: false,
        message: 'Farmer profile already exists'
      });
    }

    const { farmDetails, bankDetails, certifications } = req.body;

    const farmer = new Farmer({
      userId,
      farmDetails,
      bankDetails,
      certifications
    });

    await farmer.save();

    res.status(201).json({
      success: true,
      message: 'Farmer profile created successfully',
      farmer
    });
  } catch (error) {
    console.error('Create farmer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating farmer profile'
    });
  }
};

// Get Farmer Profile
exports.getFarmerProfile = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const farmer = await Farmer.findById(farmerId).populate('userId', 'name email phone');

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    res.json({
      success: true,
      farmer
    });
  } catch (error) {
    console.error('Get farmer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get My Farmer Profile
exports.getMyFarmerProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const farmer = await Farmer.findOne({ userId }).populate('userId', 'name email phone');

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer profile not found'
      });
    }

    res.json({
      success: true,
      farmer
    });
  } catch (error) {
    console.error('Get my farmer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update Farmer Profile
exports.updateFarmerProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { farmDetails, bankDetails, certifications } = req.body;

    const farmer = await Farmer.findOne({ userId });

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer profile not found'
      });
    }

    // Update fields
    if (farmDetails) farmer.farmDetails = { ...farmer.farmDetails, ...farmDetails };
    if (bankDetails) farmer.bankDetails = { ...farmer.bankDetails, ...bankDetails };
    if (certifications) farmer.certifications = certifications;

    await farmer.save();

    res.json({
      success: true,
      message: 'Farmer profile updated successfully',
      farmer
    });
  } catch (error) {
    console.error('Update farmer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get All Farmers
exports.getAllFarmers = async (req, res) => {
  try {
    const { page = 1, limit = 10, verified } = req.query;

    const query = {};
    if (verified !== undefined) {
      query.isVerified = verified === 'true';
    }

    const farmers = await Farmer.find(query)
      .populate('userId', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Farmer.countDocuments(query);

    res.json({
      success: true,
      farmers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get all farmers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
