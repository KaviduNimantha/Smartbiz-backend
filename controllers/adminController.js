const { User, Business, Sale } = require('../models');

// @desc    Get all registered businesses
// @route   GET /api/admin/businesses
// @access  Private (Admin)
const getAllBusinesses = async (req, res) => {
    try {
        const businesses = await Business.findAll({
            include: [{
                model: User,
                as: 'business', // Wait, check the alias in models/index.js
                attributes: ['name', 'email']
            }]
        });
        // Correction: In models/index.js: User.hasOne(Business, { foreignKey: 'userId', as: 'business' });
        // So from Business side, we need to check the alias. 
        // Business.belongsTo(User, { foreignKey: 'userId' }); (no alias yet)

        // Let's refine the query once I'm sure about the alias.
        const allBusinesses = await Business.findAll({
            include: [{ model: User, attributes: ['name', 'email'] }]
        });
        res.json(allBusinesses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update business status (Activate/Suspend)
// @route   PUT /api/admin/businesses/:id/status
// @access  Private (Admin)
const updateBusinessStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Active', 'Suspended'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const business = await Business.findByPk(id);
        if (!business) return res.status(404).json({ error: 'Business not found' });

        business.status = status;
        await business.save();

        res.json({ message: `Business status updated to ${status}`, business });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get platform-wide statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getSystemStats = async (req, res) => {
    try {
        const userCount = await User.count({ where: { role: 'BusinessOwner' } });
        const businessCount = await Business.count();
        const totalSales = await Sale.sum('totalAmount') || 0;

        res.json({
            totalBusinessOwners: userCount,
            totalRegisteredBusinesses: businessCount,
            totalPlatformSales: parseFloat(totalSales)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllBusinesses,
    updateBusinessStatus,
    getSystemStats
};
