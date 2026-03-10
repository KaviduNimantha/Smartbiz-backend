const express = require('express');
const router = express.Router();
const { 
  addExpense, 
  getExpenses, 
  updateExpense, 
  deleteExpense 
} = require('../controllers/expenseController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// All expense routes require being logged in as a BusinessOwner
router.use(protect);
router.use(authorize('BusinessOwner'));

router.get('/', getExpenses);
router.post('/', addExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
