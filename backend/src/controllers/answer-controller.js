const answerService = require("../services/answer-services");
const ErrorCodes = require("../enums/error-code-enum");

class AnswerController {
    createAnswer(req, res) {
        answerService
        .createAnswer(req.body)
        .then((answer) => {
            res.json(answer);
        })
        .catch((err) => {
            res.status(ErrorCodes.INVALID_REQUEST).send(err.message);
        });
    }

    getOneAnswer(req, res) {
        const {answerId} = req.params;

        answerService
        .getOneAnswer({"answerId": answerId})
        .then((answer) => {
            res.json(answer);
        })
        .catch((err) => {
            res.status(ErrorCodes.INVALID_REQUEST).send(err.message);
        });
    }

    updateAnswer(req, res) {
        const {answerId} = req.params;

        let data = req.body;
        data["answerId"] = answerId;
        data["isAnonymous"] = (data.isAnonymous === "true");

        answerService
        .updateAnswer(data)
        .then((answer) => {
            res.json(answer);
        })
        .catch((err) => {
            res.status(ErrorCodes.INVALID_REQUEST).send(err.message);
        });
    }

    deleteAnswer(req, res) {
        const {answerId} = req.params;

        answerService
        .deleteAnswer({"answerId": answerId})
        .then((response) => {
            res.json(response);
        })
        .catch((err) => {
            res.status(ErrorCodes.INVALID_REQUEST).send(err.message);
        });
    }
}

module.exports = new AnswerController();