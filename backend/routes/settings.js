const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect } = require('../middleware/auth');

// @route   GET /api/settings
// @desc    Get system settings or create default
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let settings = await Settings.findOne({});

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/settings
// @desc    Update settings (upsert)
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const { emailAlerts, slackAlerts, twoFactor, currency } = req.body;

    let settings = await Settings.findOne({});

    if (settings) {
      settings.emailAlerts = emailAlerts !== undefined ? emailAlerts : settings.emailAlerts;
      settings.slackAlerts = slackAlerts !== undefined ? slackAlerts : settings.slackAlerts;
      settings.twoFactor = twoFactor !== undefined ? twoFactor : settings.twoFactor;
      settings.currency = currency || settings.currency;

      const updatedSettings = await settings.save();
      res.json(updatedSettings);
    } else {
      const newSettings = await Settings.create({
        emailAlerts,
        slackAlerts,
        twoFactor,
        currency,
      });
      res.status(201).json(newSettings);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
