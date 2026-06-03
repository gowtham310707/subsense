const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/auth');

// Helper function to create audit log
const createAuditLog = async (action, userId, type) => {
  try {
    await AuditLog.create({
      action,
      user: userId,
      type
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
};

// @route   GET /api/subscriptions
// @desc    Get all subscriptions
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({});
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/subscriptions
// @desc    Create a new subscription
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, icon, category, cost, billing, seats, nextRenewal, status, score } = req.body;

    const subscription = new Subscription({
      name,
      icon,
      category,
      cost,
      billing,
      seats,
      nextRenewal,
      status,
      score
    });

    const createdSubscription = await subscription.save();
    
    // Log the action
    await createAuditLog(`Created subscription: ${name}`, req.user._id, 'subscription_created');

    res.status(201).json(createdSubscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/subscriptions/:id
// @desc    Update a subscription
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, icon, category, cost, billing, seats, nextRenewal, status, score } = req.body;

    const subscription = await Subscription.findById(req.params.id);

    if (subscription) {
      subscription.name = name || subscription.name;
      subscription.icon = icon || subscription.icon;
      subscription.category = category || subscription.category;
      subscription.cost = cost || subscription.cost;
      subscription.billing = billing || subscription.billing;
      subscription.seats = seats || subscription.seats;
      subscription.nextRenewal = nextRenewal || subscription.nextRenewal;
      subscription.status = status || subscription.status;
      subscription.score = score || subscription.score;

      const updatedSubscription = await subscription.save();

      // Log the action
      await createAuditLog(`Updated subscription: ${subscription.name}`, req.user._id, 'subscription_updated');

      res.json(updatedSubscription);
    } else {
      res.status(404).json({ message: 'Subscription not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/subscriptions/:id
// @desc    Delete a subscription
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (subscription) {
      const subName = subscription.name;
      await subscription.deleteOne();
      
      // Log the action
      await createAuditLog(`Deleted subscription: ${subName}`, req.user._id, 'subscription_deleted');

      res.json({ message: 'Subscription removed' });
    } else {
      res.status(404).json({ message: 'Subscription not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
