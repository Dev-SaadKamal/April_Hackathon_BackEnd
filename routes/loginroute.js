const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
const auth = require('../middleware/auth');

router.post('/',
    UserController.login
)
router.get('/me', auth,
    UserController.getUser
)
router.post('/logout', auth,
    UserController.logout
)


module.exports = router;