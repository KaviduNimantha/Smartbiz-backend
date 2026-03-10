const express = require('express');
const router = express.Router();
const {
    generateNLReport,
    generateEmail,
    generateSocialPost
} = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// All AI routes require being logged in as a BusinessOwner
router.use(protect);
router.use(authorize('BusinessOwner'));

router.post('/report', generateNLReport);
router.post('/email', generateEmail);
router.post('/post', generateSocialPost);

module.exports = router;
