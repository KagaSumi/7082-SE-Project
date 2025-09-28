const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questions-controller');

router.post('/questions', questionController.createQuestion);
router.get('/questions', questionController.getAllQuestions);
router.get('/questions/:questionId', questionController.getSingleQuestion);
router.put('/questions/:questionId', questionController.updateQuestion);
router.delete('/questions/:questionId', questionController.deletQuestion);

module.exports = router;