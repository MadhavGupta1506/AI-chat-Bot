const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  cropName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Cereals', 'Pulses', 'Vegetables', 'Fruits', 'Spices', 'Oilseeds', 'Cash Crops', 'Other'],
    required: true
  },
  variety: {
    type: String
  },
  quantity: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton', 'piece'],
      default: 'kg'
    }
  },
  pricePerUnit: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  quality: {
    grade: {
      type: String,
      enum: ['A+', 'A', 'B', 'C'],
      default: 'A'
    },
    description: String
  },
  harvestDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date
  },
  images: [{
    url: String,
    caption: String
  }],
  description: {
    type: String
  },
  organicCertified: {
    type: Boolean,
    default: false
  },
  availableForInvestment: {
    type: Boolean,
    default: false
  },
  investmentDetails: {
    minimumInvestment: Number,
    expectedROI: Number,
    harvestCycle: Number // in months
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved', 'expired'],
    default: 'available'
  },
  location: {
    city: String,
    state: String,
    pincode: String
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search
cropSchema.index({ cropName: 'text', category: 'text', description: 'text' });

module.exports = mongoose.model('Crop', cropSchema);
