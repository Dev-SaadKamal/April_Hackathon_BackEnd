const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['new-request', 'helper-joined', 'request-solved', 'message'],
        default: 'new-request'
    },
    read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);