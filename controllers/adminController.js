const { Business, User, SubscriptionPlan, SystemLog, Sequelize } = require('../models');

// @desc    Get all businesses
// @route   GET /api/admin/businesses
const getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.findAll({
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }]
    });
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update business status
// @route   PUT /api/admin/businesses/:id/status
const updateBusinessStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const business = await Business.findByPk(req.params.id);

    if (!business) return res.status(404).json({ error: 'Business not found' });

    business.status = status;
    await business.save();

    res.json(business);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create subscription plan
// @route   POST /api/admin/plans
const createSubscriptionPlan = async (req, res) => {
  try {
    const { name, price, durationInDays, features } = req.body;
    const plan = await SubscriptionPlan.create({ name, price, durationInDays, features });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all plans
// @route   GET /api/admin/plans
const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.findAll();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get system logs
// @route   GET /api/admin/logs
const getSystemLogs = async (req, res) => {
  try {
    const logs = await SystemLog.findAll({ order: [['createdAt', 'DESC']], limit: 100 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get system-wide statistics
// @route   GET /api/admin/statistics
const getSystemStatistics = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalBusinesses = await Business.count();
    const activeBusinesses = await Business.count({ where: { status: 'Active' } });
    
    res.json({
      totalUsers,
      totalBusinesses,
      activeBusinesses,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getBusinesses,
  updateBusinessStatus,
  createSubscriptionPlan,
  getSubscriptionPlans,
  getSystemLogs,
  getSystemStatistics,
};
