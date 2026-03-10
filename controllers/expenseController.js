const { Expense } = require('../models');

// @desc    Add a new expense
// @route   POST /api/expenses
// @access  Private (BusinessOwner)
const addExpense = async (req, res) => {
  try {
    const { description, amount, category, expenseDate } = req.body;
    const userId = req.user.id;

    const expense = await Expense.create({
      description,
      amount,
      category,
      expenseDate: expenseDate || new Date(),
      userId
    });

    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private (BusinessOwner)
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private (BusinessOwner)
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOne({ where: { id, userId: req.user.id } });

    if (!expense) {
      return res.status(404).json({ error: 'Expense record not found' });
    }

    await expense.update(req.body);
    res.json({ message: 'Expense updated successfully', expense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private (BusinessOwner)
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Expense.destroy({ where: { id, userId: req.user.id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Expense record not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense
};
