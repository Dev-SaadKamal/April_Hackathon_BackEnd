const Request = require('../models/Request');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { autoCategory, detectUrgency, generateSummary } = require('../utils/aiUtils');

const createRequest = async (req, res, next) => {
    try {
        const { title, description, tags, category, urgency } = req.body;

        const finalCategory = category || autoCategory(title);
        const finalUrgency = urgency || detectUrgency(description);
        const aiSummary = generateSummary(description);

        const request = await Request.create({
            title,
            description,
            tags: tags || [],
            category: finalCategory,
            urgency: finalUrgency,
            aiSummary,
            createdBy: req.user.id
        });

        const populatedRequest = await Request.findById(request._id)
            .populate('createdBy', 'name email skills location');

        // Find users with matching skills for notification
        const users = await User.find({
            skills: { $in: [finalCategory] },
            _id: { $ne: req.user.id }
        });

        // Create notifications for matching users
        for (const user of users) {
            await Notification.create({
                userId: user._id,
                message: `New request in ${finalCategory}: ${title}`,
                type: 'new-request'
            });
        }

        res.status(201).json({ success: true, data: populatedRequest });
    } catch (error) {
        next(error);
    }
};

const getRequests = async (req, res, next) => {
    try {
        const { category, urgency, location, search } = req.query;
        const query = {};

        if (category) query.category = category;
        if (urgency) query.urgency = urgency;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        let requests = await Request.find(query)
            .populate('createdBy', 'name email skills location trustScore badges')
            .sort({ createdAt: -1 });

        // Filter by location if specified
        if (location) {
            requests = requests.filter(req =>
                req.createdBy.location &&
                req.createdBy.location.toLowerCase().includes(location.toLowerCase())
            );
        }

        res.json({ success: true, data: requests });
    } catch (error) {
        next(error);
    }
};

const getRequestById = async (req, res, next) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate('createdBy', 'name email skills location trustScore badges')
            .populate('helpers', 'name trustScore badges helpCount');

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        res.json({ success: true, data: request });
    } catch (error) {
        next(error);
    }
};

const offerHelp = async (req, res, next) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        if (!request.helpers.includes(req.user.id)) {
            request.helpers.push(req.user.id);

            // Update user stats
            await User.findByIdAndUpdate(req.user.id, {
                $inc: { helpCount: 1, trustScore: 10 }
            });

            if (request.status === 'open') {
                request.status = 'in-progress';
            }

            await request.save();

            // Notify request creator
            await Notification.create({
                userId: request.createdBy,
                message: `${req.user.name || 'Someone'} offered to help with your request: ${request.title}`,
                type: 'helper-joined'
            });
        }

        const updatedRequest = await Request.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('helpers', 'name trustScore badges');

        res.json({ success: true, data: updatedRequest });
    } catch (error) {
        next(error);
    }
};

const markSolved = async (req, res, next) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        if (request.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Only request creator can mark as solved' });
        }

        request.status = 'solved';
        await request.save();

        // Award trust points to helpers
        for (const helperId of request.helpers) {
            await User.findByIdAndUpdate(helperId, {
                $inc: { trustScore: 5 }
            });

            await Notification.create({
                userId: helperId,
                message: `Request "${request.title}" was marked as solved!`,
                type: 'request-solved'
            });
        }

        const updatedRequest = await Request.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('helpers', 'name trustScore badges');

        res.json({ success: true, data: updatedRequest });
    } catch (error) {
        next(error);
    }
};

const deleteRequest = async (req, res, next) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        const user = await User.findById(req.user.id);
        if (request.createdBy.toString() !== req.user.id && user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await request.deleteOne();
        res.json({ success: true, message: 'Request deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRequest,
    getRequests,
    getRequestById,
    offerHelp,
    markSolved,
    deleteRequest
};