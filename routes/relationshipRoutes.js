const express = require('express');
const { assignPartner, updateSliders } = require('../controllers/relationshipController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/assign-partner', authMiddleware, assignPartner); // Protected route
router.post('/update-sliders', authMiddleware, updateSliders); // Protected route

module.exports = router;
