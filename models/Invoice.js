const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  pdfUrl: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('Paid', 'Unpaid', 'Partial'),
    defaultValue: 'Unpaid',
  },
  dueDate: {
    type: DataTypes.DATE,
  },
}, {
  timestamps: true,
});

module.exports = Invoice;
