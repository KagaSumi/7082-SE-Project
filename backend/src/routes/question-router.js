const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questions-controller');

router.post('/', questionController.createQuestion);
router.get('/', questionController.getAllQuestions);
router.get('/:questionId', questionController.getSingleQuestion);
router.put('/:questionId', questionController.updateQuestion);
router.delete('/:questionId', questionController.deletQuestion);

module.exports = router;