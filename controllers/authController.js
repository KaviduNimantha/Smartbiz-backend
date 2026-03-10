const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const dotenv = require('dotenv');

dotenv.config();

// Hardcoded Admin Constants
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@smartbiz.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user (BusinessOwner or Employee)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Prevent registering with admin email
    if (email === ADMIN_EMAIL) {
      return res.status(400).json({ error: 'Cannot register with admin email' });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Role cannot be Admin through public registration
    const userRole = (role === 'Admin') ? 'BusinessOwner' : (role || 'BusinessOwner');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    if (user) {
      res.status(201).json({
        message: 'User registered successfully. Please login to continue.',
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check Hardcoded Admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return res.json({
        message: 'Admin login successful',
        user: {
          id: 'admin_id_0',
          name: 'Super Admin',
          email: ADMIN_EMAIL,
          role: 'Admin',
        },
        token: generateToken('admin_id_0', 'Admin'),
      });
    }

    // 2. Check Database Users
    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
