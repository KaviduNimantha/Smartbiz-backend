const { OpenAI } = require('openai');
const { Sale, Expense, Income, SystemLog } = require('../models');

// Configure OpenAI
let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else {
  console.warn("OPENAI_API_KEY is missing. Mock AI responses will be used.");
}

// Helper to interact with OpenAI
const generateAIResponse = async (prompt, systemPrompt = "You are a helpful AI assistant for a business managing app called SmartBiz.") => {
  if (!openai) {
    return `[MOCK AI] I am an AI response to your request: "${prompt}". Please add your OPENAI_API_KEY to see real responses.`;
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw new Error("Failed to generate AI response");
  }
};

// Log AI usage internally
const logAIUsage = async (userId, action, prompt) => {
  try {
    await SystemLog.create({
      action,
      details: { userId, promptPreview: prompt.substring(0, 50) + "..." }
    });
  } catch(e) { console.error("Could not log AI usage", e); }
};

// @desc    Generate NLP Report (e.g., "How did I perform last month?")
// @route   POST /api/ai/report
const generateNLPReport = async (req, res) => {
  try {
    const { question } = req.body;
    const businessId = req.businessId;

    // Fetch brief business data context to pass to OpenAI (simplified)
    const totalSales = await Sale.sum('totalAmount', { where: { businessId } }) || 0;
    const totalExpenses = await Expense.sum('amount', { where: { businessId } }) || 0;
    
    const prompt = `Business Data Context: Total Sales: $${totalSales}, Total Expenses: $${totalExpenses}. \nUser Question: ${question}\nProvide a concise analysis based on this data.`;
    
    const answer = await generateAIResponse(prompt, "You are a business analyst assistant.");
    await logAIUsage(req.user.id, 'generateNLPReport', question);

    res.json({ answer });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// @desc    Generate an Email
// @route   POST /api/ai/email
const generateEmail = async (req, res) => {
  try {
    const { prompt } = req.body;
    const answer = await generateAIResponse(prompt, "You are a professional email composer for a business.");
    await logAIUsage(req.user.id, 'generateEmail', prompt);
    res.json({ email: answer });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// @desc    Generate Marketing Post
// @route   POST /api/ai/marketing
const generateMarketingPost = async (req, res) => {
  try {
    const { prompt } = req.body;
    const answer = await generateAIResponse(prompt, "You are an expert social media and marketing content creator.");
    await logAIUsage(req.user.id, 'generateMarketingPost', prompt);
    res.json({ post: answer });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// @desc    Invoice Summary Generator
// @route   POST /api/ai/invoice-summary
const summarizeInvoice = async (req, res) => {
  try {
    const { invoiceData } = req.body; // Raw text or JSON representation of an invoice
    const prompt = `Please explain the following invoice in simple terms for a client to understand what they are paying for: \n${JSON.stringify(invoiceData)}`;
    const answer = await generateAIResponse(prompt, "You are a customer service representative.");
    await logAIUsage(req.user.id, 'summarizeInvoice', prompt);
    res.json({ summary: answer });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// @desc    Chatbot Handler for general queries
// @route   POST /api/ai/chat
const chatbotQuery = async (req, res) => {
  try {
    const { message } = req.body;
    const answer = await generateAIResponse(message, "You are the SmartBiz App support AI. Answer briefly and helpfully.");
    await logAIUsage(req.user.id, 'chatbotQuery', message);
    res.json({ reply: answer });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = {
  generateNLPReport,
  generateEmail,
  generateMarketingPost,
  summarizeInvoice,
  chatbotQuery
};
