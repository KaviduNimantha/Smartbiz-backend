const { Sale, SaleItem, Product, Invoice, Expense, Income, sequelize } = require('../models');
const PDFDocument = require('pdfkit');

// --------- Sales CRUD ---------
const getSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      where: { businessId: req.businessId },
      include: [{ model: SaleItem, as: 'items' }, { model: Invoice, as: 'invoice' }]
    });
    res.json(sales);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const createSale = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { customerId, discount, items } = req.body; // items: [{ productId, quantity }]
    
    let totalAmount = 0;
    const saleItemsData = [];

    // Calculate total and deduct stock
    for (let item of items) {
      const product = await Product.findByPk(item.productId, { transaction });
      if (!product || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product ? product.name : item.productId}`);
      }

      product.stock -= item.quantity;
      await product.save({ transaction });

      const subtotal = item.quantity * product.price;
      totalAmount += subtotal;

      saleItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal
      });
    }

    const finalAmount = totalAmount - (discount || 0);

    const sale = await Sale.create({
      totalAmount: finalAmount,
      discount: discount || 0,
      businessId: req.businessId,
      customerId: customerId || null
    }, { transaction });

    // Add saleItems
    const saleItemsToCreate = saleItemsData.map(si => ({ ...si, saleId: sale.id }));
    await SaleItem.bulkCreate(saleItemsToCreate, { transaction });

    // Create default unpaid invoice
    const invoice = await Invoice.create({
      invoiceNumber: `INV-${Date.now()}`,
      saleId: sale.id
    }, { transaction });

    await transaction.commit();
    res.status(201).json({ sale, invoice });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// --------- Invoices & PDF ---------
const generateInvoicePDF = async (req, res) => {
  try {
    const saleId = req.params.saleId;
    const sale = await Sale.findByPk(saleId, {
      include: [
        { model: SaleItem, as: 'items', include: [{ model: Product }] },
        { model: Invoice, as: 'invoice' }
      ]
    });

    if (!sale || sale.businessId !== req.businessId) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    const doc = new PDFDocument();
    
    // Set response headers to trigger file download/view
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${sale.invoice.invoiceNumber}.pdf`);
    
    doc.pipe(res);

    // Simple PDF content
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice Number: ${sale.invoice.invoiceNumber}`);
    doc.text(`Date: ${new Date(sale.date).toLocaleDateString()}`);
    doc.moveDown();

    doc.text('Items:');
    sale.items.forEach(item => {
      doc.text(`- ${item.Product.name}: ${item.quantity} x $${item.unitPrice} = $${item.subtotal}`);
    });

    doc.moveDown();
    doc.text(`Discount: $${sale.discount}`);
    doc.fontSize(14).text(`Total Amount: $${sale.totalAmount}`, { underline: true });

    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --------- Expenses CRUD ---------
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { businessId: req.businessId } });
    res.json(expenses);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const createExpense = async (req, res) => {
  try {
    const { description, amount, date } = req.body;
    const expense = await Expense.create({
      description, amount, date, businessId: req.businessId
    });
    res.status(201).json(expense);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// --------- Income CRUD ---------
const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.findAll({ where: { businessId: req.businessId } });
    res.json(incomes);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const createIncome = async (req, res) => {
  try {
    const { description, amount, date } = req.body;
    const income = await Income.create({
      description, amount, date, businessId: req.businessId
    });
    res.status(201).json(income);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = {
  getSales,
  createSale,
  generateInvoicePDF,
  getExpenses,
  createExpense,
  getIncomes,
  createIncome,
};
