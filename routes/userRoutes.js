const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile, getLeaderboard } = require('../controllers/userController');

router.get('/leaderboard', protect, getLeaderboard);
router.get('/:id', protect, getProfile);
router.put('/:id', protect, updateProfile);

module.exports = router;