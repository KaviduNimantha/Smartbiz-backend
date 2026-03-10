const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  addSupplierBatch,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
  getProducts,
  updateProductPrice,
  createBusinessProfile
} = require('../controllers/businessController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// All business routes require being logged in as a BusinessOwner
router.use(protect);
router.use(authorize('BusinessOwner'));

// Profile
router.post('/', createBusinessProfile);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Suppliers
router.get('/suppliers', getSuppliers);
router.post('/suppliers', addSupplierBatch); // "Add" also updates inventory
router.put('/suppliers/:id', updateSupplier);
router.delete('/suppliers/:id', deleteSupplier);

// Products
router.get('/products', getProducts);
router.put('/products/:id/price', updateProductPrice);

module.exports = router;
