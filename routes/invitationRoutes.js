const express = require('express');
const { sendInvitation, acceptInvitation,getPendingInvitations, rejectInvitation} = require('../controllers/invitationController');
const apiKeyMiddleware = require('../middlewares/apiKeyMiddleware'); // Optional: API key protection
const router = express.Router();


router.post('/send', apiKeyMiddleware, sendInvitation);
router.post('/accept', apiKeyMiddleware, acceptInvitation);
router.get('/pending', apiKeyMiddleware, getPendingInvitations);
router.post('/reject', apiKeyMiddleware, rejectInvitation);
module.exports = router;
