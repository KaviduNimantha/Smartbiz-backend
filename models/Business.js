const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

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
        type: DataTypes.ENUM('Active', 'Suspended'),
        defaultValue: 'Active',
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // One user owns one business in this lite version
    }
}, {
    timestamps: true,
});

module.exports = Business;
