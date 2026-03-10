const express = require('express');
const router = express.Router();
const {
    getAllBusinesses,
    updateBusinessStatus,
    getSystemStats
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// All admin routes require being logged in as an Admin
router.use(protect);
router.use(authorize('Admin'));

router.get('/businesses', getAllBusinesses);
router.put('/businesses/:id/status', updateBusinessStatus);
router.get('/stats', getSystemStats);

module.exports = router;
