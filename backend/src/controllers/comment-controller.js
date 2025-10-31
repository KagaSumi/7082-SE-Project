const commentService = require("../services/comment-services");
const ErrorCodes = require("../enums/error-code-enum");

class CommentController {
    // Create a new comment
    createComment(req, res) {
        commentService
            .createComment(req.body)
            .then((comment) => res.json(comment))
            .catch((err) => res.status(ErrorCodes.INVALID_REQUEST).send(err.message));
    }

    // Get comments for a specific question or answer
    getComments(req, res) {
        const { questionId, answerId } = req.params;

        commentService
            .getComments({ question_id: questionId, answer_id: answerId })
            .then((comments) => res.json(comments))
            .catch((err) => res.status(ErrorCodes.INVALID_REQUEST).send(err.message));
    }

    // Update a comment
    updateComment(req, res) {
        const { commentId } = req.params;
        const data = { ...req.body, comment_id: commentId, user_id: req.body.user_id };

        commentService
            .updateComment(data)
            .then((updated) => res.json(updated))
            .catch((err) => res.status(ErrorCodes.INVALID_REQUEST).send(err.message));
    }

    // Delete a comment
    deleteComment(req, res) {
        const { commentId } = req.params;
        const { user_id } = req.body;

        commentService
            .deleteComment({ comment_id: commentId, user_id })
            .then((result) => res.json(result))
            .catch((err) => res.status(ErrorCodes.INVALID_REQUEST).send(err.message));
    }

    // GenerateAIComment
    generateAIComment(req, res) {
        commentService
            .generateAIComment(req.body)
            .then((result) => res.json(result))
            .catch((err) => res.status(ErrorCodes.INVALID_REQUEST).send(err.message));
    }
}

module.exports = new CommentController();

