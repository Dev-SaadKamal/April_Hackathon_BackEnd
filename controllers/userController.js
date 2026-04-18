const User = require('../models/User');

const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        if (req.params.id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You can only update your own profile' });
        }

        const { skills, interests, location } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { skills, interests, location },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

const getLeaderboard = async (req, res, next) => {
    try {
        const users = await User.find()
            .select('name trustScore helpCount badges skills')
            .sort({ helpCount: -1 })
            .limit(10);

        res.json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

module.exports = { getProfile, updateProfile, getLeaderboard };