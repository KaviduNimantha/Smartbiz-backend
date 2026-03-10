const { sequelize } = require('../db/db');
const User = require('./User');
const Supplier = require('./Supplier');
const Product = require('./Product');
const Sale = require('./Sale');
const Customer = require('./Customer');
const Expense = require('./Expense');
const Business = require('./Business');

// System Relations
User.hasOne(Business, { foreignKey: 'userId', as: 'business' });
Business.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Supplier, { foreignKey: 'userId', as: 'suppliers' });
Supplier.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Product, { foreignKey: 'userId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Sale, { foreignKey: 'userId', as: 'sales' });
Sale.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Customer, { foreignKey: 'userId', as: 'customers' });
Customer.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Expense, { foreignKey: 'userId', as: 'expenses' });
Expense.belongsTo(User, { foreignKey: 'userId' });

// Centralize model exports
module.exports = {
  sequelize,
  User,
  Supplier,
  Product,
  Sale,
  Customer,
  Expense,
  Business,
};
