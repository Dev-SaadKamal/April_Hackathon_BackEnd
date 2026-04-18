const Request = require('../models/Request');
const User = require('../models/User');

const getAllRequests = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const requests = await Request.find()
            .populate('createdBy', 'name email')
            .populate('helpers', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: requests });
    } catch (error) {
        next(error);
    }
};

const deleteAnyRequest = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const request = await Request.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        await request.deleteOne();
        res.json({ success: true, message: 'Request deleted by admin' });
    } catch (error) {
        next(error);
    }
};

const getStats = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const totalUsers = await User.countDocuments();
        const totalRequests = await Request.countDocuments();
        const resolvedRequests = await Request.countDocuments({ status: 'solved' });
        const openRequests = await Request.countDocuments({ status: 'open' });

        res.json({
            success: true,
            data: { totalUsers, totalRequests, resolvedRequests, openRequests }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllRequests, deleteAnyRequest, getStats };