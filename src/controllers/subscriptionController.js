const Subscription = require('../models/Subscription');

const createSubscription = async (req, res) => {
  const { name, price, billingCycle } = req.body;
  try {
    const subscription = await Subscription.create({
      name,
      price,
      billingCycle,
      userId: req.user._id,
    });
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.user._id });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription || subscription.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Subscription not found or not owned by you' });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSubscription = async (req, res) => {
  const { name, price, billingCycle } = req.body;
  try {
    let subscription = await Subscription.findById(req.params.id);
    if (!subscription || subscription.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Subscription not found or not owned by you' });
    }

    subscription.name = name || subscription.name;
    subscription.price = price || subscription.price;
    subscription.billingCycle = billingCycle || subscription.billingCycle;

    const updatedSubscription = await subscription.save();
    res.json(updatedSubscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription || subscription.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Subscription not found or not owned by you' });
    }
    await subscription.deleteOne();
    res.json({ message: 'Subscription removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
};
