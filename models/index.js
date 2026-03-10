const { sequelize } = require('../config/db');
const User = require('./User');
const Business = require('./Business');
const Customer = require('./Customer');
const Supplier = require('./Supplier');
const Product = require('./Product');
const Sale = require('./Sale');
const SaleItem = require('./SaleItem');
const Invoice = require('./Invoice');
const Expense = require('./Expense');
const Income = require('./Income');
const SubscriptionPlan = require('./SubscriptionPlan');
const SystemLog = require('./SystemLog');

// Define Relationships

// User - Business (1:1 for BusinessOwner, could be 1:N if multiple businesses per owner, going with 1:1 for simplicity initially or 1:N)
User.hasMany(Business, { foreignKey: 'userId', as: 'businesses' });
Business.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// Business - Customers (1:N)
Business.hasMany(Customer, { foreignKey: 'businessId', as: 'customers' });
Customer.belongsTo(Business, { foreignKey: 'businessId' });

// Business - Suppliers (1:N)
Business.hasMany(Supplier, { foreignKey: 'businessId', as: 'suppliers' });
Supplier.belongsTo(Business, { foreignKey: 'businessId' });

// Business - Products (1:N)
Business.hasMany(Product, { foreignKey: 'businessId', as: 'products' });
Product.belongsTo(Business, { foreignKey: 'businessId' });

// Business - Sales (1:N)
Business.hasMany(Sale, { foreignKey: 'businessId', as: 'sales' });
Sale.belongsTo(Business, { foreignKey: 'businessId' });

// Customer - Sales (1:N)
Customer.hasMany(Sale, { foreignKey: 'customerId', as: 'sales' });
Sale.belongsTo(Customer, { foreignKey: 'customerId' });

// Sale - SaleItems (1:N)
Sale.hasMany(SaleItem, { foreignKey: 'saleId', as: 'items' });
SaleItem.belongsTo(Sale, { foreignKey: 'saleId' });

// Product - SaleItems (1:N)
Product.hasMany(SaleItem, { foreignKey: 'productId', as: 'saleItems' });
SaleItem.belongsTo(Product, { foreignKey: 'productId' });

// Sale - Invoice (1:1)
Sale.hasOne(Invoice, { foreignKey: 'saleId', as: 'invoice' });
Invoice.belongsTo(Sale, { foreignKey: 'saleId' });

// Business - Expense (1:N)
Business.hasMany(Expense, { foreignKey: 'businessId', as: 'expenses' });
Expense.belongsTo(Business, { foreignKey: 'businessId' });

// Business - Income (1:N)
Business.hasMany(Income, { foreignKey: 'businessId', as: 'incomes' });
Income.belongsTo(Business, { foreignKey: 'businessId' });

module.exports = {
  sequelize,
  User,
  Business,
  Customer,
  Supplier,
  Product,
  Sale,
  SaleItem,
  Invoice,
  Expense,
  Income,
  SubscriptionPlan,
  SystemLog
};
