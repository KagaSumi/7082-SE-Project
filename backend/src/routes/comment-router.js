const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment-controller");

router.post("/", commentController.createComment);
router.get("/question/:questionId", commentController.getComments);
router.get("/answer/:answerId", commentController.getComments);
router.put("/:commentId", commentController.updateComment);
router.delete("/:commentId", commentController.deleteComment);

module.exports = router;

