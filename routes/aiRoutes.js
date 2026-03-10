const express = require('express');
const router = express.Router();
const {
  generateNLPReport,
  generateEmail,
  generateMarketingPost,
  summarizeInvoice,
  chatbotQuery
} = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

const { checkBusinessProfile } = require('../controllers/businessController');

router.use(protect); // Ensure user is logged in
router.use(checkBusinessProfile); // Ensure they have a business context

router.post('/report', generateNLPReport);
router.post('/email', generateEmail);
router.post('/marketing', generateMarketingPost);
router.post('/invoice-summary', summarizeInvoice);
router.post('/chat', chatbotQuery);

module.exports = router;
