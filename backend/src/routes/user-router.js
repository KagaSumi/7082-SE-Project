const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');

router.post('/createUser', userController.createUser);
router.get('/', userController.getUser);

module.exports = router;