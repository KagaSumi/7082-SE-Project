const userService = require("../services/user-services");
const ErrorCodes = require("../enums/error-code-enum");

class UserController {
    createUser(req, res) {
        userService
        .createUser(req.body)
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            res.status(ErrorCodes.INVALID_REQUEST).send(err.message);
        });
    }

    getUser(req, res) {
        userService
        .getUser(req.query.uid)
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            res.status(ErrorCodes.INVALID_REQUEST).send(err.message);
        });
    }
}

module.exports = new UserController();