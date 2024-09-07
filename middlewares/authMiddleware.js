const jwt = require('jsonwebtoken');

// JWT Authentication Middleware
module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Log the Authorization header for debugging
    console.log('Authorization header:', authHeader);

    // Check if the Authorization header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Missing or invalid token' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    // Log the extracted token for debugging
    console.log('Extracted token:', token);

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Log the decoded token to ensure the token is valid and decoded
        console.log('Decoded token:', decoded);

        // Attach the decoded token data to req.user
        req.user = decoded;

        // Proceed to the next middleware or controller
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message); // Log error message
        return res.status(403).json({ msg: 'Token is invalid or expired' });
    }
};
