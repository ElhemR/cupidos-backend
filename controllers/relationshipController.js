const User = require('../models/User');
const Relationship = require('../models/Relationship');
const jwt = require('jsonwebtoken');
// Assign a partner (polyamory support using partner's username)
exports.assignPartner = async (req, res) => {
    const { partnerUsername } = req.body; // Partner username provided in the request body
    console.log('Authorization Header:', req.headers['authorization']);

    // Extract the token from the Authorization header
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'No token provided' });
    }

    // Manually decode the token without verifying it (for debugging purposes)
    const decodedToken = jwt.decode(token, { complete: true });
    console.log('Decoded Token:', decodedToken);
    const userId = decodedToken.payload.userId;

    try {
        // Find the logged-in user (from the token) and the partner by username
        const user = await User.findById(userId); 
        const partner = await User.findOne({ username: partnerUsername }); 

        if (!user || !partner) {
            return res.status(400).json({ msg: 'User or partner not found' });
        }

        // Check if a relationship already exists between the two users
        let relationship = await Relationship.findOne({
            users: { $all: [user._id, partner._id] },
        });

        if (relationship) {
            return res.status(400).json({ msg: 'Relationship already exists' });
        }

        // Create a new relationship and initialize sliders for both users
        relationship = new Relationship({
            users: [user._id, partner._id], 
            sliders: [
                {
                    user: user._id,
                    communication: 5,
                    emotionalSupport: 5,
                    trust: 5,
                    sex: 5,
                    qualityTime: 5,
                    harmony: 5,
                    futurePlans: 5
                },
                {
                    user: partner._id,
                    communication: 5,
                    emotionalSupport: 5,
                    trust: 5,
                    sex: 5,
                    qualityTime: 5,
                    harmony: 5,
                    futurePlans: 5
                }
            ]
        });

        // Save the relationship
        const savedRelationship = await relationship.save();

        res.json({ msg: 'Partner assigned and relationship created successfully', relationship: savedRelationship });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getRelationships = async (req, res) => {
    // Extract the token and decode it to get the user ID
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'No token provided' });
    }

    const decodedToken = jwt.decode(token, { complete: true });
    const userId = decodedToken.payload.userId;

    try {
        // Find all relationships where the user is part of
        const relationships = await Relationship.find({
            users: userId
        }).populate('users'); // Populate the users field to get partner details

        if (!relationships || relationships.length === 0) {
            return res.status(400).json({ msg: 'No relationships found for the user' });
        }

        // Create an array to store relationship information
        const relationshipData = relationships.map(relationship => {
            // Find the user's own sliders
            const userSliders = relationship.sliders.find(slider => slider.user.toString() === userId);

            // Find the partner (assuming it's a 2-user relationship, or the others in a polyamorous setup)
            const partners = relationship.users.filter(user => user._id.toString() !== userId);

            // Map the partner data with their slider values
            const partnerData = partners.map(partner => {
                const partnerSliders = relationship.sliders.find(slider => slider.user.toString() === partner._id.toString());

                return {
                    partnerName: partner.username,
                    partnerSliders: partnerSliders || {}
                };
            });

            // Return the relationship details with user's and partner's sliders
            return {
                relationshipId: relationship._id,
                userSliders: userSliders || {},
                partners: partnerData
            };
        });

        // Respond with the relationships and sliders data
        res.json({
            msg: 'Relationships and sliders data fetched successfully',
            relationships: relationshipData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
// Update sliders for a relationship
exports.updateSliders = async (req, res) => {
    const { relationshipId, sliders } = req.body;

    // Extract the token and decode it to get the user ID
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'No token provided' });
    }

    const decodedToken = jwt.decode(token, { complete: true });
    const userId = decodedToken.payload.userId;

    try {
        // Find the relationship by ID
        let relationship = await Relationship.findById(relationshipId);

        if (!relationship) {
            return res.status(400).json({ msg: 'Relationship not found' });
        }

        // Find the sliders for the logged-in user within the relationship
        let userSliders = relationship.sliders.find(slider => slider.user.toString() === userId);

        if (!userSliders) {
            return res.status(400).json({ msg: 'User not part of this relationship' });
        }

        // Update only the sliders that are provided in the request body
        if (sliders.communication !== undefined) {
            userSliders.communication = sliders.communication;
        }
        if (sliders.emotionalSupport !== undefined) {
            userSliders.emotionalSupport = sliders.emotionalSupport;
        }
        if (sliders.trust !== undefined) {
            userSliders.trust = sliders.trust;
        }
        if (sliders.sex !== undefined) {
            userSliders.sex = sliders.sex;
        }
        if (sliders.qualityTime !== undefined) {
            userSliders.qualityTime = sliders.qualityTime;
        }
        if (sliders.harmony !== undefined) {
            userSliders.harmony = sliders.harmony;
        }
        if (sliders.futurePlans !== undefined) {
            userSliders.futurePlans = sliders.futurePlans;
        }

        // Save the updated relationship
        await relationship.save();

        res.json({ msg: 'Sliders updated successfully', relationship });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

