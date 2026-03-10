const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { sequelize, connectDB } = require('./db/db');
require('./models'); // Ensure models are loaded
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');
const customerRoutes = require('./routes/customerRoutes');
const salesRoutes = require('./routes/salesRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mounted Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);


// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

const PORT = process.env.PORT || 5000;

// Bootstrap DB & Server
connectDB().then(() => {
  // Sync DB schemas
  // Note: Using force: true will drop and recreate tables. 
  // We disable FK checks to avoid "Cannot drop table referenced by FK" errors
  sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
    .then(() => {
      return sequelize.sync({ force: true });
    })
    .then(() => {
      return sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    })
    .then(() => {
      console.log('Database schemas synced successfully.');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to sync database:', err);
    });
});
