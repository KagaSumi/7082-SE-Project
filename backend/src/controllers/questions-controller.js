const questionService = require("../services/question-services");
const ErrorCodes = require("../enums/error-code-enum");

class QuestionController {
    createQuestion(req, res) {
        questionService
        .createQuestion(req.body)
        .then((question) => {
            res.json(question);
        })
        .catch((err) => {
            res.status(ErrorCodes.INVALID_REQUEST).send(err.message);
        });
    }

    getSingleQuestion(req, res) {
        const {questionId} = req.params;

        questionService
        .getSingleQuestion({"questionId": questionId})
        .then((question) => {
            res.json(question);
        })
        .catch((err) => {
            res.status(ErrorCodes.INVALID_REQUEST).send(err.message);
        });
    }

    getAllQuestions(req, res) {
        questionService
        .getAllQuestions()
        .then((questions) => {
            res.json(questions);
        })
        .catch((err) => {
            res.status(ErrorCodes.INVALID_REQUEST).send(err.message);
        });
    }

    updateQuestion(req, res) {
        const {questionId} = req.params;

        data = req.body;
        data["questionId"] = questionId;

        questionService
        .updateQuestion(data)
        .then((question) => {
            res.json(question);
        })
        .catch((err) => {
            res.status(ErrorCodes.INVALID_REQUEST).send(err.message);
        });
    }

    deletQuestion(req, res) {
        questionService
        .deletQuestion({"questionId": req.params})
        .then((response) => {
            res.json(response);
        })
        .catch((err) => {
            res.status(ErrorCodes.INVALID_REQUEST).send(err.message);
        });
    }
}

module.exports = new QuestionController();