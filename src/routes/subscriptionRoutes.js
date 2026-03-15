const express = require('express');
const {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
} = require('../controllers/subscriptionController');
const { protect } = require('../middlewares/authMiddleware');
const { validateSubscription } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', validateSubscription, createSubscription);
router.get('/', getSubscriptions);
router.get('/:id', getSubscriptionById);
router.put('/:id', validateSubscription, updateSubscription);
router.delete('/:id', deleteSubscription);

module.exports = router;
