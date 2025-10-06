const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');


router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.get('/:id', userController.getUserById);

module.exports = router;