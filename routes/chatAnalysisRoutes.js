const express = require('express');
const { analyzeChat } = require('../controllers/chatAnalysisController');
const router = express.Router();
const apiKeyMiddleware = require('../middlewares/apiKeyMiddleware');

router.post('/analyze-chat', apiKeyMiddleware, async (req, res) => {
    try {
        const { chatJson } = req.body;

        if (!chatJson || typeof chatJson !== 'string') {
            return res.status(400).json({ message: 'chatJson is required as a string' });
        }

        const analysis = await analyzeChat(chatJson);
        res.json({ analysis });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to analyze chat' });
    }
});

module.exports = router;
