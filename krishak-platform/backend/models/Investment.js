const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop'
  },
  investmentAmount: {
    type: Number,
    required: true
  },
  investmentType: {
    type: String,
    enum: ['crop-specific', 'farm-general', 'harvest-cycle'],
    default: 'crop-specific'
  },
  expectedROI: {
    type: Number,
    required: true // in percentage
  },
  duration: {
    type: Number,
    required: true // in months
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  maturityDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'matured', 'cancelled', 'returned'],
    default: 'active'
  },
  returnAmount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  transactionId: {
    type: String
  },
  terms: {
    type: String
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Investment', investmentSchema);
