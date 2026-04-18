const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAllRequests, deleteAnyRequest, getStats } = require('../controllers/adminController');

router.get('/requests', protect, getAllRequests);
router.delete('/requests/:id', protect, deleteAnyRequest);
router.get('/stats', protect, getStats);

module.exports = router;