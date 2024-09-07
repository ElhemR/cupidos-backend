const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    code: { type: String, required: true }, // Store hashed codes
    partners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Polyamorous relationships
    sliders: {
        communication: { type: Number, default: 5 },
        emotionalSupport: { type: Number, default: 5 },
        intimacy: { type: Number, default: 5 }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
