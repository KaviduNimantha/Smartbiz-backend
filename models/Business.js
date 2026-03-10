const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Business = sequelize.define('Business', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Pending', 'Blocked'),
    defaultValue: 'Active',
  },
  subscriptionEndsAt: {
    type: DataTypes.DATE,
  }
}, {
  timestamps: true,
});

module.exports = Business;
