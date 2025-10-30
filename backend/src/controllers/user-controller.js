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

    async update(req, res) {
        try {
            const userId = req.params.id;
            const user = await userService.update(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getUserById(req, res) {
        try {
            const userId = req.params.id;
            const user = await userService.getUserById(userId,req.body);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new UserController();
