// apiKeyMiddleware.js
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

module.exports = (req, res, next) => {
  const apiKey = req.headers['x-api-key']; // Get API key from headers
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key is missing' });
  }

  // Check if the API key matches the one in your .env file
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Unauthorized: Invalid API key' });
  }

  // If valid, proceed to the next middleware or route handler
  next();
};
