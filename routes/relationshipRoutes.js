const express = require('express');
const { assignPartner, updateSliders, getRelationships } = require('../controllers/relationshipController');
const router = express.Router();
const apiKeyMiddleware = require('../middlewares/apiKeyMiddleware'); // Optional: API key protection

// Route to assign a partner and create a relationship
// Optionally protected with API key middleware
router.post('/assign-partner', apiKeyMiddleware, assignPartner);

// Route to update the sliders in a relationship
// Optionally protected with API key middleware
router.post('/update-sliders', apiKeyMiddleware, updateSliders);
router.post('/getRelationships', apiKeyMiddleware, getRelationships);
module.exports = router;
