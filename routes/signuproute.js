const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');


router.post('/', UserController.signup);



module.exports = router;