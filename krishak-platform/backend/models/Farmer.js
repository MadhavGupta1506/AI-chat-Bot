const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmDetails: {
    farmName: {
      type: String,
      required: true
    },
    farmSize: {
      type: Number,
      required: true // in acres
    },
    location: {
      latitude: Number,
      longitude: Number,
      address: String
    },
    soilType: {
      type: String,
      enum: ['Alluvial', 'Black', 'Red', 'Laterite', 'Desert', 'Mountain', 'Other']
    }
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String
  },
  certifications: [{
    name: String,
    issuedBy: String,
    issuedDate: Date,
    validUntil: Date,
    documentUrl: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalSales: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Farmer', farmerSchema);
