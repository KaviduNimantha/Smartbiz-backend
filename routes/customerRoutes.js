const express = require('express');
const router = express.Router();
const { 
  addCustomer, 
  getCustomers, 
  updateCustomer, 
  deleteCustomer 
} = require('../controllers/customerController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// All customer routes require being logged in as a BusinessOwner
router.use(protect);
router.use(authorize('BusinessOwner'));

router.get('/', getCustomers);
router.post('/', addCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;
