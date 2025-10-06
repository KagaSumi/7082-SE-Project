const userService = require("../services/user-services");
const ErrorCodes = require("../enums/error-code-enum");

class UserController {
    signup(req, res) {
        userService
        .signup(req.body)
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            res.status(ErrorCodes.INVALID_REQUEST).send(err.message);
        });
    }

    signin(req, res) {
        userService
        .signin(req.body)
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            res.status(ErrorCodes.INVALID_REQUEST).send(err.message);
        });
    }
}

module.exports = new UserController();