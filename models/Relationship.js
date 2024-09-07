const mongoose = require('mongoose');

const relationshipSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array containing both user IDs
    sliders: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user
            communication: { type: Number, default: 5 },
            emotionalSupport: { type: Number, default: 5 },
            intimacy: { type: Number, default: 5 },
            qualityTime: { type: Number, default: 5 },
            sex: { type: Number, default: 5 },
            dreams: { type: Number, default: 5 },
            futurePlans: { type: Number, default: 5 }
        }
    ]
});

// Update the `updatedAt` field whenever the document is updated
relationshipSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Relationship = mongoose.model('Relationship', relationshipSchema);

module.exports = Relationship;
