const { Sale, Product, sequelize } = require('../models');

// @desc    Process a new sale (Reduce stock and calculate profit)
// @route   POST /api/sales
// @access  Private (BusinessOwner)
const processSale = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { productName, quantity } = req.body;
    const userId = req.user.id;

    // 1. Find the product
    const product = await Product.findOne({
      where: { productName, userId }
    }, { transaction });

    if (!product) {
      return res.status(404).json({ error: 'Product not found in inventory' });
    }

    if (product.totalStockQuantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // 2. Calculate values
    const totalAmount = product.sellingPrice * quantity;
    const costTotal = product.costPrice * quantity;
    const profit = totalAmount - costTotal;

    // 3. Create Sale Record
    const sale = await Sale.create({
      productName,
      quantity,
      totalAmount,
      profit,
      userId
    }, { transaction });

    // 4. Reduce Stock
    product.totalStockQuantity -= quantity;
    await product.save({ transaction });

    await transaction.commit();
    res.status(201).json({ message: 'Sale processed successfully', sale });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private (BusinessOwner)
const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({ 
      where: { userId: req.user.id },
      attributes: { exclude: ['userId'] } // Often "details without customer name" means the payload is clean
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  processSale,
  getAllSales
};
