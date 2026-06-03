const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/auth');

// @route   GET /api/auditlogs
// @desc    Get all audit logs
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const logs = await AuditLog.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auditlogs
// @desc    Create an audit log manually (usually done internally, but exposed per spec)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { action, type } = req.body;

    if (!action) {
      return res.status(400).json({ message: 'Action is required' });
    }

    const log = await AuditLog.create({
      action,
      user: req.user._id,
      type
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
