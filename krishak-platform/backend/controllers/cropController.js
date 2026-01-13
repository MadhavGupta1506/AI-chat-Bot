const Crop = require('../models/Crop');
const Farmer = require('../models/Farmer');

// Create Crop Listing
exports.createCrop = async (req, res) => {
  try {
    const userId = req.userId;

    // Get farmer profile
    const farmer = await Farmer.findOne({ userId });
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer profile not found. Please create a farmer profile first.'
      });
    }

    const cropData = {
      ...req.body,
      farmerId: farmer._id
    };

    const crop = new Crop(cropData);
    await crop.save();

    res.status(201).json({
      success: true,
      message: 'Crop listing created successfully',
      crop
    });
  } catch (error) {
    console.error('Create crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating crop listing'
    });
  }
};

// Get All Crops
exports.getAllCrops = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      status, 
      search,
      minPrice,
      maxPrice,
      organicCertified,
      availableForInvestment
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (organicCertified) query.organicCertified = organicCertified === 'true';
    if (availableForInvestment) query.availableForInvestment = availableForInvestment === 'true';

    if (search) {
      query.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      query.pricePerUnit = {};
      if (minPrice) query.pricePerUnit.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerUnit.$lte = parseFloat(maxPrice);
    }

    const crops = await Crop.find(query)
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

    const count = await Crop.countDocuments(query);

    res.json({
      success: true,
      crops,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error('Get all crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get Single Crop
exports.getCrop = async (req, res) => {
  try {
    const { cropId } = req.params;

    const crop = await Crop.findById(cropId).populate({
      path: 'farmerId',
      populate: {
        path: 'userId',
        select: 'name email phone'
      }
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Increment views
    crop.views += 1;
    await crop.save();

    res.json({
      success: true,
      crop
    });
  } catch (error) {
    console.error('Get crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get My Crops
exports.getMyCrops = async (req, res) => {
  try {
    const userId = req.userId;

    const farmer = await Farmer.findOne({ userId });
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer profile not found'
      });
    }

    const crops = await Crop.find({ farmerId: farmer._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      crops,
      total: crops.length
    });
  } catch (error) {
    console.error('Get my crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update Crop
exports.updateCrop = async (req, res) => {
  try {
    const userId = req.userId;
    const { cropId } = req.params;

    const farmer = await Farmer.findOne({ userId });
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer profile not found'
      });
    }

    const crop = await Crop.findOne({ _id: cropId, farmerId: farmer._id });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found or you do not have permission to update it'
      });
    }

    // Update crop fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        crop[key] = req.body[key];
      }
    });

    await crop.save();

    res.json({
      success: true,
      message: 'Crop updated successfully',
      crop
    });
  } catch (error) {
    console.error('Update crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete Crop
exports.deleteCrop = async (req, res) => {
  try {
    const userId = req.userId;
    const { cropId } = req.params;

    const farmer = await Farmer.findOne({ userId });
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer profile not found'
      });
    }

    const crop = await Crop.findOneAndDelete({ _id: cropId, farmerId: farmer._id });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found or you do not have permission to delete it'
      });
    }

    res.json({
      success: true,
      message: 'Crop deleted successfully'
    });
  } catch (error) {
    console.error('Delete crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
