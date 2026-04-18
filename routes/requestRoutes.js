const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createRequest,
    getRequests,
    getRequestById,
    offerHelp,
    markSolved,
    deleteRequest
} = require('../controllers/requestController');

router.post('/', protect, createRequest);
router.get('/', protect, getRequests);
router.get('/:id', protect, getRequestById);
router.put('/:id/help', protect, offerHelp);
router.put('/:id/solve', protect, markSolved);
router.delete('/:id', protect, deleteRequest);

module.exports = router;