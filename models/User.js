const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['need-help', 'can-help', 'both'],
        default: 'both'
    },
    skills: [String],
    interests: [String],
    location: { type: String, default: '' },
    trustScore: { type: Number, default: 0 },
    helpCount: { type: Number, default: 0 },
    badges: [String]
}, { timestamps: true });

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', UserSchema);