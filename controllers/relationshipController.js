const User = require('../models/User');

// Assign a partner (polyamory support)
exports.assignPartner = async (req, res) => {
    const { partnerId } = req.body;

    try {
        const user = await User.findById(req.user.userId); // Get user from token
        const partner = await User.findById(partnerId);

        if (!user || !partner) {
            return res.status(400).json({ msg: 'User or partner not found' });
        }

        user.partners.push(partner._id);
        await user.save();
        res.json({ msg: 'Partner assigned successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update sliders for a user
exports.updateSliders = async (req, res) => {
    const { sliders } = req.body;

    try {
        const user = await User.findById(req.user.userId); // Get user from token
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Update slider values
        user.sliders = sliders;
        await user.save();
        res.json({ msg: 'Sliders updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
