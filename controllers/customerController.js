const { Customer } = require('../models');

// @desc    Add a new customer
// @route   POST /api/customers
// @access  Private (BusinessOwner)
const addCustomer = async (req, res) => {
  try {
    const { customerName, productName, quantity, otherDetails } = req.body;
    const userId = req.user.id;

    const customer = await Customer.create({
      customerName,
      productName,
      quantity,
      otherDetails,
      userId
    });

    res.status(201).json({ message: 'Customer added successfully', customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private (BusinessOwner)
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({ where: { userId: req.user.id } });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private (BusinessOwner)
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findOne({ where: { id, userId: req.user.id } });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    await customer.update(req.body);
    res.json({ message: 'Customer updated successfully', customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private (BusinessOwner)
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Customer.destroy({ where: { id, userId: req.user.id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer
};
