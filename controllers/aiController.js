const { Supplier, Product, Sale, Expense, sequelize } = require('../models');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

// @desc    Generate voice-like natural language reports
// @route   POST /api/ai/report
// @access  Private (BusinessOwner)
const generateNLReport = async (req, res) => {
    try {
        const { query } = req.body; // e.g., "How did I perform last month?"
        const userId = req.user.id;

        if (!process.env.OPENAI_API_KEY) {
            return res.json({
                message: "Mock Response: Your sales increased by 15% last month. Top item: Wireless Mouse.",
                warning: "OpenAI API Key not configured."
            });
        }

        // Fetch some context data for the AI
        const sales = await Sale.findAll({ where: { userId }, limit: 10 });
        const context = JSON.stringify(sales);

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a business consultant for SmartBiz. Use the provided data context to answer the user's question concisely." },
                { role: "user", content: `Data: ${context}. Question: ${query}` }
            ],
        });

        res.json({ message: response.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Generate email for suppliers or customers
// @route   POST /api/ai/email
// @access  Private (BusinessOwner)
const generateEmail = async (req, res) => {
    try {
        const { prompt } = req.body; // e.g., "Write a thank-you email to a supplier for delay"

        if (!process.env.OPENAI_API_KEY) {
            return res.json({
                message: "Subject: Regarding delivery delay\n\nDear Supplier,\n\nThank you for updating us regarding the delay...",
                warning: "OpenAI API Key not configured."
            });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an expert email composer for business owners. Create professional emails based on the user's request." },
                { role: "user", content: prompt }
            ],
        });

        res.json({ message: response.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Generate social media marketing posts
// @route   POST /api/ai/post
// @access  Private (BusinessOwner)
const generateSocialPost = async (req, res) => {
    try {
        const { prompt } = req.body; // e.g., "Create a Facebook post for our 50% off sale"

        if (!process.env.OPENAI_API_KEY) {
            return res.json({
                message: "🚀 HUGE SALE! Get 50% OFF on all items this weekend at SmartBiz! Don't miss out! #SmartBizSale #SME",
                warning: "OpenAI API Key not configured."
            });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a creative social media manager. Generate engaging posts with emojis and hashtags." },
                { role: "user", content: prompt }
            ],
        });

        res.json({ message: response.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    generateNLReport,
    generateEmail,
    generateSocialPost
};
