const express = require('express');
const router = express.Router();
const { 
  processSale, 
  getAllSales 
} = require('../controllers/salesController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// All sales routes require being logged in as a BusinessOwner
router.use(protect);
router.use(authorize('BusinessOwner'));

router.get('/', getAllSales);
router.post('/', processSale); // "Process Sale" reduces stock

module.exports = router;
