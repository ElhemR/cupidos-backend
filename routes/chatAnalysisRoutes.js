const express = require('express');
const multer = require('multer');
const fs = require('fs');
const apiKeyMiddleware = require('../middlewares/apiKeyMiddleware');
const { analyzeChat } = require('../controllers/chatAnalysisController');

const router = express.Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

router.post('/analyze-chat', apiKeyMiddleware, upload.single('chatFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const rawJson = req.file.buffer.toString();
        const parsed = JSON.parse(rawJson);

        const messages = parsed.messages || parsed; // supports full JSON or just messages

        const analysis = await analyzeChat(messages); // send messages to analysis logic
        return res.json({ summary: analysis });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to analyze chat' });
    }
});

module.exports = router;
