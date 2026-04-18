const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String],
    category: {
        type: String,
        enum: ['Programming', 'Design', 'Math', 'Science', 'Language', 'Other'],
        default: 'Other'
    },
    urgency: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'solved'],
        default: 'open'
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    helpers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    aiSummary: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);