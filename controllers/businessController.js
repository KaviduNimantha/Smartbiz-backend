const { Supplier, Product, Sale, sequelize } = require('../models');
const { Op } = require('sequelize');

// --- Dashboard Logic ---
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Total Sales & Profits
    const salesData = await Sale.findAll({
      where: { userId },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalSales'],
        [sequelize.fn('SUM', sequelize.col('profit')), 'totalProfit']
      ],
      raw: true
    });

    // 2. Inventory Stats (Total stock value and quantity)
    const inventoryData = await Product.findAll({
      where: { userId },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('totalStockQuantity')), 'totalStock'],
        [sequelize.fn('SUM', sequelize.where(sequelize.col('totalStockQuantity'), '*', sequelize.col('costPrice'))), 'inventoryValue']
      ],
      raw: true
    });

    res.json({
      totalSales: parseFloat(salesData[0].totalSales || 0),
      totalProfit: parseFloat(salesData[0].totalProfit || 0),
      totalStock: parseInt(inventoryData[0].totalStock || 0),
      inventoryValue: parseFloat(inventoryData[0].inventoryValue || 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- Supplier CRUD ---
const addSupplierBatch = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { supplierName, productName, category, quantity, unitCost, date, contactDetails } = req.body;
    const userId = req.user.id;

    // 1. Create Supplier Record
    const supplier = await Supplier.create({
      supplierName,
      productName,
      quantityReceived: quantity,
      unitCost,
      supplyDate: date || new Date(),
      contactDetails,
      userId
    }, { transaction });

    // 2. Update or Create Product (Inventory)
    let product = await Product.findOne({
      where: { productName, userId }
    }, { transaction });

    if (product) {
      product.totalStockQuantity += parseInt(quantity);
      // Optional: Update cost price to the latest or average
      product.costPrice = unitCost;
      await product.save({ transaction });
    } else {
      product = await Product.create({
        productName,
        category,
        totalStockQuantity: quantity,
        costPrice: unitCost,
        sellingPrice: unitCost * 1.2, // Default 20% markup, user can update later
        userId
      }, { transaction });
    }

    await transaction.commit();
    res.status(201).json({ message: 'Supplier/Stock added successfully', supplier, product });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({ where: { userId: req.user.id } });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findOne({ where: { id, userId: req.user.id } });
    if (!supplier) return res.status(404).json({ error: 'Supplier entry not found' });

    await supplier.update(req.body);
    res.json({ message: 'Supplier updated successfully', supplier });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Supplier.destroy({ where: { id, userId: req.user.id } });
    if (!deleted) return res.status(404).json({ error: 'Supplier entry not found' });
    res.json({ message: 'Supplier entry deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- Product/Stock Category API ---
const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { userId: req.user.id } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { sellingPrice } = req.body;
    const product = await Product.findOne({ where: { id, userId: req.user.id } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.sellingPrice = sellingPrice;
    await product.save();
    res.json({ message: 'Product price updated', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBusinessProfile = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const userId = req.user.id;

    // Check if user already has a business
    const existing = await Business.findOne({ where: { userId } });
    if (existing) {
      return res.status(400).json({ error: 'Business profile already exists for this user' });
    }

    const business = await Business.create({
      name,
      address,
      phone,
      userId
    });

    res.status(201).json({ message: 'Business profile created successfully', business });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  addSupplierBatch,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
  getProducts,
  updateProductPrice,
  createBusinessProfile
};
