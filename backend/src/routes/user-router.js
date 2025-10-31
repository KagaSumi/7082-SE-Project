const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');


router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
// Get all answers for a specific user
router.get('/:id/answers', userController.getAnswersByUser);
router.get('/:id', userController.getUserById);
router.get('/update/:id', userController.getUserById);
router.post('/:id', userController.update);

module.exports = router;
