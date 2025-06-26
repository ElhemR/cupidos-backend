const Invitation = require('../models/Invitation');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Relationship = require("../models/Relationship");
const sendInvitation = async (req, res) => {
    try {
        const { receiverUsername } = req.body;
        const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

        if (!token) {
            return res.status(401).json({ msg: 'No token provided' });
        }

        // Decode token
        const decodedToken = jwt.decode(token, { complete: true });
        const senderId = decodedToken.payload.userId;

        // Check if receiver exists
        const receiver = await User.findOne({ username: receiverUsername });
        if (!receiver) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if a relationship already exists
        const existingRelationship = await Relationship.findOne({
            users: { $all: [senderId, receiver._id] }
        });

        if (existingRelationship) {
            return res.status(400).json({ msg: 'You are already in a relationship with this user' });
        }

        // Check if an invitation already exists in either direction
        const existingInvitation = await Invitation.findOne({
            $or: [
                { sender: senderId, receiver: receiver._id },
                { sender: receiver._id, receiver: senderId }
            ]
        });

        if (existingInvitation) {
            return res.status(400).json({ msg: 'An invitation already exists between you and this user' });
        }

        // Create a new invitation
        const invitation = new Invitation({ sender: senderId, receiver: receiver._id });
        await invitation.save();

        res.status(201).json({ msg: 'Invitation sent successfully' });
    } catch (error) {
        console.error('Send Invitation Error:', error);
        res.status(500).json({ msg: 'Internal server error. Please try again later.' });
    }
};




const acceptInvitation = async (req, res) => {
    try {
        const { invitationId } = req.body;
        const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

        if (!token) {
            return res.status(401).json({ msg: 'No token provided' });
        }

        // Manually decode the token without verifying it (for debugging purposes)
        const decodedToken = jwt.decode(token, { complete: true });
        console.log('Decoded Token:', decodedToken);
        const receiverId = decodedToken.payload.userId;
        // Find invitation
        const invitation = await Invitation.findById(invitationId);
        if (!invitation || invitation.receiver.toString() !== receiverId) {
            return res.status(404).json({ msg: 'Invitation not found' });
        }

        // Create a relationship
        const relationship = new Relationship({
            users: [invitation.sender, invitation.receiver],
            sliders: [
                { user: invitation.sender },
                { user: invitation.receiver }
            ]
        });
        await relationship.save();

        // Add relationship to both users
        await User.findByIdAndUpdate(invitation.sender, { $push: { relationships: relationship._id } });
        await User.findByIdAndUpdate(invitation.receiver, { $push: { relationships: relationship._id } });

        // Update invitation status
        invitation.status = 'accepted';
        await invitation.save();

        res.status(200).json({ msg: 'Invitation accepted! Relationship created' });
    } catch (error) {
        console.error('Accept Invitation Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};
const rejectInvitation = async (req, res) => {
    try {
        const { invitationId } = req.body;
        const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
        console.log('inv', invitationId)
        if (!token) {
            return res.status(401).json({ msg: 'No token provided' });
        }

        // Manually decode the token without verifying it (for debugging purposes)
        const decodedToken = jwt.decode(token, { complete: true });
        console.log('Decoded Token:', decodedToken);
        const receiverId = decodedToken.payload.userId;
        // Find invitation
        const invitation = await Invitation.findById(invitationId);
        if (!invitation || invitation.receiver.toString() !== receiverId) {
            return res.status(404).json({ msg: 'Invitation not found' });
        }

        // Create a relationship
        const relationship = new Relationship({
            users: [invitation.sender, invitation.receiver],
            sliders: [
                { user: invitation.sender },
                { user: invitation.receiver }
            ]
        });
        await relationship.save();

        // Add relationship to both users
        await User.findByIdAndUpdate(invitation.sender, { $push: { relationships: relationship._id } });
        await User.findByIdAndUpdate(invitation.receiver, { $push: { relationships: relationship._id } });

        // Update invitation status
        invitation.status = 'rejected';
        await invitation.save();

        res.status(200).json({ msg: 'Invitation accepted! Relationship created' });
    } catch (error) {
        console.error('Accept Invitation Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

const getPendingInvitations = async (req, res) => {
    try {
        const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

        if (!token) {
            return res.status(401).json({ msg: 'No token provided' });
        }

        // Manually decode the token without verifying it (for debugging purposes)
        const decodedToken = jwt.decode(token, { complete: true });
        console.log('Decoded Token:', decodedToken);
        const userId = decodedToken.payload.userId;

        // Find all pending invitations where the current user is the receiver
        const invitations = await Invitation.find({ receiver: userId, status: 'pending' })
            .populate('sender', 'username') // ✅ Populate sender's username
            .select('sender createdAt'); // ✅ Select only necessary fields

        // Map the response to return sender usernames
        const formattedInvitations = invitations.map(invite => ({
            invitationId: invite._id,
            senderUsername: invite.sender.username,
            createdAt: invite.createdAt
        }));

        res.status(200).json({ invitations: formattedInvitations });
    } catch (error) {
        console.error('Get Pending Invitations Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = { sendInvitation, acceptInvitation, rejectInvitation, getPendingInvitations };


