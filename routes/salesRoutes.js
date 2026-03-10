const express = require('express');
const router = express.Router();
const {
  getSales,
  createSale,
  generateInvoicePDF,
  getExpenses,
  createExpense,
  getIncomes,
  createIncome,
} = require('../controllers/salesController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);
router.use(authorize('BusinessOwner', 'Employee'));

// Wait, we need the checkBusinessProfile middleware from businessController, 
// so we'll import it here to enforce that a business exists for the user.
const { checkBusinessProfile } = require('../controllers/businessController');
router.use(checkBusinessProfile);

router.route('/')
  .get(getSales)
  .post(createSale);

router.get('/:saleId/invoice/pdf', generateInvoicePDF);

router.route('/expenses')
  .get(getExpenses)
  .post(createExpense);

router.route('/incomes')
  .get(getIncomes)
  .post(createIncome);

module.exports = router;
