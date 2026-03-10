const express = require('express');
const router = express.Router();
const {
  checkBusinessProfile,
  createBusinessProfile,
  getDashboardConfig,
  getCustomers,
  createCustomer,
  getSuppliers,
  createSupplier,
  getProducts,
  createProduct,
} = require('../controllers/businessController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

// Allow BusinessOwner or Employee for these routes
router.use(authorize('BusinessOwner', 'Employee'));

// Profile
router.post('/profile', createBusinessProfile);

// The rest require an existing business profile
router.use(checkBusinessProfile);

router.get('/dashboard', getDashboardConfig);

router.route('/customers')
  .get(getCustomers)
  .post(createCustomer);

router.route('/suppliers')
  .get(getSuppliers)
  .post(createSupplier);

router.route('/products')
  .get(getProducts)
  .post(createProduct);

module.exports = router;
