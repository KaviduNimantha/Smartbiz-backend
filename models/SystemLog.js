const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SystemLog = sequelize.define('SystemLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  details: {
    type: DataTypes.JSON,
  },
}, {
  timestamps: true,
});

module.exports = SystemLog;
