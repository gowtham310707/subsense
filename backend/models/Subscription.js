const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  category: {
    type: String,
  },
  cost: {
    type: Number,
  },
  billing: {
    type: String,
    enum: ['monthly', 'yearly', 'weekly'],
  },
  seats: {
    type: Number,
  },
  nextRenewal: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled'],
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
