const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

const Supplier = sequelize.define('Supplier', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  supplierName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantityReceived: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  unitCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  supplyDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  contactDetails: {
    type: DataTypes.STRING,
  },
  // We link this to the user managing their business
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: true,
});

module.exports = Supplier;
