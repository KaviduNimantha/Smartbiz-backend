const { Business, Customer, Supplier, Product, Sale, Expense, Income, Sequelize } = require('../models');

// Middleware helper to ensure user has a business profile
const checkBusinessProfile = async (req, res, next) => {
  const business = await Business.findOne({ where: { userId: req.user.id } });
  if (!business) {
    return res.status(404).json({ error: 'Business profile not found. Please create one first.' });
  }
  req.businessId = business.id;
  next();
};

// @desc    Get dashboard summary
// @route   GET /api/business/dashboard
const getDashboardConfig = async (req, res) => {
  try {
    const businessId = req.businessId;

    const totalSalesAmount = await Sale.sum('totalAmount', { where: { businessId } }) || 0;
    const totalExpenses = await Expense.sum('amount', { where: { businessId } }) || 0;
    const totalIncome = await Income.sum('amount', { where: { businessId } }) || 0;
    const totalProducts = await Product.count({ where: { businessId } });
    
    // Inventory value (Sum of stock * cost)
    const products = await Product.findAll({ where: { businessId } });
    const inventoryValue = products.reduce((acc, curr) => acc + (curr.stock * curr.cost), 0);

    res.json({
      totalSalesAmount,
      totalExpenses,
      totalIncome,
      totalProducts,
      inventoryValue,
      netProfit: (totalSalesAmount + totalIncome) - totalExpenses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create business profile for the owner
// @route   POST /api/business/profile
const createBusinessProfile = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    
    const existing = await Business.findOne({ where: { userId: req.user.id } });
    if(existing) return res.status(400).json({ error: 'Business profile already exists for this user' });

    const business = await Business.create({
      name, address, phone, userId: req.user.id
    });
    
    res.status(201).json(business);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --------- Customers CRUD ---------
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({ where: { businessId: req.businessId } });
    res.json(customers);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const customer = await Customer.create({ name, email, phone, address, businessId: req.businessId });
    res.status(201).json(customer);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// --------- Suppliers CRUD ---------
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({ where: { businessId: req.businessId } });
    res.json(suppliers);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const createSupplier = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const supplier = await Supplier.create({ name, email, phone, address, businessId: req.businessId });
    res.status(201).json(supplier);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// --------- Products CRUD ---------
const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { businessId: req.businessId } });
    res.json(products);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, sku, price, cost, stock } = req.body;
    const product = await Product.create({ name, description, sku, price, cost, stock, businessId: req.businessId });
    res.status(201).json(product);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = {
  checkBusinessProfile,
  createBusinessProfile,
  getDashboardConfig,
  getCustomers,
  createCustomer,
  getSuppliers,
  createSupplier,
  getProducts,
  createProduct,
};
