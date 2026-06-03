const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  emailAlerts: {
    type: Boolean,
    default: false,
  },
  slackAlerts: {
    type: Boolean,
    default: false,
  },
  twoFactor: {
    type: Boolean,
    default: false,
  },
  currency: {
    type: String,
    default: 'USD',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Settings', SettingsSchema);
