const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answer-controller');

router.post('/', answerController.createAnswer);
router.get('/:answerId', answerController.getOneAnswer);
router.put('/:answerId', answerController.updateAnswer);
router.delete('/:answerId', answerController.deleteAnswer);
router.post('/:answerId/rate', answerController.rateAnswer);

module.exports = router;
