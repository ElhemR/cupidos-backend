const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const relationshipRoutes = require('./routes/relationshipRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const chatAnalysisRoutes = require('./routes/chatAnalysisRoutes');
const app = express();

// Middleware

// CORS Setup
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors()); // allow preflight requests

app.use(express.json());
app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request on ${req.path}`);
    next();
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/relationships', relationshipRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/analyse', chatAnalysisRoutes);
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true,  serverSelectionTimeoutMS: 50000,  // Adjust as needed (default is 30 seconds)
    socketTimeoutMS: 45000, })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
