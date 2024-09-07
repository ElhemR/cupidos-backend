const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
    const { username, code } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create a new user with hashed code
        user = new User({
            username,
            code: await bcrypt.hash(code, 10) // Hash the code for security
        });

        await user.save();
        res.json({ msg: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Login a user and return JWT
exports.loginUser = async (req, res) => {
    const { username, code } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(code, user.code);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        console.log('u', user._id)
        // Generate JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('test', token)
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
