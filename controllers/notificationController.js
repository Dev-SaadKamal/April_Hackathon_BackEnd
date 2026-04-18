const Notification = require('../models/Notification');

const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.json({ success: true, data: notifications });
    } catch (error) {
        next(error);
    }
};

const markAllRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id, read: false },
            { read: true }
        );

        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        next(error);
    }
};

const markOneRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        if (notification.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        notification.read = true;
        await notification.save();

        res.json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
};

module.exports = { getNotifications, markAllRead, markOneRead };