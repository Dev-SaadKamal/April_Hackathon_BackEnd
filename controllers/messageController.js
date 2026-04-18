const Message = require('../models/Message');
const Notification = require('../models/Notification');

const sendMessage = async (req, res, next) => {
    try {
        const { receiverId, requestId, text } = req.body;

        const message = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            requestId,
            text
        });

        // Create notification for receiver
        await Notification.create({
            userId: receiverId,
            message: `You have a new message regarding request #${requestId}`,
            type: 'message'
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name')
            .populate('receiver', 'name');

        res.status(201).json({ success: true, data: populatedMessage });
    } catch (error) {
        next(error);
    }
};

const getMessages = async (req, res, next) => {
    try {
        const messages = await Message.find({ requestId: req.params.requestId })
            .populate('sender', 'name')
            .populate('receiver', 'name')
            .sort({ createdAt: 1 });

        res.json({ success: true, data: messages });
    } catch (error) {
        next(error);
    }
};

module.exports = { sendMessage, getMessages };