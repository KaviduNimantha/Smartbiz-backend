const express = require('express');
const router = express.Router();
const {
  getBusinesses,
  updateBusinessStatus,
  createSubscriptionPlan,
  getSubscriptionPlans,
  getSystemLogs,
  getSystemStatistics,
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Apply protection and Admin role authorization to all routes in this file
router.use(protect);
router.use(authorize('Admin'));

router.get('/businesses', getBusinesses);
router.put('/businesses/:id/status', updateBusinessStatus);

router.route('/plans')
  .get(getSubscriptionPlans)
  .post(createSubscriptionPlan);

router.get('/logs', getSystemLogs);
router.get('/statistics', getSystemStatistics);

module.exports = router;
